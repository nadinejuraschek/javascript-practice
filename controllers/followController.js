const Follow = require("../models/Follow");

exports.addFollow = function(req, res) {
  let follow = new Follow(req.params.username, req.visitorId);
  follow.create().then(() => {
    req.flash("success", `You are now following ${req.params.username}!`);
    req.session.save(() => res.redirect(`/profile/${req.params.username}`));
  }).catch(() => {
    errors.forEach(error => {
      req.flash("errors", "Sorry, there was an error. Please try again later!");
    });
    req.session.save(() => res.redirect("/"));
  });
};