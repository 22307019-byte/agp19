self.addEventListener('install', event => {
    self.skipWaiting();    event.waitUntil(
        caches.open('v3')
            .then(cache => {
                cache.addAll([
                    './', // the index.html
                    './script.js', // the main script
                    './obj.png' // local img; same dir as script.js
                ]);
                console.log("Assets cached.");
            })
            .catch(err => console.log("Could not cache."))
    )
});

self.addEventListener('fetch', event => {
    console.log("INTERCEPTED");

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                console.log("V3 The request: ", event.request);
                console.log("V3 Got the response...", response);

                /* COMMENT OUT AND UNCOMMENT THESE EXAMPLES TO TEST THE RESULTS */

                /* EXAMPLE 1 */
                // from cache or fetched if not
                return response || fetch(event.request);


                /* EXAMPLE 2 */
                // target specific request object and respond with different data but same type
                // if (event.request.url === 'http://127.0.0.1:5500/obj.png') {
                //     return fetch('https://picsum.photos/800');
                // } else {
                //     return response;
                // }


                /* EXAMPLE 3 */
                // target specific request object and respond with different data but same type
                // one thing you'll want your service worker to do is to CACHE REQUESTS THAT YOU DON'T ALREADY HAVE STORED LOCALLY
                // if (event.request.url === 'http://127.0.0.1:5500/obj.png') { // obj.png is just a local img in the same directory as the index.html
                //     return fetch('https://picsum.photos/800')
                //         .then(res => {
                //             return caches.open('v1')
                //                 .then(cache => {
                //                     cache.put(event.request, res.clone());
                //                     return res;
                //                 })
                //         });
                // } else {
                //     return response;
                // }


                /* EXAMPLE 4 */
                // return other site - must be non CORS-blocked instead of the initial index.html (index.html always first to be fetched)
                // return fetch('https://jsonplaceholder.typicode.com/todos/1')


                /* EXAMPLE 5 */
                // return an empty RESPONSE object or a RESPONSE object with data inside
                // return new Response();
            })
            .catch(err => {
                console.log("Could not find matching request.");
                return null;
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => {
                keys.forEach(key => {
                    if (key === 'v3') caches.delete(key);
                });
            })
    );
});
