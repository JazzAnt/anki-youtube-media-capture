import {
  getSavedModel,
  setSavedModel,
  getSavedImageField,
  setSavedImageField,
  getSavedAudioField,
  setSavedAudioField,
  getSavedImageShortcut,
  setSavedImageShortcut,
  getSavedAudioShortcut,
  setSavedAudioShortcut,
} from "./utils/storage.js";

import {
  getConnectionStatus,
  getModels,
  getFieldNames,
} from "./utils/action-calls.js";

import SettingsID from "./namespaces/settings-id.js";

initialize();
/**************************************************************************************************
 * Adding Event Listeners to various UI elements                                                  *
 **************************************************************************************************/
document
  .getElementById(SettingsID.reconnectBtn)
  .addEventListener("click", initialize, false);
document.getElementById(SettingsID.modelField).addEventListener(
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
document.getElementById(SettingsID.imageField).addEventListener(
  "input",
  async function () {
    const success = await setSavedImageField(this.value);
    if (!success) handleConnectionFailure("Failed Saving Image Field");
  },
  false,
);
document.getElementById(SettingsID.audioField).addEventListener(
  "input",
  async function () {
    const success = await setSavedAudioField(this.value);
    if (!success) handleConnectionFailure("Failed Saving Audio Field");
  },
  false,
);

document.getElementById(SettingsID.imageShortcutField).addEventListener(
  "focusin",
  async function () {
    const keyListener = (keyPress) => {
      this.disabled = true;
      this.value = keyPress.code;
      setSavedImageShortcut(keyPress.code);
      this.disabled = false;
    };

    this.addEventListener("keydown", keyListener);
    this.addEventListener("focusout", () => {
      this.removeEventListener("keydown", keyListener);
    });
  },
  false,
);

document.getElementById(SettingsID.audioShortcutField).addEventListener(
  "focusin",
  async function () {
    const keyListener = (keyPress) => {
      this.disabled = true;
      this.value = keyPress.code;
      setSavedAudioShortcut(keyPress.code);
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
 * Initializer Function                                                                           *
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

  try {
    const savedImageShortcut = await getSavedImageShortcut();
    document.getElementById(SettingsID.imageShortcutField).value =
      savedImageShortcut;
    const savedAudioShortcut = await getSavedAudioShortcut();
    document.getElementById(SettingsID.audioShortcutField).value =
      savedAudioShortcut;
  } catch (_) {
    handleConnectionFailure();
    return;
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
 * UI Functions (Modify UI Elements)                                                              *
 **************************************************************************************************/

/**
 * Set whether the 'retry connection' button is displayed on the UI or not.
 * @param {boolean} isVisible If true makes the button visible on the UI.
 */
function setReconnectBtnVisibility(isVisible) {
  const connectButton = document.getElementById(SettingsID.reconnectBtn);
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
  const statusMessage = document.getElementById(SettingsID.statusMsg);
  statusMessage.textContent = message;
  statusMessage.style.color = color;
}

/**
 * Sets whether the selectors are displayed on the UI or not.
 * @param {boolean} isVisible If true, selectors are displayed on the UI.
 */
function setSelectorsVisibility(isVisible) {
  const selectors = document.getElementsByClassName(
    SettingsID.selectorContainerClass,
  );

  if (isVisible)
    for (let i = 0; i < selectors.length; i++)
      selectors[i].style.display = "flex";
  else
    for (let i = 0; i < selectors.length; i++)
      selectors[i].style.display = "none";
}

/**
 * Sets the options on the model selector input field. Replaces any existing options.
 * @param {Array<string>} models An array of the models to be used as the selector options.
 */
function setModelOptions(models) {
  const modelSelector = document.getElementById(SettingsID.modelField);
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
  const imageFieldSelector = document.getElementById(SettingsID.imageField);
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
  const audioFieldSelector = document.getElementById(SettingsID.audioField);
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
  const selector = document.getElementById(SettingsID.modelField);
  const options = selector.getElementsByTagName("option");

  //could be more efficient if I return the function the moment a match is found
  //but I did it this way to ensure all the non-selected one are selected=false
  for (let i = 0; i < options.length; i++) {
    if (options[i].value == model) options[i].selected = true;
    else options[i].selected = false;
  }
}

/**
 * Sets a specific option in the image field selector to be selected. If none are found then nothing happens.
 * @param {string} imageField The Image Field option to be selected.
 */
function setImageFieldSelected(imageField) {
  const selector = document.getElementById(SettingsID.imageField);
  const options = selector.getElementsByTagName("option");

  for (let i = 0; i < options.length; i++) {
    if (options[i].value == imageField) options[i].selected = true;
    else options[i].selected = false;
  }
}

/**
 * Sets a specific option in the audio field selector to be selected. If none are found then nothing happens.
 * @param {string} audioField The Audio Field option to be selected.
 */
function setAudioFieldSelected(audioField) {
  const selector = document.getElementById(SettingsID.audioField);
  const options = selector.getElementsByTagName("option");

  for (let i = 0; i < options.length; i++) {
    if (options[i].value == audioField) options[i].selected = true;
    else options[i].selected = false;
  }
}
