const mongoose = require("mongoose");
const Daten = require("./models/daten");
require('dotenv').config()

mongoose.connect(process.env.mongoLink)
    .then(() => {
        console.log("Mongo Connection Open")

    })
    .catch(err => {
        console.log("Mongo ERRROR")
        console.log(err)
    })

Daten.deleteMany({});

const seedDaten = [{
    exerciseName: "Benchpress",

    exerciseWeight: 140,

    exerciseRep: 10,

    exerciseSet: 1,

    basicExercise: false
},
{
    exerciseName: "Benchpress",

    exerciseWeight: 140,

    exerciseRep: 9,

    exerciseSet: 2,
    basicExercise: false
},
{
    exerciseName: "Benchpress",

    exerciseWeight: 120,

    exerciseRep: 9,

    exerciseSet: 3,
    basicExercise: false
},
{
    exerciseName: "Benchpress",

    exerciseWeight: 140,

    exerciseRep: 10,

    exerciseSet: 1,
    basicExercise: false
},
{
    exerciseName: "Benchpress",

    exerciseWeight: 140,

    exerciseRep: 9,

    exerciseSet: 2,
    basicExercise: false
},
{
    exerciseName: "Benchpress",

    exerciseWeight: 140,

    exerciseRep: 9,

    exerciseSet: 3,
    basicExercise: false
}]

Daten.insertMany(seedDaten)