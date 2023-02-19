import CONSTANTS from "./Constants.js";
import WebServiceCall from "./WebServiceCall.js";
import * as Utils from "./Utils.js";

let accessToken = localStorage.getItem("accessToken");
let refreshToken = localStorage.getItem("refreshToken");
if (!accessToken || !refreshToken) {
  window.location.href = CONSTANTS.CLIENT_BASE_URL + "/index.html";
}

// global variables

let intervalId = null;

// api

let getUnitsApi = CONSTANTS.BASE_URL + CONSTANTS.GET_UNITS;
let logoutApi = CONSTANTS.BASE_URL + CONSTANTS.LOGOUT;
let authApi = CONSTANTS.BASE_URL + CONSTANTS.AUTH;

// dom elements fetching

const usernameContainer = document.querySelector(".username-container");
const logoutButton = document.querySelector("#logout_button");
const loader = document.querySelector(".loader");
const tableContainer = document.querySelector(".table-container");
const dataContainer = document.querySelector(".data-container");
const filtersContainer = document.querySelector(".filters-container");

if (localStorage.getItem("username")) {
  usernameContainer.textContent = `Welcome ${localStorage.getItem(
    "username"
  )} !!!`;
}

let loadData = async () => {
  let options = {
    url: getUnitsApi,
    method: "GET",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const data = await WebServiceCall(options);

  if (data) {
    localStorage.setItem("data", JSON.stringify(data));
    if (!loader.classList.contains("hide")) {
      loader.classList.add("hide");
    }
    feedDataToUI(data);
    if (tableContainer.classList.contains("hide")) {
      tableContainer.classList.remove("hide");
    }
  }

  // calling auth api after every 5 minute if user is loggedin
  intervalId = setInterval(async () => {
    let options = {
      url: authApi,
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: localStorage.getItem("refreshToken"),
      }),
    };

    const data = await WebServiceCall(options);
    if (data && data.accessToken) {
      accessToken = data.accessToken;
      localStorage.setItem("accessToken", accessToken);
    }

    if (data && data.refreshToken) {
      refreshToken = data.refreshToken;
      localStorage.setItem("refreshToken", refreshToken);
    }
  }, +localStorage.getItem("expiresInSeconds") * 1000);

  let editIcons = document.querySelectorAll("#editIcon");

  editIcons.forEach((element) => {
    element.addEventListener("click", async (event) => {
      let cardElement = event.target.parentElement.parentElement.parentElement;
      let id = cardElement.id;
      window.location.href =
        CONSTANTS.CLIENT_BASE_URL + "/Update.html?id=" + id;
    });
  });

  let eyeIcons = document.querySelectorAll("#eyeIcon");
  eyeIcons.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      let container = element.parentElement.parentElement.querySelector(
        ".ability-desc-container"
      );
      if (container.classList.contains("hide")) {
        container.classList.remove("hide");
      }
    });
    element.addEventListener("mouseout", () => {
      let container = element.parentElement.parentElement.querySelector(
        ".ability-desc-container"
      );
      if (!container.classList.contains("hide")) {
        container.classList.add("hide");
      }
    });
  });
};

let feedDataToUI = (data) => {
  data.map((unitData) => {
    let card = Utils.createCard(unitData);
    let cardContainer = document.createElement("div");
    cardContainer.innerHTML = card;
    dataContainer.appendChild(cardContainer);
  });
};

loadData();

logoutButton.addEventListener("click", async () => {
  let options = {
    url: logoutApi,
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const data = await WebServiceCall(options);
  if (data.status === 202) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    accessToken = null;
    refreshToken = null;
    clearInterval(intervalId);
    window.location.href = CONSTANTS.CLIENT_BASE_URL + "/index.html";
  }
});
