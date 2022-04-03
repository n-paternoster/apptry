const express = require("express");
const cors = require('cors');
const https = require('https');
const http = require('http');
const fs = require('fs');
const app = express();
const path = require("path");
require('dotenv').config()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const MongoStore = require('connect-mongo');


if (process.env.NODE_ENV === 'production') {
    //unterschied Server zu PC in NODE_ENV

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


//.NODE_ENV nicht vergessen!!!!! (production Server)
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

},
{
    id: '1631234651351',
    name: 'Matte',
    email: 'matthias_strohmaier@web.de',
    password: process.env.hashedMatte
},
{
    id: '1631234651351',
    name: 'Steff',
    email: 'kronauer.stefan@gmx.de',
    password: process.env.hashedSteff
}
]



//Alles DatenBank

const mongoose = require("mongoose");
const Exercise = require("./models/exercise");
const Daten = require("./models/daten");
const Weight = require("./models/weight");
const store = MongoStore.create({
    mongoUrl: process.env.mongoLink,
    saveUninitialized: false,
    autoRemove: 'interval',
    autoRemoveInterval: 60 * 24, // In minutes. Default
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'squirrel'
    }
});
store.on("error", function (e) {
    console.log("Session store Error")
})

const sessionConfig = {

    store,
    name: 'session',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

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


app.get('/', checkAuthenticated, async (req, res) => {

    let name = req.user.name
    let date = new Date();
    let today = date.toISOString().slice(0, 10);  //aktuelles Datum in Year/month/day

    const checkDate = await Weight.exists({ username: name, weightDate: today })

    res.render("index", { checkDate })


})

app.get("/Datenbank", checkAuthenticated, async (req, res) => {
    // Sucht nach den Uebungen je ausgewaehlter Koerperpartie
    const search = Object.values(req.query);
    let allNames = [];
    let Uname = req.user.name
    let allTypes = [];
    for (s of search) {
        const names = await Exercise.find({ username: Uname, exerciseType: s, basicExercise: true }, "exerciseName exerciseType")
        for (i of names) {
            allNames.push(i.exerciseName);
            allTypes.push(s)
        }
    }
    let nameArray = [];
    let data = [];
    let todaysdata = [];
    let allDates = []
    for (let name of allNames) {
        // Sucht nach den letzten Tag der Übung um damit in pExercises die letzten Übungswerte darstellen zu können
        const lastDay = await Daten.find({ username: Uname, exerciseName: name, exerciseDate: { $exists: true }, basicExercise: false }, 'exerciseDate').sort({ $natural: -1 }).limit(1);
        // the array is defined and has at least one element
        if (typeof lastDay !== 'undefined' && lastDay.length > 0) {


            let today = new Date();
            let eDate = today.toISOString().slice(0, 10);

            let Day = lastDay[0].exerciseDate;
            let controleDay = Day.toISOString().slice(0, 10);

            let dateFormat = `${Day.getDate()}.${Day.getMonth() + 1}.${Day.getYear() + 1900}`





            //Differnziert zwischen letzte Übung und heute Übungung

            if (controleDay == eDate) {
                nameArray.push(name)
                const daybefore = await Daten.find({ username: Uname, exerciseName: name, exerciseDate: { $ne: Day }, basicExercise: false }, 'exerciseDate').sort({ $natural: -1 }).limit(1);

                if (typeof daybefore !== '0' && daybefore.length > 0) {
                    let beforeday = daybefore[0].exerciseDate;
                    let oldDate = `${beforeday.getDate()}.${beforeday.getMonth() + 1}.${beforeday.getYear() + 1900}`
                    const pDaten = await Daten.find({ username: Uname, exerciseName: name, basicExercise: false, exerciseDate: beforeday }, 'exerciseWeight exerciseRep exerciseSet')
                    data.push(pDaten)
                    allDates.push(oldDate)
                }
                else {
                    data.push(0)
                }
                //Daten rechte Tabelle
                const todayDaten = await Daten.find({ username: Uname, exerciseName: name, basicExercise: false, exerciseDate: Day }, 'exerciseWeight exerciseRep exerciseSet')
                todaysdata.push(todayDaten);
            } else {

                const pDaten = await Daten.find({ username: Uname, exerciseName: name, basicExercise: false, exerciseDate: Day }, 'exerciseWeight exerciseRep exerciseSet')
                allDates.push(dateFormat)
                data.push(pDaten)
                nameArray.push(name)
                todaysdata.push(0);
            }
        } else {
            nameArray.push(name)
            data.push(0)
            todaysdata.push(0);
            allDates.push("-")
        }

    }

    res.render("pExercises.ejs", { nameArray, data, todaysdata, allDates, allTypes });

})




app.post("/Datenbank/newData", async (req, res) => {
    //Verhindert das Daten nicht gepeichert werden wenn die Session abgelaufen ist
    if (req.isAuthenticated()) {
        let name = req.user.name
        let data = req.body
        data["username"] = name;



        const check = await Daten.exists({ username: name, exerciseName: req.body.exerciseName, exerciseDate: req.body.exerciseDate, exerciseSet: req.body.exerciseSet, basicExercise: false })

        //Doublication check
        if (check === true) {

            const replace = await Daten.replaceOne({ username: name, exerciseName: req.body.exerciseName, exerciseDate: req.body.exerciseDate, exerciseSet: req.body.exerciseSet, basicExercise: false }, data)
            res.end()
        } else {

            const newDaten = new Daten(data)
            await newDaten.save();
            res.end()
        }
    }
    else {
        let loginToggle = true
        res.send({ loginToggle })

    }
})

app.post("/Datenbank/newExercise", checkAuthenticated, async (req, res) => {



    let name = req.user.name
    let data = req.body

    data["username"] = name;




    const newExercise = new Exercise(data)
    await newExercise.save();
    res.end()


})

app.post("/Datenbank/newWeight", checkAuthenticated, async (req, res) => {

    let date = new Date();
    let today = date.toISOString().slice(0, 10);  //aktuelles Datum in Year/month/day

    let name = req.user.name
    let data = req.body

    data["username"] = name;


    const check = await Weight.exists({ username: name, weightDate: today })
    if (check === true) {

        const replace = await Weight.replaceOne({ username: name, weightDate: today }, data)
        res.end()
    } else {
        const newWeight = new Weight(data)
        await newWeight.save();
        res.end()
    }
})


app.get("/Datenbank/selectExercise", checkAuthenticated, async (req, res) => {

    const values = Object.values(req.query);
    // const selected = Object.values(JSON.stringify(req.body));
    let name = req.user.name



    let selectedExercises = await Exercise.find({
        exerciseType: values[0],
        basicExercise: true,
        username: name
    })


    res.send({ selectedExercises })



})
app.get("/Datenbank/selectName", checkAuthenticated, async (req, res) => {
    const values = Object.values(req.query);
    let name = req.user.name

    let selectedData = await Daten.find({

        exerciseName: values[0],
        basicExercise: false,
        username: name

    }, "exerciseDate exerciseWeight exerciseRep exerciseSet")

    res.send({ selectedData })
})

app.get("/Datenbank/getWeight", checkAuthenticated, async (req, res) => {
    const values = Object.values(req.query);
    let name = req.user.name

    let selectedWeight = await Weight.find({
        username: name
    })





    res.send({ selectedWeight })
})


app.get("/Datenbank/getTime", checkAuthenticated, async (req, res) => {

    let name = req.user.name
    let today = new Date();
    let eDate = today.toISOString().slice(0, 10);
    //Letzte Übung ermitteln
    const lastDay = await Daten.find({ username: name, exerciseDate: { $exists: true }, basicExercise: false }, 'exerciseDate').sort({ $natural: -1 }).limit(1);

    let timeDiff = []
    let latestValues = []
    if (typeof lastDay !== 'undefined' && lastDay.length > 0) {

        let Day = lastDay[0].exerciseDate;

        let controleDay = Day.toISOString().slice(0, 10);

        //Zeit der letzten Übung
        const latestDuration = await Daten.find({ username: name, basicExercise: false, exerciseDate: controleDay }, "exerciseTime").sort({ exerciseDate: -1 })

        for (arr of latestDuration) {
            latestValues.push(arr.exerciseTime)
        }

        //Runden&Subtrahieren von 1. und letzen Wert (vorher sortiert durch Mongoose)
        timeDiff = Math.round(Math.abs(new Date(latestValues[latestValues.length - 1]) - new Date(latestValues[0])) / (1000 * 60))

    } else {
        timeDiff = 0
    }

    const allData = await Daten.find({ username: name, exerciseTime: { $exists: true }, basicExercise: false }, 'exerciseTime exerciseDate').sort({ exerciseDate: -1 })



    res.send({ timeDiff, allData })
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

// app.delete('/logout', (req, res) => {
//     req.logOut()
//     res.redirect('/login')
// })


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




