import { gsap } from 'gsap';

import './css/tango.css';
import tangoSVG from './images/tango.svg';

// import self-written functions
import { experimentalInstructions } from './js/experimentalInstructions';
import { randomizeTrials } from './js/randomizeTrials';

import { initWindowFunctionality } from './js/initWindowFunctionality';
import { initDatastructure } from './js/initDatastructure';
import { initStimuli } from './js/initStimuli';
import { initAudio } from './js/initAudio';
import { animateTrial } from './js/animateTrial';
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
const agentsSingle = [
  document.getElementById('female01'),
  document.getElementById('female02'),
  document.getElementById('male01'),
  document.getElementById('male02'),
];

const targetsSingle = [
  document.getElementById('balloon-blue'),
  document.getElementById('balloon-red'),
  document.getElementById('balloon-yellow'),
  document.getElementById('balloon-green'),
];

randomizeTrials(exp, agentsSingle, targetsSingle);

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
//   exp.timeline = gsap.timeline({ paused: true });
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
