//Verificar si el navegador soporta service workers
if ("serviceWorker" in navigator){
    //El metodo register() sirve para registrar un archivo tipo service worker
    //El parametro "./sw.js" es la ruta del archivo a usar como  SW
    navigator.serviceWorker.register("./sw.js")

        //then() se ejecuta si el SW fue exitoso
        //'reg' es un objeto de tipo ServiceWorkerRegistration con informacion del SW
        .then((reg) => console.log("Service Worker registrado:", reg))

        //catch() se ejecuta si ocurre un error en el registro
        //'err' contiene el mensaje o detalle del error
        .catch((err) => console.log("Error al registrar el SW:", err));
}

//Agregamos un evento de clic para el id check
document.getElementById("check").addEventListener("click", () => {
    //Verificar si el SW controla la pagina actual
    if(navigator.serviceWorker.controller) {
        alert("El service worker esta activado y controlando la pagina");
    } else {
        alert("El service worker aun no está activo.");
    }
});

//Area de notificación 
if (Notification.permission === "default") {
    Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
            console.log("Permiso de Notificación concedido.")
        }
    });
}