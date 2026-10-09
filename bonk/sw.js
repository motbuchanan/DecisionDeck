/* BONK service worker — cache name MUST match the app version badge on every deploy */
var CACHE = 'bonk-v0.4.3';
var ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];
self.addEventListener('install', function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS).catch(function(){}); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.map(function(k){ if(k!==CACHE) return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET') return;
  // network-first for page navigations so the live version is always fresh online; cache is the offline fallback
  if(req.mode === 'navigate'){
    e.respondWith(fetch(req).then(function(r){
      var copy = r.clone(); caches.open(CACHE).then(function(c){ c.put('./index.html', copy); });
      return r;
    }).catch(function(){ return caches.match('./index.html').then(function(m){ return m || caches.match('./'); }); }));
    return;
  }
  // cache-first for everything else (icons, manifest)
  e.respondWith(caches.match(req).then(function(m){ return m || fetch(req).then(function(r){
    var copy = r.clone(); if(r.ok) caches.open(CACHE).then(function(c){ c.put(req, copy); });
    return r;
  }).catch(function(){ return m; }); }));
});
