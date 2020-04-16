const User = require('../models/User');

exports.login = function(req, res) {
    let user = new User(req.body);
    user.login().then(function(result) {
        // req.session.user = {} can be anything, can be used anywhere
        req.session.user = { username: user.data.username };
        req.session.save(function() {
            res.redirect("/");
        });
    }).catch(function(err) {
        req.flash("errors", err);
        // manually save session, so page doesn't redirect before flash message is loaded
        req.session.save(function() {
            res.redirect("/");
        });
    });
};

exports.logout = function(req, res) {
    req.session.destroy(function() {
        res.redirect("/");
    });
    
};

exports.register = function(req, res) {
    let user = new User(req.body);
    user.register();
    if (user.errors.length > 0) {
        res.send(user.errors);
    } else {
        res.send("Congrats! There are no errors.");
    }
    res.send('Thanks for trying to register!');
};

exports.home = function(req, res) {
    if (req.session.user) {
        res.render("home-dashboard", { username: req.session.user.username });
    } else {
        res.render("home-guest", { errors: req.flash("errors") });
    }
};