
document.addEventListener('DOMContentLoaded', createWeightGraph(), false);
//Körpergewichtgraph nach Laden der Seite Laden
async function createWeightGraph() {
    let div = document.getElementById("center-bodyweight")


    const img = document.createElement("img");
    img.src = 'pics/muskel.gif';
    img.style.width = '60%'
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
    //Buffer 
    let maxValue = Math.max(...weights)
    let minValue = Math.min(...weights)
    console.log(weights)
    console.log(minValue)
    console.log(maxValue)

    //Create Chart
    const chart = document.getElementById("bodyChart")
    let linechart = new Chart(chart, {
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
    console.log(dynMin)
    console.log(min)
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
    obj.addEventListener('click', async function (evt) {

        let selType = evt.target.previousElementSibling.options[evt.target.previousElementSibling.selectedIndex].value
        let dataObject = { exerciseType: selType }


        const res = await axios({
            method: 'get',
            url: '/Datenbank/selectExercise',
            params: dataObject,
        })



        let newDiv = document.createElement("div");
        newDiv.setAttribute("class", "nameDiv")
        let inputStyle = document.createElement("select");
        let addExerciseButton = evt.target;
        // addExerciseButton.disabled = true;


        let newButton = document.createElement("button");

        newDiv.appendChild(inputStyle);
        newDiv.appendChild(newButton);

        //Form Klassen etc.
        inputStyle.classList.toggle("form-control");
        newButton.innerText = "Show Chart";


        newButton.className = "selcSpefExcer buttonAll";

        for (el of res.data.selectedExercises) {
            let Name = el.exerciseName;
            let option = document.createElement("option")
            option.value = Name
            option.innerText = Name
            inputStyle.appendChild(option);

            let place = evt.target.parentElement;

            place.insertBefore(newDiv, evt.target.nextSibling)

        }
        let selectName = [];
        const searchExerciseData = document.querySelectorAll('.selcSpefExcer');
        for (let obj of searchExerciseData) {
            obj.addEventListener('click', async function (evt) {
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
                img.style.width = '60%'
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
                rangeSelect.appendChild(optionAll)
                rangeSelect.appendChild(option1m)
                rangeSelect.appendChild(option3m)
                rangeSelect.appendChild(option6m)
                rangeSelect.appendChild(option12m)


                div.setAttribute("class", "container")
                let canvas = document.createElement("canvas")
                canvas.setAttribute("id", "myChart")

                div.appendChild(rangeSelect)
                div.appendChild(canvas)
                evt.target.parentElement.parentElement.insertBefore(div, evt.target.parentElement.nextElementSibling)


                let range = []
                const selectRange = document.getElementById("rangeSelector")
                selectRange.addEventListener("change", (evt) => {

                    let selectedRange = evt.target.options[evt.target.selectedIndex].value
                    range = selectedRange
                    let canvas = evt.target.nextElementSibling
                    if (canvas) {
                        canvas.remove()
                    }

                    let newCanvas = document.createElement("canvas")
                    newCanvas.setAttribute("id", "myChart")
                    evt.target.parentElement.appendChild(newCanvas)

                    createGraph(selectName, res.data, range);
                })










                createGraph(selectName, res.data, range);



            })
        }
        //Ersetzen der vorher ausgewählten Übungen

        let oldName = document.querySelectorAll(".nameDiv")
        if (oldName[1] !== null) { oldName[1].remove(); }


    })
}

