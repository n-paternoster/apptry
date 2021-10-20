const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

const Exercise = require("./models/exercise");
const Daten = require("./models/daten");

mongoose.connect('mongodb://localhost:27017/Trackerv5')
    .then(() => {
        console.log("Mongo Connection Open")

    })
    .catch(err => {
        console.log("Mongo ERRROR")
        console.log(err)
    })





app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"))
app.set("public", path.join(__dirname, "/public"))


app.get('/', (req, res) => {

    res.render("FitnessTracker")

})

app.get("/Datenbank", async (req, res) => {
    // Sucht nach den Uebungen je ausgewaehlter Koerperpartie
    const search = Object.values(req.query);
    search1 = search[0];
    search2 = search[1];
    search3 = search[2];

    const pExercises = await Exercise.find({ $or: [{ exerciseType: search1 }, { exerciseType: search2 }, { exerciseType: search3 }], basicExercise: true }, 'exerciseName')
    console.log(pExercises);

    // Sucht nach den letzten Werten aller ausgewaehlten Uebungen
    let nameArray = [];
    let latestWeight = [];
    let latestReps = [];
    for (let iwas of pExercises) {

        nameArray.push(iwas.exerciseName);
    }
    console.log(nameArray);

    for (let iwas of nameArray) {
        const pDaten = await Daten.find({ exerciseName: iwas }, 'exerciseWeight exerciseRep').sort({ $natural: -1 }).limit(3);

        latestReps.push(pDaten[0] === undefined ? 0 : pDaten[0].exerciseRep);
        latestWeight.push(pDaten[0] === undefined ? 0 : pDaten[0].exerciseWeight);
    }

    console.log(latestWeight);
    console.log(latestReps);
    // console.log(await Daten.find({})); 

    res.render("pExercises.ejs", { nameArray, latestWeight, latestReps });
})


app.post("/Datenbank/newData", async (req, res) => {
    console.log("das der Body")
    console.log(req.body)

    const newDaten = new Daten(req.body)
    await newDaten.save();
    console.log("Das sind meine Daten")
    console.log(newDaten)


})

app.post("/Datenbank/newExercise", async (req, res) => {
    console.log("das der Body")
    console.log(req.body)

    const newExercise = new Exercise(req.body)
    await newExercise.save();
    console.log("Das ist die neue uebung")
    console.log(newExercise)


})


app.get('/Exercises', (req, res) => {
    res.render("pickableExercises")
})

app.get('/Chart', (req, res) => {
    res.render("chartSelection")
})




app.listen(3000, () => {
    console.log("Listening on Port 3000")
})




