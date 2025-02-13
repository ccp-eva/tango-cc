import { gsap } from 'gsap';
import { logResponse } from './logResponse';
import { pause } from './pause';
import { prepareTrial } from './prepareTrial';
import { animateTrial } from './animateTrial';
import { showTouchToFamSlide } from './showTouchToFamSlide';
import { showFamToTestSlide } from './showFamToTestSlide';
import { showGoodbyeSlide } from './showGoodbyeSlide';
/**
 * Function for when child locates the balloon, clicks on hedge
 *
 * @param {Object} exp - An object storing our experiment data
 *
 * @example
 *      handleTargetClick(exp)
 */
export async function handleTargetClick(event, exp) {
  // stop audio that is potentially playing
  exp.soundEffect.pause();

  // clear timer that awaits participant's click. otherwise, it will run even after target click
  clearTimeout(exp.targetClickTimer5sec);

  // function to save all relevant information
  await logResponse(event, exp);

  // so that we don't rush into next trial
  await pause(500);

  // prepare next trial
  exp.trial += 1;
  exp.state.shift();

  // then depending on experimental state, decide what happens next...
  switch (exp.state[0]) {
    // prepare next trials
    case 'touch':
    case 'fam':
    case 'test':
      prepareTrial(exp);
      exp.timeline = gsap.timeline({ paused: true });
      exp.timeline.add(animateTrial(exp));
      break;
    // ... or show text inbetween / after trials
    case 'transition':
      if (exp.state[1] === 'fam') showTouchToFamSlide(exp);
      if (exp.state[1] === 'test') showFamToTestSlide(exp);
      break;
    case 'goodbye':
      showGoodbyeSlide(exp);
      break;
  }
}
