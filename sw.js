// Bot Lab service worker
// Cache name MUST match the in-app version badge (bump every deploy).
var CACHE = "botlab-v18.0";
var CORE = ["./botlab.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(CORE).catch(function(){}); }));
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ if(k!==CACHE) return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

// Network-first for navigations + the app HTML, so a fresh GitHub Pages push is picked up.
// Falls back to cache when offline. Other assets: stale-while-revalidate.
self.addEventListener("fetch", function(e){
  var req = e.request;
  if(req.method !== "GET") return;
  var isHTML = req.mode === "navigate" || (req.headers.get("accept")||"").indexOf("text/html") > -1;
  if(isHTML){
    e.respondWith(
      fetch(req).then(function(res){
        var copy = res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); });
        return res;
      }).catch(function(){ return caches.match(req).then(function(m){ return m || caches.match("./botlab.html"); }); })
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(function(cached){
      var net = fetch(req).then(function(res){
        var copy = res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); });
        return res;
      }).catch(function(){ return cached; });
      return cached || net;
    })
  );
});

self.addEventListener("message", function(e){ if(e.data === "skipWaiting") self.skipWaiting(); });
