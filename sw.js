/* Bitácora — service worker
   Cachea el shell para uso offline y dispara un recordatorio diario
   (best-effort) cuando la PWA está instalada. */
const VERSION = 'bitacora-v1';
const SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(k => k !== VERSION && k !== 'bitacora-cfg')
        .map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // HTML: red primero (para recibir actualizaciones), con respaldo en cache
  if (req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('index.html')) {
    e.respondWith(
      fetch(req)
        .then(r => { const cp = r.clone(); caches.open(VERSION).then(c => c.put(req, cp)); return r; })
        .catch(() => caches.match(req).then(m => m || caches.match('index.html')))
    );
    return;
  }
  // Resto: cache primero
  e.respondWith(
    caches.match(req).then(m => m || fetch(req).then(r => {
      const cp = r.clone(); caches.open(VERSION).then(c => c.put(req, cp)); return r;
    }))
  );
});

/* ---- Recordatorio en segundo plano (Periodic Background Sync) ----
   Solo funciona en PWA instalada (Chrome Android) y el navegador decide
   cuándo dispararlo (aprox. cada 12 h). No es un temporizador exacto. */
self.addEventListener('periodicsync', e => {
  if (e.tag === 'bitacora-reminder') e.waitUntil(remind());
});

async function remind() {
  try {
    const cache = await caches.open('bitacora-cfg');
    const cfgRes = await cache.match('reminder-cfg');
    if (!cfgRes) return;
    const cfg = await cfgRes.json();
    if (!cfg.activo || !cfg.notificar) return;

    const now = new Date();
    const day = (now.getDay() + 6) % 7; // 0 = lunes
    if (!(cfg.dias || []).includes(day)) return;

    const today = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0');
    const lastRes = await cache.match('reminder-last');
    const last = lastRes ? await lastRes.text() : '';
    if (last === today) return; // ya notificado hoy

    await self.registration.showNotification('Bitácora', {
      body: '¿Registramos tu práctica de hoy?',
      icon: 'icon-192.png',
      badge: 'icon-192.png',
      tag: 'bitacora-daily'
    });
    await cache.put('reminder-last', new Response(today));
  } catch (e) { /* silencioso */ }
}

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(list => {
      for (const c of list) { if ('focus' in c) return c.focus(); }
      if (self.clients.openWindow) return self.clients.openWindow('index.html');
    })
  );
});
