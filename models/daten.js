const mongoose = require("mongoose");
const DatenSchema = new mongoose.Schema({

    exerciseName: String,

    exerciseWeight: Number,

    exerciseRep: Number,

    exerciseSet: Number,

    basicExercise: Boolean,

    exerciseDate: Date,

    username: String,

    uKey: { type: Number, unique: true }
})

const Daten = mongoose.model("Daten", DatenSchema);
module.exports = Daten;