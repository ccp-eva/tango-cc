/* eslint-disable no-case-declarations */
import { gsap } from 'gsap';

import touch1SrcF from '../sounds/ger/touch-1-f.mp3';
import touch1SrcM from '../sounds/ger/touch-1-m.mp3';
import famHedge1SrcF from '../sounds/ger/fam-hedge-1-f.mp3';
import famHedge1SrcM from '../sounds/ger/fam-hedge-1-m.mp3';
import testHedge1SrcF from '../sounds/ger/test-hedge-1-f.mp3';
import testHedge1SrcM from '../sounds/ger/test-hedge-1-m.mp3';
import testHedge2SrcF from '../sounds/ger/test-hedge-2-f.mp3';
import testHedge2SrcM from '../sounds/ger/test-hedge-2-m.mp3';
import testHedge3SrcF from '../sounds/ger/test-hedge-3-f.mp3';
import testHedge3SrcM from '../sounds/ger/test-hedge-3-m.mp3';
import blinkSrc from '../sounds/ger/blink.mp3';
import balloonLandsSrc from '../sounds/ger/balloon-lands.mp3';

import { playFullAudio } from './playFullAudio';
import { playAudio } from './playAudio';

/**
 * Function for animating balloon, eyes & hedge in a given trial.
 *
 * @param {Object} exp - An object storing our experiment data
 * @return {object} GSAP timeline object
 *
 * @example
 *     animateTrial(exp)
 */
export function animateTrial(exp) {
  // voice over settings
  let touch1Src;
  let famHedge1Src;
  let testHedge1Src;
  let testHedge2Src;
  let testHedge3Src;

  switch (exp.meta.firstVoiceover) {
    case 'F':
      touch1Src = touch1SrcF;
      famHedge1Src = famHedge1SrcM;
      testHedge1Src = testHedge1SrcM;
      testHedge2Src = testHedge2SrcM;
      testHedge3Src = testHedge3SrcM;
      break;
    case 'M':
      touch1Src = touch1SrcM;
      famHedge1Src = famHedge1SrcF;
      testHedge1Src = testHedge1SrcF;
      testHedge2Src = testHedge2SrcF;
      testHedge3Src = testHedge3SrcF;
      break;
    default:
      console.log('error in importing sounds');
  }

  // get relevant elements
  const currentAgent = `${exp.agents[exp.trial].getAttribute('id')}`;
  const pupilLeft = document.getElementById(`${currentAgent}-pupil-left`);
  const pupilRight = document.getElementById(`${currentAgent}-pupil-right`);
  const irisLeft = document.getElementById(`${currentAgent}-iris-left`);
  const irisRight = document.getElementById(`${currentAgent}-iris-right`);
  const hedge = document.getElementById('hedge');

  // we use gsap3 for animation
  const timeline = gsap.timeline({ paused: true });
  // general delay
  const delay = 0.5;
  const hedgeDuration = 0.2;

  // -------------------------------------------------------------------------------------------------------------------
  // define common movements/ animations
  // -------------------------------------------------------------------------------------------------------------------
  const attentionGetter = gsap.timeline({ paused: true });
  attentionGetter
    .to(
      [pupilLeft, pupilRight, irisLeft, irisRight],
      {
        scale: 1.3,
        opacity: 0.75,
        duration: 0.3,
        transformOrigin: '50% 50%',
        onStart: async function onStart() {
          await playFullAudio(exp, blinkSrc);
          // already set source for balloon landing here, so that sound is already preloaded
          exp.soundEffect.src = balloonLandsSrc;
        },
      },
      '<',
    )
    .set([exp.agents[exp.trial], pupilLeft, pupilRight, irisLeft, irisRight], {
      scale: 1,
      opacity: 1,
    });

  const ballonToGround = gsap.timeline({ paused: true });
  ballonToGround
    .to(exp.targets[exp.trial], {
      duration: exp.log[exp.trial].durationAnimationBalloonTotal,
      ease: 'none',
      x: exp.elemSpecs.targets.centerFinal.x,
      y: exp.elemSpecs.targets.centerFinal.y,
    })
    .to(
      [pupilLeft, irisLeft],
      {
        duration: exp.log[exp.trial].durationAnimationBalloonTotal,
        ease: 'none',
        x: exp.elemSpecs.eyes[currentAgent].left.centerFinal.x,
        y: exp.elemSpecs.eyes[currentAgent].left.centerFinal.y,
      },
      '<',
    )
    .to(
      [pupilRight, irisRight],
      {
        duration: exp.log[exp.trial].durationAnimationBalloonTotal,
        ease: 'none',
        x: exp.elemSpecs.eyes[currentAgent].right.centerFinal.x,
        y: exp.elemSpecs.eyes[currentAgent].right.centerFinal.y,
        onComplete() {
          exp.soundEffect.play();
        },
      },
      '<',
    );

  // -------------------------------------------------------------------------------------------------------------------
  // define animation depending on trial type
  // -------------------------------------------------------------------------------------------------------------------
  // TOUCH TRIALS
  if (exp.trials.type[exp.trial] === 'touch') {
    // for instructions voice over
    if (exp.trials.voiceover[exp.trial]) {
      timeline.eventCallback('onStart', playAudio, [exp, touch1Src]);
      attentionGetter.delay(exp.elemSpecs.animAudioDur[touch1Src] + delay);
    }
    attentionGetter.play();
    ballonToGround.play();
    timeline
      .add(attentionGetter, `+=${delay}`)
      .add(ballonToGround, `+=${delay}`);
  }

  // FAM TRIALS
  if (exp.trials.type[exp.trial] === 'fam') {
    const hedgeSetHalfWay = gsap.set(hedge, {
      y: hedge.getBBox().height - exp.targets[exp.trial].getBBox().height - 75,
    });

    if (exp.trials.voiceover[exp.trial]) {
      timeline.eventCallback('onStart', playAudio, [exp, famHedge1Src]);
      attentionGetter.delay(exp.elemSpecs.animAudioDur[famHedge1Src] + delay);
    }
    attentionGetter.play();
    ballonToGround.play();

    timeline
      .add(hedgeSetHalfWay)
      .add(attentionGetter, `+=${delay}`)
      .add(ballonToGround, `+=${delay}`);
  }

  // TEST TRIALS
  if (exp.trials.type[exp.trial] === 'test') {
    const hedgeHalfDown = gsap.to(hedge, {
      y: hedge.getBBox().height - exp.targets[exp.trial].getBBox().height - 75,
      duration: hedgeDuration,
      ease: 'none',
    });

    const hedgeUp = gsap.fromTo(
      hedge,
      {
        y:
          hedge.getBBox().height - exp.targets[exp.trial].getBBox().height - 75,
      },
      {
        y: 0,
        duration: hedgeDuration,
        ease: 'none',
      },
    );

    if (exp.trials.voiceover[exp.trial]) {
      timeline.eventCallback('onStart', playAudio, [exp, testHedge1Src]);
      hedgeUp.delay(exp.elemSpecs.animAudioDur[testHedge1Src] + delay);
      hedgeUp.eventCallback('onComplete', playAudio, [exp, testHedge2Src]);
      attentionGetter.delay(exp.elemSpecs.animAudioDur[testHedge2Src] + delay);
    }
    hedgeUp.play();
    attentionGetter.play();
    ballonToGround.play();
    hedgeHalfDown.play();

    timeline
      .add(hedgeUp, `+=${delay}`)
      .add(attentionGetter, `+=${delay}`)
      .add(ballonToGround, `+=${delay}`)
      .add(hedgeHalfDown, `+=${delay}`);
  }

  timeline.play();
  return timeline;
}
