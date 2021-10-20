const mongoose = require("mongoose");
const DatenSchema = new mongoose.Schema({

    exerciseName: String,

    exerciseWeight: Number,

    exerciseRep: Number,

    exerciseSet: Number,

    basicExercise: Boolean,

    exerciseDate: Date
})

const Daten = mongoose.model("Daten", DatenSchema);
module.exports = Daten;