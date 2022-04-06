const weightinputElement = document.getElementById("saveWeightButton")
weightinputElement.addEventListener("click", (evt) => {
    if (weightinputElement.previousElementSibling.value.length != 0) {
        console.log(weightinputElement.previousElementSibling.value)
        let weightData = evt.target.previousElementSibling.value
        let today = new Date();
        let eDate = today.toISOString().slice(0, 10);  //aktuelles Datum in Year/month/day
        let dataObject = {
            weightDate: eDate,
            weight: weightData
        }


        axios({
            method: 'post',
            url: '/Datenbank/newWeight',
            data: dataObject,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {

            }, (error) => {
                console.log(error);
            });

        let accordion = document.getElementById("weightAcc")
        accordion.remove()

    }
})

const overviewData = document.getElementById("overviewButton")
overviewData.addEventListener("click", async (evt) => {
    let res = await axios({
        method: 'get',
        url: '/Datenbank/getOverview',

    })

    const overviewData = document.getElementById("overViewTable")
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let allData = res.data.everyData

    for (el of allData) {
        let row = document.createElement("tr")
        let col1 = document.createElement("th")
        let col2 = document.createElement("th")
        let col3 = document.createElement("th")
        let date = new Date(el.dateshort)

        col1.innerText = date.toISOString().slice(0, 10)
        col2.innerText = days[date.getDay()]
        col3.innerText = el.value

        row.appendChild(col1)
        row.appendChild(col2)
        row.appendChild(col3)
        overviewData.appendChild(row)


    }

    console.log(allData)
    console.log(overviewData)




})