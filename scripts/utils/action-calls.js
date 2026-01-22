/**************************************************************************************************
 * Background Service Calls (Message background-script.js, mostly to receive content)             *
 **************************************************************************************************/
/**
 * Checks if AnkiConnect is connected to the Anki application.
 * @returns {Promise<boolean>} true if AnkiConnect is connected and false otherwise.
 */
export async function getConnectionStatus() {
  const response = await callBackgroundService("TEST-ANKICONNECT");
  return response;
}

/**
 * Fetches the model names in the Anki account (also known as note types).
 * @returns {Promise<Array<string>>} An Array of strings containing the model names.
 * @throws An Error bubbled from {@link callBackgroundService()}.
 * The most common error is caused by AnkiConnect not being connected to Anki.
 */
export async function getModels() {
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
export async function getFieldNames(model) {
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
