import "./browser-polyfill.js";

browser.runtime.onMessage.addListener(handleMessages);

const Actions = {
  "TEST-CONNECTION": async (payload) => {
    try {
    const result = await ankiConnectInvoke('version', 6);
    console.log(`Got AnkiConnect Version: ${result}`);
    return { response: true }
    } catch (e) {
    console.log(`Test Connection Failed: ${e}`);
    return { response: false }
    }
  }
}

// Event listener
function handleMessages(message, sender) {
  var action = Actions[message.action]
  if (action) { return action(message.payload) }

  return Promise.resolve({ error: `Action ${message.action} not found` })
}

async function ankiConnectInvoke(action, version, params={}) {
  try
  {
    const response = await fetch('http://127.0.0.1:8765', {
      method: 'POST',
      body: JSON.stringify({action, version, params})
    });

    if(!response.ok){
      throw new Error("Failed to connect to AnkiConnect")
    }

    const json = await response.json();

    if(json.error){
      throw json.error
    }

    return json.result;
  }
  catch (error) {
    throw new Error(`AnkiConnect Error: ${error}`)
  }
}
