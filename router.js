const express = require('express'),
router = express.Router(),
userController = require('./controllers/userController'),
postController = require('./controllers/postController');

// USER ROUTES
router.get('/', userController.home);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

// PROFILE ROUTES
router.get('/profile/:username', userController.ifUserExists, userController.profilePostsScreen);

// POST ROUTES
router.get('/create-post', userController.mustBeLoggedIn, postController.viewCreateScreen);
router.post('/create-post', userController.mustBeLoggedIn, postController.create);
router.get('/post/:id', postController.viewSingle);
router.get('/post/:id/edit', postController.viewEditScreen);

router.get("/test", function(req, res) {
  res.send("TEST");
});

module.exports = router;