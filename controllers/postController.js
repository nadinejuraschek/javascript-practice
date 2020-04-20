const   Post    = require("../models/Post");

exports.viewCreateScreen = function(req, res) {
    res.render("create-post");
};

exports.create = function(req, res) {
    let post = new Post(req.body, req.session.user._id);
    post.create().then(function(resolve, reject) {
        res.send("new post created");
    }).catch(function(err) { 
        res.send(err);
    });
};