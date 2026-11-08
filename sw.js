// Offline cache for GYMBRO. The version changes on every build, so phones pick up updates.
const CACHE = 'gymbro-0251cad3a2';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png', "ex/Barbell_Bench_Press_-_Medium_Grip-0.jpg", "ex/Barbell_Bench_Press_-_Medium_Grip-1.jpg", "ex/Barbell_Glute_Bridge-0.jpg", "ex/Barbell_Glute_Bridge-1.jpg", "ex/Barbell_Hip_Thrust-0.jpg", "ex/Barbell_Hip_Thrust-1.jpg", "ex/Barbell_Incline_Bench_Press_-_Medium_Grip-0.jpg", "ex/Barbell_Incline_Bench_Press_-_Medium_Grip-1.jpg", "ex/Bicycling_Stationary-0.jpg", "ex/Bicycling_Stationary-1.jpg", "ex/Butterfly-0.jpg", "ex/Butterfly-1.jpg", "ex/Calf_Press_On_The_Leg_Press_Machine-0.jpg", "ex/Calf_Press_On_The_Leg_Press_Machine-1.jpg", "ex/Close-Grip_Front_Lat_Pulldown-0.jpg", "ex/Close-Grip_Front_Lat_Pulldown-1.jpg", "ex/Dead_Bug-0.jpg", "ex/Dead_Bug-1.jpg", "ex/Dips_-_Triceps_Version-0.jpg", "ex/Dips_-_Triceps_Version-1.jpg", "ex/Dumbbell_Incline_Row-0.jpg", "ex/Dumbbell_Incline_Row-1.jpg", "ex/Dumbbell_Shoulder_Press-0.jpg", "ex/Dumbbell_Shoulder_Press-1.jpg", "ex/EZ-Bar_Curl-0.jpg", "ex/EZ-Bar_Curl-1.jpg", "ex/EZ-Bar_Skullcrusher-0.jpg", "ex/EZ-Bar_Skullcrusher-1.jpg", "ex/Face_Pull-0.jpg", "ex/Face_Pull-1.jpg", "ex/Hammer_Curls-0.jpg", "ex/Hammer_Curls-1.jpg", "ex/Incline_Dumbbell_Curl-0.jpg", "ex/Incline_Dumbbell_Curl-1.jpg", "ex/Incline_Dumbbell_Press-0.jpg", "ex/Incline_Dumbbell_Press-1.jpg", "ex/Isometric_Neck_Exercise_-_Sides-0.jpg", "ex/Isometric_Neck_Exercise_-_Sides-1.jpg", "ex/Knee_Hip_Raise_On_Parallel_Bars-0.jpg", "ex/Knee_Hip_Raise_On_Parallel_Bars-1.jpg", "ex/Leg_Extensions-0.jpg", "ex/Leg_Extensions-1.jpg", "ex/Leg_Press-0.jpg", "ex/Leg_Press-1.jpg", "ex/Lying_Face_Up_Plate_Neck_Resistance-0.jpg", "ex/Lying_Face_Up_Plate_Neck_Resistance-1.jpg", "ex/Lying_Leg_Curls-0.jpg", "ex/Lying_Leg_Curls-1.jpg", "ex/Machine_Shoulder_Military_Press-0.jpg", "ex/Machine_Shoulder_Military_Press-1.jpg", "ex/Mountain_Climbers-0.jpg", "ex/Mountain_Climbers-1.jpg", "ex/One-Arm_Dumbbell_Row-0.jpg", "ex/One-Arm_Dumbbell_Row-1.jpg", "ex/Pallof_Press-0.jpg", "ex/Pallof_Press-1.jpg", "ex/Plank-0.jpg", "ex/Plank-1.jpg", "ex/Pullups-0.jpg", "ex/Pullups-1.jpg", "ex/Seated_Calf_Raise-0.jpg", "ex/Seated_Calf_Raise-1.jpg", "ex/Seated_Leg_Curl-0.jpg", "ex/Seated_Leg_Curl-1.jpg", "ex/Seated_Side_Lateral_Raise-0.jpg", "ex/Seated_Side_Lateral_Raise-1.jpg", "ex/Side_Bridge-0.jpg", "ex/Side_Bridge-1.jpg", "ex/Side_Lateral_Raise-0.jpg", "ex/Side_Lateral_Raise-1.jpg", "ex/Single-Leg_Leg_Extension-0.jpg", "ex/Single-Leg_Leg_Extension-1.jpg", "ex/Stomach_Vacuum-0.jpg", "ex/Stomach_Vacuum-1.jpg", "ex/Thigh_Abductor-0.jpg", "ex/Thigh_Abductor-1.jpg", "ex/Triceps_Pushdown_-_Rope_Attachment-0.jpg", "ex/Triceps_Pushdown_-_Rope_Attachment-1.jpg", "ex/Walking_Treadmill-0.jpg", "ex/Walking_Treadmill-1.jpg", "ex/Wide-Grip_Lat_Pulldown-0.jpg", "ex/Wide-Grip_Lat_Pulldown-1.jpg"];

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
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(res => {
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
