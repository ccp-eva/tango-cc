import './css/tango.css';
import tangoSVG from './images/tango.svg';

import { experimentalInstructions } from './js/experimentalInstructions';
import { randomizeTrials } from './js/randomizeTrials';
import { initWindowFunctionality } from './js/initWindowFunctionality';
import { initDatastructure } from './js/initDatastructure';
import { initStimuli } from './js/initStimuli';
import { initAudio } from './js/initAudio';
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

if (exp.devmode) console.log(exp);
