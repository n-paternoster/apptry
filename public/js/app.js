



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
        console.log(res.data)


        let newDiv = document.createElement("div");
        let inputStyle = document.createElement("select");
        let addExerciseButton = evt.target;
        // addExerciseButton.disabled = true;


        let newButton = document.createElement("button");
        let missingData = document.createElement("button");
        newDiv.appendChild(inputStyle);
        newDiv.appendChild(newButton);
        newDiv.appendChild(missingData);
        //Form Klassen etc.
        inputStyle.classList.toggle("form-control");
        newButton.innerText = "Show Chart";
        missingData.innerText = "Add Missing Data"
        missingData.className = "buttonAll addMissingData"
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
                selectName = evt.target.previousElementSibling.options[evt.target.previousElementSibling.selectedIndex].value
                let dataObject = { exerciseName: selectName }

                const res = await axios({
                    method: 'get',
                    url: '/Datenbank/selectName',
                    params: dataObject,
                })
                console.log(res.data)
                createGraph(selectName, res.data);


            })
        }
        const addMissingDaten = document.querySelectorAll('.addMissingData');
        for (let obj of addMissingDaten) {

            obj.addEventListener('click', async function (evt) {

                let missingDiv = document.createElement("div")


                let dateInput = document.createElement("input")
                dateInput.setAttribute("type", "date")

                let weightInput = document.createElement("input")
                weightInput.setAttribute("type", "number")
                let repsInput = document.createElement("input")
                repsInput.setAttribute("type", "number")
                repsInput.setAttribute("placeholder", "Repetitions")
                weightInput.setAttribute("placeholder", "Weight")

                let setSelector = document.createElement("select")

                let option0 = document.createElement("option")
                option0.value = "";
                option0.innerText = "Select Set";
                option0.attributes = "disabled selected"
                setSelector.appendChild(option0);




                let option1 = document.createElement("option")
                option1.value = 1
                option1.innerText = 1
                setSelector.appendChild(option1);

                let option2 = document.createElement("option")
                option2.value = 2
                option2.innerText = 2
                setSelector.appendChild(option2);
                let option3 = document.createElement("option")
                option3.value = 3
                option3.innerText = 3
                setSelector.appendChild(option3);
                let option4 = document.createElement("option")
                option4.value = 4
                option4.innerText = 4
                setSelector.appendChild(option4);
                let option5 = document.createElement("option")
                option5.value = 5
                option5.innerText = 5
                setSelector.appendChild(option5);

                missingDiv.appendChild(dateInput)
                missingDiv.appendChild(setSelector)
                missingDiv.appendChild(weightInput)
                missingDiv.appendChild(repsInput)
                const container = document.getElementById("myChart")
                const parent = container.parentElement
                parent.parentElement.insertBefore(missingDiv, parent)









                // let dataObject = {
                //     exerciseDate: dateInput.value,
                //     exerciseName: selectName,
                //     exerciseType: selType,
                //     basicExercise: true,





                // }
                // axios({
                //     method: 'post',
                //     url: '/Datenbank/newExercise',
                //     data: dataObject,
                //     headers: {
                //         'Content-Type': 'application/json'

                //     }
                // })
                //     .then((response) => {
                //         console.log(response.data);
                //     }, (error) => {
                //         console.log(error);
                //     });

            })
        }
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
        inputName.classList.toggle("forming")
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
                    console.log(response.data);
                }, (error) => {
                    console.log(error);
                });


            let saved = document.createElement("p");
            saved.innerText = "Saved!"
            newDiv.appendChild(saved);





            setTimeout(function () {

                newDiv.remove();
                addExerciseButton.style.visibility = "visible";

            }, 1000);


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
        let setCount = evt.target.parentElement.id //setCount //"Set1"
        let today = new Date();
        let eDate = today.toISOString().slice(0, 10);  //aktuelles Datum in Year/month/day
        console.log(eDate)
        console.log(today)



        let setNum = setCount.match(/\d/g);
        setNum = setNum.join("");
        let dataObject = {

            exerciseName: eName,
            exerciseWeight: eWeight,
            exerciseRep: eRep,
            exerciseSet: setNum,
            exerciseDate: eDate,
            basicExercise: false,
            uKey: Math.random() * Date.now()


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
                console.log(response.data);
            }, (error) => {
                console.log(error);
            });
        //children ist kein Array(da HTML) --> umwandeln zu Array
        //Disabled das jeweilige Set nach Speicherung
        [...evt.target.parentElement.children].forEach((element) => {
            element.disabled = "true"
        })

        //um sachen disabeled zu lassen bei Relaoding, Session verwenden. 

        sessionStorage.setItem("disable" + eName + setCount, true);

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

    console.log(dataset)


    //Sortieren der Übungen aufsteigend funktionier!??!
    const sortedDada = dataset.slice().sort((a, b) => b.exerciseDate - a.exerciseDate)

    let nestedMeanWeight = d3.nest()
        .key(function (d) { return d.exerciseDate; })
        .rollup(function (m) {
            return d3.mean(m, function (d) { return d.exerciseWeight });
        })
        .entries(sortedDada);


    let nestedMeanReps = d3.nest()
        .key(function (d) { return d.exerciseDate; })
        .rollup(function (m) {
            return d3.mean(m, function (d) { return d.exerciseRep });
        })
        .entries(sortedDada);


    let weights = [];
    let dateLabel = [];
    for (obj of nestedMeanWeight) {
        let weight = obj.values
        let label = obj.key
        dateLabel.push(label)
        weights.push(weight)
    }
    // console.log(nestedMeanWeight)
    // console.log(nestedMeanReps)
    // console.log(weights)
    // console.log(dateLabel)




    const chart = document.getElementById("myChart")
    let linechart = new Chart(chart, {
        type: "line",
        data: {
            labels: dateLabel,
            datasets: [{
                label: 'Mean Value of Weight',
                data: weights,
                borderColor: "#FFFFFF",

            }]

        }
    })

}
