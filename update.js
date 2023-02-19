import CONSTANTS from "./Constants.js";
import WebServiceCall from "./WebServiceCall.js";
import * as Utils from "./Utils.js";

let accessToken = localStorage.getItem("accessToken");
let refreshToken = localStorage.getItem("refreshToken");
if (!accessToken || !refreshToken) {
  window.location.href = CONSTANTS.CLIENT_BASE_URL + "/index.html";
}

// api
let updateApi = CONSTANTS.BASE_URL + CONSTANTS.UPDATE_UNIT;

// dom element
const updateButton = document.querySelector("#update-button");
const cancelButton = document.querySelector("#cancel-button");
const qualityInput = document.querySelector("#quality_drpdown");
const healthInput = document.querySelector("#health_input");
const attackInput = document.querySelector("#attck_input");
const mtcInput = document.querySelector("#mtc_input");
const scdInput = document.querySelector("#scd_input");
const scInput = document.querySelector("#sc_input");
const errorContainer = document.querySelector(".error-container");

// fetching id from URL
let unitId = null;

// global variables
let previousData = {};

if (
  location.search &&
  typeof location.search.split === "function" &&
  location.search.split("=").length >= 1
) {
  unitId = location.search.split("=")[1];
}

// appending unit id with api url
if (unitId) {
  updateApi += unitId;
}

let initValue = (data, unitId) => {
  let unitData = null;
  for (let i in data) {
    if (data[i].id === unitId) {
      unitData = data[i];
      break;
    }
  }

  let prevQuality = (qualityInput.value = unitData.quality);
  let prevHealth = (healthInput.value = unitData.health);
  let prevAttack = (attackInput.value = unitData.attack);
  let prevMtc = (mtcInput.value = unitData.maxTargetCount);
  let prevScd = (scdInput.value = unitData.spawnCooldownInSeconds);
  let prevSc = (scInput.value = unitData.spawnCost);

  previousData.quality = prevQuality;
  previousData.health = prevHealth;
  previousData.attack = prevAttack;
  previousData.maxTargetCount = prevMtc;
  previousData.spawnCooldownInSeconds = prevScd;
  previousData.spawnCost = prevSc;
};

let validateInputValues = (health, attack, mtcVal, scdVal, scVal) => {
  let errorOptions = {
    elementTag: "h4",
    className: "error-msg-reason",
    parentElement: errorContainer,
  };
  let hasError = false;
  let errorStr = "";
  if (health < 5 || health > 10000) {
    errorStr += "Health must be between 5 to 10000 \n";
    hasError = true;
  } else if (health % 5 !== 0) {
    errorStr += "Health value must be divisible by 5 \n";
    hasError = true;
  }

  if (attack < 5 || attack > 500) {
    errorStr += "Attack must be between 5 to 500 \n";
    hasError = true;
  } else if (attack % 5 !== 0) {
    errorStr += "Attack value must be divisible by 5 \n";
    hasError = true;
  }

  if (mtcVal < 1 || mtcVal > 100) {
    errorStr += "Maximum Target Count must be between 1 to 100 \n";
    hasError = true;
  }

  if (scVal < 0 || scVal > 1000) {
    errorStr = "Spawn Cost must be between 0 to 1000 \n";
    hasError = true;
  } else if (scVal % 5 !== 0) {
    errorStr = "Spawn Cost value must be divisible by 5 \n";
    hasError = true;
  }

  if (scdVal < 0 || scdVal > 100) {
    errorStr += "Spawn Cost Down must be between 0 to 1000 \n";
    hasError = true;
  } else if (
    scdVal.toString().split(".") &&
    scdVal.toString().split(".")[1] &&
    scdVal.toString().split(".")[1].length > 1
  ) {
    errorStr += "Spawn Cost Down value can have upto 1 decimal place \n";
    hasError = true;
  }

  if (hasError) {
    errorOptions.content = errorStr;
    Utils.showError(errorOptions);
    return true;
  }
  return false;
};

let valuesAreSame = (current, previous) => {
  let keys = Object.keys(current);
  let areEqual = true;
  for (let i = 0; i < keys.length; i++) {
    if (current[keys[i]] !== previous[keys[i]]) {
      areEqual = false;
      break;
    }
  }
  return areEqual;
};

// initialise update UI with pre-existing value
initValue(JSON.parse(localStorage.getItem("data")), unitId);

updateButton.addEventListener("click", async () => {
  if (errorContainer.children.length > 0) {
    errorContainer.innerText = "";
  }
  let quality = qualityInput.value;
  let health = parseInt(healthInput.value);
  let attack = parseInt(attackInput.value);
  let mtcVal = parseInt(mtcInput.value);
  let scdVal = parseFloat(scdInput.value);
  let scVal = parseInt(scInput.value);

  if (validateInputValues(health, attack, mtcVal, scdVal, scVal)) {
    return;
  }

  let currentData = {
    quality: quality,
    health: health,
    attack: attack,
    maxTargetCount: mtcVal,
    spawnCooldownInSeconds: scdVal,
    spawnCost: scVal,
  };

  if (valuesAreSame(currentData, previousData)) {
    return;
  }

  let updateOptions = {
    url: updateApi,
    method: "PATCH",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      id: unitId,
      quality: quality,
      health: health,
      attack: attack,
      maxTargetCount: mtcVal,
      spawnCost: scVal,
      spawnCooldownInSeconds: scdVal,
    }),
  };

  const data = await WebServiceCall(updateOptions);

  if (data) {
    alert("Successfully updated!!");
    setTimeout(() => {
      window.location.href = CONSTANTS.CLIENT_BASE_URL + "/Dashboard.html";
    }, 500);
  } else {
    alert("Something went wrong, please try again!!");
  }
});

cancelButton.addEventListener("click", async () => {
  window.location.href = CONSTANTS.CLIENT_BASE_URL + "/Dashboard.html";
});
