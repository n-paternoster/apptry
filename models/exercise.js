const mongoose = require("mongoose");

const ExerciseSchema = new mongoose.Schema({

    exerciseName: String,

    exerciseType: String,

    basicExercise: Boolean,

    exerciseDate: Date
})

const Exercise = mongoose.model("Exercise", ExerciseSchema);

module.exports = Exercise;