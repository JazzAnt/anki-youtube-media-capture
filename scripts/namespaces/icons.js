/**
 * Contain SVG HTML elements as string, meant to be used with {@link createDomElement()}.
 * @example //Here's how you add a screenshot SVG icon to your button element
 * yourButton.append(createDomElement(ICONS.screenshot))
 */
const Icons = {
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
export default Icons;
