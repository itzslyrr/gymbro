// Offline cache for GYMBRO. The version changes on every build, so phones pick up updates.
const CACHE = 'gymbro-3cfe9f85c8';
const SHELL = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png", "mus/abduct.jpg", "mus/abs.jpg", "mus/biceps.jpg", "mus/calves.jpg", "mus/cardio.jpg", "mus/chest.jpg", "mus/fdelt.jpg", "mus/forearms.jpg", "mus/glutes.jpg", "mus/hams.jpg", "mus/lats.jpg", "mus/lowback.jpg", "mus/neck.jpg", "mus/obliques.jpg", "mus/quads.jpg", "mus/rdelt.jpg", "mus/sdelt.jpg", "mus/triceps.jpg", "mus/upback.jpg"];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('gymbro-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // App page: network first so updates arrive when online, cache when offline.
  if (url.searchParams.has('check')) return; // update checks always go to the network
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req.url, { cache: 'no-store' }).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put('index.html', copy)); return res;
    }).catch(() => caches.match('index.html')));
    return;
  }
  // Everything else (icons, Google Fonts): cache first, fill the cache on first use.
  if (url.origin === location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res;
    })));
  }
});
