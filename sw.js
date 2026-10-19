/* VolleyFit – funzionamento senza rete.
   Cambia VERSIONE a ogni pubblicazione: i dispositivi vedranno «È disponibile una nuova versione». */
const VERSIONE = 'volleyfit-1.1.1';
const FILE = [
  './', 'index.html', 'manifest.webmanifest',
  'js/pose.js', 'js/anim.js', 'js/dati.js', 'js/catalogo.js', 'js/store.js', 'js/sync.js', 'js/editor.js', 'js/app.js',
  'fonts/sora-latin-400-normal.woff2', 'fonts/sora-latin-600-normal.woff2', 'fonts/sora-latin-700-normal.woff2',
  'icone/icona.svg', 'icone/icona-180.png', 'icone/icona-192.png', 'icone/icona-512.png', 'icone/icona-maskable-512.png',
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSIONE).then(c => c.addAll(FILE.map(f => new Request(f, {cache:'reload'})))));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSIONE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', e => { if (e.data === 'aggiorna') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // GitHub e il resto passano direttamente
  e.respondWith(
    caches.match(e.request, {ignoreSearch: true}).then(r => r || fetch(e.request).then(res => {
      if (res.ok && res.type === 'basic') { const copia = res.clone(); caches.open(VERSIONE).then(c => c.put(e.request, copia)); }
      return res;
    }).catch(() => e.request.mode === 'navigate' ? caches.match('index.html') : Response.error()))
  );
});
