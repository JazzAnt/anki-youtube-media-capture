toggleReloadButton(false);
document
  .getElementById("model-field")
  .addEventListener("input", async function () {
    const fieldNames = await getFieldNames(this.value);
    setFieldSelectorsOptions(fieldNames);
  });

{
  if (validateAnkiConnect()) {
    fetchModels();
  }
}

var connectButton = document.getElementById("connect-button");
if (connectButton.addEventListener)
  connectButton.addEventListener("click", validateAnkiConnect, false);
else if (connectButton.attachEvent)
  connectButton.addEventListener("onclick", validateAnkiConnect);

var reloadButton = document.getElementById("reload-button");
if (reloadButton.addEventListener)
  reloadButton.addEventListener("click", fetchModels, false);
else if (reloadButton.attachEvent)
  reloadButton.attachEvent("onclick", fetchModels);

var saveButton = document.getElementById("save-button");
if (saveButton.addEventListener)
  saveButton.addEventListener("click", onSaveButtonClick, false);
else if (saveButton.attachEvent)
  saveButton.attachEvent("onclick", onSaveButtonClick);

async function validateAnkiConnect() {
  const statusMessage = document.getElementById("status-message");
  const connectButton = document.getElementById("connect-button");

  connectButton.style.display = "none";
  toggleSettingsVisibility(false);

  statusMessage.textContent = "Checking Connection...";
  statusMessage.style.color = "blue";
  const response = await callBackgroundService("TEST-ANKICONNECT");

  //response.response returns true if connection is successful
  if (response.response) {
    statusMessage.textContent = "Connected to Anki";
    statusMessage.style.color = "green";
    toggleSettingsVisibility(true);
    return true;
  } else {
    statusMessage.textContent = "Not Connected to Anki";
    statusMessage.style.color = "red";
    connectButton.style.display = "inline-block";
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
  toggleReloadButton(false);
  try {
    const response = await callBackgroundService("FETCH-ANKI-MODELS");
    //Not sure if there is a better way to extract the data than this toString into split
    const models = response.toString().split(",");
    return models;
  } catch (e) {
    toggleReloadButton(true, `Error Fetching Models: ${e}`);
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
  toggleReloadButton(false);
  try {
    const response = await callBackgroundService("FETCH-ANKI-FIELDS", {
      modelName: model,
    });
    //Not sure if there is a better way to extract the data than this toString into split
    const fieldNames = response.toString().split(",");
    return fieldNames;
  } catch (e) {
    toggleReloadButton(true, `Error Fetching Fields: ${e}`);
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

function toggleReloadButton(isVisible, message = "") {
  document.getElementById("button-message").textContent = message;
  if (isVisible)
    document.getElementById("model-fetch-error-container").style.display =
      "block";
  else
    document.getElementById("model-fetch-error-container").style.display =
      "none";
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
