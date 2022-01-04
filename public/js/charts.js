
document.addEventListener('DOMContentLoaded', (evt) => {
    createWeightGraph()
    createTimeData()
}, false);
//Körpergewichtgraph nach Laden der Seite Laden
async function createWeightGraph() {

    let div = document.getElementById("center-bodyweight")


    const img = document.createElement("img");
    img.src = 'pics/muskel.gif';
    img.style.width = '40%'
    div.insertAdjacentElement('afterend', img)
    const res = await axios({
        method: 'get',
        url: '/Datenbank/getWeight'

    })
    img.remove()
    //Create HTML Elements

    let canvas = document.createElement("canvas")
    canvas.setAttribute("id", "bodyChart")
    div.appendChild(canvas)




    let rangeSelect = document.createElement("select")
    rangeSelect.setAttribute("id", "rangeSelectorBody")
    rangeSelect.setAttribute("class", "smallSelect")
    let option1m = document.createElement("option")

    option1m.innerText = "1 Month"
    option1m.value = 1 * 30 * 24 * 60 * 60 * 1000
    let option3m = document.createElement("option")
    option3m.innerText = "3 Month"
    option3m.value = 3 * 30 * 24 * 60 * 60 * 1000
    let option6m = document.createElement("option")
    option6m.innerText = "6 Month"
    option6m.value = 6 * 30 * 24 * 60 * 60 * 1000
    let option12m = document.createElement("option")
    option12m.innerText = "1 Year"
    option12m.value = 12 * 30 * 24 * 60 * 60 * 1000
    let optionAll = document.createElement("option")
    optionAll.innerText = "All"
    optionAll.value = 0
    let label = document.createElement("label")
    label.setAttribute("for", "rangeSelector")
    label.innerText = "Time range: "
    rangeSelect.appendChild(optionAll)
    rangeSelect.appendChild(option1m)
    rangeSelect.appendChild(option3m)
    rangeSelect.appendChild(option6m)
    rangeSelect.appendChild(option12m)




    div.appendChild(label)
    div.appendChild(rangeSelect)




    let range = []
    const selectRange = document.getElementById("rangeSelectorBody")


    const sortedData = res.data.selectedWeight.slice().sort((a, b) => b.weightDate - a.weightDate)
    //Zusammenfassen der versch. Daten in ein Object
    let nestedMeanValue = d3.nest()
        .key(function (d) { return d.weightDate; })
        .entries(sortedData);

    //Aufteilen der Daten in X und Y Array
    let weights = [];
    let dateLabel = [];

    for (obj of nestedMeanValue) {
        let weight = obj.values[0].weight

        let unsliceLabel = obj.key
        label = unsliceLabel.slice(0, 10);

        dateLabel.push(label)
        weights.push(weight)
    }
    let linechart
    createWeight(0)
    function createWeight(range) {

        //Dynamik X Scale
        let max = dateLabel.reduce((prev, curr) => new Date(prev) > new Date(curr) ? prev : curr, "1970-01-01")
        let min = dateLabel.reduce((prev, curr) => new Date(prev) < new Date(curr) ? prev : curr, new Date(Date.now()))
        let dynMin
        if (range != 0) {
            dynMin = new Date(new Date(max).getTime() - range)
        }
        else {
            dynMin = min
        }

        //Buffer Y scale
        let maxValue = Math.max(...weights)
        let minValue = Math.min(...weights)


        //Create Chart
        const chart = document.getElementById("bodyChart")

        linechart = new Chart(chart, {
            type: "line",
            data: {
                labels: dateLabel,
                datasets: [{
                    data: weights,
                    borderColor: "#efeff1",
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: false,
                        text: "Bodyweight",
                        color: "#efeff1"
                    }
                },
                scales: {
                    x: {
                        min: dynMin,
                        max: max,
                        ticks: {
                            color: "#efeff1",
                        },
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    },
                    y: {
                        ticks: {
                            color: "#efeff1",
                        },
                        //Buffer 
                        max: maxValue + 1,
                        min: minValue - 1,

                    }
                }
            }
        })

    }
    selectRange.addEventListener("change", (evt) => {

        let selectedRange = evt.target.options[evt.target.selectedIndex].value
        range = selectedRange

        linechart.destroy()
        createWeight(range)
    })
}
async function createTimeData() {
    const div = document.getElementById("timeDuration")

    const img = document.createElement("img");
    img.src = 'pics/muskel.gif';
    img.style.width = '40%'
    div.appendChild(img)
    const res = await axios({
        method: 'get',
        url: '/Datenbank/getTime',

    })
    img.remove()
    let exerciseDuration = res.data.timeDiff

    let par1 = document.createElement("p")
    par1.innerText = `Lastest Workout Duration: ${exerciseDuration} min`
    div.appendChild(par1)
    let dateDuration = []
    let duration = []
    if (res.data.allData) {
        let allData = res.data.allData

        //aufteilen der Daten mit gleichen Datum in unterObjecte
        let groupedData = d3.nest()
            .key(function (d) { return d.exerciseDate; })
            .entries(allData);

        for (arr of groupedData) {
            let timeDiff = Math.round(Math.abs(new Date(arr.values[arr.values.length - 1].exerciseTime) - new Date(arr.values[0].exerciseTime)) / (1000 * 60))

            dateDuration.push(arr.key)  //Absteigend geordnet direkt abhängigig zu einander
            duration.push(timeDiff)     //Absteigend geordnet direkt abhängigig zu einander in min

        }

        let pmean = document.createElement("p")
        let sumDuration = duration.reduce((a, b) => a + b, 0)
        let meanDuration = Math.round((sumDuration / duration.length) || 0)
        pmean.innerText = `Average Workout Duration: ${meanDuration} min`
        div.appendChild(pmean)
        //each  MOnth
        let monthCount = []   // anzahl der Workouts pro Montat (0-11)
        for (let j = 0; j < 12; j++) {
            let count = 0
            for (let i = 0; i < duration.length; i++) {
                if (new Date(dateDuration[i]).getMonth() === j) {
                    count++
                }
            }
            monthCount.push(count)
        }


        let pcount = document.createElement("p")
        let selectcount = document.createElement("select")
        selectcount.setAttribute("class", "smallSelect")
        option0 = document.createElement("option")
        option0.innerText = "January"
        option0.value = 0
        selectcount.appendChild(option0)
        option1 = document.createElement("option")
        option1.innerText = "February"
        option1.value = 1
        selectcount.appendChild(option1)
        option2 = document.createElement("option")
        option2.innerText = "March"
        option2.value = 2
        selectcount.appendChild(option2)
        option3 = document.createElement("option")
        option3.innerText = "April"
        option3.value = 3
        selectcount.appendChild(option3)
        option4 = document.createElement("option")
        option4.innerText = "May"
        option4.value = 4
        selectcount.appendChild(option4)
        option5 = document.createElement("option")
        option5.innerText = "June"
        option5.value = 5
        selectcount.appendChild(option5)
        option6 = document.createElement("option")
        option6.innerText = "July"
        option6.value = 6
        selectcount.appendChild(option6)
        option7 = document.createElement("option")
        option7.innerText = "August"
        option7.value = 7
        selectcount.appendChild(option7)
        option8 = document.createElement("option")
        option8.innerText = "September"
        option8.value = 8
        selectcount.appendChild(option8)
        option9 = document.createElement("option")
        option9.innerText = "October"
        option9.value = 9
        selectcount.appendChild(option9)
        option10 = document.createElement("option")
        option10.innerText = "November"
        option10.value = 10
        selectcount.appendChild(option10)
        option11 = document.createElement("option")
        option11.innerText = "December"
        option11.value = 11
        selectcount.appendChild(option11)


        let selectedMonthDigit = 0;

        selectcount.addEventListener('change', (evt) => {

            selectedMonthDigit = evt.target.options[evt.target.selectedIndex].value
            pcount.innerText = `You went ${monthCount[selectedMonthDigit]} times on `
            pcount.appendChild(selectcount)
            div.appendChild(pcount)

        })

        pcount.innerText = `You went ${monthCount[selectedMonthDigit]} times on `
        pcount.appendChild(selectcount)
        div.appendChild(pcount)
    }
}


//Auswählbarer Übungsgraph
function createGraph(dataName, Data, selectedRange) {

    //Aufteilen aller Übung auf einzelne Tage
    let dataset = Data.selectedData

    //Sortieren der Übungen aufsteigend 
    const sortedDada = dataset.slice().sort((a, b) => b.exerciseDate - a.exerciseDate)
    //Zusammenfassen der versch. Daten in ein Object
    let nestedMeanWeight = d3.nest()
        .key(function (d) { return d.exerciseDate; })
        .rollup(function (m) {
            return d3.mean(m, function (d) { return d.exerciseWeight });
        })
        .entries(sortedDada);
    //Aufteilen der Daten in X und Y Array
    let weights = [];
    let dateLabel = [];
    for (obj of nestedMeanWeight) {
        let weight = obj.values
        let unsliceLabel = obj.key
        label = unsliceLabel.slice(0, 10);

        dateLabel.push(label)
        weights.push(weight)
    }

    let max = dateLabel.reduce((prev, curr) => new Date(prev) > new Date(curr) ? prev : curr, "1970-01-01")
    let min = dateLabel.reduce((prev, curr) => new Date(prev) < new Date(curr) ? prev : curr, new Date(Date.now()))
    let dynMin
    if (selectedRange != 0) {
        dynMin = new Date(new Date(max).getTime() - selectedRange)
    }
    else {
        dynMin = min
    }
    const chart = document.getElementById("myChart")
    let linechart = new Chart(chart, {
        type: "line",
        data: {
            labels: dateLabel,
            datasets: [{

                data: weights,
                borderColor: "#FFFFFF",

            }]

        },
        options: {
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: dataName,
                    color: "#FFFFFF"
                }
            },
            scales: {
                x: {

                    min: dynMin,
                    max: max,
                    ticks: {
                        color: "#efeff1",
                    },

                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                },
                y: {
                    ticks: {
                        color: "#efeff1",
                    }
                }
            }
        }

    })



}

const selectExercise = document.querySelectorAll('.selectExerc');
//chartSelections auswählen der zu untersuchenden Uebungen
for (let obj of selectExercise) {
    obj.addEventListener('change', async function (evt) {
        //Data
        let selType = evt.target.options[evt.target.selectedIndex].value
        let dataObject = { exerciseType: selType }

        //GET Exercise for Bodypart
        const res = await axios({
            method: 'get',
            url: '/Datenbank/selectExercise',
            params: dataObject,
        })


        //Create Exercise Select & Button
        let newDiv = document.createElement("div");
        newDiv.setAttribute("class", "nameDiv")


        let inputStyle = document.createElement("select");
        inputStyle.setAttribute("class", "smallSelect")
        let newButton = document.createElement("button");
        newDiv.appendChild(inputStyle);
        newDiv.appendChild(newButton);
        inputStyle.classList.toggle("form-select");
        newButton.innerText = "Show Chart";
        newButton.className = "selcSpefExcer buttonAll";
        let dummyoption = document.createElement("option")

        inputStyle.appendChild(dummyoption);
        //Exercise Check
        if (res.data.selectedExercises.length !== 0) {

            dummyoption.innerText = "2. Select Exercise"



            for (el of res.data.selectedExercises) {
                let Name = el.exerciseName;
                let option = document.createElement("option")
                option.value = Name
                option.innerText = Name
                inputStyle.appendChild(option);

                let place = evt.target.parentElement;

                place.insertBefore(newDiv, evt.target.nextSibling)

            }
        } else {

            dummyoption.innerText = "No Data found &#128532"

        }
        let selectName = [];
        const searchExerciseData = document.querySelectorAll('.selcSpefExcer');
        for (let obj of searchExerciseData) {
            obj.addEventListener('click', async function (evt) {
                if (evt.target.previousElementSibling.options[evt.target.previousElementSibling.selectedIndex].value != "2. Select Exercise" && "No Data found &#128532") {
                    evt.target.setAttribute('disabled', 'disabled')
                    //Ersetzen der vorherigen Graphen
                    let existChart = evt.target.parentElement.nextElementSibling
                    if (existChart !== null) {
                        let oldChart = evt.target.parentElement.parentElement.lastChild
                        oldChart.remove()
                    }

                    //Erstellen Graph HTML Elemente
                    //Loading Element
                    let divgif = document.createElement("div")
                    const img = document.createElement("img");
                    img.src = 'pics/muskel.gif';
                    img.style.width = '40%'
                    evt.target.insertAdjacentElement('afterend', divgif)
                    divgif.appendChild(img)
                    //Exercise Name
                    selectName = evt.target.previousElementSibling.options[evt.target.previousElementSibling.selectedIndex].value
                    let dataObject = { exerciseName: selectName }
                    //GET Data
                    const res = await axios({
                        method: 'get',
                        url: '/Datenbank/selectName',
                        params: dataObject,
                    })
                    evt.target.removeAttribute('disabled')
                    img.remove()
                    //GraphElement
                    let div = document.createElement("div")
                    let rangeSelect = document.createElement("select")
                    rangeSelect.setAttribute("id", "rangeSelector")
                    rangeSelect.setAttribute("class", "smallSelect")
                    let option1m = document.createElement("option")
                    option1m.innerText = "1 Month"
                    option1m.value = 1 * 30 * 24 * 60 * 60 * 1000
                    let option3m = document.createElement("option")
                    option3m.innerText = "3 Month"
                    option3m.value = 3 * 30 * 24 * 60 * 60 * 1000
                    let option6m = document.createElement("option")
                    option6m.innerText = "6 Month"
                    option6m.value = 6 * 30 * 24 * 60 * 60 * 1000
                    let option12m = document.createElement("option")
                    option12m.innerText = "1 Year"
                    option12m.value = 12 * 30 * 24 * 60 * 60 * 1000
                    let optionAll = document.createElement("option")
                    optionAll.innerText = "All"
                    optionAll.value = 0
                    let label = document.createElement("label")
                    label.setAttribute("for", "rangeSelector")
                    label.innerText = "Time range: "
                    rangeSelect.appendChild(optionAll)
                    rangeSelect.appendChild(option1m)
                    rangeSelect.appendChild(option3m)
                    rangeSelect.appendChild(option6m)
                    rangeSelect.appendChild(option12m)

                    div.setAttribute("class", "container")
                    let canvas = document.createElement("canvas")
                    canvas.setAttribute("id", "myChart")


                    div.appendChild(canvas)
                    div.appendChild(label)
                    div.appendChild(rangeSelect)
                    evt.target.parentElement.parentElement.insertBefore(div, evt.target.parentElement.nextElementSibling)



                    let range = []
                    const selectRange = document.getElementById("rangeSelector")
                    selectRange.addEventListener("change", (evt) => {

                        let selectedRange = evt.target.options[evt.target.selectedIndex].value
                        range = selectedRange
                        let canvas = evt.target.previousElementSibling.previousElementSibling
                        if (canvas) {
                            canvas.remove()
                        }

                        let newCanvas = document.createElement("canvas")
                        newCanvas.setAttribute("id", "myChart")
                        evt.target.parentElement.insertBefore(newCanvas, evt.target.previousElementSibling)

                        createGraph(selectName, res.data, range);
                    })
                    createGraph(selectName, res.data, range);
                    canvas.scrollIntoView()
                }
            })

        }
        //Ersetzen der vorher ausgewählten Übungen

        let oldName = document.querySelectorAll(".nameDiv")
        if (oldName[1] !== undefined) {
            oldName[1].remove();
        }


    })
}

const date = new Date();
