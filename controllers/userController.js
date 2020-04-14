const User = require('../models/User');

exports.login = function(req, res) {
    let user = new User(req.body);
    user.login().then(function(result) {
        // req.session.user = {} can be anything, can be used anywhere
        req.session.user = { username: user.data.username };
        res.send(result);
    }).catch(function(err) {
        res.send(err);
    });
};

exports.logout = function(req, res) {
    res.send("Thanks for trying to logout!");
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
        res.send("Welcome to the app!");
    } else {
        res.render("home-guest");
    }
    
};