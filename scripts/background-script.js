import "./browser-polyfill.js";

browser.runtime.onMessage.addListener(handleMessages);

const Actions = {
  "TEST": async (payload) => {
    console.log(payload.message)
    return { response: "Test Message from Background Service" }
  }
}

// Event listener
function handleMessages(message, sender) {
  var action = Actions[message.action]
  if (action) { return action(message.payload) }

  return Promise.resolve({ error: `Action ${message.action} not found` })
}

