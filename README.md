# Omikuji — Fortune & Destiny

Juego web para un stand escolar: la persona escanea un QR, agita el cilindro de bambú y recibe un omikuji (fortuna japonesa) al azar.

Hecho con React 18 + Vite 5 + Tailwind CSS 3 y `lucide-react`. Sin backend, sin router, sin `localStorage`: se puede subir como sitio estático.

## Requisitos

- Node.js 18 o superior.

## Uso

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
npm run preview  # sirve dist/ para probar el build
```

## Flujo

`App.jsx` maneja una máquina de tres estados:

| Fase       | Pantalla          | Qué pasa                                                        |
| ---------- | ----------------- | --------------------------------------------------------------- |
| `welcome`  | `WelcomeScreen`   | Título y botón **Shake & Draw Your Fortune**.                    |
| `shaking`  | `ShakeAnimation`  | El cilindro vibra 1500 ms, con palitos y chispas.                |
| `revealed` | `FortuneScroll`   | El pergamino se desenrolla y muestra la fortuna y un consejo.    |

La fortuna se elige al azar y nunca repite la anterior (`pickFortune` en `App.jsx`).

## Estructura

```text
index.html
public/favicon.svg
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
```

Para agregar o cambiar una fortuna, edita `src/data/fortunes.js`. El campo `Icon` es un componente de `lucide-react`.

## Despliegue

`vite.config.js` usa `base: './'`, así que `dist/` funciona en cualquier hosting estático, incluso dentro de una subcarpeta.

**Netlify (lo más rápido):** arrastra la carpeta `dist/` a [app.netlify.com/drop](https://app.netlify.com/drop). También puedes conectar el repo: `netlify.toml` ya define `npm run build` y `dist`.

**Vercel:** importa el repo; detecta Vite solo.

**GitHub Pages:** publica el contenido de `dist/` (por ejemplo con `gh-pages`).

## QR para el stand

1. Despliega y copia la URL final.
2. Genera el QR (qr-code-generator.com, o `npx qrcode` desde la terminal).
3. Imprímelo en A5 o más grande, con el texto "Scan me" debajo.
4. Prueba el QR con un Android y un iPhone antes del evento.
5. Ten el enlace escrito en el stand por si falla la red.

## Notas de calidad

- `npm run build` sin errores.
- Probado a 375×667 y 320×568: sin scroll horizontal; en 375×667 la fortuna completa y el botón entran sin scroll.
- Botones de 56 px de alto, foco visible, `aria-live` en las fases y `prefers-reduced-motion` respetado.
- Lighthouse: 100 en accesibilidad, buenas prácticas y SEO.
