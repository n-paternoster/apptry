let query = window.location
console.log(query)
let actualDateLong = new Date();
let acDate = actualDateLong.toISOString().slice(0, 10);


window.localStorage.setItem("dateDay", acDate)
window.localStorage.setItem("query", query)





