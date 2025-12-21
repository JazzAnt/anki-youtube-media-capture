var ytplayer_controls = document.getElementsByClassName("ytp-right-controls")[0]

//TODO: This key should be able to be changed by the user
var screenshot_key = "q"
implement_screenshot_button(screenshot_key)

/**
 * Implement the take screenshot button to the youtube player
 * @param {string} shortcut_key - The shortcut key to activate this button (this is only a UI indicator, does not add functionality)
 */
function implement_screenshot_button(shortcut_key)
{
    var screenshot_btn = document.createElement("button")
    screenshot_btn.id = "screenshot-button"

    addYoutubeButtonAttributes(screenshot_btn, "Take Screenshot", shortcut_key)

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
            <defs/>
            <circle id="shape0" transform="translate(1.92, 2.64)" r="0.84" cx="0.84" cy="0.84" fill="none" stroke="#ffffff" stroke-width="0.6264" stroke-linecap="square" stroke-linejoin="bevel"/>
            <rect id="shape1" transform="translate(0.48, 1.68)" fill="none" stroke="#ffffff" stroke-width="0.6264" stroke-linecap="square" stroke-linejoin="bevel" width="4.8" height="3.6"/>
            <path id="shape2" transform="translate(3.58874998997317, 0.776249997831187)" fill="none" stroke="#ffffff" stroke-width="0.6264" stroke-linecap="square" stroke-linejoin="miter" stroke-miterlimit="2" d="M0 0L1.1475 0.01125" sodipodi:nodetypes="cc"/>
            </svg>
        `)
    )

    implementButton(screenshot_btn)
}

/**
 * Implements a button to the youtube player controller. This function checks the button ID. If no button 
 * with said ID exists then it will add the button. If there is already an existing button with this ID 
 * then the new button will replace the old button.
 * @param {HTMLButtonElement} button - The button you want to implement to the youtube player controller
 * @param {string} button.id - The button's ID is used to check if there is an existing button with the same ID 
 */
function implementButton(button)
{
    var existingButton = document.getElementById(button.id)
    if(typeof(existingButton) != "undefined" && existingButton != null)
    { ytplayer_controls.replaceChild(button, existingButton) }
    else
    { ytplayer_controls.insertBefore(button, ytplayer_controls.firstChild) }
}

/**
 * This function modifies a button to include attributes that are used by youtube player controller buttons
 * @param {HTMLButtonElement} button - The button that you want to modify
 * @param {string} tooltip - The name of the button that appears when you hover over it
 * @param {string} shortcut_key - The shortcut key to press the button (only an indicator, the functionality is declared elsewhere)
 */
function addYoutubeButtonAttributes(button, tooltip, shortcut_key)
{
    //Add class necessary for youtube controller buttons
    if(!button.classList.contains("ytp-button"))
    { button.classList.add("ytp-button") }

    //Set tooltip values
    button.setAttribute("aria-keyshortcuts", shortcut_key)
    button.setAttribute("title", tooltip)
    button.setAttribute("data-title-no-tooltip", tooltip)
    button.setAttribute("data-tooltip-title", tooltip + " (" + shortcut_key + ")")
    button.setAttribute("aria-label", tooltip + " keyboard shortcut " + shortcut_key)

    //Set Styling
    button.style.display = "inline-block"
}

/**
 * Creates a JS DOM element from a HTML string text. 
 * I ripped this function straight from https://developer.chrome.com/docs/extensions/get-started/tutorial/service-worker-events.
 * @param {string} html - a HTML string text
 * @returns a DOM element made of the parsed HTML string
 */
function createDomElement(html) {
  const dom = new DOMParser().parseFromString(html, 'text/html');
  return dom.body.firstElementChild;
}
