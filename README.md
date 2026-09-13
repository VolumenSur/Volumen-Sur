# Volumen sur — sitio web

Sitio estático (HTML + CSS + JS, sin backend ni build) para el estudio Volumen sur.

## Estructura

```
volumensur-site/
├── index.html          → toda la página (tabs: Inicio, Laboratorio Bioclimático, Contacto, Quiénes somos)
├── css/style.css        → estilos
├── js/main.js           → lógica de tabs, servicios y el Laboratorio Bioclimático
└── assets/logo.svg      → isotipo de Volumen sur
```

## Antes de publicar

- **Zonas IRAM 11603**: en el Laboratorio (`js/main.js`, objeto `CITIES`), Trelew, Comodoro Rivadavia, Esquel, Buenos Aires, Oberá, San Juan y Bariloche usan datos y zona real de una base de estaciones. Rawson, Puerto Madryn, Gaiman y San Martín de los Andes no estaban en esa base — sus valores son una estimación por proximidad climática, aclarada también dentro del sitio.

## Publicar gratis

Cualquiera de estas opciones funciona sin necesidad de configurar nada más, porque el sitio no tiene backend:

### Netlify (el más simple)
1. Entrá a [app.netlify.com/drop](https://app.netlify.com/drop).
2. Arrastrá la carpeta `volumensur-site` completa a la página.
3. Netlify te da una URL al instante (podés cambiarle el nombre o conectar un dominio propio después, en Site settings → Domain management).

### GitHub Pages
1. Creá un repositorio en GitHub y subí el contenido de `volumensur-site` (que `index.html` quede en la raíz del repo).
2. Andá a Settings → Pages → Source → elegí la rama `main` y la carpeta `/root`.
3. GitHub te da una URL tipo `https://tu-usuario.github.io/tu-repo/`.

### Vercel
1. Entrá a [vercel.com/new](https://vercel.com/new) e importá el repositorio (o arrastrá la carpeta si usás su CLI).
2. Como es un sitio estático, no hace falta configurar ningún build command.

## Dominio propio

Cualquiera de las tres opciones permite conectar un dominio propio (por ejemplo `volumensur.com.ar`) gratis, apuntando los DNS del dominio a Netlify, GitHub Pages o Vercel desde el panel de cada servicio.
