const mongoose = require("mongoose");

const ExerciseSchema = new mongoose.Schema({

    exerciseName: String,

    exerciseType: String,

    basicExercise: Boolean


})

const Exercise = mongoose.model("Exercise", ExerciseSchema);

module.exports = Exercise;