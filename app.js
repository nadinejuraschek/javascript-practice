// NPM PACKAGES
const   dotenv      = require("dotenv");
dotenv.config();
const   express     = require("express"),
        session     = require("express-session"),
        MongoStore  = require("connect-mongo")(session),
        flash       = require("connect-flash"),
        markdown    = require("marked"),
        sanitizeHTML = require("sanitize-html"),
        csrf        = require("csurf"),
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

// properties can be added to ejs templates by adding them to res.locals
// has to be defined before the router
app.use(function (req, res, next) {
    // make markdown function available for ejs
    res.locals.filterUserHTML = function(content) {
        return sanitizeHTML(markdown(content), { allowedTags: ["p", "br", "ul", "ol", "li", "strong", "i", "em", "h1", "h2", "h3", "h4", "h5", "h6"], allowedAttributes: {} });
    };

    // make current user id available on the req object
    if (req.session.user) {
        req.visitorId = req.session.user._id;
    } else {
        req.visitorId = 0;
    };

    // make user session data available from within view templates
    res.locals.user = req.session.user;

    // make all error and success flash messages available for all templates
    res.locals.errors = req.flash("errors");
    res.locals.success = req.flash("success");

    next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

app.set('views', 'views');
app.set('view engine', 'ejs');

// CSRF
app.use(csrf());
app.use(function(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
});

// ROUTES
app.use("/", router);

app.use(function(err, req, res, next) {
    if (err) {
        if (err.code == "EBADCSRFTOKEN") {
            req.flash("errors", "Cross site request forgery detected.");
            req.session.save(() => res.redirect("/"));
        } else {
            res.render("404");
        };
    };
});

// SOCKET.IO - CHAT SETUP
// power both express app and chat server by PORT
const server = require("http").createServer(app),
io = require("socket.io")(server);

io.use(function(socket, next) {
    // make session data accessible in socket.io
    sessionOptions(socket.request, socket.request.res, next);
});

io.on("connection", function(socket) {
    console.log("Chat connection opened!");
    // only if user is logged in
    if (socket.request.session.user) {
        let user = socket.request.session.user;

        socket.emit("welcome", { username: user.username, avatar: user.avatar });

        socket.on("chatMessageFromBrowser", function(data) {
            // console.log(data.message);
            // socket.broadcast will send message to all connected browsers, except the one who sent it
            socket.broadcast.emit("chatMessageFromServer", {
                message: sanitizeHTML(data.message, { allowedTags: [], allowedAttributes: {} }),
                username: user.username,
                avatar: user.avatar,
            });
        });
    };
});

module.exports = server;