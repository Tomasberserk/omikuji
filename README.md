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
npm test         # pruebas del detector, selección y datos
npm run deploy   # publica en GitHub Pages
npm run stand    # servidor local para el plan B sin internet
```

## Flujo

`App.jsx` maneja una máquina de tres estados:

| Fase       | Pantalla          | Qué pasa                                                          |
| ---------- | ----------------- | ----------------------------------------------------------------- |
| `welcome`  | `WelcomeScreen`   | Pide agitar el teléfono. En iOS se activa el sensor con un toque.  |
| `shaking`  | `ShakeAnimation`  | El cilindro vibra 1500 ms, con palitos y chispas.                  |
| `revealed` | `FortuneScroll`   | El pergamino se desenrolla y muestra la fortuna y un consejo.      |

La fortuna se elige al azar y nunca repite la anterior (`pickFortune` en `App.jsx`).

### Cómo se detecta el agitado

`src/hooks/useShake.js` usa la API `DeviceMotion`:

- Compara la aceleración entre muestras y exige **3 cambios fuertes en menos de 900 ms**, así caminar o mover el teléfono normal no dispara nada.
- Espera 900 ms al entrar a la pantalla de inicio antes de "armarse", para que sacar el teléfono del bolsillo no cuente como agitado.
- En iOS 13+ el permiso se pide con un botón (**Enable Shake**), porque Safari exige un gesto del usuario.
- Si el equipo no tiene sensor, el permiso se niega o no llegan eventos, aparece un botón de **tap** como respaldo. Sin ese respaldo el juego se rompería en computadores y tablets.
- El indicador de "No motion" aparece a los 2.5 s sin eventos.

Nota: la API de movimiento solo funciona en **HTTPS** (GitHub Pages ya lo cumple) y con la pestaña visible.


## Estructura

```text
index.html
public/                  favicon, robots.txt, .nojekyll
src/
  main.jsx
  index.css              capas Tailwind, papel washi, safe-area, reduced-motion
  App.jsx                estados y temporizador
  hooks/useShake.js      detección del agitado y permisos de iOS
  lib/shakeDetector.js   algoritmo puro (testeable)
  lib/pickFortune.js     selección sin repetir
  data/fortunes.js       las 15 fortunas (texto, kanji, icono)
  components/
    SakuraBackground.jsx pétalos de sakura
    WelcomeScreen.jsx    invitación a agitar + respaldo por tap
    ShakeAnimation.jsx   cilindro de bambú
    FortuneScroll.jsx    pergamino con varillas
tailwind.config.js       colores, fuentes y keyframes
scripts/deploy.ps1       build + push a gh-pages
scripts/serve-local.ps1  servidor local (plan B)
tests/                   pruebas con node:test
docs/libreto-stand.md    libreto en inglés para el stand
qr/                      QR y cartel para imprimir
```

Para agregar o cambiar una fortuna, edita `src/data/fortunes.js`. El campo `Icon` es un componente de `lucide-react`. Después corre `npm run check:fortunes` para validar ids, números e íconos.

Hay 15 fortunas repartidas en cinco rangos tradicionales, de mejor a menor: **大吉 Daikichi**, **中吉 Chūkichi**, **小吉 Shōkichi**, **吉 Kichi** y **末吉 Suekichi**. Varias fortunas comparten rango (como en una caja de omikuji real); lo que cambia es el tema y el consejo. No hay fortunas malas (凶) a propósito.

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

## Plan B: stand sin internet

Si el wifi del colegio falla, el juego puede correr desde el portátil:

1. `npm run stand`
2. El script compila si hace falta, imprime la URL local (por ejemplo `http://192.168.1.20:4173/`) y guarda `qr/qr-local.png` con ese QR.
3. Conecta los celulares al mismo wifi **o al hotspot del portátil**.
4. Escanea el QR local.

Ojo: algunos wifi de eventos aíslan a los clientes entre sí. Si los celulares no abren la URL, usa el hotspot del portátil. La primera vez Windows puede pedir permiso de firewall para Node.

## Pruebas

`npm test` usa el runner nativo de Node, sin dependencias extra:

- `tests/shake-detector.test.mjs` — movimiento suave no dispara, agitado sí, respeta el armado y el cooldown.
- `tests/pick-fortune.test.mjs` — nunca repite la fortuna anterior.
- `tests/fortunes.test.mjs` — 15 fortunas, ids y números únicos, rangos válidos.

También existe `npm run check:fortunes` para validar los datos después de editarlos.

## Notas de calidad

- `npm run build` sin errores.
- Probado a 375×667 y 320×568: sin scroll horizontal; en 375×667 la fortuna completa y el botón entran sin scroll.
- Detección de agitado probada simulando eventos: movimiento suave no dispara, agitado fuerte revela, y al volver al inicio se ignora el movimiento durante el primer segundo.
- Si la pestaña se oculta durante la animación, la tirada se cancela y vuelve al inicio (no se revela una fortuna que nadie vio).
- El foco se mueve al encabezado de cada pantalla para lectores de pantalla y teclado.
- `npm test` cubre el detector, la selección y los datos.
- Botones de 56 px de alto, foco visible, `aria-live` en las fases y `prefers-reduced-motion` respetado.
- Lighthouse: 100 en accesibilidad, buenas prácticas y SEO.

## Alternativa: Netlify

El proyecto también incluye `netlify.toml` (`npm run build` → `dist`). Puedes conectar el repo en Netlify o arrastrar `dist/` a https://app.netlify.com/drop.
