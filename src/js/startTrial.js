import { showSlide } from './showSlide';
import { playAudio } from './playAudio';
import { playFullAudio } from './playFullAudio';
import { pause } from './pause';
import { handleTargetClick } from './handleTargetClick';

/**
 * Function for showing a trial, starts animation of eye & balloon movement.
 *
 * @param {Object} exp - An object storing our experiment data
 *
 * @example
 *     startTrial(exp)
 */
export async function startTrial(exp) {
  if (exp.devmode) console.log('trial: ', exp.trial + 1);

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
    playAudio(exp, `./sounds/${exp.meta.lang}/prompt-general.mp3`);
  } else if (exp.state[0] === 'touch') {
    await playFullAudio(exp, `./sounds/${exp.meta.lang}/prompt-touch-long.mp3`);
  } else if (exp.state[0] === 'fam') {
    await playFullAudio(exp, `./sounds/${exp.meta.lang}/prompt-hedge.mp3`);
  } else if (exp.state[0] === 'test') {
    await playFullAudio(exp, `./sounds/${exp.meta.lang}/test-hedge-3-m.mp3`);
  }

  // runs if participant has not responded within 5 sec
  const noTargetClickWithin5sec = () => {
    if (exp.state[0] === 'touch') {
      playAudio(exp, `./sounds/${exp.meta.lang}/prompt-touch.mp3`);
    }
    if (exp.state[0] !== 'touch') {
      playAudio(exp, `./sounds/${exp.meta.lang}/prompt-hedge.mp3`);
    }
  };

  exp.targetClickTimer5sec = window.setTimeout(noTargetClickWithin5sec, 5000);

  // add timestamp
  exp.log[exp.trial].timeTrialstart = Date.now();

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
