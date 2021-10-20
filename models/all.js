const mongoose = require("mongoose");





const ExerciseSchema = new mongoose.Schema({

    exerciseName: String,

    exerciseType: String,

    basicExercise: Boolean
})

const Exercise = mongoose.model("Exercise", ExerciseSchema);

const DatenSchema = new mongoose.Schema({

    exerciseName: String,

    exerciseWeight: Number,

    exerciseRep: Number,

    exerciseSet: Number,

    basicExercise: Boolean
})

const Daten = mongoose.model("Daten", ExerciseSchema);


module.exports = Daten;
module.exports = Exercise;

