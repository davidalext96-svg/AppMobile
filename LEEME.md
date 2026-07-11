# Bitácora — App de aficiones (PWA)

App para registrar y planificar tus aficiones: **Literatura, Escritura, MMA y Baile**, con panel de porcentajes, metas semanales, recordatorios, agenda con calendario y respaldo de datos.

## Archivos

- `index.html` — la app completa (funciona sola, incluso abierta como archivo).
- `manifest.webmanifest` — permite instalarla como app.
- `sw.js` — service worker: uso **offline** + recordatorio en segundo plano.
- `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` — íconos.

> Los cuatro últimos solo tienen efecto cuando la app se sirve por **https** (o localhost). Abierta como archivo local (`file://`), `index.html` funciona igual, pero sin instalación PWA ni service worker.

## Opción A — Instalarla como app (recomendado)

Necesitas publicarla en una URL https. La forma gratuita más simple es **GitHub Pages**:

1. Crea un repositorio en GitHub y sube **todos** estos archivos a la raíz.
2. Repositorio → **Settings → Pages** → *Branch: main / (root)* → Save.
3. Espera 1–2 min. Tendrás una URL tipo `https://tu-usuario.github.io/tu-repo/`.
4. Abre esa URL en **Chrome (Android)** → menú ⋮ → **Instalar app** / *Añadir a pantalla de inicio*.
5. Quedará con ícono y pantalla completa, funcionando sin conexión.

Dentro de la app, el menú de tema (☀️) incluye **Instalar app** cuando el navegador lo permite.

### Recordatorios en segundo plano
Actívalos en **Metas y recordatorios → Notificación del teléfono**. Requieren la app **instalada**; el navegador decide el momento exacto (aprox. cada 12 h), así que es un aviso aproximado, no un temporizador a la hora exacta. El **aviso al abrir la app** siempre funciona.

## Opción B — Generar un APK real

Una vez publicada (Opción A), conviértela en APK sin programar:

1. Entra a **https://www.pwabuilder.com** y pega la URL de tu app.
2. Pulsa **Package for stores → Android**.
3. Descarga el paquete (`.apk`/`.aab`) firmado y ya lo puedes instalar o subir a Google Play.

Alternativa con línea de comandos: **Bubblewrap** (`@bubblewrap/cli`).

## Datos y respaldo

Todo se guarda en el propio dispositivo (localStorage). Usa **Respaldo y datos → Descargar respaldo** para guardar un `.json` con toda tu información (libros, escritos, registros, metas y recordatorios) e **Importar** para restaurarla en otro equipo.
