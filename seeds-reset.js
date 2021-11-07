const mongoose = require("mongoose");
const Exercise = require("./models/exercise");
require('dotenv').config()


mongoose.connect(process.env.mongoLink)
    .then(() => {
        console.log("Mongo Connection Open")

    })
    .catch(err => {
        console.log("Mongo ERRROR")
        console.log(err)
    })

Exercise.deleteMany({});
