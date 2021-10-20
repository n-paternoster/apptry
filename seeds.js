const mongoose = require("mongoose");
const Exercise = require("./models/exercise");


mongoose.connect('mongodb://localhost:27017/Trackerv5')
    .then(() => {
        console.log("Mongo Connection Open")

    })
    .catch(err => {
        console.log("Mongo ERRROR")
        console.log(err)
    })

Exercise.deleteMany({});
const seedExercises = [
    {
        exerciseName: "Benchpress",
        exerciseType: "Chest",
        basicExercise: true
    },
    {
        exerciseName: "Cableflies",
        exerciseType: "Chest",
        basicExercise: true
    },
    {
        exerciseName: "Leg Extentions",
        exerciseType: "Legs",
        basicExercise: true
    },
    {
        exerciseName: "Dumbbell Lateral Raise",
        exerciseType: "Shoulders",
        basicExercise: true
    },
    {
        exerciseName: "Barbell Overhead Shoulder Press",
        exerciseType: "Shoulders",
        basicExercise: true
    },
    {
        exerciseName: "Leg Raises",
        exerciseType: "Legs",
        basicExercise: true
    },
    {
        exerciseName: "Crunches",
        exerciseType: "Abdomninal",
        basicExercise: true
    },
    {
        exerciseName: "Legpress",
        exerciseType: "Leg",
        basicExercise: true
    },
    {
        exerciseName: "21s",
        exerciseType: "Biceps",
        basicExercise: true
    },
    {
        exerciseName: "Dumbbell seated Curls",
        exerciseType: "Biceps",
        basicExercise: true
    },
    {
        exerciseName: "Lying Triceps Extension",
        exerciseType: "Triceps",
        basicExercise: true
    },
    {
        exerciseName: "Tricep Dips",
        exerciseType: "Triceps",
        basicExercise: true
    },
    {
        exerciseName: "Deadlift",
        exerciseType: "Lower Back",
        basicExercise: true
    },
    {
        exerciseName: "Lower Back Extensions",
        exerciseType: "Lower Back",
        basicExercise: true
    },
    {
        exerciseName: "Lateral Pull",
        exerciseType: "Upper Back",
        basicExercise: true
    },
    {
        exerciseName: "Bent Over Barbell Row",
        exerciseType: "Upper Back",
        basicExercise: true
    }
]



Exercise.insertMany(seedExercises)