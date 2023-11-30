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
export function logResponse(event, exp) {
  // get user screen size
  // offset and client properties don't work, they include padding/borders etc. when we style our svg in the CSS
  exp.log[exp.trials.count].clientScreenWidth = document
    .getElementById('experimentslide')
    .getBoundingClientRect().width;
  exp.log[exp.trials.count].clientScreenHeight = document
    .getElementById('experimentslide')
    .getBoundingClientRect().height;

  // how much smaller/bigger is the SVG coordinate system wrt the screen size?
  // we could do the same with origViewBoxWidth / clientScreenWidth, will result in the same value
  exp.log[exp.trials.count].clientScreenScaling =
    exp.log[exp.trials.count].clientScreenHeight /
    exp.elemSpecs.outerSVG.origViewBoxHeight;

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

  // save original and transformed click coords in our response log
  exp.log[exp.trials.count].clickOriginalX = clickOriginal.x;
  exp.log[exp.trials.count].clickOriginalY = clickOriginal.y;
  exp.log[exp.trials.count].clickScaledX = clickScaled.x;
  exp.log[exp.trials.count].clickScaledY = clickScaled.y;

  // get the circle that we set on the click coordinates
  const clickBubble = document.getElementById('click-bubble');
  clickBubble.setAttribute('cx', exp.log[exp.trials.count].clickScaledX);
  clickBubble.setAttribute('cy', exp.log[exp.trials.count].clickScaledY);

  // let clickBubble be visible only for 0.5 sec
  gsap.to(clickBubble, {
    duration: 0.5,
    attr: { visibility: 'visible' },
    onComplete() {
      clickBubble.setAttribute('visibility', 'hidden');
    },
  });

  // play positive user feedback
  exp.soundEffect.src = clickSrc;
  exp.soundEffect.play();

  // get upper left corner of target
  exp.log[exp.trials.count].targetX = exp.positions[exp.trials.count].x;
  exp.log[exp.trials.count].targetY = exp.positions[exp.trials.count].y;

  // define center of target
  exp.log[exp.trials.count].targetWidth =
    exp.targets[exp.trials.count].getBBox().width;
  exp.log[exp.trials.count].targetHeight =
    exp.targets[exp.trials.count].getBBox().height;
  exp.log[exp.trials.count].targetCenterX =
    exp.log[exp.trials.count].targetX +
    exp.targets[exp.trials.count].getBBox().width / 2;
  exp.log[exp.trials.count].targetCenterY =
    exp.log[exp.trials.count].targetY +
    exp.targets[exp.trials.count].getBBox().height / 2;

  // clicked on target?
  // NOTE: the SVG coord system starts with 0, 0 in upper left corner
  // for x: negative values mean too far left, positive values mean too far right
  // for y: negative values mean too high, positive values mean too low
  exp.log[exp.trials.count].clickDistFromTargetCenterX =
    exp.log[exp.trials.count].clickScaledX -
    exp.log[exp.trials.count].targetCenterX;
  exp.log[exp.trials.count].clickDistFromTargetCenterY =
    exp.log[exp.trials.count].clickScaledY -
    exp.log[exp.trials.count].targetCenterY;

  // did you click somewhere on the target?
  exp.log[exp.trials.count].hitBBTargetX = false;
  exp.log[exp.trials.count].hitBBTargetY = false;

  if (
    exp.log[exp.trials.count].targetX <=
      exp.log[exp.trials.count].clickScaledX &&
    exp.log[exp.trials.count].clickScaledX <=
      exp.log[exp.trials.count].targetX + exp.log[exp.trials.count].targetWidth
  ) {
    exp.log[exp.trials.count].hitBBTargetX = true;
  }
  if (
    exp.log[exp.trials.count].targetY <=
      exp.log[exp.trials.count].clickScaledY &&
    exp.log[exp.trials.count].clickScaledY <=
      exp.log[exp.trials.count].targetY + exp.log[exp.trials.count].targetHeight
  ) {
    exp.log[exp.trials.count].hitBBTargetY = true;
  }

  // calculate distance between click coords and target bounding box
  // for x axis
  if (exp.log[exp.trials.count].hitBBTargetX === true) {
    exp.log[exp.trials.count].clickDistFromTargetBBoxX = 0;
  } else if (
    exp.log[exp.trials.count].clickScaledX < exp.log[exp.trials.count].targetX
  ) {
    exp.log[exp.trials.count].clickDistFromTargetBBoxX =
      exp.log[exp.trials.count].clickScaledX -
      exp.log[exp.trials.count].targetX;
  } else if (
    exp.log[exp.trials.count].clickScaledX > exp.log[exp.trials.count].targetX
  ) {
    exp.log[exp.trials.count].clickDistFromTargetBBoxX =
      exp.log[exp.trials.count].clickScaledX -
      (exp.log[exp.trials.count].targetX +
        exp.log[exp.trials.count].targetWidth);
  }
  // for y axis
  if (exp.log[exp.trials.count].hitBBTargetY === true) {
    exp.log[exp.trials.count].clickDistFromTargetBBoxY = 0;
  } else if (
    exp.log[exp.trials.count].clickScaledY < exp.log[exp.trials.count].targetY
  ) {
    exp.log[exp.trials.count].clickDistFromTargetBBoxY =
      exp.log[exp.trials.count].clickScaledY -
      exp.log[exp.trials.count].targetY;
  } else if (
    exp.log[exp.trials.count].clickScaledY > exp.log[exp.trials.count].targetY
  ) {
    exp.log[exp.trials.count].clickDistFromTargetBBoxY =
      exp.log[exp.trials.count].clickScaledY -
      (exp.log[exp.trials.count].targetY +
        exp.log[exp.trials.count].targetHeight);
  }

  // save which area was clicked (either clickable-area or hedge)
  exp.log[exp.trials.count].clickedArea = event.currentTarget.id;

  // log all important trial infos
  exp.log[exp.trials.count].trialNr = exp.trials.count + 1;
  exp.log[exp.trials.count].agent = `${exp.agents[
    exp.trials.count
  ].getAttribute('id')}`;
  exp.log[exp.trials.count].target = `${exp.targets[
    exp.trials.count
  ].getAttribute('id')}`;
  exp.log[exp.trials.count].trialType = exp.trials.type[exp.trials.count];
  exp.log[exp.trials.count].voiceover = exp.trials.voiceover[exp.trials.count];

  exp.log[exp.trials.count].targetPosition =
    exp.positions[exp.trials.count].bin;

  exp.log[exp.trials.count].epoch = exp.log[exp.trials.count].responseTime.t1;
  exp.log[exp.trials.count].timestamp = new Date(
    parseInt(exp.log[exp.trials.count].responseTime.t1),
  ).toISOString();
  exp.log[exp.trials.count].responseTime =
    exp.log[exp.trials.count].responseTime.t1 -
    exp.log[exp.trials.count].responseTime.t0;

  exp.log[exp.trials.count].eyeRadius = parseFloat(
    exp.elemSpecs.eyes[exp.log[exp.trials.count].agent].radius,
  );
  exp.log[exp.trials.count].eyeCenterLeftX = parseFloat(
    exp.elemSpecs.eyes[exp.log[exp.trials.count].agent].left.center.x,
  );
  exp.log[exp.trials.count].eyeCenterLeftY = parseFloat(
    exp.elemSpecs.eyes[exp.log[exp.trials.count].agent].left.center.y,
  );
  exp.log[exp.trials.count].pupilFinalLeftX = parseFloat(
    exp.elemSpecs.eyes[exp.log[exp.trials.count].agent].left.final.x,
  );
  exp.log[exp.trials.count].pupilFinalLeftY = parseFloat(
    exp.elemSpecs.eyes[exp.log[exp.trials.count].agent].left.final.y,
  );
  exp.log[exp.trials.count].eyeCenterRightX = parseFloat(
    exp.elemSpecs.eyes[exp.log[exp.trials.count].agent].right.center.x,
  );
  exp.log[exp.trials.count].eyeCenterRightY = parseFloat(
    exp.elemSpecs.eyes[exp.log[exp.trials.count].agent].right.center.y,
  );
  exp.log[exp.trials.count].pupilFinalRightX = parseFloat(
    exp.elemSpecs.eyes[exp.log[exp.trials.count].agent].right.final.x,
  );
  exp.log[exp.trials.count].pupilFinalRightY = parseFloat(
    exp.elemSpecs.eyes[exp.log[exp.trials.count].agent].right.final.y,
  );
}
