console.log("Settings JS works!")

var saveButton = document.getElementById("save-button");
if (saveButton.addEventListener)
    saveButton.addEventListener("click", onSaveButtonClick, false);
else if (saveButton.attachEvent)
    saveButton.attachEvent('onclick', onSaveButtonClick);


function onSaveButtonClick() {
    document.getElementById("button-message").innerHTML = "You Clicked The Button!"
}
