import "./browser-polyfill.js";

browser.runtime.onMessage.addListener(handleMessages);

/**
 * An Action Map that abstracts action calls between {@link handleMessages()} and {@link ankiConnectInvoke()}
 */
const Actions = {
  /**
   * Tests connectivity to AnkiConnect, which is done by making a simple API call to ask AnkiConnect for it's current version.
   * @returns True if connection is successful and false otherwise.
   */
  "TEST-ANKICONNECT": async () => {
    try {
      const result = await ankiConnectInvoke("version", 6);
      console.log(
        `TEST-ANKICONNECT action success!\nResult\t: AnkiConnect Version ${result}`
      );
      return { response: true };
    } catch (e) {
      console.log(`TEST-ANKICONNECT action failure!\nError\t: ${e}`);
      return { response: false };
    }
  },
  /**
   * Request AnkiConnect to fetch the models (also known as note types).
   * @returns {Promise<Array<string>>} An Array of models as strings, or an object with an error key if failed.
   */
  "FETCH-ANKI-MODELS": async () => {
    try {
      const result = await ankiConnectInvoke("modelNames", 6);
      console.log(`FETCH-ANKI-MODELS action success!\nResult\t:`, result);
      return result;
    } catch (e) {
      errorMessage = `FETCH-ANKI-MODELS action failure!\nError\t: ${e}`;
      console.log(errorMessage);
      return { error: errorMessage };
    }
  },
  /**
   * Requests AnkiConnect to fetch the field names of the specified model.
   * @param {object} model Object with a single key "modelName" containing a string value of the model.
   * @returns {Promise<Array<string>>} An Array of fieldNames as strings, or an object with an error key if failed.
   */
  "FETCH-ANKI-FIELDS": async ({ modelName }) => {
    try {
      const result = await ankiConnectInvoke("modelFieldNames", 6, {
        modelName: modelName,
      });
      console.log(`FETCH-ANKI-FIELDS action success!\nResult\t:`, result);
      return result;
    } catch (e) {
      errorMessage = `FETCH-ANKI-FIELDS action failure!\nError\t: ${e}`;
      console.log(errorMessage);
      return { error: errorMessage };
    }
  },
};

/**
 * Receives an action sent by browser.runtime.sendMessage() and executes an Action that corresponds to
 * the Action Map defined above. This function should be attached as an eventListener of browser.runtime.onMessage
 * on the very top of the module.
 * @async This function calls for another function in the Action Map which are all async functions.
 * @see {@link Actions} for all the available actions, their respective responses, and any params required.
 * @param {object} message An object containing an "action" key and an optional "params" key.
 * @param {string} sender
 * @returns {Promise<any>} The response of the specified action.
 */
function handleMessages({ action, params = {} }, sender) {
  console.log(
    `Sender\t: ${describeSender(sender)}\nAction\t: ${action}\nParams\t: `,
    params
  );
  var actionFunction = Actions[action];
  if (actionFunction) {
    return actionFunction(params);
  }

  const errorMessage = `Action ${action} is not found on the Action Map`;
  console.log("Error: ", errorMessage);
  return Promise.resolve({ error: errorMessage });
}

/**
 * Analyzes the sender parameter sent by browser.runtime.sendMessage() calls and returns a string value that
 * better describes what who the sender actually is. Meant to be used by {@link handleMessages()} for logging.
 * @param {object} sender The sender parameter of {@link handleMessages()}
 * @returns {string} A string that describes who the sender is.
 */
function describeSender(sender) {
  if (sender.tab) return sender.tab.id.toString();
  if (sender.url?.includes("settings.html")) return "settings.html";
  return "Unknown Sender";
}

/**
 * A function to make POST API calls to AnkiConnect. This function is directly taken from the AnkiConnect GitHub docs but modified
 * to use fetch() instead of XMLHttpRequest() because Background Services can only use fetch() (this is for Chrome compatibility).
 * @see {@link https://github.com/amikey/anki-connect?tab=readme-ov-file#sample-invocation}
 * @param {string} action The Action to be requested to the AnkiConnect API. See the cited link for all available actions.
 * @param {int} version The version of the AnkiConnect API. AnkiConnect is backwards compatible so there's no reason to not use the latest version.
 * @param {object} params A group of key-value pairs that some Actions require.
 * @returns {Promise<any>} A response from the API call, what type depends on the requested action.
 * @throws An Error if API call fails such as connection failure.
 */
async function ankiConnectInvoke(action, version, params = {}) {
  try {
    const response = await fetch("http://127.0.0.1:8765", {
      method: "POST",
      body: JSON.stringify({ action, version, params }),
    });

    if (!response.ok) {
      throw new Error("Failed to connect to AnkiConnect");
    }

    const json = await response.json();

    if (json.error) {
      throw json.error;
    }
    console.log(typeof json.result);
    return json.result;
  } catch (error) {
    throw new Error(`AnkiConnect Error: ${error}`);
  }
}
