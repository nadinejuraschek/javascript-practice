const validator = require("validator");

let User = function(data) {
    this.data = data;
    this.errors = [];
};

User.prototype.validate = function() {
    if (this.data.username == "") {
        this.errors.push("You must provide a username!");
    }
    if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {
        this.errors.push("Username can only contain letters and numbers.");
    }
    if (this.data.username.length > 0 && this.data.username.length < 3) {
        this.errors.push("Username must be at least 3 characters long.");
    }
    if (this.data.username.length > 30) {
        this.errors.push("Username can not exceed 30 characters.");
    }

    if (!validator.isEmail(this.data.email)) {
        this.errors.push("You must provide a valid email address!");
    }

    if (this.data.password == "") {
        this.errors.push("You must provide a password!");
    }
    if (this.data.password.length > 0 && this.data.password.length < 6) {
        this.errors.push("Password must be at least 6 characters.");
    }
    if (this.data.password.length > 100) {
        this.errors.push("Password can not exceed 100 characters.");
    }
};

// method .register won't be created every time new User() gets called, more efficient
User.prototype.register = function() {
    // Step 1: validate user data
    this.validate();
    // Step 2: only if no errors, save user data to DB
};

module.exports = User;