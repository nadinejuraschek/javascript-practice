import axios from 'axios';

export default class RegistrationForm {
  // DOM Elements
  constructor() {
    this.allFields = document.querySelectorAll("#registration-form .form-control");
    this.insertValidationElements();
    this.username = document.querySelector("#username-register");
    this.username.previousValue = "";
    this.email = document.querySelector("#email-register");
    this.email.previousValue = "";
    this.events();
  };

  // Events
  events() {
    this.username.addEventListener("keyup", () => {
      this.isDifferent(this.username, this.usernameHandler);
    });
    this.email.addEventListener("keyup", () => {
      this.isDifferent(this.email, this.emailHandler);
    });
  };

  // Methods
  isDifferent(el, handler) {
    if (el.previousValue != el.value) {
      handler.call(this);
    };
    el.previousValue = el.value;
  };

  usernameHandler() {
    this.username.errors = false;
    this.usernameImmediately();
    clearTimeout(this.username.timer);
    this.username.timer = setTimeout(() => this.usernameAfterDelay(), 800);
  };

  usernameImmediately() {
    if (this.username.value != "" && !/^([a-zA-Z0-9]+)$/.test(this.username.value)) {
      this.showValidationError(this.username, "Username can not contain special characters.");
    };

    if (this.username.value.length > 30) {
      this.showValidationError(this.username, "Username can not exceed 30 characters.");
    };

    if (!this.username.errors) {
      this.hideValidationError(this.username);
    };
  };

  usernameAfterDelay() {
    if (this.username.value.length < 3) {
      this.showValidationError(this.username, "Username can not be less than 3 characters long.");
    };

    if (!this.username.errors) {
      axios.post("/doesUsernameExist", { username: this.username.value }).then(response => {
        if (response.data) {
          this.showValidationError(this.username, "This username is already taken.");
          this.username.isUnique = false;
        } else {
          this.username.isUnique = true;
        };
      }).catch(() => {
        console.log("Please try again later.");
      });
    };
  };

  emailHandler() {
    this.email.errors = false;
    clearTimeout(this.email.timer);
    this.email.timer = setTimeout(() => this.emailAfterDelay(), 800);
  };

  emailAfterDelay() {
    if (!/^\S+@\S+$/.test(this.email.value)) {
      this.showValidationError(this.email, "Please provide a valid e-mail address.");
    };

    if (!this.email.errors) {
      axios.post("/doesEmailExist", { email: this.email.value }).then(response => {
        if (response.data) {
          this.showValidationError(this.email, "This e-mail is already registered.");
          this.email.isUnique = false;
        } else {
          this.email.isUnique = true;
          this.hideValidationError(this.email);
        };
      }).catch(() => {
        console.log("Please try again later.");
      });
    };
  };

  hideValidationError(el) {
    el.nextElementSibling.classList.remove("liveValidateMessage--visible");
  };

  showValidationError(el, message) {
    el.nextElementSibling.innerHTML = message;
    el.nextElementSibling.classList.add("liveValidateMessage--visible");
    el.errors = true;
  };

  insertValidationElements() {
    this.allFields.forEach(function(el) {
      el.insertAdjacentHTML("afterend", `<div class='alert alert-danger small liveValidateMessage'></div>`);
    });
  };


};