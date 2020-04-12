let User = function(data) {
    this.data = data;
    this.errors = [];
};

User.prototype.validate = function() {
    if (this.data.username == "") {
        this.errors.push("You must provide a username!");
    }
    if (this.data.email == "") {
        this.errors.push("You must provide a valid email address!");
    }
    if (this.data.password == "") {
        this.errors.push("You must provide a password!");
    }
};

// method .register won't be created every time new User() gets called, more efficient
User.prototype.register = function() {
    // Step 1: validate user data
    this.validate();
    // Step 2: only if no errors, save user data to DB
};

module.exports = User;