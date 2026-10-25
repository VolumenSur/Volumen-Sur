(function(){

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ============ NAV SCROLL-SPY ============ */
  /* la navegación ahora son anclas <a href="#seccion"> que el navegador
     scrollea solo (scroll-behavior:smooth en el CSS); acá solo resaltamos
     el tab activo según qué sección está a la vista. */

  var navLinks = document.querySelectorAll('nav.tabs a[data-tab]');
  var sections = document.querySelectorAll('.page-section[id]');

  function setActive(id){
    navLinks.forEach(function(a){ a.classList.toggle('is-active', a.dataset.tab === id); });
  }

  if ('IntersectionObserver' in window && sections.length){
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach(function(s){ observer.observe(s); });
  }

  /* ============ SERVICIOS ============ */

  var SERVICES = [
    {name:'Proyecto', desc:'Diseño arquitectónico integral, de la idea al plano ejecutivo.'},
    {name:'Dirección de obra', desc:'Seguimiento técnico de la obra hasta la entrega.'},
    {name:'Análisis de eficiencia energética', desc:'Evaluación del desempeño térmico y energético del edificio.'},
    {name:'Adecuación de confort', desc:'Estrategias para mejorar el confort térmico de espacios existentes.'},
    {name:'Consultas virtuales', desc:'Asesoramiento a distancia, para cualquier punto del país.'},
    {name:'Reformas', desc:'Ampliaciones y renovaciones de espacios existentes.'},
    {name:'Regularización de planos', desc:'Gestión de planos ante los organismos correspondientes.'},
  ];
  var servicesGrid = document.getElementById('servicesGrid');
  SERVICES.forEach(function(s, i){
    var card = document.createElement('div');
    card.className = 'service-card';
    card.innerHTML = '<div class="num">' + String(i+1).padStart(2,'0') + '</div><h3>' + s.name + '</h3><p>' + s.desc + '</p>';
    servicesGrid.appendChild(card);
  });

  /* ============ LABORATORIO BIOCLIMATICO ============ */

  // Zonas IRAM 11603 (según datos de estación de la base provista; aproximadas donde se indica)
  var ZONES = {
    Ib:  {code:'Ib',  label:'Muy cálida',       color:'#D64B3A'},
    IIIa:{code:'IIIa',label:'Templada cálida',  color:'#F2C879'},
    IIIb:{code:'IIIb',label:'Templada cálida',  color:'#F2E08A'},
    IVc: {code:'IVc', label:'Templada fría',    color:'#5FAE5A'},
    V:   {code:'V',   label:'Fría',             color:'#5FC7D9'},
    VI:  {code:'VI',  label:'Muy fría',         color:'#3E7FB0'},
  };

  var CITIES = [
    { id:'rawson', name:'Rawson', tag:'Chubut — estepa patagónica costera (estimado, proximidad a Trelew)', veg:'steppe', windy:true, humidity:'dry', zone:'IVc',
      seasons:{ verano:{m:17,d:24,n:15}, otono:{m:15,d:23,n:13}, invierno:{m:5,d:11,n:3}, primavera:{m:8,d:15,n:6} } },
    { id:'trelew', name:'Trelew', tag:'Chubut — estepa patagónica', veg:'steppe', windy:true, humidity:'dry', zone:'IVc',
      seasons:{ verano:{m:19,d:28,n:14}, otono:{m:16,d:25,n:11}, invierno:{m:5,d:12,n:2}, primavera:{m:9,d:18,n:4} } },
    { id:'madryn', name:'Puerto Madryn', tag:'Chubut — costa atlántica árida (estimado, proximidad a Trelew)', veg:'steppe', windy:true, humidity:'dry', zone:'IVc',
      seasons:{ verano:{m:18,d:27,n:13}, otono:{m:16,d:24,n:11}, invierno:{m:5,d:11,n:4}, primavera:{m:9,d:17,n:4} } },
    { id:'gaiman', name:'Gaiman', tag:'Chubut — valle irrigado, estepa (estimado, proximidad a Trelew)', veg:'steppe', windy:false, humidity:'dry', zone:'IVc',
      seasons:{ verano:{m:18,d:29,n:13}, otono:{m:15,d:25,n:10}, invierno:{m:4,d:12,n:1}, primavera:{m:8,d:18,n:3} } },
    { id:'comodoro', name:'Comodoro Rivadavia', tag:'Chubut — estepa costera, muy ventosa', veg:'steppe', windy:true, humidity:'dry', zone:'V',
      seasons:{ verano:{m:18,d:25,n:13}, otono:{m:16,d:23,n:11}, invierno:{m:6,d:11,n:3}, primavera:{m:10,d:16,n:5} } },
    { id:'esquel', name:'Esquel', tag:'Chubut — cordillera, templado frío', veg:'pine', windy:false, humidity:'temperate', zone:'VI',
      seasons:{ verano:{m:12,d:21,n:7}, otono:{m:11,d:19,n:6}, invierno:{m:1,d:7,n:-3}, primavera:{m:4,d:12,n:0} } },
    { id:'ba', name:'Buenos Aires', tag:'Pampa húmeda', veg:'grass', windy:false, humidity:'humid', zone:'IIIb',
      seasons:{ verano:{m:23,d:30,n:19}, otono:{m:21,d:27,n:18}, invierno:{m:10,d:16,n:7}, primavera:{m:14,d:20,n:11} } },
    { id:'obera', name:'Oberá', tag:'Misiones — selva subtropical húmeda', veg:'palm', windy:false, humidity:'humid', zone:'Ib',
      seasons:{ verano:{m:24,d:33,n:20}, otono:{m:22,d:30,n:19}, invierno:{m:14,d:21,n:11}, primavera:{m:16,d:24,n:13} } },
    { id:'sanjuan', name:'San Juan', tag:'Cuyo — desierto cálido de altura', veg:'cactus', windy:false, humidity:'arid', zone:'IIIa',
      seasons:{ verano:{m:25,d:35,n:19}, otono:{m:21,d:30,n:16}, invierno:{m:7,d:16,n:2}, primavera:{m:13,d:24,n:7} } },
    { id:'bariloche', name:'San Carlos de Bariloche', tag:'Río Negro — cordillera, lago', veg:'pine', windy:false, humidity:'temperate', zone:'VI',
      seasons:{ verano:{m:12,d:21,n:6}, otono:{m:11,d:20,n:5}, invierno:{m:2,d:7,n:-1}, primavera:{m:5,d:12,n:0} } },
  ];

  var SEASONS = [
    {id:'verano',    main:'Solsticio de verano',    sub:'Día más largo'},
    {id:'otono',     main:'Equinoccio de otoño',    sub:'Día y noche parejos'},
    {id:'invierno',  main:'Solsticio de invierno',  sub:'Día más corto'},
    {id:'primavera', main:'Equinoccio de primavera',sub:'Día y noche parejos'},
  ];

  var MOMENTS = [
    {id:'morning', label:'Mañana'},
    {id:'midday',  label:'Mediodía'},
    {id:'night',   label:'Noche'},
  ];

  var STRATEGIES = [
    {id:'shading',     name:'Sombra / protección solar', desc:'Aleros, parasoles o vegetación que frenan el sol antes de que entre.'},
    {id:'crossVent',   name:'Ventilación cruzada',        desc:'Aberturas enfrentadas que dejan correr el aire y renuevan el ambiente.'},
    {id:'nightPurge',  name:'Ventilación nocturna',       desc:'Abrir la casa de noche para lavarla con aire fresco antes del día siguiente.'},
    {id:'thermalMass', name:'Masa térmica / inercia',     desc:'Muros y pisos pesados que retrasan y suavizan los cambios de temperatura.'},
    {id:'evapCooling', name:'Enfriamiento evaporativo',   desc:'Agua que se evapora y resta calor al aire — rinde más cuanto más seco está el ambiente.'},
    {id:'passiveSolar',name:'Ganancia solar pasiva',      desc:'Dejar entrar el sol a propósito para calentar el ambiente.'},
    {id:'insulation',  name:'Aislación térmica',          desc:'Envolvente que frena el paso de calor entre adentro y afuera.'},
    {id:'windbreak',   name:'Barrera de viento',          desc:'Vegetación o muros que cortan el viento y reducen la pérdida de calor.'},
  ];

  var GAIN = {morning:1, midday:4, night:2};
  var HUMIDITY_FACTOR = {humid:0.3, temperate:0.6, dry:1, arid:1.15};
  var SCALE_MIN = -20, SCALE_MAX = 40;
  var COMFORT_MIN = 20, COMFORT_MAX = 26;

  var state = { cityId:'trelew', seasonId:'verano', active:{} };
  STRATEGIES.forEach(function(s){ state.active[s.id] = false; });

  function $(id){ return document.getElementById(id); }

  // city select
  var citySelect = $('citySelect');
  CITIES.forEach(function(c){
    var opt = document.createElement('option');
    opt.value = c.id; opt.textContent = c.name + ' — Zona ' + c.zone;
    citySelect.appendChild(opt);
  });
  citySelect.value = state.cityId;
  citySelect.addEventListener('change', function(){ state.cityId = citySelect.value; renderAll(); });

  // season tabs
  var seasonTabs = $('seasonTabs');
  SEASONS.forEach(function(s){
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'season-tab';
    b.innerHTML = '<span class="lbl-main">' + s.main + '</span><span class="lbl-sub">' + s.sub + '</span>';
    b.addEventListener('click', function(){ state.seasonId = s.id; renderAll(); });
    b._id = s.id;
    seasonTabs.appendChild(b);
  });

  // strategies
  var strategyGrid = $('strategyGrid');
  STRATEGIES.forEach(function(s){
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'strategy';
    b.innerHTML = '<span class="switch" aria-hidden="true"></span><span class="body"><span class="name">' + s.name + '</span><span class="desc">' + s.desc + '</span></span>';
    b.setAttribute('aria-pressed','false');
    b.addEventListener('click', function(){ state.active[s.id] = !state.active[s.id]; renderAll(); });
    b._id = s.id;
    strategyGrid.appendChild(b);
  });

  // ---- physics ----

  function computeForSeason(city, seasonData, active){
    var s = { morning:seasonData.m, midday:seasonData.d, night:seasonData.n };
    var unmitigated = {};
    MOMENTS.forEach(function(m){ unmitigated[m.id] = s[m.id] + GAIN[m.id]; });
    var mean = (unmitigated.morning + unmitigated.midday + unmitigated.night) / 3;
    var deltas = {morning:0, midday:0, night:0};

    if (active.shading){ deltas.morning += -0.5; deltas.midday += -2.5; deltas.night += -0.2; }
    if (active.crossVent){ MOMENTS.forEach(function(m){ deltas[m.id] += -0.5 * GAIN[m.id]; }); }
    if (active.nightPurge){
      deltas.morning += -0.4; deltas.night += -1.2;
      deltas.midday += active.thermalMass ? -1.5 : -0.3;
    }
    if (active.thermalMass){ MOMENTS.forEach(function(m){ deltas[m.id] += 0.35 * (mean - unmitigated[m.id]); }); }
    if (active.evapCooling){
      var hf = HUMIDITY_FACTOR[city.humidity];
      deltas.morning += -1 * hf; deltas.midday += -3.5 * hf; deltas.night += -0.5 * hf;
    }
    if (active.passiveSolar){ deltas.morning += 0.3; deltas.midday += 2.5; deltas.night += active.thermalMass ? 0.8 : 0.3; }
    if (active.insulation){ MOMENTS.forEach(function(m){ deltas[m.id] += 0.35 * (22 - unmitigated[m.id]); }); }
    if (active.windbreak){
      var wf = city.windy ? 1.4 : 0.8;
      MOMENTS.forEach(function(m){ deltas[m.id] += (s[m.id] < unmitigated[m.id]) ? 0.5 * wf : -0.1; });
    }

    var result = {};
    MOMENTS.forEach(function(m){ result[m.id] = unmitigated[m.id] + deltas[m.id]; });
    return { unmitigated: unmitigated, result: result };
  }

  function zoneOf(t){ if (t < COMFORT_MIN) return 'cold'; if (t > COMFORT_MAX) return 'hot'; return 'comfort'; }
  function zoneStatusText(zone, t){
    if (zone === 'comfort') return 'En confort';
    if (zone === 'cold') return t < COMFORT_MIN - 6 ? 'Frío marcado' : 'Fresco';
    return t > COMFORT_MAX + 6 ? 'Caluroso' : 'Cálido';
  }
  function cap(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
  function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
  function pct(v){ return ((v - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100; }
  function round1(v){ return Math.round(v * 10) / 10; }

  function renderAll(){
    var city = CITIES.find(function(c){ return c.id === state.cityId; });
    var season = SEASONS.find(function(s){ return s.id === state.seasonId; });
    var seasonData = city.seasons[season.id];
    var a = state.active;

    $('cityZone').textContent = 'Zona ' + city.zone + ' — ' + ZONES[city.zone].label;
    $('cityTag').textContent = city.tag;

    Array.prototype.forEach.call(seasonTabs.children, function(t){ t.classList.toggle('is-active', t._id === season.id); });

    var activeCount = 0;
    Array.prototype.forEach.call(strategyGrid.children, function(b){
      var on = a[b._id];
      if (on) activeCount++;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    var out = computeForSeason(city, seasonData, a);
    var gauges = $('gauges');
    gauges.innerHTML = '';
    var comfortCount = 0, hotMoments = [], coldMoments = [];

    MOMENTS.forEach(function(m){
      var base = clamp(out.unmitigated[m.id], SCALE_MIN, SCALE_MAX);
      var cur = clamp(out.result[m.id], SCALE_MIN, SCALE_MAX);
      var zone = zoneOf(out.result[m.id]);
      if (zone === 'comfort') comfortCount++;
      if (zone === 'hot') hotMoments.push(m.id);
      if (zone === 'cold') coldMoments.push(m.id);

      var basePct = pct(base), curPct = pct(cur);
      var bandLeft = pct(COMFORT_MIN), bandWidth = pct(COMFORT_MAX) - bandLeft;

      var g = document.createElement('div');
      g.className = 'gauge';
      g.innerHTML =
        '<div class="g-head"><span class="g-moment">' + m.label + '</span>' +
        '<span class="g-value zone-' + zone + '">' + round1(out.result[m.id]) + '°C</span></div>' +
        '<div class="g-track">' +
          '<div class="g-comfort-band" style="left:' + bandLeft + '%; width:' + bandWidth + '%;"></div>' +
          '<div class="g-baseline" style="left:' + basePct + '%;" title="Sin estrategias: ' + round1(out.unmitigated[m.id]) + '°C"></div>' +
          '<div class="g-marker zone-' + zone + '" style="left:' + curPct + '%;"></div>' +
        '</div>' +
        '<div class="g-scale"><span>' + SCALE_MIN + '°C</span><span>' + SCALE_MAX + '°C</span></div>' +
        '<div class="g-status">' + zoneStatusText(zone, out.result[m.id]) + '</div>';
      gauges.appendChild(g);
    });

    $('feedback').innerHTML = buildFeedback(activeCount, comfortCount, hotMoments, coldMoments);

    renderCost(out);
  }

  // Costo relativo de energía (1 a 5): grados que faltan o sobran respecto del confort,
  // sumados en los tres momentos del día. Cada $ equivale a COST_STEP grados.
  var COST_STEP = {heat:9, cool:3};
  var COST_MAX = 5;

  function energyNeed(temps){
    var need = {heat:0, cool:0};
    MOMENTS.forEach(function(m){
      var t = temps[m.id];
      if (t < COMFORT_MIN) need.heat += COMFORT_MIN - t;
      if (t > COMFORT_MAX) need.cool += t - COMFORT_MAX;
    });
    return need;
  }
  function costLevel(degrees, kind){ return Math.min(COST_MAX, Math.ceil(degrees / COST_STEP[kind] - 0.001)); }

  function renderCost(out){
    var base = energyNeed(out.unmitigated), cur = energyNeed(out.result);
    var rows = [
      {kind:'heat', label:'Calefacción', fuel:'gas'},
      {kind:'cool', label:'Refrigeración', fuel:'electricidad'},
    ];
    $('costRow').innerHTML = rows.map(function(r){
      var b = costLevel(base[r.kind], r.kind), c = Math.min(costLevel(cur[r.kind], r.kind), b);
      var symbols = '';
      for (var i = 1; i <= COST_MAX; i++){
        var cls = i <= c ? 'is-on' : (i <= b ? 'is-saved' : '');
        symbols += '<span class="' + cls + '">$</span>';
      }
      var note;
      if (b === 0) note = 'No hace falta';
      else if (c === b) note = 'Sin ahorro todavía';
      else if (c === 0) note = 'Ahorro total';
      else note = 'Ahorrás ' + (b - c) + ' de ' + b;
      return '<div class="cost-cell"><div class="cost-head"><span class="cost-label">' + r.label + '</span><span class="cost-fuel">' + r.fuel + '</span></div>' +
        '<div class="cost-symbols" aria-label="' + c + ' de ' + COST_MAX + '">' + symbols + '</div>' +
        '<div class="cost-note">' + note + '</div></div>';
    }).join('');
  }

  function buildFeedback(activeCount, comfortCount, hotMoments, coldMoments){
    var momentLabel = function(id){ return MOMENTS.find(function(m){ return m.id === id; }).label.toLowerCase(); };

    if (activeCount === 0){
      return '<div class="fb-title">Sin estrategias</div>Así responde el ambiente sin ninguna intervención pasiva. Activá alguna estrategia para ver cómo cambia.';
    }
    if (comfortCount === 3){
      return '<div class="fb-title">Resultado</div>Los tres momentos del día quedan dentro de la zona de confort (20–26°C) con esta combinación.';
    }
    var hint = '';
    if (hotMoments.length){
      var sug1 = ['shading','crossVent','evapCooling','nightPurge'].filter(function(id){ return !state.active[id]; });
      var sName1 = sug1.length ? STRATEGIES.find(function(s){ return s.id === sug1[0]; }).name.toLowerCase() : null;
      hint += cap(hotMoments.map(momentLabel).join(' y ')) + ' queda' + (hotMoments.length>1?'n':'') + ' por encima del confort.';
      if (sName1) hint += ' Probá sumar ' + sName1 + '.';
    }
    if (coldMoments.length){
      var sug2 = ['passiveSolar','insulation','thermalMass','windbreak'].filter(function(id){ return !state.active[id]; });
      var sName2 = sug2.length ? STRATEGIES.find(function(s){ return s.id === sug2[0]; }).name.toLowerCase() : null;
      hint += ' ' + cap(coldMoments.map(momentLabel).join(' y ')) + ' queda' + (coldMoments.length>1?'n':'') + ' por debajo del confort.';
      if (sName2) hint += ' Probá sumar ' + sName2 + '.';
    }
    return '<div class="fb-title">' + comfortCount + ' de 3 momentos en confort</div>' + hint.trim();
  }

  renderAll();

})();
