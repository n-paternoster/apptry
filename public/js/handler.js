const weightinputElement = document.getElementById("saveWeightButton")
weightinputElement.addEventListener("click", (evt) => {
    if (weightinputElement.previousElementSibling.value.length != 0) {

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
    let newestDates = []
    //Array der letzten Tage zur
    for (i = 0; i < 8; i++) {

        let today = new Date();
        let dateOffset = (24 * 60 * 60 * 1000) * i; //i days

        today.setTime(today.getTime() - dateOffset);
        newestDates.push(today)

    }

    for (i = 0; i < 8; i++) {
        let row = document.createElement("tr")
        let col1 = document.createElement("th")
        let col2 = document.createElement("th")
        let col3 = document.createElement("th")
        let day = days[newestDates[i].getDay()]
        for (j = 0; j < allData.length; j++) {

            if (newestDates[i].toISOString().slice(0, 10) === allData[j].dateshort) {
                col3.innerText = allData[j].value;

                break;
            } else {
                col3.innerText = "-";
            }
        }
        col2.innerText = day;
        col1.innerText = newestDates[i].toISOString().slice(0, 10)
        row.appendChild(col1)
        row.appendChild(col2)
        row.appendChild(col3)
        overviewData.children[1].appendChild(row)

    }




})