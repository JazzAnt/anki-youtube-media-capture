/**************************************************************************************************
 * Namespaces (This is on top so that they're initialized before everything else)                 *
 **************************************************************************************************/
/**
 * Contains HTML IDs as strings, so that their implementation is consistent (at least on this file)
 */
const ID = {
  rootDivContainer: "anki-media-capture-controls",
  screenshotBtn: "screenshot-button",
  startRecordBtn: "start-record-button",
  stopRecordBtn: "stop-record-button",
};

/**
 * Contain SVG HTML elements as string, meant to be used with {@link createDomElement()}.
 * @example //Here's how you add a screenshot SVG icon to your button element
 * yourButton.append(createDomElement(ICONS.screenshot))
 */
const ICONS = {
  /**
   * SVG Icon meant for a screenshot button.
   */
  screenshot: `
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xmlns:krita="http://krita.org/namespaces/svg/krita"
                xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                width="24"
                height="24"
                viewBox="0 0 5.76 5.76"
            >
            <circle id="shape0" transform="translate(1.92, 2.64)" r="0.84" cx="0.84" cy="0.84" fill="none" stroke="#ffffff" stroke-width="0.6264" stroke-linecap="square" stroke-linejoin="bevel"/>
            <rect id="shape1" transform="translate(0.48, 1.68)" fill="none" stroke="#ffffff" stroke-width="0.6264" stroke-linecap="square" stroke-linejoin="bevel" width="4.8" height="3.6"/>
            <path id="shape2" transform="translate(3.58874998997317, 0.776249997831187)" fill="none" stroke="#ffffff" stroke-width="0.6264" stroke-linecap="square" stroke-linejoin="miter" stroke-miterlimit="2" d="M0 0L1.1475 0.01125" sodipodi:nodetypes="cc"/>
            </svg>
        `,
  /**
   * SVG Icon meant for a button to start recording audio.
   */
  start_recording_audio: `
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xmlns:krita="http://krita.org/namespaces/svg/krita"
                xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                width="24"
                height="24"
                viewBox="0 0 5.76 5.76"
            >
            <rect id="shape0" transform="translate(2.16, 0.72)" fill="none" stroke="#ffffff" stroke-width="0.6264" stroke-linecap="square" stroke-linejoin="bevel" width="1.44" height="2.88"/>
            <path id="shape1" transform="translate(1.00124999720255, 3.02624999154477)" fill="none" stroke="#ffffff" stroke-width="0.6264" stroke-linecap="square" stroke-linejoin="bevel" d="M0.01125 0L0 0.8775L0.63 1.4175L1.7775 1.5975L3.25125 1.27125L3.63375 0.855L3.6225 0.09" sodipodi:nodetypes="ccccccc"/>
            <path id="shape2" transform="translate(2.75624999229914, 4.7024999868614)" fill="none" stroke="#ffffff" stroke-width="0.6264" stroke-linecap="square" stroke-linejoin="miter" stroke-miterlimit="2" d="M0.01125 0L0 0.45" sodipodi:nodetypes="cc"/>
            <path id="shape3" transform="translate(1.41749999603956, 5.47874998469258)" fill="none" stroke="#ffffff" stroke-width="0.6264" stroke-linecap="square" stroke-linejoin="miter" stroke-miterlimit="2" d="M0 0.0225L2.71125 0" sodipodi:nodetypes="cc"/>
            <path id="shape4" transform="translate(2.87999999195339, 1.52999999572524)" fill="none" stroke="#ffffff" stroke-width="0.6264" stroke-linecap="square" stroke-linejoin="miter" stroke-miterlimit="2" d="M0 0L0.01125 1.29375" sodipodi:nodetypes="cc"/>
            </svg>
        `,
  /**
   * SVG Icon meant for a button to stop recording audio.
   */
  stop_recording_audio: `
            <svg 
            xmlns="http://www.w3.org/2000/svg" 
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:krita="http://krita.org/namespaces/svg/krita"
            xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
            width="24"
            height="24"
            viewBox="0 0 5.76 5.76"
            >
            <rect id="shape0" transform="translate(1.2, 0.72)" fill="none" stroke="#ffffff" stroke-width="0.8136" stroke-linecap="square" stroke-linejoin="bevel" width="3.6" height="4.32"/>
            <path id="shape1" transform="translate(2.27247434435576, 2.40383124287343)" fill="none" stroke="#ffffff" stroke-width="0.8136" stroke-linecap="square" stroke-linejoin="miter" stroke-miterlimit="2" d="M0 0L1.51717 0.00656784" sodipodi:nodetypes="cc"/>
            <path id="shape2" transform="translate(2.18052451539339, 3.61231470923603)" fill="none" stroke="#ffffff" stroke-width="0.8136" stroke-linecap="square" stroke-linejoin="miter" stroke-miterlimit="2" d="M0 0L1.6551 0" sodipodi:nodetypes="cc"/>
            </svg>
            `,
};

/**################################### CODE STARTS HERE #########################################*/

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
  return document.getElementById(ID.rootDivContainer);
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
    container.id = ID.rootDivContainer;
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
    ID.screenshotBtn,
    "Take Screenshot",
    shortcut_key
  );
  screenshotBtn.append(createDomElement(ICONS.screenshot));
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
    ID.startRecordBtn,
    "Start Audio Recording",
    shortcut_key
  );
  startRecordBtn.append(createDomElement(ICONS.start_recording_audio));
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
    ID.stopRecordBtn,
    "Stop Audio Recording",
    shortcut_key,
    false
  );
  stopRecordBtn.append(createDomElement(ICONS.stop_recording_audio));
  stopRecordBtn.addEventListener("click", stopRecording);
  return stopRecordBtn;
}

/**
 * Toggles which recording button is shown between start-recording and stop-recording
 * @param {boolean} isRecording If true: the start recording button would be hidden and
 * the stop recording button would be shown, and vice-versa if it's false.
 */
function toggleRecordBtnDisplay(isRecording) {
  const startRecordBtn = document.getElementById(ID.startRecordBtn);
  const stopRecordBtn = document.getElementById(ID.stopRecordBtn);
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
