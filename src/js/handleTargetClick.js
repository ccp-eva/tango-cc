import { gsap } from 'gsap';
import { showSlide } from './showSlide';
import { logResponse } from './logResponse';
import { pause } from './pause';
import { prepareTrial } from './prepareTrial';
import { animateTrial } from './animateTrial';

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

  // then depending on trialcount, decide what happens next...
  // for touch trials
  if (exp.trial < exp.meta.nrTouch) {
    prepareTrial(exp);
    exp.timeline = gsap.timeline({ paused: true });
    exp.timeline.add(animateTrial(exp));
  }

  // // for transition from touching into familiarization
  // if (exp.trial === exp.meta.nrTouch) {
  //   document
  //     .getElementById('foreign-object-heading')
  //     .replaceChild(
  //       exp.txt.instructionsFamHeading,
  //       exp.txt.instructionsTouchHeading,
  //     );
  //   document
  //     .getElementById('foreign-object-center-left')
  //     .replaceChild(
  //       exp.txt.instructionsFamParagraph,
  //       exp.txt.instructionsTouchParagraph,
  //     );
  //   document
  //     .getElementById('foreign-object-center-right')
  //     .replaceChild(
  //       exp.txt.instructionsFamImage,
  //       exp.txt.instructionsTouchImage,
  //     );
  //   textslideButton.addEventListener('click', handleTransitionClick, {
  //     capture: false,
  //     once: true,
  //   });

  //   showSlide(
  //     [textslide, textslideButton],
  //     [
  //       experimentslide,
  //       hedge,
  //       female01,
  //       female02,
  //       female03,
  //       female04,
  //       male01,
  //       male02,
  //       male03,
  //       male04,
  //       balloonBlue,
  //       balloonGreen,
  //       balloonRed,
  //       balloonYellow,
  //       speaker,
  //     ],
  //   );
  // }

  // // for familiarization trials
  // if (exp.trial < exp.meta.nrTouch + exp.meta.nrFam) {
  //   prepareTrial(exp);
  //   exp.timeline = gsap.timeline({ paused: true });
  //   exp.timeline.add(animateTrial(exp));
  // }

  // // for transition from familiarization to test trials
  // if (exp.trial === exp.meta.nrTouch + exp.meta.nrFam) {
  //   document
  //     .getElementById('foreign-object-heading')
  //     .replaceChild(
  //       exp.txt.instructionsTestHeading,
  //       exp.txt.instructionsFamHeading,
  //     );
  //   document
  //     .getElementById('foreign-object-center-left')
  //     .replaceChild(
  //       exp.txt.instructionsTestParagraph,
  //       exp.txt.instructionsFamParagraph,
  //     );
  //   document
  //     .getElementById('foreign-object-center-right')
  //     .replaceChild(
  //       exp.txt.instructionsTestImage,
  //       exp.txt.instructionsFamImage,
  //     );
  //   textslideButton.addEventListener('click', handleTransitionClick, {
  //     capture: false,
  //     once: true,
  //   });

  //   showSlide(
  //     [textslide, textslideButton],
  //     [
  //       experimentslide,
  //       hedge,
  //       female01,
  //       female02,
  //       female03,
  //       female04,
  //       male01,
  //       male02,
  //       male03,
  //       male04,
  //       balloonBlue,
  //       balloonGreen,
  //       balloonRed,
  //       balloonYellow,
  //       speaker,
  //     ],
  //   );
  // }

  // // for test trials
  // if (exp.trial < exp.meta.trialsTotal) {
  //   prepareTrial(exp);
  //   exp.timeline = gsap.timeline({ paused: true });
  //   exp.timeline.add(animateTrial(exp));
  // }

  // // for goodbye after test trials
  // if (exp.trial === exp.meta.trialsTotal) {
  //   // hide everything
  //   showSlide(
  //     [],
  //     [
  //       experimentslide,
  //       hedge,
  //       female01,
  //       female02,
  //       female03,
  //       female04,
  //       male01,
  //       male02,
  //       male03,
  //       male04,
  //       balloonBlue,
  //       balloonGreen,
  //       balloonRed,
  //       balloonYellow,
  //       textslideButton,
  //     ],
  //   );

  //   // save data, download locally
  //   if (!exp.devmode) downloadData(exp.log, exp.meta.subjID);
  //   // save the video locally
  //   if (!exp.meta.iOSSafari && exp.meta.webcam) {
  //     mrec.stopRecorder();
  //     // give some time to create Video Blob
  //     const day = new Date().toISOString().substr(0, 10);
  //     const time = new Date().toISOString().substr(11, 8);
  //     setTimeout(
  //       () => mrec.downloadVideo(`gafo-${exp.meta.subjID}-${day}-${time}`),
  //       1000,
  //     );
  //   }
  //   document
  //     .getElementById('foreign-object-heading')
  //     .replaceChild(exp.txt.goodbyeHeading, exp.txt.instructionsTestHeading);
  //   document
  //     .getElementById('foreign-object-center-left')
  //     .replaceChild(
  //       exp.txt.goodbyeParagraph,
  //       exp.txt.instructionsTestParagraph,
  //     );
  //   document
  //     .getElementById('foreign-object-center-right')
  //     .replaceChild(exp.txt.familyImage, exp.txt.instructionsTestImage);
  //   textslideButton.addEventListener('click', handleGoodbyeClick, {
  //     capture: false,
  //     once: true,
  //   });

  //   showSlide(
  //     [textslide, speaker, textslideButton],
  //     [
  //       experimentslide,
  //       hedge,
  //       female01,
  //       female02,
  //       female03,
  //       female04,
  //       male01,
  //       male02,
  //       male03,
  //       male04,
  //       balloonBlue,
  //       balloonGreen,
  //       balloonRed,
  //       balloonYellow,
  //     ],
  //   );
  // }
}
