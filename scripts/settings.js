initialize();
/**************************************************************************************************
 * Adding Event Listeners to various UI elements                                                  *
 **************************************************************************************************/
document
  .getElementById("reconnect-button")
  .addEventListener("click", initialize, false);
document.getElementById("model-field").addEventListener(
  "input",
  async function () {
    try {
      let success = await setSavedModel(this.value);
      if (!success) throw new Error("Failed Saving Model");

      const fieldNames = await getFieldNames(this.value);
      setImageFieldOptions(fieldNames);
      setAudioFieldOptions(fieldNames);

      success = setSavedImageField(fieldNames[0]);
      if (!success) throw new Error("Failed Saving Image Field");

      success = setSavedAudioField(fieldNames[0]);
      if (!success) throw new Error("Failed Saving Audio Field");
    } catch (e) {
      handleConnectionFailure(e);
    }
  },
  false,
);
document.getElementById("image-field").addEventListener(
  "input",
  async function () {
    const success = await setSavedImageField(this.value);
    if (!success) handleConnectionFailure("Failed Saving Image Field");
  },
  false,
);
document.getElementById("audio-field").addEventListener(
  "input",
  async function () {
    const success = await setSavedAudioField(this.value);
    if (!success) handleConnectionFailure("Failed Saving Audio Field");
  },
  false,
);

document.getElementById("image-shortcut-field").addEventListener(
  "focusin",
  async function () {
    const keyListener = (keyPress) => {
      this.disabled = true;
      this.value = keyPress.code;
      this.disabled = false;
    };

    this.addEventListener("keydown", keyListener);
    this.addEventListener("focusout", () => {
      this.removeEventListener("keydown", keyListener);
    });
  },
  false,
);

document.getElementById("audio-shortcut-field").addEventListener(
  "focusin",
  async function () {
    const keyListener = (keyPress) => {
      this.disabled = true;
      this.value = keyPress.code;
      this.disabled = false;
    };

    this.addEventListener("keydown", keyListener);
    this.addEventListener("focusout", () => {
      this.removeEventListener("keydown", keyListener);
    });
  },
  false,
);

/**************************************************************************************************
 * Complex Functions (Functions which calls several other functions to perform complex actions)   *
 **************************************************************************************************/
/**
 * Function that sets everything up. This function is meant to be called at the very start of the code
 * and re-called by the reconnect button.
 * @returns {void}
 */
async function initialize() {
  //disable all input to prevent user input while connection is checked
  setReconnectBtnVisibility(false);
  setSelectorsVisibility(false);

  setStatusMessage("Checking Connection...", "blue");
  const connected = await getConnectionStatus();

  if (!connected) {
    handleConnectionFailure();
    return;
  }

  setStatusMessage("Connected to Anki", "green");
  setSelectorsVisibility(true);

  try {
    const models = await getModels();
    setModelOptions(models);
  } catch (_) {
    handleConnectionFailure();
    return;
  }

  const savedModel = await getSavedModel();
  if (savedModel) {
    setModelSelected(savedModel);
    try {
      const fieldNames = await getFieldNames(savedModel);
      setImageFieldOptions(fieldNames);
      setAudioFieldOptions(fieldNames);

      const savedImageField = await getSavedImageField();
      if (savedImageField) {
        setImageFieldSelected(savedImageField);
      }

      const savedAudioField = await getSavedAudioField();
      if (savedAudioField) {
        setAudioFieldSelected(savedAudioField);
      }
    } catch (_) {
      handleConnectionFailure();
      return;
    }
  }
}

/**
 * Function that is meant to be triggered when a connection failure happens. This function displays an error message on
 * the UI, displays the retry connection button, and disables all other input fields.
 * @param {string} message An error message to be displayed on the UI. The default message is "Failed to Connect to Anki"
 */
function handleConnectionFailure(message = "Failed to Connect to Anki") {
  setStatusMessage(message, "red");
  setReconnectBtnVisibility(true);
  setSelectorsVisibility(false);
}

/**************************************************************************************************
 * Storage Functions (Abstracts storage getters and setters to ensure no wrong keys are used)     *
 **************************************************************************************************/
/**
 * Fetches the saved note model from the sync storage area.
 * @returns {Promise<string>} The saved model, or undefined if there is none (or if there is an error)
 */
async function getSavedModel() {
  try {
    const response = await browser.storage.sync.get("model");
    return response.model;
  } catch (_) {
    return undefined;
  }
}

/**
 * Fetches the saved image field from the sync storage area.
 * @returns {Promise<string>} The saved image field, or undefined if there is none (or if there is an error)
 */
async function getSavedImageField() {
  try {
    const response = await browser.storage.sync.get("imageField");
    return response.imageField;
  } catch (_) {
    return undefined;
  }
}

/**
 * Fetches the saved audio field from the sync storage area.
 * @returns {Promise<string>} The saved audio field, or undefined if there is none (or if there is an error)
 */
async function getSavedAudioField() {
  try {
    const response = await browser.storage.sync.get("audioField");
    return response.audioField;
  } catch (_) {
    return undefined;
  }
}

/**
 * Saves the model in the sync storage area. Also deletes the existing field values (by default) because
 * fields are tied to models so if the saved model is changed then the saved fields won't be compatible with the new model.
 * @param {string} model
 * @param {boolean} deleteSavedFields If set to true (which is the default), then this function also deletes all saved fields.
 * @returns {Promise<boolean>} True if successful and false otherwise.
 */
async function setSavedModel(model, deleteSavedFields = true) {
  try {
    await browser.storage.sync.set({ model: model });
    if (deleteSavedFields) {
      await browser.storage.sync.remove(["imageField", "audioField"]);
    }
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Saves the image field in the sync storage area.
 * @param {string} imageField
 * @returns {Promise<boolean>} True if successful and false otherwise.
 */
async function setSavedImageField(imageField) {
  try {
    await browser.storage.sync.set({ imageField: imageField });
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Saves the audio field in the sync storage area.
 * @param {string} audioField
 * @returns {Promise<boolean>} True if successful and false otherwise.
 */
async function setSavedAudioField(audioField) {
  try {
    await browser.storage.sync.set({ audioField: audioField });
    return true;
  } catch (_) {
    return false;
  }
}
/**************************************************************************************************
 * Background Service Calls (Message background-script.js, mostly to receive content)             *
 **************************************************************************************************/
/**
 * Checks if AnkiConnect is connected to the Anki application.
 * @returns {Promise<boolean>} true if AnkiConnect is connected and false otherwise.
 */
async function getConnectionStatus() {
  const response = await callBackgroundService("TEST-ANKICONNECT");
  return response;
}

/**
 * Fetches the model names in the Anki account (also known as note types).
 * @returns {Promise<Array<string>>} An Array of strings containing the model names.
 * @throws An Error bubbled from {@link callBackgroundService()}.
 * The most common error is caused by AnkiConnect not being connected to Anki.
 */
async function getModels() {
  const models = await callBackgroundService("FETCH-ANKI-MODELS");
  return models;
}

/**
 * Fetches the field names of a given note model.
 * @param {string} model The note model whose field names would be requested
 * (usually retrieved from {@link getModels()}).
 * @returns {Promise<Array<string>>} An Array of strings containing the field names.
 * @throws An Error bubbled from {@link callBackgroundService()}.
 * The most common error is caused by AnkiConnect not being connected to Anki.
 */
async function getFieldNames(model) {
  const fieldNames = await callBackgroundService("FETCH-ANKI-FIELDS", {
    modelName: model,
  });
  return fieldNames;
}

/**
 * Messages the background service to request an action and a response.
 * Check background-script.js to see in detail what actions are available and what content they return.
 * NOTE: This function is usually not called directly by any UI-attached function.
 * Rather, all relevant actions should already have a function that abstracts them.
 * @param {string} action An action to be performed by the background service.
 * @param {object} params Some actions requires certain parameters (as key-value pairs) to be inputted.
 * @returns {Promise} Content from the background service (depends on the action requested)
 * @throws An Error if the requested action responds with an error or if the requested action doesn't exist.
 * @example let response = await callBackgroundService("ACTION", {param1: "lorem", param2: "ipsum"});
 */
async function callBackgroundService(action, params = {}) {
  try {
    const response = await browser.runtime.sendMessage({
      action: action,
      params: params,
    });

    if (response && response.error) {
      throw new Error(`callBackgroundService Error: ${response.error}`);
    }
    return response;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
}

/**************************************************************************************************
 * UI Functions (Modify UI Elements)                                                              *
 **************************************************************************************************/

/**
 * Set whether the 'retry connection' button is displayed on the UI or not.
 * @param {boolean} isVisible If true makes the button visible on the UI.
 */
function setReconnectBtnVisibility(isVisible) {
  const connectButton = document.getElementById("reconnect-button");
  if (isVisible) connectButton.style.display = "inline-block";
  else connectButton.style.display = "none";
}

/**
 * Sets the message displayed on the top of the UI, which is primarily meant to display connection status and errors.
 * @param {string} message The message displayed.
 * @param {string} color The color of the message (must be compatible with CSS color styling e.g. "red" or "blue").
 * @example setStatusMessage("Connection OK", "green");
 */
function setStatusMessage(message, color = "darkgreen") {
  const statusMessage = document.getElementById("status-message");
  statusMessage.textContent = message;
  statusMessage.style.color = color;
}

/**
 * Sets whether the selectors are displayed on the UI or not.
 * @param {boolean} isVisible If true, selectors are displayed on the UI.
 */
function setSelectorsVisibility(isVisible) {
  const selectors = document.getElementsByClassName("selector-container");

  if (isVisible)
    for (i = 0; i < selectors.length; i++) selectors[i].style.display = "flex";
  else
    for (i = 0; i < selectors.length; i++) selectors[i].style.display = "none";
}

/**
 * Sets the options on the model selector input field. Replaces any existing options.
 * @param {Array<string>} models An array of the models to be used as the selector options.
 */
function setModelOptions(models) {
  const modelSelector = document.getElementById("model-field");
  modelSelector.innerHTML = "";
  for (let model of models) {
    const modelOption = document.createElement("option");
    modelOption.value = model;
    modelOption.textContent = model;
    modelSelector.appendChild(modelOption);
  }
}

/**
 * Sets the options on the image selector input field. Replaces any existing options.
 * @param {Array<string>} models An array of the fields to be used as the selector options.
 */
function setImageFieldOptions(fieldsArray) {
  const imageFieldSelector = document.getElementById("image-field");
  imageFieldSelector.innerHTML = "";
  for (let field of fieldsArray) {
    const fieldOption = document.createElement("option");
    fieldOption.value = field;
    fieldOption.textContent = field;
    imageFieldSelector.appendChild(fieldOption);
  }
}

/**
 * Sets the options on the audio selector input field. Replaces any existing options.
 * @param {Array<string>} models An array of the fields to be used as the selector options.
 */
function setAudioFieldOptions(fieldsArray) {
  const audioFieldSelector = document.getElementById("audio-field");
  audioFieldSelector.innerHTML = "";
  for (let field of fieldsArray) {
    const fieldOption = document.createElement("option");
    fieldOption.value = field;
    fieldOption.textContent = field;
    audioFieldSelector.appendChild(fieldOption);
  }
}

/**
 * Sets a specific option in the model selector to be selected. If none are found then nothing happens.
 * @param {string} model The Model option to be selected.
 */
function setModelSelected(model) {
  const selector = document.getElementById("model-field");
  const options = selector.getElementsByTagName("option");

  //could be more efficient if I return the function the moment a match is found
  //but I did it this way to ensure all the non-selected one are selected=false
  for (i = 0; i < options.length; i++) {
    if (options[i].value == model) options[i].selected = true;
    else options[i].selected = false;
  }
}

/**
 * Sets a specific option in the image field selector to be selected. If none are found then nothing happens.
 * @param {string} imageField The Image Field option to be selected.
 */
function setImageFieldSelected(imageField) {
  const selector = document.getElementById("image-field");
  const options = selector.getElementsByTagName("option");

  for (i = 0; i < options.length; i++) {
    if (options[i].value == imageField) options[i].selected = true;
    else options[i].selected = false;
  }
}

/**
 * Sets a specific option in the audio field selector to be selected. If none are found then nothing happens.
 * @param {string} audioField The Audio Field option to be selected.
 */
function setAudioFieldSelected(audioField) {
  const selector = document.getElementById("audio-field");
  const options = selector.getElementsByTagName("option");

  for (i = 0; i < options.length; i++) {
    if (options[i].value == audioField) options[i].selected = true;
    else options[i].selected = false;
  }
}
