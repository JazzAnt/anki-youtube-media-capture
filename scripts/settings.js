/*
 * These two functions should be uncommented when ready for deployment, but they're commented for easier testing
*/
// toggleSettingsVisibility(false)
// validateAnkiConnect()

var connectButton = document.getElementById("connect-button");
if (connectButton.addEventListener)
  connectButton.addEventListener("click", validateAnkiConnect, false);
else if (connectButton.attachEvent)
  connectButton.addEventListener("onclick", validateAnkiConnect);

var saveButton = document.getElementById("save-button");
if (saveButton.addEventListener)
  saveButton.addEventListener("click", onSaveButtonClick, false);
else if (saveButton.attachEvent)
  saveButton.attachEvent('onclick', onSaveButtonClick);

async function validateAnkiConnect() {
  const statusMessage = document.getElementById("status-message")
  const connectButton = document.getElementById("connect-button")

  connectButton.style.display= "none"
  statusMessage.innerHTML = "Checking Connection..."
  statusMessage.style.color = "blue"
  const response = await callBackgroundService('TEST-CONNECTION', { message: "Hello from Popup!" })
  connectButton.style.display= "inline-block"

  //response.response here returns true if connection is successful
  if (response.response) {
    statusMessage.innerHTML = "Connected to Anki"
    statusMessage.style.color = "green"
    toggleSettingsVisibility(true)
  }
  else {
    statusMessage.innerHTML = "Not Connected to Anki"
    statusMessage.style.color = "red"
    toggleSettingsVisibility(false)
  }
}

function toggleSettingsVisibility(isVisible) {
  const selectors = document.getElementsByClassName("selector-container")
  const buttons = document.getElementsByClassName("button-container")

  if (isVisible){
    for(i = 0; i < selectors.length; i++){
      selectors[i].style.display = "flex"
    }
    for(i = 0; i < buttons.length; i++){
      buttons[i].style.display = "block"
    }
  } else {
    for(i = 0; i < selectors.length; i++){
      selectors[i].style.display = "none"
    }
    for(i = 0; i < buttons.length; i++){
      buttons[i].style.display = "none"
    }
  }
}

async function getNoteTypes() {
  try{
    const response = await callBackgroundService('GET-NOTETYPES', { message: "Hello from Popup!" })
    //Not sure if there is a better way to extract the data than this toString into split
    const noteTypes = response.toString().split(',')
    return noteTypes;

  } catch (e) {
    //If error, re-validate AnkiConnect to see if connection has been lost
    validateAnkiConnect()
  }
}

function setNotetypeSelector(noteTypesArray = [""]){
  const noteTypeSelector = document.getElementById("note-type")
  noteTypeSelector.innerHTML = ""
  for (let noteType of noteTypesArray){
    const option = document.createElement("option")
    option.value = noteType
    option.innerHTML = noteType
    //TODO: If there is already a notetype saved in the storage, then add selected attribute to said notetype
    noteTypeSelector.appendChild(option)
  }
}

async function onSaveButtonClick(){
  const noteTypes = await getNoteTypes();
  setNotetypeSelector(noteTypes);
}

async function callBackgroundService(action, payload = {}) {
  try {
    const response = await browser.runtime.sendMessage({
      action: action,
      payload: payload
    });

    if (response && response.error) {
      throw new Error(`Background Script Error: ${response.error}`)
    }
    return response
  }
  catch (error) {
    console.log(error.message)
    throw new Error(error.message)
  }
}
