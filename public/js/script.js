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

//Überprüfen des Localstorage ob heute Übungen augewählt wurden
document.addEventListener("DOMContentLoaded", function (event) {
    let actualDateLong = new Date();
    let acDate = actualDateLong.toISOString().slice(0, 10);


    let storedDate = window.localStorage.getItem("dateDay")

    if (storedDate !== acDate) {
        window.localStorage.clear()
        console.log("if")
    } else {

        let startAnker = document.getElementById("startWorkout")
        startAnker.innerText = 'Back to Work !'
        startAnker.href = window.localStorage.query

    };

})

