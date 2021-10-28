//Liste aller Körperpartien

const allBodyparts = ["Biceps", "Triceps", "Legs", "Chest", "Abdominal", "Shoulders", "Lower Back", "Upper Back"]
const saveSetButtons = document.querySelectorAll('.saveSetButton');


const makenewSet = document.querySelectorAll('.addOneSet');

const addExercises = document.querySelectorAll('.addExercise');

const selectExercise = document.querySelectorAll('.selectExerc');
//charSelections auswählen der zu untersuchenden Uebungen
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
        newDiv.appendChild(inputStyle);
        newDiv.appendChild(newButton);
        //Form Klassen etc.
        inputStyle.classList.toggle("form-control");
        newButton.innerText = "Continue";
        newButton.classList.toggle("selcSpefExcer");


        for (el of res.data.selectedExercises) {
            let Name = el.exerciseName;
            let option = document.createElement("option")
            option.value = Name
            option.innerText = Name
            inputStyle.appendChild(option);

            let place = evt.target.parentElement;

            place.insertBefore(newDiv, evt.target.nextSibling)

        }
        //Falls Fehler den letzten Eintrag löschen. Funkt nicht :(
        // if (evt.nextElementSibling === true) {
        //     evt.nextElementSibling.remove();
        // }
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

        discription.innerText = "Insert exercise name and select body part";

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
function saveButtonListener(btn) {
    btn.addEventListener('click', (evt) => {

        let eName = evt.target.parentElement.parentElement.parentElement.parentElement.children[0].innerText // exerciseName
        let eWeight = evt.target.parentElement.children[0].value // exerciseWeight
        let eRep = evt.target.parentElement.children[1].value // exerciseRep
        let setCount = evt.target.parentElement.id //setCount //"Set1"
        let eDate = Date.now();
        let setNum = setCount.match(/\d/g);
        setNum = setNum.join("");
        let dataObject = {

            exerciseName: eName,
            exerciseWeight: eWeight,
            exerciseRep: eRep,
            exerciseSet: setNum,
            exerciseDate: eDate
        }
        axios({
            method: 'post',
            url: '/Datenbank/newData',
            data: dataObject,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'

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


    })



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
        inputReps.classList.toggle("form-control")
        inputReps.setAttribute("placeholder", "Number of Repetitions")

        savebutton.classList.toggle("saveSetButton")
        savebutton.innerText = "Save";
        deleteButton.innerText = "Delete Set";

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


//Speichern der Uebungssaetze in die Datenbank
for (let obj of saveSetButtons) {
    saveButtonListener(obj)

}





