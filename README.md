# Omikuji — Fortune & Destiny

Juego web para un stand escolar: la persona escanea un QR, agita el cilindro de bambú y recibe un omikuji (fortuna japonesa) al azar.

Hecho con React 18 + Vite 5 + Tailwind CSS 3 y `lucide-react`. Sin backend, sin router, sin `localStorage`: se puede subir como sitio estático.

## Ya está publicado

- **Juego:** https://tomasberserk.github.io/omikuji/
- **Repo:** https://github.com/Tomasberserk/omikuji — código en `main`, sitio en `gh-pages`.

Para actualizar el sitio después de cambiar código:

```bash
npm run deploy
```

Eso corre `npm run build` y sube `dist/` a la rama `gh-pages`. GitHub Pages tarda alrededor de un minuto en reflejar los cambios.

## Requisitos

- Node.js 18 o superior.

## Uso

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
npm run preview  # sirve dist/ para probar el build
npm run deploy   # publica en GitHub Pages
```

## Flujo

`App.jsx` maneja una máquina de tres estados:

| Fase       | Pantalla          | Qué pasa                                                      |
| ---------- | ----------------- | ------------------------------------------------------------- |
| `welcome`  | `WelcomeScreen`   | Título y botón **Shake & Draw Your Fortune**.                  |
| `shaking`  | `ShakeAnimation`  | El cilindro vibra 1500 ms, con palitos y chispas.              |
| `revealed` | `FortuneScroll`   | El pergamino se desenrolla y muestra la fortuna y un consejo.  |

La fortuna se elige al azar y nunca repite la anterior (`pickFortune` en `App.jsx`).

## Estructura

```text
index.html
public/                  favicon, robots.txt, .nojekyll
src/
  main.jsx
  index.css              capas Tailwind, papel washi, safe-area, reduced-motion
  App.jsx                estados y temporizador
  data/fortunes.js       las 5 fortunas (texto, kanji, icono)
  components/
    SakuraBackground.jsx pétalos de sakura
    WelcomeScreen.jsx
    ShakeAnimation.jsx   cilindro de bambú
    FortuneScroll.jsx    pergamino con varillas
tailwind.config.js       colores, fuentes y keyframes
scripts/deploy.ps1       build + push a gh-pages
qr/                      QR y cartel para imprimir
```

Para agregar o cambiar una fortuna, edita `src/data/fortunes.js`. El campo `Icon` es un componente de `lucide-react`.

## QR y cartel para el stand

- `qr/qr-omikuji.png` — QR de 1600 px (WhatsApp, redes, impresión).
- `qr/qr-omikuji.svg` — QR vectorial (escala sin perder calidad).
- `qr/cartel-omikuji.html` — cartel A5 listo para imprimir.

Para imprimir el cartel:

1. Abre `qr/cartel-omikuji.html` en Chrome o Edge.
2. `Ctrl + P`.
3. Destino **Guardar como PDF**, papel **A5**, márgenes **Ninguno**.
4. Activa **Gráficos de fondo** (si no, sale sin color).
5. Imprime en A5 o amplía a A4 para que se lea de lejos.

El QR ya apunta a la URL publicada y fue verificado decodificándolo.

Antes del evento: prueba el QR con un Android y un iPhone reales, y ten la URL escrita en el stand por si falla la red.

## Notas de calidad

- `npm run build` sin errores.
- Probado a 375×667 y 320×568: sin scroll horizontal; en 375×667 la fortuna completa y el botón entran sin scroll.
- Botones de 56 px de alto, foco visible, `aria-live` en las fases y `prefers-reduced-motion` respetado.
- Lighthouse: 100 en accesibilidad, buenas prácticas y SEO.

## Alternativa: Netlify

El proyecto también incluye `netlify.toml` (`npm run build` → `dist`). Puedes conectar el repo en Netlify o arrastrar `dist/` a https://app.netlify.com/drop.
