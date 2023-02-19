import CONSTANTS from "./Constants.js";
import WebServiceCall from "./WebServiceCall.js";
import * as Utils from "./Utils.js";

//API End Points
const loginApi = CONSTANTS.BASE_URL + CONSTANTS.LOGINS;
// fetching DOM Elements
const usernameField = document.getElementById("username");
const passwordField = document.getElementById("password");
const submit = document.getElementById("login_btn");
const errorContainer = document.querySelector(".error-container");

// Check username validation ----------------------------------------
const validateUserNameAndPassword = (username, password) => {
  const usernameMinLength = 5;
  const usernameMaxLength = 20;
  const passwordMinLength = 10;
  const passowrdMaxLength = 64;

  username = username.trim();
  password = password.trim();
  let errorOptions = {
    elementTag: "h4",
    className: "error-msg-reason",
    parentElement: errorContainer,
  };

  if (username.length === 0 || password.length === 0) {
    errorOptions.content = "Username or password can't be blank!!";
    Utils.showError(errorOptions);
    return true;
  }

  if (
    username.length < usernameMinLength &&
    username.length > usernameMaxLength
  ) {
    errorOptions.content =
      "Username must have minimum 5 characters and maximum 20 characters";
    Utils.showError(errorOptions);
    return true;
  }

  let usernameArr = username.split("");
  if (
    !(
      username &&
      usernameArr.includes(".") &&
      usernameArr[0] !== "." &&
      usernameArr[usernameArr.length - 1] !== "."
    )
  ) {
    errorOptions.content =
      "Username must have maximum one period (.) anywhere but not as the first or last character.";
    Utils.showError(errorOptions);
    return true;
  }

  if (
    password.length < passwordMinLength &&
    password.length > passowrdMaxLength
  ) {
    errorOptions.content = "Password must be between 10 to 64 characters";
    Utils.showError(errorOptions);
    return true;
  }
  return false;
};

// Auth Functionality
// login
submit.addEventListener("click", async (e) => {
  e.preventDefault();

  let username = usernameField.value;
  let password = passwordField.value;

  // validate username & password
  if (validateUserNameAndPassword(username, password)) {
    return;
  }

  let loginOptions = {
    url: loginApi,
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  };

  const data = await WebServiceCall(loginOptions);

  // storing accessToken and refreshToken and username
  let accessToken = null,
    refreshToken = null,
    user = null;

  if (data && data.auth && data.auth.accessToken) {
    accessToken = data.auth.accessToken;
    localStorage.setItem("accessToken", accessToken);
  }

  if (data && data.auth && data.auth.refreshToken) {
    refreshToken = data.auth.refreshToken;
    localStorage.setItem("refreshToken", refreshToken);
  }

  if (data && data.auth && data.auth.expiresInSeconds) {
    localStorage.setItem("expiresInSeconds", data.auth.expiresInSeconds);
  }

  if (data && data.user && data.user.firstname && data.user.lastname) {
    user = `${data.user.firstname} ${data.user.lastname}`;
    localStorage.setItem("username", user);
  }

  if (accessToken && refreshToken && user) {
    //redirect to dashboard
    window.location.href = CONSTANTS.CLIENT_BASE_URL + "/Dashboard.html";
  } else {
    // throw error/bad request

    // build options for showing error msg
    let options = {
      elementTag: "h3",
      className: "error-msg-reason",
      parentElement: errorContainer,
    };
    if (data.status === 409) {
      options.content = "Invalid Password";
      Utils.showError(options);
    }

    if (data.status === 404) {
      options.content = "Username not found, please sign up!!";
      Utils.showError(options);
    }

    if (data && data.reason) {
      options.content = data.reason + "\n";
      if (data.hint) {
        options.content += data.hint;
      }
      Utils.showError(options);
    }
  }
});
