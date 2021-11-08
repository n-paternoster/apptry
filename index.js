const express = require("express");
const app = express();
const path = require("path");
// const helmet = require("helmet");
const { body, validationResult } = require('express-validator');
require('dotenv').config()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')



//Passwortsachen
const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)
const users = [{
    id: '1635860869289',
    name: 'Pada',
    email: 'paternosterniklas@yahoo.de',
    password: process.env.hashed
}
]


//Alles DatenBank
const mongoose = require("mongoose");
const Exercise = require("./models/exercise");
const Daten = require("./models/daten");

mongoose.connect(process.env.mongoLink)
    .then(() => {
        console.log("Mongo Connection Open")

    })
    .catch(err => {
        console.log("Mongo ERRROR")
        console.log(err)
    })




// app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"))
app.set("public", path.join(__dirname, "/public"))


app.get('/', checkAuthenticated, (req, res) => {

    res.render("FitnessTracker")

})

app.get("/Datenbank", checkAuthenticated, async (req, res) => {
    // Sucht nach den Uebungen je ausgewaehlter Koerperpartie
    const search = Object.values(req.query);
    let allNames = [];
    for (s of search) {
        const names = await Exercise.find({ exerciseType: s, basicExercise: true }, "exerciseName")


        for (i of names) {

            allNames.push(i.exerciseName);
        }


    }

    let nameArray = [];
    let data = [];
    // Sucht nach den letzten Tag der Übung um damit in pExercises die letzten Übungswerte darstellen zu können
    for (let name of allNames) {
        const lastDay = await Daten.find({ exerciseName: name, basicExercise: false }, 'exerciseDate').sort({ $natural: -1 }).limit(1);

        let Day = lastDay[0].exerciseDate;



        const pDaten = await Daten.find({ exerciseName: name, basicExercise: false, exerciseDate: Day }, 'exerciseWeight exerciseRep exerciseSet')


        data.push(pDaten)
        nameArray.push(name)
        // latestReps.push(pDaten[0] === undefined ? 0 : pDaten[0].exerciseRep);
        // latestWeight.push(pDaten[0] === undefined ? 0 : pDaten[0].exerciseWeight);
    }
    res.render("pExercises.ejs", { nameArray, data });
})




app.post("/Datenbank/newData", checkAuthenticated, async (req, res) => {
    console.log("das der Body")
    console.log(req.body)

    const newDaten = new Daten(req.body)
    await newDaten.save();
    console.log("Das sind meine Daten")
    console.log(newDaten)


})

app.post("/Datenbank/newExercise", checkAuthenticated, async (req, res) => {

    console.log(req.body)

    const newExercise = new Exercise(req.body)
    await newExercise.save();
    console.log("Das ist die neue uebung")
    console.log(newExercise)


})




app.get("/Datenbank/selectExercise", checkAuthenticated, async (req, res) => {

    const values = Object.values(req.query);
    // const selected = Object.values(JSON.stringify(req.body));


    console.log(values)
    let selectedExercises = await Exercise.find({
        exerciseType: values[0],
        basicExercise: true
    })

    console.log(selectedExercises)
    res.send({ selectedExercises })



})
app.get("/Datenbank/selectName", checkAuthenticated, async (req, res) => {
    const values = Object.values(req.query);

    let selectedData = await Daten.find({
        exerciseName: values[0],
        basicExercise: false,

    }, "exerciseDate exerciseWeight exerciseRep exerciseSet")
    console.log(values)
    console.log(selectedData)
    res.send({ selectedData })
})

app.get('/Exercises', checkAuthenticated, (req, res) => {
    res.render("pickableExercises")
})

app.get('/Chart', checkAuthenticated, (req, res) => {
    res.render("chartSelection")
})


app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true

}))

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()

    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

app.listen(80, () => {
    console.log("Listening on Port 80")
})




