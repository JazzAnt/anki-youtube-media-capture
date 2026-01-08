var ytplayer_controls =
  document.getElementsByClassName("ytp-right-controls")[0];

//TODO: This key should be able to be changed by the user
var screenshot_key = "q";
var record_key = "w";
implement_screenshot_button(screenshot_key);
implement_start_record_audio_button(record_key);
implement_stop_record_audio_button(record_key);

/**
 * Implement the take screenshot button to the youtube player
 * @param {string} shortcut_key - The shortcut key to activate this button (this is only a UI indicator, does not add functionality)
 */
function implement_screenshot_button(shortcut_key) {
  var screenshot_btn = document.createElement("button");
  screenshot_btn.id = "screenshot-button";

  addYoutubeButtonAttributes(screenshot_btn, "Take Screenshot", shortcut_key);

  screenshot_btn.append(
    createDomElement(`
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
        `)
  );

  screenshot_btn.addEventListener("click", testMessage);

  implementButton(screenshot_btn);
}

function testMessage() {
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

/**
 * Implement the start record audio button to the youtube player. It is displayed by default.
 * @param {string} shortcut_key - The shortcut key to activate this button (this is only a UI indicator, does not add functionality)
 */
function implement_start_record_audio_button(shortcut_key) {
  var record_audio_btn = document.createElement("button");
  record_audio_btn.id = "start-record-audio-button";

  addYoutubeButtonAttributes(
    record_audio_btn,
    "Start Audio Recording",
    shortcut_key
  );

  record_audio_btn.append(
    createDomElement(`
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
        `)
  );

  implementButton(record_audio_btn);
}

/**
 * Implement the stop record audio button to the youtube player. It is not displayed by default (it's intended to appear and replace
 * the start audio record button once that is clicked)
 * @param {string} shortcut_key - The shortcut key to activate this button (this is only a UI indicator, does not add functionality)
 */
function implement_stop_record_audio_button(shortcut_key) {
  var record_audio_btn = document.createElement("button");
  record_audio_btn.id = "stop-record-audio-button";
  addYoutubeButtonAttributes(
    record_audio_btn,
    "Stop Audio Recording",
    shortcut_key
  );

  record_audio_btn.append(
    createDomElement(`
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
            `)
  );

  record_audio_btn.style.display = "none";

  implementButton(record_audio_btn);
}

/**
 * Implements a button to the youtube player controller. This function checks the button ID. If no button
 * with said ID exists then it will add the button. If there is already an existing button with this ID
 * then the new button will replace the old button.
 * @param {HTMLButtonElement} button - The button you want to implement to the youtube player controller
 * @param {string} button.id - The button's ID is used to check if there is an existing button with the same ID
 */
function implementButton(button) {
  var existingButton = document.getElementById(button.id);
  if (typeof existingButton != "undefined" && existingButton != null) {
    ytplayer_controls.replaceChild(button, existingButton);
  } else {
    ytplayer_controls.insertBefore(button, ytplayer_controls.firstChild);
  }
}

/**
 * This function modifies a button to include attributes that are used by youtube player controller buttons
 * @param {HTMLButtonElement} button - The button that you want to modify
 * @param {string} tooltip - The name of the button that appears when you hover over it
 * @param {string} shortcut_key - The shortcut key to press the button (only an indicator, the functionality is declared elsewhere)
 */
function addYoutubeButtonAttributes(button, tooltip, shortcut_key) {
  if (!button.classList.contains("ytp-button")) {
    button.classList.add("ytp-button");
  }

  button.setAttribute("aria-keyshortcuts", shortcut_key);
  button.setAttribute(
    "title",
    tooltip + " keyboard shortcut (" + shortcut_key + ")"
  );
  button.setAttribute(
    "aria-label",
    tooltip + " keyboard shortcut " + shortcut_key
  );

  button.style.display = "inline-block";
}

/**
 * Creates a JS DOM element from a HTML string text.
 * I ripped this function straight from https://developer.chrome.com/docs/extensions/get-started/tutorial/service-worker-events.
 * @param {string} html - a HTML string text
 * @returns a DOM element made of the parsed HTML string
 */
function createDomElement(html) {
  const dom = new DOMParser().parseFromString(html, "text/html");
  return dom.body.firstElementChild;
}
