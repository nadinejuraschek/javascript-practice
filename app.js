// NPM PACKAGES
const   dotenv      = require("dotenv");
dotenv.config();
const   express     = require("express"),
        session     = require("express-session"),
        MongoStore  = require("connect-mongo")(session),
        flash       = require("connect-flash"),
        db          = require("./db"),
        app         = express();

let sessionOptions = session({ 
    secret: "Random Fact: Space smells like seared steak.",
    store: new MongoStore({ client: db }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        // maxAge: ms * s/min * min/h * h/d --> cookie expires after a day
        maxAge: 1000 * 60 * 60 * 24, 
        httpOnly: true
    }
});
app.use(sessionOptions);
app.use(flash());

// FILES
const router = require('./router');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static('public'));

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use('/', router);

module.exports = app;