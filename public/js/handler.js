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