let query = window.location
console.log(query)
let actualDateLong = new Date();
let acDate = actualDateLong.toISOString().slice(0, 10);


window.localStorage.setItem("dateDay", acDate)
window.localStorage.setItem("query", query)



window.history.pushState({ page: 1 }, "", "");

// window.onpopstate = function (event) {

//     // "event" object seems to contain value only when the back button is clicked
//     // and if the pop state event fires due to clicks on a button
//     // or a link it comes up as "undefined"

//     if (event) {
//         window.location.replace("/")
//     }
//     else {
//         // Continue user action through link or button
//     }
// }

