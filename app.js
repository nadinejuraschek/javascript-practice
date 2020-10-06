// NPM PACKAGES
const   dotenv      = require("dotenv");
dotenv.config();
const   express     = require("express"),
        session     = require("express-session"),
        MongoStore  = require("connect-mongo")(session),
        flash       = require("connect-flash"),
        db          = require("./db"),
        app         = express(),
        router      = require("./router");

let sessionOptions = session({
    secret: process.env.APP_SECRET,
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

// properties can be added to ejs templates by adding them to locals
// has to be defined before the router
app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

app.set('views', 'views');
app.set('view engine', 'ejs');

app.get("/", router);

module.exports = app;