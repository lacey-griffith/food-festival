const FILES_TO_CACHE = [
    "./index.html",
    "./events.html",
    "./tickets.html",
    "./schedule.html",
    "./assets/css/style.css",
    "./assets/css/bootstrap.css",
    "./assets/css/tickets.css",
    "./dist/app.bundle.js",
    "./dist/events.bundle.js",
    "./dist/tickets.bundle.js",
    "./dist/schedule.bundle.js"
]

const APP_PREFIX = 'FoodFest-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;


//INSTALL service worker
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('installing cache: ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
});


//ACTIVATE service worker
self.addEventListener('activate', function(e) {
    e.waitUntil(
        //keys() returns array of all cache names then we name that returned list keyNames
        caches.keys().then(function(keylist) {
            let cacheKeepList = keyList.filter(function (key) {
                //keep only the caches of our app in new list cacheKeepList
                return key.indexOf(APP_PREFIX)
            })
            cacheKeepList.push(CACHE_NAME);
            return Promise.all(
                keylist.map(function(key,i) {
                    if(cacheKeepList.indexOf(key) === -1){
                        console.log('deleting cache: ', + keylist[i])
                        return caches.delete(keylist[i])
                    }
                })
            )
        })
    )
});

//GET cache data
//listen for fetch event
//log the URL of requested resource
//define how to respond to the request
//if it exists in the cache- return it
//if it doesn't- send the request normally (to the server)
self.addEventListener('fetch', function(e) {
    console.log('fetch request: ' + e.request.url)
    e.respondWith(
        caches.match(e.request).then(function(request) {
            // return request || fetch(e.request) can replace all the following lines
            if(request){ //if cache is available, respond with cache
                console.log('responding with cache: ' + e.request.url)
                return request
            } else { //if no cache, respond with fetch request
                console.log('file not cached, fetching: ' + e.request.url)
                return fetch(e.request)
            }
        })
    )
})