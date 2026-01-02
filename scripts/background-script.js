import "./browser-polyfill.js";

browser.runtime.onMessage.addListener(handleMessages);

// Event listener
function handleMessages(message, sender, sendResponse) {
    console.log("Message received: " + message + " from " + sender)

    sendResponse("Sending message from background")

  // Since `fetch` is asynchronous, must return an explicit `true`
    return true;
}

