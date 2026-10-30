/* Inicio: maqueta isométrica (caja abierta al norte y árboles) con la sombra del sol
   real según ciudad, estación y hora. Si no hay WebGL, el Inicio queda igual sobre blanco. */
(function(){
  var hero = document.getElementById('sol');
  var modelSpace = document.getElementById('homeModel');
  if (!hero || !modelSpace) return;
  function without3d(){                 // sin 3D: el Inicio queda limpio, sin maqueta ni selector
    modelSpace.hidden = true;
    var ctl = hero.querySelector('.home-sun'); if (ctl) ctl.hidden = true;
  }
  if (!window.THREE){ without3d(); return; }

  var CITIES = [
    {id:'trelew', name:'Trelew', lat:-43.25}, {id:'rawson', name:'Rawson', lat:-43.30},
    {id:'madryn', name:'Puerto Madryn', lat:-42.77}, {id:'gaiman', name:'Gaiman', lat:-43.29},
    {id:'comodoro', name:'Comodoro Rivadavia', lat:-45.86}, {id:'esquel', name:'Esquel', lat:-42.91},
    {id:'bariloche', name:'Bariloche', lat:-41.13}, {id:'ba', name:'Buenos Aires', lat:-34.60},
    {id:'sanjuan', name:'San Juan', lat:-31.54}, {id:'obera', name:'Oberá', lat:-27.49}
  ];
  var SEASONS = [
    {id:'verano',    name:'Verano',    dec:-23.44, icon:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/>'},
    {id:'otono',     name:'Otoño',     dec:0,      icon:'<path d="M5 19C5 10 11 5 20 4c-1 9-6 15-15 15z"/><path d="M5 19l8-8"/>'},
    {id:'invierno',  name:'Invierno',  dec:23.44,  icon:'<path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7"/><path d="M9.5 3.5 12 6l2.5-2.5M9.5 20.5 12 18l2.5 2.5"/>'},
    {id:'primavera', name:'Primavera', dec:0,      icon:'<path d="M12 21v-9"/><path d="M12 13C12 8 8.5 5 4 5c0 5 3.5 8 8 8z"/><path d="M12 11c0-4 3-6.5 8-6.5 0 4.5-3 6.5-8 6.5z"/>'}
  ];
  var city = CITIES[0], season = SEASONS[0];
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // sol en coordenadas locales: x = este, y = arriba, z = sur
  function sunVector(latDeg, decDeg, ha){
    var L = latDeg * Math.PI / 180, d = decDeg * Math.PI / 180;
    var east  = -Math.cos(d) * Math.sin(ha);
    var north =  Math.cos(L) * Math.sin(d) - Math.sin(L) * Math.cos(d) * Math.cos(ha);
    var up    =  Math.sin(L) * Math.sin(d) + Math.cos(L) * Math.cos(d) * Math.cos(ha);
    return new THREE.Vector3(east, up, -north);
  }
  function halfDay(latDeg, decDeg){
    var L = latDeg * Math.PI / 180, d = decDeg * Math.PI / 180;
    return Math.acos(Math.max(-1, Math.min(1, -Math.tan(L) * Math.tan(d))));
  }
  // el slider recorre las horas con el sol a más de 15° (o 5° menos que su altura del mediodía,
  // si en invierno no llega a 20°): así las sombras no se estiran hasta tapar el selector
  function sunWindow(latDeg, decDeg){
    var L = latDeg * Math.PI / 180, d = decDeg * Math.PI / 180;
    var noon = Math.asin(Math.sin(L) * Math.sin(d) + Math.cos(L) * Math.cos(d));
    var minAlt = Math.min(15 * Math.PI / 180, noon - 5 * Math.PI / 180);
    var c = (Math.sin(minAlt) - Math.sin(L) * Math.sin(d)) / (Math.cos(L) * Math.cos(d));
    return Math.acos(Math.max(-1, Math.min(1, c)));
  }
  function fmt(h){ var hh = Math.floor(h), mm = Math.floor((h - hh) * 60); return String(hh).padStart(2,'0') + ':' + String(mm).padStart(2,'0'); }

  // ---- selector: ciudad, estación y hora ----
  var citySel = document.getElementById('homeCity');
  CITIES.forEach(function(c){ var o = document.createElement('option'); o.value = c.id; o.textContent = c.name; citySel.appendChild(o); });
  citySel.addEventListener('change', function(){ city = CITIES.find(function(c){ return c.id === citySel.value; }); kick(); });

  var seasonsEl = document.getElementById('homeSeasons');
  SEASONS.forEach(function(s){
    var b = document.createElement('button');
    b.type = 'button'; b.title = s.name; b.setAttribute('aria-label', s.name);
    b.setAttribute('aria-pressed', s === season ? 'true' : 'false');
    b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + s.icon + '</svg>';
    b.addEventListener('click', function(){
      season = s;
      Array.prototype.forEach.call(seasonsEl.children, function(c){ c.setAttribute('aria-pressed', c === b ? 'true' : 'false'); });
      kick();
    });
    seasonsEl.appendChild(b);
  });

  // el sol avanza solo; si la persona mueve la hora, queda donde la deja
  var hourInput = document.getElementById('homeHour');
  var manual = true;              // fijo: el sol solo cambia si se mueve la hora, la estación o la ciudad
  hourInput.value = 300;          // media mañana: sombras visibles
  hourInput.addEventListener('input', function(){ manual = true; kick(); });

  // ---- escena ----
  var renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias:true }); }
  catch (e) { without3d(); return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0xFAFBFA, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // estilos del lienzo en línea: nunca empuja el alto del Inicio, aunque el CSS esté desactualizado en caché
  var cv = renderer.domElement;
  cv.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:block;pointer-events:none;';
  hero.style.position = 'relative'; hero.style.overflow = 'hidden';
  hero.insertBefore(cv, hero.firstChild);

  var scene = new THREE.Scene();
  var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  camera.position.set(-12, 9.8, -12);   // isométrica desde el noroeste: se ve la cara norte abierta
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xdfe3df, 0.72));
  var sun = new THREE.DirectionalLight(0xffffff, 0.75);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  var sc = sun.shadow.camera; sc.left = -10; sc.right = 10; sc.top = 10; sc.bottom = -10; sc.near = 0.5; sc.far = 80;
  sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.02;
  scene.add(sun); scene.add(sun.target);

  var ground = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), new THREE.ShadowMaterial({ opacity:0.13 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

  var white = new THREE.MeshStandardMaterial({ color:0xFFFFFF, roughness:0.95 });
  var lineMat = new THREE.LineBasicMaterial({ color:0x9AA3A0 });
  function solid(geo, x, y, z, parent){
    parent = parent || scene;
    var m = new THREE.Mesh(geo, white); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m);
    var e = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 25), lineMat); e.position.copy(m.position); parent.add(e);
    return m;
  }
  function tree(x, z, s, parent){
    solid(new THREE.CylinderGeometry(0.05 * s, 0.07 * s, 0.9 * s, 6), x, 0.45 * s, z, parent);
    solid(new THREE.IcosahedronGeometry(0.55 * s, 0), x, 1.15 * s, z, parent);
  }

  // caja abierta al norte
  var S = 2, T = 0.1;
  solid(new THREE.BoxGeometry(S, T, S), 0, T / 2, 0);                    // piso
  solid(new THREE.BoxGeometry(S, T, S), 0, S - T / 2, 0);                // techo
  solid(new THREE.BoxGeometry(S, S, T), 0, S / 2, S / 2 - T / 2);        // muro sur
  solid(new THREE.BoxGeometry(T, S, S), -S / 2 + T / 2, S / 2, 0);       // muro oeste
  solid(new THREE.BoxGeometry(T, S, S),  S / 2 - T / 2, S / 2, 0);       // muro este

  // árboles junto a la caja, al sur y al este
  [[2.6, -1.6, 1.0], [3.4, 0.6, 0.8], [2.4, 2.6, 0.9], [-1.2, 3.2, 0.7]].forEach(function(t){ tree(t[0], t[1], t[2]); });

  // flecha del norte
  var nPts = [new THREE.Vector3(-3.0, 0.01, -1.6), new THREE.Vector3(-3.0, 0.01, -2.8), new THREE.Vector3(-3.15, 0.01, -2.5), new THREE.Vector3(-3.0, 0.01, -2.8), new THREE.Vector3(-2.85, 0.01, -2.5)];
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(nPts), new THREE.LineBasicMaterial({ color:0xB59343 })));

  // hilera de árboles del ancho de la fila de botones
  var forest = null, forestWidth = 0;
  function rand(seed){ var x = Math.sin(seed * 127.1) * 43758.5453; return x - Math.floor(x); }
  function buildForest(widthUnits){
    if (forest && Math.abs(widthUnits - forestWidth) < 2) return;
    if (forest){ forest.traverse(function(o){ if (o.geometry) o.geometry.dispose(); }); scene.remove(forest); }
    forest = new THREE.Group(); forestWidth = widthUnits;
    var half = widthUnits / 2 - 0.6, i = 0;
    for (var t = -half; t <= half; t += 0.8){
      i++;
      if (Math.abs(t) < 4.4) continue;
      var depth = (rand(i) - 0.5) * 4.8;
      var along = t + (rand(i + 50) - 0.5) * 0.6;
      var x = (-along - depth) / Math.SQRT2, z = (along - depth) / Math.SQRT2;
      tree(x, z, 0.6 + rand(i + 100) * 0.5, forest);
    }
    scene.add(forest);
    var r = Math.max(10, half + 6);
    sc.left = -r; sc.right = r; sc.top = r; sc.bottom = -r; sc.updateProjectionMatrix();
  }

  // ---- encuadre: escala fija y la maqueta en su lugar, debajo de los botones ----
  function resize(){
    var w = hero.clientWidth, h = Math.min(hero.clientHeight, 2000);
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    var u = w < 760 ? 0.046 : 0.042;
    var hr = hero.getBoundingClientRect(), mr = modelSpace.getBoundingClientRect();
    var cy = (mr.top - hr.top) + mr.height * 0.62;
    var cx = (mr.left - hr.left) + mr.width / 2;
    camera.left = -cx * u; camera.right = (w - cx) * u;
    camera.top = cy * u;   camera.bottom = -(h - cy) * u;
    camera.updateProjectionMatrix();
    buildForest(Math.min(mr.width, 620) * u);       // hilera de árboles de ancho acotado
    kick();
  }
  window.addEventListener('resize', resize);
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(hero);

  // ---- render: solo mientras el Inicio está a la vista ----
  var DAY_MS = 18000, t0 = performance.now(), pending = false, visible = true;
  var clock = document.getElementById('homeClock');
  if ('IntersectionObserver' in window){
    new IntersectionObserver(function(es){ visible = es[0].isIntersecting; if (visible) kick(); }).observe(hero);
  }
  function frame(now){
    pending = false;
    var k;
    if (manual) k = hourInput.value / 1000;
    else { k = ((now - t0) % DAY_MS) / DAY_MS; hourInput.value = Math.round(k * 1000); }
    var h0 = sunWindow(city.lat, season.dec);
    var ha = -h0 + 2 * h0 * k;
    var v = sunVector(city.lat, season.dec, ha);
    sun.position.copy(v.clone().multiplyScalar(40)); sun.target.position.set(0, 0, 0);
    sun.intensity = 0.35 + 0.6 * Math.min(1, Math.max(0, v.y) / 0.45);
    clock.textContent = fmt(12 + ha * 12 / Math.PI);
    renderer.render(scene, camera);
    if (!manual && visible) kick();
  }
  function kick(){ if (!pending){ pending = true; requestAnimationFrame(frame); } }
  resize();
})();
