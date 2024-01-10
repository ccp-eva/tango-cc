import { gsap } from 'gsap';
import { playFullAudio } from './playFullAudio';
import { playAudio } from './playAudio';
import { distancePoints } from './distancePoints';

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

  // depending on which gender the current agent has, set audio
  if (exp.log[exp.trial].agent.startsWith('female')) {
    touch1Src = `./sounds/${exp.meta.lang}/touch-1-f.mp3`;
    famHedge1Src = `./sounds/${exp.meta.lang}/fam-hedge-1-f.mp3`;
    testHedge1Src = `./sounds/${exp.meta.lang}/test-hedge-1-f.mp3`;
    testHedge2Src = `./sounds/${exp.meta.lang}/test-hedge-2-f.mp3`;
    testHedge3Src = `./sounds/${exp.meta.lang}/test-hedge-3-f.mp3`;
  } else if (exp.log[exp.trial].agent.startsWith('male')) {
    touch1Src = `./sounds/${exp.meta.lang}/touch-1-m.mp3`;
    famHedge1Src = `./sounds/${exp.meta.lang}/fam-hedge-1-m.mp3`;
    testHedge1Src = `./sounds/${exp.meta.lang}/test-hedge-1-m.mp3`;
    testHedge2Src = `./sounds/${exp.meta.lang}/test-hedge-2-m.mp3`;
    testHedge3Src = `./sounds/${exp.meta.lang}/test-hedge-3-m.mp3`;
  }

  // get relevant elements
  const currentTarget = document.getElementById(`${exp.log[exp.trial].target}`);
  const currentAgent = exp.log[exp.trial].agent;
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

  // calculate distance between center and target position, for constant speed
  const distanceCenterFinal = distancePoints(exp.elemSpecs.targets.center, {
    x: exp.log[exp.trial].targetX,
    y: exp.log[exp.trial].targetY,
  });

  const perSecond = 700;

  // save animation speed in our exp object
  const durationAnimationBalloonTotal = distanceCenterFinal / perSecond;

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
          await playFullAudio(exp, `./sounds/${exp.meta.lang}/blink.mp3`);
          // already set source for balloon landing here, so that sound is already preloaded
          exp.soundEffect.src = `./sounds/${exp.meta.lang}/balloon-lands.mp3`;
        },
      },
      '<',
    )
    .set(
      [exp.log[exp.trial].agent, pupilLeft, pupilRight, irisLeft, irisRight],
      {
        scale: 1,
        opacity: 1,
      },
    );

  const ballonToGround = gsap.timeline({ paused: true });
  ballonToGround
    .to(currentTarget, {
      duration: durationAnimationBalloonTotal,
      ease: 'none',
      x: exp.elemSpecs.targets.centerFinal.x,
      y: exp.elemSpecs.targets.centerFinal.y,
    })
    .to(
      [pupilLeft, irisLeft],
      {
        duration: durationAnimationBalloonTotal,
        ease: 'none',
        x: exp.elemSpecs.eyes[currentAgent].left.centerFinal.x,
        y: exp.elemSpecs.eyes[currentAgent].left.centerFinal.y,
      },
      '<',
    )
    .to(
      [pupilRight, irisRight],
      {
        duration: durationAnimationBalloonTotal,
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
  if (exp.state[0] === 'touch') {
    // for instructions voice over
    if (exp.log[exp.trial].voiceover) {
      timeline.eventCallback('onStart', playAudio, [exp, touch1Src]);
      attentionGetter.delay(exp.elemSpecs.audioDur[touch1Src] + delay);
    }
    attentionGetter.play();
    ballonToGround.play();
    timeline
      .add(attentionGetter, `+=${delay}`)
      .add(ballonToGround, `+=${delay}`);
  }

  // FAM TRIALS
  if (exp.state[0] === 'fam') {
    const hedgeSetHalfWay = gsap.set(hedge, {
      y: hedge.getBBox().height - exp.elemSpecs.targets.height - 75,
    });

    if (exp.log[exp.trial].voiceover) {
      timeline.eventCallback('onStart', playAudio, [exp, famHedge1Src]);
      attentionGetter.delay(exp.elemSpecs.audioDur[famHedge1Src] + delay);
    }
    attentionGetter.play();
    ballonToGround.play();

    timeline
      .add(hedgeSetHalfWay)
      .add(attentionGetter, `+=${delay}`)
      .add(ballonToGround, `+=${delay}`);
  }

  // TEST TRIALS
  if (exp.state[0] === 'test') {
    const hedgeHalfDown = gsap.to(hedge, {
      y: hedge.getBBox().height - exp.elemSpecs.targets.height - 75,
      duration: hedgeDuration,
      ease: 'none',
    });

    const hedgeUp = gsap.fromTo(
      hedge,
      {
        y: hedge.getBBox().height - exp.elemSpecs.targets.height - 75,
      },
      {
        y: 0,
        duration: hedgeDuration,
        ease: 'none',
      },
    );

    if (exp.log[exp.trial].voiceover) {
      timeline.eventCallback('onStart', playAudio, [exp, testHedge1Src]);
      hedgeUp.delay(exp.elemSpecs.audioDur[testHedge1Src] + delay);
      hedgeUp.eventCallback('onComplete', playAudio, [exp, testHedge2Src]);
      attentionGetter.delay(exp.elemSpecs.audioDur[testHedge2Src] + delay);
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
