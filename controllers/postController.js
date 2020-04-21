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

exports.viewSingle = async function(req, res) {
    try {
        let post = await Post.findSingleById(req.params.id);
        res.render("post", { post: post });
    } catch {
        res.send("404 Not Found");
        // res.render("404");
    };
};