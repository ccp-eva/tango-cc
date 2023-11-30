import { showSlide } from './showSlide';
import { playFullAudio } from './playFullAudio';
import { pause } from './pause';

import promptGeneralSrc from '../sounds/ger/prompt-general.mp3';
import promptHedgeSrc from '../sounds/ger/prompt-hedge.mp3';
import promptTouchSrc from '../sounds/ger/prompt-touch.mp3';
import promptTouchLongSrc from '../sounds/ger/prompt-touch-long.mp3';

/**
 * Function for showing a trial.
 *
 * @param {Object} exp - An object storing our experiment data
 *
 * @example
 *     startTrial(exp)
 */
export async function startTrial(exp) {
  if (exp.devmode) console.log('trial: ', exp.trial);

  // hide blurr canvas and button, so that stimuli are visible
  showSlide(
    [],
    [
      document.getElementById('experimentslideButton'),
      document.getElementById('cover-blurr'),
    ],
  );

  // animate balloon & eye movement to randomized positions
  await exp.timeline.play();
  await pause(200);

  // play audio prompts for clicking on the tablet:
  // for any trial without voiceover
  if (!exp.trials.voiceover[exp.trial]) {
    exp.soundEffect.src = promptGeneralSrc;
    exp.soundEffect.play();
  }

  // for touch trials with voiceover
  if (exp.trials.type[exp.trial] === 'touch') {
    await playFullAudio(exp, promptTouchLongSrc);
  }

  // for fam trials with voiceover
  if (exp.trials.type[exp.trial] === 'fam') {
    await playFullAudio(exp, promptHedgeSrc);
  }

  // for test trials with voiceover
  if (exp.trials.type[exp.trial] === 'test') {
    await playFullAudio(exp, testHedge3Src);
  }

  // save current time to calculate response time later
  exp.log[exp.trial].responseTime = {
    t0: new Date().getTime(),
    t1: 0,
  };

  // runs if participant has not responded within 5 sec
  const noTargetClickWithin5sec = () => {
    if (exp.trials.type[exp.trial] === 'touch') {
      exp.soundEffect.src = promptTouchSrc;
      exp.soundEffect.play();
    }
    if (exp.trials.type[exp.trial] !== 'touch') {
      exp.soundEffect.src = promptHedgeSrc;
      exp.soundEffect.play();
    }
  };

  exp.targetClickTimer5sec = window.setTimeout(noTargetClickWithin5sec, 5000);

  // add eventlisteners so that participants can respond
  // first, get elements
  const clickableArea = document.getElementById('clickable-area');
  const hedge = document.getElementById('hedge');

  // for touch trials, participants can click in clickable area (size of hedge)
  if (exp.trials.type[exp.trial] === 'touch') {
    clickableArea.setAttribute('pointer-events', 'all');
    clickableArea.addEventListener('click', handleTargetClick, {
      capture: false,
      once: true,
    });
  }

  // for trials with hedge, participants should click directly on there
  if (exp.trials.boxesNr[exp.trial] === 0) {
    clickableArea.setAttribute('pointer-events', 'none');
    hedge.addEventListener('click', handleTargetClick, {
      capture: false,
      once: true,
    });
  }
}
