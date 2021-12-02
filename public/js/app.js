
// const allBodyparts = ["Biceps", "Triceps", "Legs", "Chest", "Abdominal", "Shoulders", "Lower Back", "Upper Back"]


//neue Übung in pickable Exercise machen
const addExercises = document.querySelectorAll('.addExercise');
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

// POST Speichern der Uebungssaetze in die Datenbank
function saveButtonListener(btn) {
    btn.addEventListener('click', async (evt) => {

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
        let res = await axios({
            method: 'post',
            url: '/Datenbank/newData',
            data: dataObject,
            headers: {
                'Content-Type': 'application/json'

            }
        })
            .then((response) => {
                console.log(response.data.loginToggle)
                console.log(response.status)
                if (!response.data.loginToggle) {
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
                }
                else {
                    location.reload();
                }
            }, (error) => {

                console.log(error);
            });








    })



}

//POST Speichern der Uebungssaetze in die Datenbank
const saveSetButtons = document.querySelectorAll('.saveSetButton');
for (let obj of saveSetButtons) {
    saveButtonListener(obj)

}

//POST neues Set in pExercises machen
const makenewSet = document.querySelectorAll('.addOneSet');
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

//GET touch event
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


