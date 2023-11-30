import { gsap } from 'gsap';
import * as mrec from '@ccp-eva/media-recorder';

import './css/tango.css';
import tangoSVG from './images/tango.svg';

// import self-written functions
import { animateTrial } from './js/animateTrial';
import { closeFullscreen } from './js/closeFullscreen';
import { downloadData } from './js/downloadData';
import { experimentalInstructions } from './js/experimentalInstructions';
import { logResponse } from './js/logResponse';
import { openFullscreen } from './js/openFullscreen';
import { pause } from './js/pause';
import { prepareTrial } from './js/prepareTrial';
import { randomizeTrials } from './js/randomizeTrials';
import { showSlide } from './js/showSlide';

// depending on training trial order (agent's gender)
// these, we need in our animation function. here, we'll calculate duration
import touch1SrcF from './sounds/ger/touch-1-f.mp3';
import touch1SrcM from './sounds/ger/touch-1-m.mp3';
import famHedge1SrcF from './sounds/ger/fam-hedge-1-f.mp3';
import famHedge1SrcM from './sounds/ger/fam-hedge-1-m.mp3';
import testHedge1SrcF from './sounds/ger/test-hedge-1-f.mp3';
import testHedge1SrcM from './sounds/ger/test-hedge-1-m.mp3';
import testHedge2SrcF from './sounds/ger/test-hedge-2-f.mp3';
import testHedge2SrcM from './sounds/ger/test-hedge-2-m.mp3';
import testHedge3SrcF from './sounds/ger/test-hedge-3-f.mp3';
import testHedge3SrcM from './sounds/ger/test-hedge-3-m.mp3';

import { initWindowFunctionality } from './js/initWindowFunctionality';
import { initDatastructure } from './js/initDatastructure';
import { initStimuli } from './js/initStimuli';
import { initAudio } from './js/initAudio';
import { startTrial } from './js/startTrial';
import { handleSpeakerClick } from './js/handleSpeakerClick';
import { showWelcomeSlide } from './js/showWelcomeSlide';

// ---------------------------------------------------------------------------------------------------------------------
// INITIALIZATION
// ---------------------------------------------------------------------------------------------------------------------
// create "exp" object, in which we store all variables, participant responses, measurements
const exp = initDatastructure();

// checks for screen orientation & enables download functions globally
initWindowFunctionality(exp);

// import experiment SVG
const tangoSVGdiv = document.getElementById('tango-svg');
tangoSVGdiv.innerHTML = `${tangoSVG}`;

exp.txt = experimentalInstructions(exp);

// show selected faces, hide others, save original eye positions, enable text via foreignObjects
initStimuli(exp);

// save durations of audio files and enable Audio element for future use
initAudio(exp);

if (exp.devmode) console.log(exp);

// ---------------------------------------------------------------------------------------------------------------------
// RANDOMIZATION OF AGENTS, TARGETS AND TARGET POSITIONS
// ---------------------------------------------------------------------------------------------------------------------
// create arrays with agents, targets, positions etc. for all the trials
// randomizeTrials(exp, agentsSingle, targetsSingle);

// gsap exp.timeline that will save our animation specifications
exp.timeline = gsap.timeline({ paused: true });
exp.targetClickTimer5sec = null;

// ---------------------------------------------------------------------------------------------------------------------
// WELCOME SLIDE
// ---------------------------------------------------------------------------------------------------------------------
showWelcomeSlide(exp); // in here, prepare famA

// // ---------------------------------------------------------------------------------------------------------------------
// // RUNS WHEN TRANSITION BUTTON IS CLICKED (between touch, fam and test trials)
// // ---------------------------------------------------------------------------------------------------------------------
// const handleTransitionClick = (event) => {
//   event.preventDefault();

//   showSlide(
//     [experimentslide],
//     [textslide, textslideButton, clickBubble, speaker],
//   );

//   prepareTrial(exp);
//   exp.timeline = gsap.exp.timeline({ paused: true });
//   exp.timeline.add(animateTrial(exp));
//   exp.log[exp.trial].durationAnimationComplete = exp.timeline.duration();
// };

// // ---------------------------------------------------------------------------------------------------------------------
// // RUNS WHEN GOODBYE BUTTON IS CLICKED
// // ---------------------------------------------------------------------------------------------------------------------
// const handleGoodbyeClick = async function tmp(event) {
//   event.preventDefault();

//   // pause audio
//   exp.soundEffect.pause();
//   exp.soundEffect.currentTime = 0;

//   // disable fullscreen mode
//   if (!exp.devmode) {
//     closeFullscreen();
//   }

//   window.location.replace(`./goodbye.html?ID=${exp.meta.subjID}`);
// };

// // ---------------------------------------------------------------------------------------------------------------------
// // RUNS WHEN TARGET (HEDGE OR BOX) IS CLICKED
// // ---------------------------------------------------------------------------------------------------------------------
// // async so we can await animation!
// const handleTargetClick = async function tmp(event) {
//   // stop audio that is potentially playing
//   exp.soundEffect.pause();
//   exp.soundEffect.currentTime = 0;

//   // we save current time, so that we can calculate response time
//   exp.log[exp.trial].responseTime.t1 = new Date().getTime();

//   // clear timer that awaits participant's click
//   // otherwise, it will run even after target click
//   clearTimeout(exp.targetClickTimer5sec);

//   // remove eventListener that was responsible for "wrong input" sound
//   exp.elemSpecs.outerSVG.ID.removeEventListener(
//     'click',
//     handleWrongAreaClick,
//     false,
//   );
//   event.preventDefault();

//   // function to save all relevant information
//   logResponse(event, exp);
//   if (exp.devmode) console.log('responseLog: ', exp.log[exp.trial]);

//   // so that we don't rush into next trial
//   await pause(500);

//   // prepare next trial
//   exp.trial += 1;

//   // then depending on trialcount, decide what happens next...
//   // for touch trials
//   if (exp.trial < exp.trials.touchNr) {
//     prepareTrial(exp);
//     exp.timeline = gsap.exp.timeline({ paused: true });
//     exp.timeline.add(animateTrial(exp));
//     exp.log[exp.trial].durationAnimationComplete = exp.timeline.duration();

//     // for transition from touching into familiarization
//   } else if (exp.trial === exp.trials.touchNr) {
//     document
//       .getElementById('foreign-object-heading')
//       .replaceChild(
//         exp.txt.instructionsFamHeading,
//         exp.txt.instructionsTouchHeading,
//       );
//     document
//       .getElementById('foreign-object-center-left')
//       .replaceChild(
//         exp.txt.instructionsFamParagraph,
//         exp.txt.instructionsTouchParagraph,
//       );
//     document
//       .getElementById('foreign-object-center-right')
//       .replaceChild(
//         exp.txt.instructionsFamImage,
//         exp.txt.instructionsTouchImage,
//       );

//     textslideButton.addEventListener('click', handleTransitionClick, {
//       capture: false,
//       once: true,
//     });

//     showSlide(
//       [textslide, textslideButton],
//       [
//         experimentslide,
//         hedge,
//         female01,
//         female02,
//         female03,
//         female04,
//         male01,
//         male02,
//         male03,
//         male04,
//         balloonBlue,
//         balloonGreen,
//         balloonRed,
//         balloonYellow,
//         speaker,
//       ],
//     );

//     // if last trial had boxes, then hide them!
//     if (exp.trials.boxesNr[exp.trial - 1] > 0) {
//       const boxesCurrentFront = document.querySelector(
//         `[id$= "boxes${exp.trials.boxesNr[exp.trial - 1]}-front"]`,
//       );
//       const boxesCurrentBack = document.querySelector(
//         `[id$= "boxes${exp.trials.boxesNr[exp.trial - 1]}-back"]`,
//       );
//       showSlide([], [boxesCurrentFront, boxesCurrentBack]);
//     }

//     // for familiarization trials
//   } else if (exp.trial < exp.trials.touchNr + exp.trials.famNr) {
//     prepareTrial(exp);
//     exp.timeline = gsap.exp.timeline({ paused: true });
//     exp.timeline.add(animateTrial(exp));
//     exp.log[exp.trial].durationAnimationComplete = exp.timeline.duration();

//     // for transition from familiarization to test trials
//   } else if (exp.trial === exp.trials.touchNr + exp.trials.famNr) {
//     document
//       .getElementById('foreign-object-heading')
//       .replaceChild(
//         exp.txt.instructionsTestHeading,
//         exp.txt.instructionsFamHeading,
//       );
//     document
//       .getElementById('foreign-object-center-left')
//       .replaceChild(
//         exp.txt.instructionsTestParagraph,
//         exp.txt.instructionsFamParagraph,
//       );
//     document
//       .getElementById('foreign-object-center-right')
//       .replaceChild(
//         exp.txt.instructionsTestImage,
//         exp.txt.instructionsFamImage,
//       );

//     textslideButton.addEventListener('click', handleTransitionClick, {
//       capture: false,
//       once: true,
//     });

//     showSlide(
//       [textslide, textslideButton],
//       [
//         experimentslide,
//         hedge,
//         female01,
//         female02,
//         female03,
//         female04,
//         male01,
//         male02,
//         male03,
//         male04,
//         balloonBlue,
//         balloonGreen,
//         balloonRed,
//         balloonYellow,
//         speaker,
//       ],
//     );

//     // if last trial had boxes, then hide them!
//     if (exp.trials.boxesNr[exp.trial - 1] > 0) {
//       const boxesCurrentFront = document.querySelector(
//         `[id$= "boxes${exp.trials.boxesNr[exp.trial - 1]}-front"]`,
//       );
//       const boxesCurrentBack = document.querySelector(
//         `[id$= "boxes${exp.trials.boxesNr[exp.trial - 1]}-back"]`,
//       );
//       showSlide([], [boxesCurrentFront, boxesCurrentBack]);
//     }

//     // for test trials
//   } else if (exp.trial < exp.trials.totalNr) {
//     prepareTrial(exp);
//     exp.timeline = gsap.exp.timeline({ paused: true });
//     exp.timeline.add(animateTrial(exp));
//     exp.log[exp.trial].durationAnimationComplete = exp.timeline.duration();

//     // for goodbye after test trials
//   } else if (exp.trial === exp.trials.totalNr) {
//     // hide everything
//     showSlide(
//       [],
//       [
//         experimentslide,
//         hedge,
//         female01,
//         female02,
//         female03,
//         female04,
//         male01,
//         male02,
//         male03,
//         male04,
//         balloonBlue,
//         balloonGreen,
//         balloonRed,
//         balloonYellow,
//         textslideButton,
//       ],
//     );

//     // if last trial had boxes, then hide them!
//     if (exp.trials.boxesNr[exp.trial - 1] > 0) {
//       const boxesCurrentFront = document.querySelector(
//         `[id$= "boxes${exp.trials.boxesNr[exp.trial - 1]}-front"]`,
//       );
//       const boxesCurrentBack = document.querySelector(
//         `[id$= "boxes${exp.trials.boxesNr[exp.trial - 1]}-back"]`,
//       );
//       showSlide([], [boxesCurrentFront, boxesCurrentBack]);
//     }

//     // save data, download locally
//     if (!exp.devmode) downloadData(exp.log, exp.meta.subjID);

//     // save the video locally
//     if (!exp.meta.iOSSafari && exp.meta.webcam) {
//       mrec.stopRecorder();

//       // give some time to create Video Blob

//       const day = new Date().toISOString().substr(0, 10);
//       const time = new Date().toISOString().substr(11, 8);

//       setTimeout(
//         () => mrec.downloadVideo(`gafo-${exp.meta.subjID}-${day}-${time}`),
//         1000,
//       );
//     }

//     document
//       .getElementById('foreign-object-heading')
//       .replaceChild(exp.txt.goodbyeHeading, exp.txt.instructionsTestHeading);
//     document
//       .getElementById('foreign-object-center-left')
//       .replaceChild(
//         exp.txt.goodbyeParagraph,
//         exp.txt.instructionsTestParagraph,
//       );
//     document
//       .getElementById('foreign-object-center-right')
//       .replaceChild(exp.txt.familyImage, exp.txt.instructionsTestImage);

//     textslideButton.addEventListener('click', handleGoodbyeClick, {
//       capture: false,
//       once: true,
//     });

//     switch (exp.meta.lang) {
//       case 'de':
//         textslideButtonText.innerHTML = 'weiter';
//         break;
//       case 'en':
//         textslideButtonText.innerHTML = 'continue';
//         break;
//       default:
//         console.log('error in setting textslideButtonText');
//     }

//     showSlide(
//       [textslide, speaker, textslideButton],
//       [
//         experimentslide,
//         hedge,
//         female01,
//         female02,
//         female03,
//         female04,
//         male01,
//         male02,
//         male03,
//         male04,
//         balloonBlue,
//         balloonGreen,
//         balloonRed,
//         balloonYellow,
//       ],
//     );
//   }
// };
