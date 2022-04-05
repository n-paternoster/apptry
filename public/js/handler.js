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

    const overviewData = document.getElementById("accBodyTwo")

    let allData = res.data.overviewExercises
    console.log(allData)

    //Daten werden in 2 direkt voneinander abhänigen Arrys aufgeteilt dates+uniqueex
    let groupedData = d3.nest()
        .key(function (d) { return d.exerciseDate; })
        .entries(allData);
    let allDates = [];
    let exercises = []
    for (arr of groupedData) {
        for (val of arr.values) {
            exercises.push(val.exerciseName)
            allDates.push(arr.key)
        }
    }
    let uniqueEx = [...new Set(exercises)];
    let indexes = [];
    let dates = []
    for (ob of uniqueEx) {
        let index = exercises.indexOf(ob)
        indexes.push(index)

    }
    for (i of indexes) {
        let date = allDates[i]
        dates.push(date)

    }
    console.log(dates)
    console.log(uniqueEx)


})