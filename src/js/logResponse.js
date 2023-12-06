import { gsap } from 'gsap';
import clickSrc from '../sounds/ger/click.mp3';

/**
 * Function for logging participant responses after a trial.
 * Directly manipulates the exp object (no return).
 *
 * @param {Object} exp - An object storing our experiment data
 *
 * @example
 *     logResponse(event, exp);
 */
export async function logResponse(event, exp) {
  // add participant info into log
  exp.log[exp.trial].id = exp.meta.subjID;
  exp.log[exp.trial].lang = exp.meta.lang;

  // user feedback where they clicked (with sound)
  // create point (needed for transformation function later) and pass event coordinates
  const clickOriginal = exp.elemSpecs.outerSVG.ID.createSVGPoint();
  clickOriginal.x = event.clientX;
  clickOriginal.y = event.clientY;

  // transform client user coordinate system to SVG coordinates
  // see: https://www.sitepoint.com/how-to-translate-from-dom-to-svg-coordinates-and-back-again/
  const clickScaled = clickOriginal.matrixTransform(
    exp.elemSpecs.outerSVG.ID.getScreenCTM().inverse(),
  );

  // save click coords in our response log
  exp.log[exp.trial].clickX = clickScaled.x;

  // get the circle that we set on the click coordinates
  const clickBubble = document.getElementById('click-bubble');
  clickBubble.setAttribute('cx', clickScaled.x);
  clickBubble.setAttribute('cy', clickScaled.y);

  // let clickBubble be visible only for 0.5 sec
  // let clickBubble be visible only for 0.5 sec
  await gsap.to(clickBubble, {
    duration: 0.5,
    attr: { visibility: 'visible' },
    onComplete() {
      clickBubble.setAttribute('visibility', 'hidden');
    },
  });

  // play positive user feedback
  exp.soundEffect.src = clickSrc;
  exp.soundEffect.play();

  // NOTE: the SVG coord system starts with 0, 0 in upper left corner
  // for x: negative values mean too far left, positive values mean too far right
  // for y: negative values mean too high, positive values mean too low
  exp.log[exp.trial].absoluteClickDistance = Math.abs(
    clickScaled.x - exp.log[exp.trial].targetCenterX,
  ).toFixed(2);

  // get rid of unneccessary variables for researchers' response log
  delete exp.log[exp.trial].targetX;
  delete exp.log[exp.trial].targetY;

  if (exp.devmode) console.log(exp.log[exp.trial]);
}
