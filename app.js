// NPM PACKAGES
const   dotenv = require('dotenv');
dotenv.config();
const   session = require('express-session'),
        express = require('express');

const app = express();

let sessionOptions = session({ 
    secret: "Random Fact: Space smells like seared steak.",
    resave: false,
    saveUninitialized: false,
    cookie: {
        // maxAge: ms * s/min * min/h * h/d --> cookie expires after a day
        maxAge: 1000 * 60 * 60 * 24, 
        httpOnly: true
    }
});
app.use(sessionOptions);

// FILES
const router = require('./router');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static('public'));

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use('/', router);

module.exports = app;