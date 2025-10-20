let registration = null;

function register_service_worker() {
    if ('serviceWorker' in navigator) {
        window.navigator.serviceWorker.register('./sw.js', { scope: './' })
            .then(res => {
                registration = res;
                console.log("SW successfully registered.");
            })
            .catch(err => {
                console.log("Could not register service worker.");
            });
    }
}

function unregister_service_worker() {
    navigator.serviceWorker.getRegistrations()
        .then(registrations => {
            registrations.forEach(registration => {
                registration.unregister();
                console.log("Service Worker ungregistered.");
            })
        })
        .catch(err => {
            console.log("Could not unregister service worker.");
        });
}

window.addEventListener('click', () => {
    fetch('./obj.png')
        .then(res => console.log('From script.js: ', res));
});
register_service_worker();
//Unregister_service_worker();




