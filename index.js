const express = require("express");
// const bodyParser = require('body-parser');
// const forceSsl = require('express-force-ssl');




const cors = require('cors');
const https = require('https');
const http = require('http');
const fs = require('fs');
const app = express();
const path = require("path");
// const { body, validationResult } = require('express-validator');
require('dotenv').config()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const MongoStore = require('connect-mongo');

if (process.env.NODE_ENV === 'production') {
    //do production stuff

    app.use(function (req, res, next) {
        if (!req.secure) {
            return res.redirect(['https://', req.get('Host'), req.url].join(''));
        }
        next();
    });
}

//Passwortsachen
const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)







const users = [{
    id: '1635875169289',
    name: 'Emold',
    email: 'emi90@gmx.de',
    password: process.env.hashedEmold
}, {
    id: '1635860869289',
    name: 'Pada',
    email: 'paternosterniklas@yahoo.de',
    password: process.env.hashedPada
},
{
    id: '1635151651351',
    name: 'Test',
    email: 'test@test.test',
    password: process.env.hashedTest

},
{
    id: '1635151651611',
    name: 'Katja',
    email: 'Katja.braig@gmx.de',
    password: process.env.hashedKatja

},
{
    id: '16313646651351',
    name: 'Tobi',
    email: 'sandner340@googlemail.com',
    password: process.env.hashedTobi

}
]



//Alles DatenBank

const mongoose = require("mongoose");
const Exercise = require("./models/exercise");
const Daten = require("./models/daten");
const store = MongoStore.create({
    mongoUrl: process.env.mongoLink,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'squirrel'
    }
});
store.on("error", function (e) {
    console.log("Sessionstore Error")
})

const sessionConfig = {

    store,
    name: 'session',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    maxAge: 1000 * 60 * 60 * 3
}

mongoose.connect(process.env.mongoLink)
    .then(() => {
        console.log("Mongo Connection Open")

    })
    .catch(err => {
        console.log("Mongo ERRROR")
        console.log(err)
    })


app.use(express.static("public"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash())
app.use(session(sessionConfig))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"))
app.set("public", path.join(__dirname, "/public"))


app.get('/', checkAuthenticated, (req, res) => {

    res.render("index")


})

app.get("/Datenbank", checkAuthenticated, async (req, res) => {
    // Sucht nach den Uebungen je ausgewaehlter Koerperpartie
    const search = Object.values(req.query);
    let allNames = [];
    let Uname = req.user.name
    for (s of search) {
        const names = await Exercise.find({ username: Uname, exerciseType: s, basicExercise: true }, "exerciseName")
        for (i of names) {
            allNames.push(i.exerciseName);
        }
    }

    let nameArray = [];
    let data = [];
    let todaysdata = [];

    for (let name of allNames) {
        // Sucht nach den letzten Tag der ??bung um damit in pExercises die letzten ??bungswerte darstellen zu k??nnen
        const lastDay = await Daten.find({ username: Uname, exerciseName: name, exerciseDate: { $exists: true }, basicExercise: false }, 'exerciseDate').sort({ $natural: -1 }).limit(1);


        if (typeof lastDay !== 'undefined' && lastDay.length > 0) {
            // the array is defined and has at least one element

            let today = new Date();
            let eDate = today.toISOString().slice(0, 10);

            let Day = lastDay[0].exerciseDate;
            let controleDay = Day.toISOString().slice(0, 10);


            if (controleDay == eDate) {

                nameArray.push(name)
                const daybefore = await Daten.find({ username: Uname, exerciseName: name, exerciseDate: { $ne: Day }, basicExercise: false }, 'exerciseDate').sort({ $natural: -1 }).limit(1);
                console.log(daybefore)
                if (typeof daybefore !== '0' && daybefore.length > 0) {
                    let beforeday = daybefore[0].exerciseDate;
                    const pDaten = await Daten.find({ username: Uname, exerciseName: name, basicExercise: false, exerciseDate: beforeday }, 'exerciseWeight exerciseRep exerciseSet')
                    data.push(pDaten)


                }
                else {
                    data.push(0)
                }



                const todayDaten = await Daten.find({ username: Uname, exerciseName: name, basicExercise: false, exerciseDate: Day }, 'exerciseWeight exerciseRep exerciseSet')
                todaysdata.push(todayDaten);





            } else {

                const pDaten = await Daten.find({ username: Uname, exerciseName: name, basicExercise: false, exerciseDate: Day }, 'exerciseWeight exerciseRep exerciseSet')

                data.push(pDaten)
                nameArray.push(name)
                todaysdata.push(0);
            }


        } else {
            nameArray.push(name)
            data.push(0)
            todaysdata.push(0);
        }

    }

    res.render("pExercises.ejs", { nameArray, data, todaysdata });

})




app.post("/Datenbank/newData", checkAuthenticated, async (req, res) => {
    let name = req.user.name
    let data = req.body
    data["username"] = name;
    console.log(data)


    const check = await Daten.exists({ username: name, exerciseName: req.body.exerciseName, exerciseDate: req.body.exerciseDate, exerciseSet: req.body.exerciseSet, basicExercise: false })
    console.log(check)
    //Doublication check
    if (check === true) {

        const replace = await Daten.replaceOne({ username: name, exerciseName: req.body.exerciseName, exerciseDate: req.body.exerciseDate, exerciseSet: req.body.exerciseSet, basicExercise: false }, data)

    } else {
        console.log("else")
        const newDaten = new Daten(data)
        await newDaten.save();
    }
})

app.post("/Datenbank/newExercise", checkAuthenticated, async (req, res) => {



    let name = req.user.name
    let data = req.body

    data["username"] = name;




    const newExercise = new Exercise(data)
    await newExercise.save();



})




app.get("/Datenbank/selectExercise", checkAuthenticated, async (req, res) => {

    const values = Object.values(req.query);
    // const selected = Object.values(JSON.stringify(req.body));



    let selectedExercises = await Exercise.find({
        exerciseType: values[0],
        basicExercise: true
    })


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
    let usernamen = req.user.name;

    res.render("pickableExercises", { usernamen })

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

const httpServer = http.createServer(app);

if (process.env.NODE_ENV === 'production') {
    //do production stuff

    const httpsServer = https.createServer({
        key: fs.readFileSync('/etc/letsencrypt/live/padadev.com/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/padadev.com/fullchain.pem'),
    }, app);

    httpsServer.listen(443, () => {
        console.log('HTTPS Server running on port 443');
    });

}

httpServer.listen(80, () => {
    console.log('HTTP Server running on port 80');
});




