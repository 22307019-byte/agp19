//Nombre del cache actual (identificador unico)
const CACHE_NAME = "mi-app-cache-v1";

//Lista de los archivos que se guardan en cache
const urlsToCache =[
    "./", //La ruta raiz
    "./index.html", //documento principal
    "./app.js", //script del cliente
    "./styles.css", //estilos
    "./logo.png" //imagen del logo
];

//Evento de instalacion (se dispara cuando se intala el SW)
self.addEventListener("install", (event) => {
    console.log("SW: Instalado");

    //event.waitUntil() asegura que la instalacion espere hasta que se complete  la promesa (promises) de cachear archivos.
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>{
            console.log("SW: Archivos cacheados.");

            //cache, addAll() agrega todos los archivos de urlstocache al cache final
            return cache.addAll(urlsToCache);
        })
    );

});

//Evento de activacion (se dispara cuando sl SW toma el control)
self.addEventListener("activate", (event) =>{
    console.log("SW: Activado");

    event.waitUntil(
        //caches keys () obtiene todos los nombres de caches  almacenados
        caches.keys().then((cacheNames) => {
            //Promise.all() espera a que se eliminen todos los caches viejos
            return Promise.all(
                cacheNames.map((cache) => {
                    //Si el cache coincide con el actual, se elimina
                    if(cache !==  CACHE_NAME) {
                        console.log("SW: Cache viejo eliminado.", cache);
                        return caches.delete(cache);
                    }
                }) 
            );
        }).then(() => {

            //mostrar notificación en sistema
                return self.registration.showNotification("Service worker activo.", {
                    body: "El cache incial se configuro correctamente." ,
                    icon: "logo.png"
                });

        })
    
    );
});

//Evento de intercepcion de peticiones (cada vez que la app pida un recurso)
self.addEventListener("fetch", (event) => {
    event.respondWith(
        //caches.match() busca si el recuro ya esta en cache
        caches.match(event.request).then((response) => {
            //si esta en cache se devuelve la copia guardada
            //si no esta en cache se hace una  peticion a la red con fetch
            return response || fetch(event.request);
        })
    );
});