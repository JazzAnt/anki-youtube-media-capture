import ControlBtnID from "./namespaces/control-btn-id";
import Icons from "./namespaces/icons";

initialize();
/**************************************************************************************************
 * Complex Functions (Functions which calls several other functions to perform complex actions)   *
 **************************************************************************************************/
/**
 * Starts or restarts the control buttons on youtube. Should be called at the start of the code and
 * when a reload extensions button is clicked.
 */
function initialize() {
  resetRootContainer();

  //check presence necessary storage variables
  //if doesn't exist, show error button and return (error button displays error message)

  //check anki connection
  //if no, show reload button and return

  insertButton(createStopRecordBtn());
  insertButton(createStartRecordBtn());
  insertButton(createScreenshotBtn());
}

/**************************************************************************************************
 * Root Container Functions (manages the div container that holds all the other element)          *
 **************************************************************************************************/
/**
 * Fetches the HTMLElement where all other elements created by this extension should be contained in.
 * @returns A \<div\> element where all the elements in this extension should be contained in.
 */
function getRootContainer() {
  return document.getElementById(ControlBtnID.rootDivContainer);
}

/**
 * Resets the container element that would be fetched by {@link getRootContainer()}.
 * If the container doesn't exist, this function creates it.
 * If the container does exist, this function empties all elements inside it.
 * Either way, the end result should be an empty container.
 */
function resetRootContainer() {
  const buttonContainer = getRootContainer();
  if (typeof buttonContainer != "undefined" && buttonContainer != null) {
    buttonContainer.innerHTML = "";
  } else {
    const container = document.createElement("div");
    container.id = ControlBtnID.rootDivContainer;
    const ytpContainer =
      document.getElementsByClassName("ytp-right-controls")[0];
    ytpContainer.insertBefore(container, ytpContainer.firstChild);
  }
}

/**************************************************************************************************
 * Screenshot Functions                                                                           *
 **************************************************************************************************/
/**
 * Creates a screenshot button HTML element.
 * @returns The button element, ready to be inserted to any other HTML container.
 */
function createScreenshotBtn() {
  //TODO: key should be obtained from storage and set by the user in settings
  var shortcut_key = "q";
  const screenshotBtn = createButtonWithAttributes(
    ControlBtnID.screenshotBtn,
    "Take Screenshot",
    shortcut_key
  );
  screenshotBtn.append(createDomElement(Icons.screenshot));
  screenshotBtn.addEventListener("click", takeScreenshot);
  return screenshotBtn;
}

/**
 * Takes a screen capture of the youtube video and saves it to Anki.
 * (TODO: CURRENTLY NOT IMPLEMENTED)
 */
function takeScreenshot() {
  //Right now this only does testing stuff, not actually take screenshots
  (async () => {
    try {
      const response = await browser.runtime.sendMessage({
        greeting: "Hello, Background JS!",
      });
      // This will only log once the background script calls sendResponse()
      console.log("Response from background:", response);
    } catch (error) {
      console.error("Connection failed:", error.message);
    }
  })();
}

/**************************************************************************************************
 * Record Audio Functions                                                                         *
 **************************************************************************************************/
/**
 * Creates a start recording audio button HTML element.
 * @returns The button element, ready to be inserted to any other HTML container.
 */
function createStartRecordBtn() {
  //TODO: key should be obtained from storage and set by the user in settings
  var shortcut_key = "w";
  const startRecordBtn = createButtonWithAttributes(
    ControlBtnID.startRecordBtn,
    "Start Audio Recording",
    shortcut_key
  );
  startRecordBtn.append(createDomElement(Icons.start_recording_audio));
  startRecordBtn.addEventListener("click", startRecording);
  return startRecordBtn;
}

/**
 * Creates a stop recording audio button HTML element. This element is by default not
 * displayed and it meant to be toggled on and off using {@link toggleRecordBtnDisplay()}
 * @returns The button element, ready to be inserted to any other HTML container.
 */
function createStopRecordBtn() {
  //TODO: key should be obtained from storage and set by the user in settings
  var shortcut_key = "w";
  const stopRecordBtn = createButtonWithAttributes(
    ControlBtnID.stopRecordBtn,
    "Stop Audio Recording",
    shortcut_key,
    false
  );
  stopRecordBtn.append(createDomElement(Icons.stop_recording_audio));
  stopRecordBtn.addEventListener("click", stopRecording);
  return stopRecordBtn;
}

/**
 * Toggles which recording button is shown between start-recording and stop-recording
 * @param {boolean} isRecording If true: the start recording button would be hidden and
 * the stop recording button would be shown, and vice-versa if it's false.
 */
function toggleRecordBtnDisplay(isRecording) {
  const startRecordBtn = document.getElementById(ControlBtnID.startRecordBtn);
  const stopRecordBtn = document.getElementById(ControlBtnID.stopRecordBtn);
  if (isRecording) {
    startRecordBtn.style.display = "none";
    stopRecordBtn.style.display = "inline-block";
  } else {
    startRecordBtn.style.display = "inline-block";
    stopRecordBtn.style.display = "none";
  }
}

/**
 * Starts recording the youtube audio. Also swaps the start recording button with the stop recording button.
 * (TODO: CURRENTLY NOT IMPLEMENTED)
 */
function startRecording() {
  (async () => {
    try {
      toggleRecordBtnDisplay(true);
    } catch (error) {
      console.error("Connection failed:", error.message);
    }
  })();
}

/**
 * Stops recording the youtube audio and saves it to Anki.
 * Also swaps the stop recording button with the start recording button.
 * (TODO: CURRENTLY NOT IMPLEMENTED)
 */
function stopRecording() {
  (async () => {
    try {
      toggleRecordBtnDisplay(false);
    } catch (error) {
      console.error("Connection failed:", error.message);
    }
  })();
}

/**************************************************************************************************
 * General Button Functions                                                                       *
 **************************************************************************************************/
/**
 * Implements a button to the youtube player controller. If a button with the same ID already exists,
 * this function will replace it.
 * @param {HTMLButtonElement} button - The button you want to implement to the youtube player controller
 * @param {string} button.id - The button's ID is used to check if there is an existing button with the same ID
 */
function insertButton(button) {
  const buttonContainer = getRootContainer();
  const existingButton = document.getElementById(button.id);
  if (typeof existingButton != "undefined" && existingButton != null) {
    buttonContainer.replaceChild(button, existingButton);
  } else {
    buttonContainer.insertBefore(button, buttonContainer.firstChild);
  }
}

/**
 * Created a button with added attributes that would make it suitable as a youtube player button.
 * @param {string} buttonID - The HTML id of the button
 * @param {string} tooltipName - The name of the button that appears when you hover over it
 * @param {string} tooltipShortcutKey - The shortcut key to press the button
 * (only an indicator, the functionality should be implemented elsewhere)
 * @param {boolean} isDisplayed - If false, the button is hidden (default is true)
 * @returns {HTMLButtonElement} a button with the added attributes.
 */
function createButtonWithAttributes(
  buttonID,
  tooltipName,
  tooltipShortcutKey,
  isDisplayed = true
) {
  const button = document.createElement("button");
  button.id = buttonID;
  button.classList.add("ytp-button");

  if (isDisplayed) button.style.display = "inline-block";
  else button.style.display = "none";
  button.setAttribute("aria-keyshortcuts", tooltipShortcutKey);
  button.setAttribute(
    "title",
    tooltipName + " keyboard shortcut (" + tooltipShortcutKey + ")"
  );
  button.setAttribute(
    "aria-label",
    tooltipName + " keyboard shortcut " + tooltipShortcutKey
  );
  return button;
}

/**
 * Creates a JS DOM element from a HTML string text.
 * I ripped this function straight from chrome's service worker tutorial.
 * @see {@link https://developer.chrome.com/docs/extensions/get-started/tutorial/service-worker-events}
 * @param {string} html - a HTML string text
 * @returns a DOM element made of the parsed HTML string
 */
function createDomElement(html) {
  const dom = new DOMParser().parseFromString(html, "text/html");
  return dom.body.firstElementChild;
}
