import { showSlide } from './showSlide';
import { playFullAudio } from './playFullAudio';
import { pause } from './pause';
import { handleTargetClick } from './handleTargetClick';

import promptGeneralSrc from '../sounds/ger/prompt-general.mp3';
import promptHedgeSrc from '../sounds/ger/prompt-hedge.mp3';
import promptTouchSrc from '../sounds/ger/prompt-touch.mp3';
import promptTouchLongSrc from '../sounds/ger/prompt-touch-long.mp3';
import testHedge3Src from '../sounds/ger/test-hedge-3-m.mp3';

/**
 * Function for showing a trial, starts animation of eye & balloon movement.
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
      document.getElementById('experimentslide-button'),
      document.getElementById('cover-blurr'),
      document.getElementById('click-bubble'),
    ],
  );

  // animate balloon & eye movement to randomized positions
  await exp.timeline.play();
  await pause(200);

  // play audio prompts for clicking on the tablet:
  // for any trial without voiceover
  if (!exp.log[exp.trial].voiceover) {
    exp.soundEffect.src = promptGeneralSrc;
    exp.soundEffect.play();
  } else if (exp.state[0] === 'touch') {
    await playFullAudio(exp, promptTouchLongSrc);
  } else if (exp.state[0] === 'fam') {
    await playFullAudio(exp, promptHedgeSrc);
  } else if (exp.state[0] === 'test') {
    await playFullAudio(exp, testHedge3Src);
  }

  // runs if participant has not responded within 5 sec
  const noTargetClickWithin5sec = () => {
    if (exp.state[0] === 'touch') {
      exp.soundEffect.src = promptTouchSrc;
      exp.soundEffect.play();
    }
    if (exp.state[0] !== 'touch') {
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
  if (exp.state[0] === 'touch') {
    clickableArea.setAttribute('pointer-events', 'all');
    clickableArea.addEventListener(
      'click',
      async function () {
        await handleTargetClick(event, exp);
      },
      {
        capture: false,
        once: true,
      },
    );
  }

  // for trials with hedge, participants should click directly on there
  if (exp.state[0] === 'fam' || exp.state[0] === 'test') {
    clickableArea.setAttribute('pointer-events', 'none');

    hedge.addEventListener(
      'click',
      async function () {
        await handleTargetClick(event, exp);
      },
      {
        capture: false,
        once: true,
      },
    );
  }
}
