/**************************************************************************************************
 * Storage Functions (Abstracts storage getters and setters to ensure no wrong keys are used)     *
 **************************************************************************************************/
/**
 * Fetches the saved note model from the sync storage area.
 * @returns {Promise<string>} The saved model, or undefined if there is none (or if there is an error)
 */
export async function getSavedModel() {
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
export async function getSavedImageField() {
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
export async function getSavedAudioField() {
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
export async function setSavedModel(model, deleteSavedFields = true) {
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
export async function setSavedImageField(imageField) {
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
export async function setSavedAudioField(audioField) {
  try {
    await browser.storage.sync.set({ audioField: audioField });
    return true;
  } catch (_) {
    return false;
  }
}
