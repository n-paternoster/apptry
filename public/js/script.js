document.addEventListener('DOMContentLoaded', init, false);
function init() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then((reg) => {
                console.log('Service worker registered -->', reg);
            })
            .catch((err) => {
                console.error('Service worker not registered -->', err);
            })
    }
}

let actualDateLong = new Date();
let acDate = actualDateLong.toISOString().slice(0, 10);


let storedDate = window.localStorage.getItem("dateDay")

if (storedDate !== acDate) {
    window.localStorage.clear()
}


