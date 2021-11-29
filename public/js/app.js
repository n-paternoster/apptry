
const allBodyparts = ["Biceps", "Triceps", "Legs", "Chest", "Abdominal", "Shoulders", "Lower Back", "Upper Back"]
const saveSetButtons = document.querySelectorAll('.saveSetButton');


const makenewSet = document.querySelectorAll('.addOneSet');

const addExercises = document.querySelectorAll('.addExercise');

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

                //Ersetzen der vorherigen Graphen
                let existChart = evt.target.parentElement.nextElementSibling
                if (existChart !== null) {
                    let oldChart = evt.target.parentElement.parentElement.lastChild
                    oldChart.remove()
                }

                //Erstellen Graph HTML Elemente

                selectName = evt.target.previousElementSibling.options[evt.target.previousElementSibling.selectedIndex].value
                let dataObject = { exerciseName: selectName }

                const res = await axios({
                    method: 'get',
                    url: '/Datenbank/selectName',
                    params: dataObject,
                })
                let div = document.createElement("div")
                div.setAttribute("class", "container")
                let canvas = document.createElement("canvas")
                canvas.setAttribute("id", "myChart")
                div.appendChild(canvas)
                evt.target.parentElement.parentElement.insertBefore(div, evt.target.parentElement.nextElementSibling)
                createGraph(selectName, res.data);


            })
        }
        //Ersetzen der vorher ausgewählten Übungen
        let oldName = evt.target.nextElementSibling.nextElementSibling;
        if (oldName !== null) { oldName.remove(); }


    })
}




//neue Übung in pickable Exercise machen
for (let obj of addExercises) {

    obj.addEventListener('click', (evt) => {
        let addExerciseButton = evt.target;
        addExerciseButton.style.visibility = "hidden";


        let newDiv = document.createElement("div");
        let discription = document.createElement("p");
        let inputName = document.createElement("input");
        let inputStyle = document.createElement("select");
        let savebutton = document.createElement("button");
        let deleteButton = document.createElement("button");

        let option0 = document.createElement("option")
        option0.value = "";
        option0.innerText = "Select Muscle";
        option0.attributes = "disabled selected"
        inputStyle.appendChild(option0);

        let option1 = document.createElement("option")
        option1.value = "Biceps";
        option1.innerText = "Biceps";
        inputStyle.appendChild(option1);

        let option2 = document.createElement("option")
        option2.value = "Triceps";
        option2.innerText = "Triceps";
        inputStyle.appendChild(option2);

        let option3 = document.createElement("option")
        option3.value = "Legs";
        option3.innerText = "Legs";
        inputStyle.appendChild(option3);

        let option4 = document.createElement("option")
        option4.value = "Chest";
        option4.innerText = "Chest";
        inputStyle.appendChild(option4);

        let option5 = document.createElement("option")
        option5.value = "Abdominal";
        option5.innerText = "Abdominal";
        inputStyle.appendChild(option5);

        let option6 = document.createElement("option")
        option6.value = "Shoulders";
        option6.innerText = "Shoulders";
        inputStyle.appendChild(option6);

        let option7 = document.createElement("option")
        option7.value = "Lower Back";
        option7.innerText = "Lower Back";
        inputStyle.appendChild(option7);

        let option8 = document.createElement("option")
        option8.value = "Upper Back";
        option8.innerText = "Upper Back";
        inputStyle.appendChild(option8);

        inputName.setAttribute("type", "string")
        inputName.classList.toggle("form-control")
        inputName.setAttribute("placeholder", "Exercise Name")

        inputStyle.setAttribute("type", "string")
        inputStyle.classList.toggle("form-control")
        inputStyle.setAttribute("placeholder", "Input Bodypart")

        //Dismiss button
        deleteButton.innerText = "Dismiss"
        deleteButton.classList.toggle("dismissExerciseButton");
        deleteButton.classList.add("buttonAll");

        discription.innerText = "Add another Exercise by filling the form";
        discription.classList.add("TextStyle");

        newDiv.appendChild(discription);
        newDiv.appendChild(inputName);
        newDiv.appendChild(inputStyle);
        newDiv.appendChild(savebutton);
        newDiv.appendChild(deleteButton);

        let place = evt.target.parentElement;

        place.insertBefore(newDiv, evt.target);
        //Save button
        savebutton.innerText = "Save"
        savebutton.classList.toggle("saveExerciseButton");
        savebutton.classList.add("buttonAll");

        savebutton.addEventListener('click', (evt) => {

            let exName = evt.target.previousElementSibling.previousElementSibling.value
            let exStyle = evt.target.previousElementSibling.options[evt.target.previousElementSibling.selectedIndex].value;


            let dataObject = {
                exerciseName: exName,
                exerciseType: exStyle,
                basicExercise: true,
            }
            axios({
                method: 'post',
                url: '/Datenbank/newExercise',
                data: dataObject,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    ;
                }, (error) => {
                    console.log(error);
                });
            let saved = document.createElement("p");
            saved.innerText = "Saved!"
            newDiv.appendChild(saved);
            setTimeout(function () {

                newDiv.remove();
                location.reload();
                addExerciseButton.style.visibility = "visible";

            }, 500);
        })
        //Dismiss button
        deleteButton.addEventListener('click', (evt) => {

            addExerciseButton.style.visibility = "visible";
            newDiv.remove();

        })
    })
}

//Speichern der Uebungssaetze in die Datenbank
function saveButtonListener(btn) {
    btn.addEventListener('click', (evt) => {

        let eName = evt.target.parentElement.parentElement.parentElement.parentElement.children[0].innerText // exerciseName
        let eWeight = evt.target.parentElement.children[0].value // exerciseWeight
        let eRep = evt.target.parentElement.children[1].value // exerciseRep
        let setCount = document.querySelector('#TodayTable' + eName.replace(/\s/g, ""))
        let setNum = setCount.children.length;

        let today = new Date();
        let eDate = today.toISOString().slice(0, 10);  //aktuelles Datum in Year/month/day


        let dataObject = {

            exerciseName: eName,
            exerciseWeight: eWeight,
            exerciseRep: eRep,
            exerciseSet: setNum,
            exerciseDate: eDate,
            basicExercise: false,

        }
        axios({
            method: 'post',
            url: '/Datenbank/newData',
            data: dataObject,
            headers: {
                'Content-Type': 'application/json'

            }
        })
            .then((response) => {

            }, (error) => {
                console.log(error);
            });



        let inputWeight = evt.target.previousElementSibling
        let inputRep = evt.target.previousElementSibling.previousElementSibling

        inputWeight.value = null;
        inputRep.value = null;



        const table = document.querySelector('#TodayTable' + eName.replace(/\s/g, ""));

        const tableRow = document.createElement("tr")
        const tableDataSet = document.createElement("td")
        const tableDataWeight = document.createElement("td")
        const tableDataRep = document.createElement("td")

        tableDataWeight.innerText = `${eWeight} kg`;
        tableDataSet.innerText = `${setNum}.`;
        tableDataRep.innerText = `x ${eRep}`;

        tableRow.appendChild(tableDataSet)
        tableRow.appendChild(tableDataWeight)
        tableRow.appendChild(tableDataRep)

        table.appendChild(tableRow)



    })



}
//Speichern der Uebungssaetze in die Datenbank
for (let obj of saveSetButtons) {
    saveButtonListener(obj)

}


//neues Set in pExercises machen
for (let obj of makenewSet) {

    obj.addEventListener('click', (evt) => {


        let newDiv = document.createElement("div");
        let inputWeight = document.createElement("input");
        let inputReps = document.createElement("input");
        let savebutton = document.createElement("button");
        let deleteButton = document.createElement("button");
        let setCount = evt.target.previousElementSibling.id //setCount //"Set1"
        let setNum = setCount.match(/\d/g);
        setNum = setNum.join("");
        setNum++


        inputWeight.setAttribute("type", "number")
        inputWeight.classList.toggle("form-control")
        inputWeight.setAttribute("placeholder", "Weight")

        inputReps.setAttribute("type", "number")
        inputReps.classList.add("form-control")
        inputReps.setAttribute("placeholder", "Number of Repetitions")

        savebutton.className = "saveSetButton buttonAll";
        savebutton.innerText = "Save";

        deleteButton.innerText = "Delete Set";
        deleteButton.className = "buttonAll";

        newDiv.setAttribute("id", "Set" + setNum)



        newDiv.appendChild(inputWeight);
        newDiv.appendChild(inputReps);
        newDiv.appendChild(savebutton);
        newDiv.appendChild(deleteButton);

        let place = evt.target.parentElement;

        place.insertBefore(newDiv, evt.target);
        // Neuen Set wieder entfernen
        deleteButton.addEventListener('click', (evt) => {

            let setCount = evt.target.parentElement.id //setCount //"Set1"
            let setNum = setCount.match(/\d/g);
            setNum = setNum.join("");
            setNum

            newDiv.nextElementSibling.setAttribute("id", "Set" + setNum)
            newDiv.remove();
        })

        saveButtonListener(savebutton);

    })
}


function createGraph(dataName, Data) {


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
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                }
            }
        }

    })


}




//touch event
const touchsurface = document.querySelectorAll('.Touchevent')
for (touch of touchsurface) {

    let mc = new Hammer(touch);
    let toggle = true


    mc.on('swipeleft', (evt) => {

        if (toggle === true) {

            toggle = false

            const dismissButton = document.createElement("button")
            dismissButton.innerText = "Dismiss for Today"
            dismissButton.classList.add("dismiss-style")
            dismissButton.classList.add("dismissFunction")

            evt.target.setAttribute("style", "width: 70%")

            evt.target.parentElement.appendChild(dismissButton)



            dismissButton.addEventListener("click", (evt) => {

                const exerciseDiv = evt.target.parentElement.parentElement

                exerciseDiv.remove();

            })


        }
    })






}