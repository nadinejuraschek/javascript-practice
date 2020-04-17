const   bcrypt      = require("bcryptjs"),
        validator   = require("validator"),
        md5         = require("md5");

const usersCollection = require("../db").db().collection("users");

let User = function(data) {
    this.data = data;
    this.errors = [];
};

User.prototype.cleanUp = function() {
    if (typeof(this.data.username) != "string") {
        this.data.username = "";
    };
    if (typeof(this.data.email) != "string") {
        this.data.email = "";
    };
    if (typeof(this.data.password) != "string") {
        this.data.password = "";
    };

    // get rid of any strange properties sent by the user
    this.data = {
        username: this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    };
};

User.prototype.validate = function() {
    return new Promise(async (resolve, reject) => {

        if (this.data.username == "") {
            this.errors.push("You must provide a username!");
        };
        if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {
            this.errors.push("Username can only contain letters and numbers.");
        };
        if (this.data.username.length > 0 && this.data.username.length < 3) {
            this.errors.push("Username must be at least 3 characters long.");
        };
        if (this.data.username.length > 30) {
            this.errors.push("Username can not exceed 30 characters.");
        };
    
        if (!validator.isEmail(this.data.email)) {
            this.errors.push("You must provide a valid email address!");
        };
    
        if (this.data.password == "") {
            this.errors.push("You must provide a password!");
        };
        if (this.data.password.length > 0 && this.data.password.length < 6) {
            this.errors.push("Password must be at least 6 characters.");
        };
        if (this.data.password.length > 100) {
            this.errors.push("Password can not exceed 100 characters.");
        };
    
        // only if username is valid --> check to see if it is already taken
        if (this.data.username.length > 2 
            && this.data.username.length <= 30 
            && validator.isAlphanumeric(this.data.username)) {
                // if username is found, username is set, otherwise usernameExists = null
                let usernameExists = await usersCollection.findOne({ username: this.data.username });
                // if usernameExists = null, next if statement won't run
                if (usernameExists) {
                    this.errors.push("This username is already taken.");
                };
        };
    
        // only if email is valid --> check to see if it is already taken
        if (validator.isEmail(this.data.email)) {
                // if email is found, email is set, otherwise emailExists = null
                let emailExists = await usersCollection.findOne({ email: this.data.email });
                // if emailExists = null, next if statement won't run
                if (emailExists) {
                    this.errors.push("This email is already being used.");
                };
        };

        resolve()
    });
};

User.prototype.login = function() {
    return new Promise((resolve, reject) => {
        // arrow functions do not manipulate or change the this keyword
        this.cleanUp();
        usersCollection.findOne({ username: this.data.username }).then((attemptedUser) => {
            // bcrypt.compareSync(unhashedTypedPassword, hashedValueInDB)
            if (attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
                this.getAvatar();
                resolve("Congrats!");
            } else {
                reject("Invalid username or password.");
            }
        }).catch(function() {
            reject("Please try again later.");
        });
    });
};

// method .register won't be created every time new User() gets called, more efficient
User.prototype.register = function() {
    return new Promise(async (resolve, reject) => {
        // Step 1: validate user data
        this.cleanUp();
        await this.validate();
        
        // Step 2: only if no errors, save user data to DB
        if (!this.errors.length) {
            // hash user password
            let salt = bcrypt.genSaltSync(10);
            // bcrypt.hashSync(valueToHash, salt)
            this.data.password = bcrypt.hashSync(this.data.password, salt);
            await usersCollection.insertOne(this.data);
            this.getAvatar();
            resolve();
        } else {
            reject(this.errors);
        }
    });
};

User.prototype.getAvatar = function() {
    this.avatar = `https://gravatar.com/avatar/${md5(this.data.email)}?s=128`;
};

module.exports = User;