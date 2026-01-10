document.getElementById("model-field").addEventListener(
  "input",
  async function () {
    const fieldNames = await getFieldNames(this.value);
    setFieldSelectorsOptions(fieldNames);
  },
  false
);
document
  .getElementById("connect-button")
  .addEventListener("click", fetchModels, false);
document
  .getElementById("save-button")
  .addEventListener("click", onSaveButtonClick, false);
fetchModels();


async function validateAnkiConnect() {
  toggleConnectButton(false);
  toggleSettingsVisibility(false);
  setConnectionStatus("Checking Connection...", "blue");

  const response = await callBackgroundService("TEST-ANKICONNECT");

  if (response.response) {
    setConnectionStatus("Connected to Anki", "green");
    toggleSettingsVisibility(true);
    return true;
  } else {
    setConnectionStatus("Failed to Connect to Anki", "red");
    toggleConnectButton(true);
    return false;
  }
}

function toggleSettingsVisibility(isVisible) {
  const selectors = document.getElementsByClassName("selector-container");
  const buttons = document.getElementsByClassName("button-container");

  if (isVisible) {
    for (i = 0; i < selectors.length; i++) {
      selectors[i].style.display = "flex";
    }
    for (i = 0; i < buttons.length; i++) {
      buttons[i].style.display = "block";
    }
  } else {
    for (i = 0; i < selectors.length; i++) {
      selectors[i].style.display = "none";
    }
    for (i = 0; i < buttons.length; i++) {
      buttons[i].style.display = "none";
    }
  }
}

async function getModels() {
  try {
    const response = await callBackgroundService("FETCH-ANKI-MODELS");
    //Not sure if there is a better way to extract the data than this toString into split
    const models = response.toString().split(",");
    return models;
  } catch (e) {
    console.log("getModels Error: " + e);
    setConnectionStatus("Error Fetching Models", "red");
    toggleConnectButton(true);
  }
}

function setModelSelectorOptions(models = [""]) {
  const modelSelector = document.getElementById("model-field");
  modelSelector.innerHTML = "";
  for (let model of models) {
    const modelOption = document.createElement("option");
    modelOption.value = model;
    modelOption.textContent = model;
    //TODO: If there is already a notetype saved in the storage, then add selected attribute to said notetype
    modelSelector.appendChild(modelOption);
  }
}

async function getFieldNames(model) {
  try {
    const response = await callBackgroundService("FETCH-ANKI-FIELDS", {
      modelName: model,
    });
    //Not sure if there is a better way to extract the data than this toString into split
    const fieldNames = response.toString().split(",");
    setConnectionStatus("Connected to Anki", "green");
    toggleConnectButton(false);
    return fieldNames;
  } catch (e) {
    console.log("getFieldNames Error: " + e);
    setConnectionStatus("Error Fetching Fields", "red");
    toggleConnectButton(true);
  }
}

function setFieldSelectorsOptions(fieldsArray = [""]) {
  const imageFieldSelector = document.getElementById("image-field");
  const audioFieldSelector = document.getElementById("audio-field");

  imageFieldSelector.innerHTML = "";
  audioFieldSelector.innerHTML = "";

  for (let field of fieldsArray) {
    const fieldOption = document.createElement("option");
    fieldOption.value = field;
    fieldOption.textContent = field;
    //TODO if there are values saved in the storage, add selected to appropriate options
    imageFieldSelector.appendChild(fieldOption);
    audioFieldSelector.appendChild(fieldOption.cloneNode(true));
  }
}

function toggleConnectButton(isVisible, message = "", msgColor = "black") {
  const connectButton = document.getElementById("connect-button");
  if (isVisible) connectButton.style.display = "inline-block";
  else connectButton.style.display = "none";
}

function setConnectionStatus(message = "", color = "black") {
  const statusMessage = document.getElementById("status-message");
  statusMessage.textContent = message;
  statusMessage.style.color = color;
}

async function fetchModels() {
  if (validateAnkiConnect()) {
    const models = await getModels();
    setModelSelectorOptions(models);
  }
}

async function onSaveButtonClick() {}

async function callBackgroundService(action, params = {}) {
  try {
    const response = await browser.runtime.sendMessage({
      action: action,
      params: params,
    });

    if (response && response.error) {
      throw new Error(`Background Script Error: ${response.error}`);
    }
    return response;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
}
