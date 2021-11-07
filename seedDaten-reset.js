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

