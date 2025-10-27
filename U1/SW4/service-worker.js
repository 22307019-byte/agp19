//Nombre del cache
const cacheName = "mi-cache-v2";
const dynamicCache = "dynamic-cache-v1"; // Cache separado para contenido dinámico

//Archivos que se guardan en cache
const cacheAssets = [
    'index.html',
    'pagina1.html',
    'pagina2.html',
    'pagina3.html',
    'offline.html',
    'styles.css',
    'main.js',
    'logo.png',
    'imagen1.jpg',
    'imagen2.JPG',
    'imagen3.jpg',

];

//Instalación del SW
self.addEventListener('install', (event) => {
    console.log('SW: Instalado');
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('SW: Cacheando archivos...');
            return cache.addAll(cacheAssets);
        })
        .then(() => self.skipWaiting())
        .catch((err) => console.log('Error al cachear archivos.', err))
    );
});

//Activacion del SW
self.addEventListener('activate', (event) => {
    console.log('SW: Activado');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== cacheName && cache !== dynamicCache) {
                        console.log(`SW: Eliminando cache antigua: ${cache}`);
                        return caches.delete(cache);
                    }
                }).filter(Boolean) // Filtrar undefined
            );
        })
    );
});

//Escuchar mensajes desde la pagina
self.addEventListener('message', (event) => {
    console.log('SW recibio:', event.data);
    if (event.data === 'mostrar-notificacion') {
        self.registration.showNotification('Notificacion Local.', {
            body: 'Esta es una prueba de notificacion push.',
            icon: 'logo.png'
        });
    }
});

//Manejar peticiones de red con fallback offline
self.addEventListener('fetch', (event) => {
    //Ignorar peticiones innecesarias con extensiones o favicon
    if (
        event.request.url.includes('chrome-extension') ||
        event.request.url.includes('favicon.ico')
    ) {
        return;
    }

    event.respondWith(
        fetch(event.request)
        .then((response) => {
            //Si la respuesta es valida, la devuelve y la guarda en cache dinamico
            const clone = response.clone();
            caches.open(dynamicCache).then((cache) => cache.put(event.request, clone));
            return response;
        })
        .catch(() => {
            //Si no hay red buscar en cache
            return caches.match(event.request).then((response) => {
                if (response) {
                    console.log('SW: Recurso desde la cache', event.request.url);
                    return response;
                } else {
                    console.warn('SW: Mostrar pagina offline.');
                    return caches.match('offline.html').then((offlineResponse) => {
                        return offlineResponse || new Response('<h1>Offline</h1><p>No hay conexión a internet.</p>', {
                            headers: { 'Content-Type': 'text/html' }
                        });
                    });
                }
            });
        })
    );
});
