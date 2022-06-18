let cacheTypes = {
    cacheVersion:'v1',
    startUrl:{
        cacheName:`start-url`,
        cacheUrl:'/'
    },
    staticAssets:{
        cacheName:'static-assets',
        cacheUrl:[ 
            '/index.html',
            '/images/pic1.jpeg',
            '/offline.html',
            '/css/style.css',
            '/js/tailwind.js'
        ]
    }
}

self.addEventListener("install", event => {
    console.log("Service Worker installed.");
    self.skipWaiting();
    // cache.add() for adding the single item

    event.waitUntil(caches.open(`${cacheTypes.startUrl.cacheName}-${cacheTypes.cacheVersion}`).then(cache=>{
        return cache.add(cacheTypes.startUrl.cacheUrl);
    }))
    event.waitUntil(caches.open(`${cacheTypes.staticAssets.cacheName}-${cacheTypes.cacheVersion}`).then(cache=>{
        return cache.addAll(cacheTypes.staticAssets.cacheUrl);
    }))
    
});

//activate sw
self.addEventListener("activate",event=>{
    console.log('service worker activated');
    event.waitUntil(caches.keys().then((cacheKeys)=>{
        console.log('cache name',cacheKeys)
        return Promise.all(cacheKeys.filter(key=>key.indexOf(cacheTypes.cacheVersion)<0).map(cacheItem=>caches.delete(cacheItem)))
    }))
})
 



  //Caching strategies 
  const cachingStrategies = {
    cacheOnly:(event,offlinePage)=>{
      event.respondWith(
          caches.match(event.request).then(cacheResponse=>{
              return cacheResponse
          }).catch(()=>  caches.match(offlinePage))
      )
    },
    netWorkOnly:(event,offlinePage)=>{
        event.respondWith(
             fetch(event.request).then(networkResponse=>{
                 return networkResponse
             }).catch(()=>  caches.match(offlinePage))
        )
    },
    netWorkFirst:(event,offlinePage)=>{
      event.respondWith(
          fetch(event.request).catch(()=>{
              return caches.match(event.request);
          }).catch(()=>  caches.match(offlinePage))
      )
    },
    cacheFirst:(event, offlinePage)=>{
        event.respondWith(
            caches.match(event.request).then(cacheResponse=>{
                return cacheResponse || fetch(event.request)
            }).catch(()=>  caches.match(offlinePage))
        )
    },
    staleWhileRevalidate:(event, offlinePage)=>{
        event.respondWith(
            caches.open(`dynamic-caching`).then(cache=>{
                return cache.match(event.request).then(cacheResponse=>{
                    const fetchPromise = fetch(event.request).then(networkResponse=>{
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    })
                    return cacheResponse || fetchPromise;
                })
            }).catch(()=>  caches.match(offlinePage))
        )
    }
}

self.addEventListener('fetch', function(event) {
    console.log('fetch event', event);
    // event.respondWith(
    //     caches.match(event.request).then(function(cachedResponse) {
    //         return cachedResponse || fetch(event.request);
    //     }).catch(error=>caches.match('/offline.html'))
    // );

    cachingStrategies.cacheFirst(event,'/offline.html');
    
  });

