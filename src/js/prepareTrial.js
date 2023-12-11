import { gsap } from 'gsap';
import { getGazeCoords } from './getGazeCoords';
import { showSlide } from './showSlide';
import { startTrial } from './startTrial';
import { animateTrial } from './animateTrial';

/**
 * Function that prepares a given trial,
 * i.e., calculate all relevant variables, show/hide elements.
 * Calls function "getGazeCoords" to calculate pupil locations.
 *
 * @param {Object} exp - An object storing our experiment data
 *
 * @example
 *     prepareTrial(exp)
 */
export function prepareTrial(exp) {
  const button = document.getElementById('experimentslide-button');

  // show blurred canvas and button
  showSlide([button, document.getElementById('cover-blurr')], []);

  if (exp.trial === 0) {
    showSlide(
      [
        document.getElementById(`${exp.log[exp.trial].agent}`),
        document.getElementById(`${exp.log[exp.trial].target}`),
      ],
      [],
    );
  }

  switch (exp.meta.bg) {
    case 'bg01':
      gsap.set([window01, wall01], { attr: { visibility: 'visible' } });
      break;
    case 'bg02':
      gsap.set([window02, wall02], { attr: { visibility: 'visible' } });
      break;
    case 'bg03':
      gsap.set([window03, wall03], { attr: { visibility: 'visible' } });
      break;
    case 'bg04':
      gsap.set([window04, wall04], { attr: { visibility: 'visible' } });
      break;
  }

  // show agent and target of the current trial only, hide the last
  if (exp.trial > 0) {
    showSlide(
      [
        document.getElementById(`${exp.log[exp.trial].agent}`),
        document.getElementById(`${exp.log[exp.trial].target}`),
      ],
      [
        document.getElementById(`${exp.log[exp.trial - 1].agent}`),
        document.getElementById(`${exp.log[exp.trial - 1].target}`),
      ],
    );
  }

  // get relevant elements
  const currentAgent = exp.log[exp.trial].agent;
  const pupilLeft = document.getElementById(`${currentAgent}-pupil-left`);
  const pupilRight = document.getElementById(`${currentAgent}-pupil-right`);
  const irisLeft = document.getElementById(`${currentAgent}-iris-left`);
  const irisRight = document.getElementById(`${currentAgent}-iris-right`);
  const eyelineLeft = document.getElementById(`${currentAgent}-eyeline-left`);
  const eyelineRight = document.getElementById(`${currentAgent}-eyeline-right`);
  const hedge = document.getElementById('hedge');

  // set eyes to center
  // original value stored in e.g. pupilLeft.getBBox().x but we just need to remove the transform attribute
  gsap.set(
    [
      pupilLeft,
      pupilRight,
      irisLeft,
      irisRight,
      hedge,
      exp.log[exp.trial].target,
    ],
    {
      x: 0,
      y: 0,
    },
  );

  if (exp.state[0] === 'touch') {
    showSlide([], [hedge]);
  } else {
    showSlide([hedge], []);
  }

  // calculate how far the balloon will fly
  exp.elemSpecs.targets.centerFinal = {
    x: exp.log[exp.trial].targetX - exp.elemSpecs.targets.center.x,
    y: exp.log[exp.trial].targetY - exp.elemSpecs.targets.center.y,
  };

  // calculate where eyes should move in the trial
  const gazeCoordsLeft = getGazeCoords(
    document.getElementById(`${exp.log[exp.trial].target}`),
    { x: exp.log[exp.trial].targetX, y: exp.log[exp.trial].targetY },
    pupilLeft,
    eyelineLeft,
  );

  exp.elemSpecs.eyes[currentAgent].left.final = gazeCoordsLeft;

  exp.elemSpecs.eyes[currentAgent].left.centerFinal = {
    x: gazeCoordsLeft.x - exp.elemSpecs.eyes[currentAgent].left.center.x,
    y: gazeCoordsLeft.y - exp.elemSpecs.eyes[currentAgent].left.center.y,
  };

  const gazeCoordsRight = getGazeCoords(
    document.getElementById(`${exp.log[exp.trial].target}`),
    { x: exp.log[exp.trial].targetX, y: exp.log[exp.trial].targetY },
    pupilRight,
    eyelineRight,
  );

  exp.elemSpecs.eyes[currentAgent].right.final = gazeCoordsRight;

  exp.elemSpecs.eyes[currentAgent].right.centerFinal = {
    x: gazeCoordsRight.x - exp.elemSpecs.eyes[currentAgent].right.center.x,
    y: gazeCoordsRight.y - exp.elemSpecs.eyes[currentAgent].right.center.y,
  };

  // gsap exp.timeline that will save our animation specifications
  exp.timeline = gsap.timeline({ paused: true });
  exp.timeline.add(animateTrial(exp));

  // attach eventListener to experimentslide button
  button.addEventListener(
    'click',
    // needs to be within unnamed function because otherwise directly called & "skips" welcome content
    function () {
      startTrial(exp);
    },
    {
      capture: false,
      once: true,
    },
  );
}
