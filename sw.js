/* Service Worker — شبكة أولاً للملفات الأساسية (حتى لا تعلق نسخة قديمة)، ثم الكاش عند انقطاع الإنترنت */
var CACHE_NAME = 'caesar-v20';
var CORE_ASSETS = ['./', './index.html', './app.js', './manifest.json'];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (c) { return c.addAll(CORE_ASSETS); }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE_NAME; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.hostname === 'generativelanguage.googleapis.com') return; // لا نخزّن طلبات الذكاء الاصطناعي

  event.respondWith(
    fetch(req).then(function (res) {
      if (res && (res.ok || res.type === 'opaque')) {
        var copy = res.clone();
        caches.open(CACHE_NAME).then(function (c) { c.put(req, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) {
        return hit || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error());
      });
    })
  );
});
