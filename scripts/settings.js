var saveButton = document.getElementById("save-button");
if (saveButton.addEventListener)
  saveButton.addEventListener("click", onSaveButtonClick, false);
else if (saveButton.attachEvent)
  saveButton.attachEvent('onclick', onSaveButtonClick);


async function onSaveButtonClick() {
  const response = await callBackgroundService('TEST', {message: "Hello from Popup!"})
  document.getElementById("button-message").innerHTML = "Response from background: " + response.response
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
  }
}
