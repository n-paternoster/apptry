const mongoose = require("mongoose");
const WeightSchema = new mongoose.Schema({



    weight: {
        type: String,
        required: true
    },

    username: String,

    weightDate: Date,

})

const Weight = mongoose.model("Weight", WeightSchema);
module.exports = Weight;