// import animation library
import { gsap } from 'gsap';
import * as mrec from '@ccp-eva/media-recorder';
import * as DetectRTC from 'detectrtc';

// same for everyone
import welcomeSrc from './sounds/welcome.mp3';
import goodbyeSrc from './sounds/goodbye.mp3';
import promptGeneralSrc from './sounds/prompt-general.mp3';
import promptHedgeSrc from './sounds/prompt-hedge.mp3';
import promptTouchSrc from './sounds/prompt-touch.mp3';
import promptTouchLongSrc from './sounds/prompt-touch-long.mp3';

// depending on training trial order (agent's gender)
// these, we need in our animation function. here, we'll calculate duration
import touch1SrcF from './sounds/touch-1-f.mp3';
import famHedge1SrcF from './sounds/fam-hedge-1-f.mp3';
import testHedge1SrcF from './sounds/test-hedge-1-f.mp3';
import testHedge2SrcF from './sounds/test-hedge-2-f.mp3';
import testHedge3SrcF from './sounds/test-hedge-3-f.mp3';

import touch1SrcM from './sounds/touch-1-m.mp3';
import famHedge1SrcM from './sounds/fam-hedge-1-m.mp3';
import testHedge1SrcM from './sounds/test-hedge-1-m.mp3';
import testHedge2SrcM from './sounds/test-hedge-2-m.mp3';
import testHedge3SrcM from './sounds/test-hedge-3-m.mp3';

// import self-written functions
import logResponse from './logResponse';
import prepareTrial from './prepareTrial';
import changeGaze from './changeGaze';
import pause from './pause';
import randomizeTrials from './randomizeTrials';
import uploadData from './uploadData';
import downloadData from './downloadData';
import checkForTouchscreen from './checkForTouchscreen';
import showSlide from './showSlide';
import openFullscreen from './openFullscreen';
import closeFullscreen from './closeFullscreen';
import experimentalInstructions from './experimentalInstructions';
import playFullAudio from './playFullAudio';

// ---------------------------------------------------------------------------------------------------------------------
// DEVMODE?
// ---------------------------------------------------------------------------------------------------------------------
const devmode = true;

// ---------------------------------------------------------------------------------------------------------------------
// EXP OBJECT
// in this object, we save all of our variables, easier to pass on to functions
// NOTE: we do manipulate this object in our functions!
// ---------------------------------------------------------------------------------------------------------------------
const exp = {};

// ---------------------------------------------------------------------------------------------------------------------
// PARTICIPANT ID & TOUCH
// ---------------------------------------------------------------------------------------------------------------------
// get url object
const url = new URL(window.location.href);

exp.subjData = {};

// use id parameter’s value if available else use 'testID'
exp.subjData.touchScreen = checkForTouchscreen();
exp.subjData.subjID = url.searchParams.get('ID') || 'testID';
exp.subjData.inhouse = 'true';
exp.subjData.lang = 'en'; // needed for instructions text
exp.subjData.population = 'zimbabwe';

// ---------------------------------------------------------------------------------------------------------------------
// CHECK WHETHER TOUCHSCREEN AND/OR iOS SAFARI
// ---------------------------------------------------------------------------------------------------------------------
DetectRTC.load(() => {
  exp.subjData.os = DetectRTC.osName;
  exp.subjData.mobile = DetectRTC.isMobileDevice;
  exp.subjData.browser = DetectRTC.browser.name;
  exp.subjData.browserVersion = JSON.stringify(DetectRTC.browser.version);
  exp.subjData.safari = DetectRTC.browser.isSafari || false;
  exp.subjData.iOSSafari = exp.subjData.mobile && exp.subjData.safari;
});

// ---------------------------------------------------------------------------------------------------------------------
// WEBCAM RECORDING (only if not iOS Safari)
// ---------------------------------------------------------------------------------------------------------------------
if (!exp.subjData.iOSSafari & !devmode) {
  mrec.startRecorder({
    audio: true,
    video: {
      frameRate: {
        min: 3,
        ideal: 5,
        max: 30,
      },
      width: {
        min: 160,
        ideal: 320,
        max: 640,
      },
      height: {
        min: 120,
        ideal: 240,
        max: 480,
      },
      facingMode: 'user',
    },
  });
}

// ---------------------------------------------------------------------------------------------------------------------
// TRIAL SPECIFICATIONS
// ---------------------------------------------------------------------------------------------------------------------
exp.trials = {};
exp.trials.touchNr = devmode ? 1 : 1;
exp.trials.famNr = devmode ? 2 : 2;
exp.trials.testNr = devmode ? 2 : 16;
exp.meta.totalNr = exp.trials.touchNr + exp.trials.famNr + exp.trials.testNr;
// this variable stores in which trial we currently are!
exp.trials.count = 0;
// NOTE: make sure, that the number of voice over fits to the nr of touch training, fam and test trials!!
exp.trials.voiceoverNr = devmode ? 0 : 1;

// FIX AGENT'S GENDER FOR FIRST 4 TRIALS
// coin flip determines which trial order
if (Math.random() < 0.5) {
  // this order means M-F-M-F for training trials. 1, 2, 4 with voice over
  exp.trials.firstVoiceover = 'M';
} else {
  // this order means F-M-F-M
  exp.trials.firstVoiceover = 'F';
}

// ---------------------------------------------------------------------------------------------------------------------
// VOICE OVER SETTINGS
// ---------------------------------------------------------------------------------------------------------------------
let touch1Src;
let famHedge1Src;
let testHedge1Src;
let testHedge2Src;
let testHedge3Src;

switch (exp.trials.firstVoiceover) {
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

// ---------------------------------------------------------------------------------------------------------------------
// SCREEN SIZE
// ---------------------------------------------------------------------------------------------------------------------
exp.subjData.offsetWidth = document.body.offsetWidth;
exp.subjData.offsetHeight = document.body.offsetHeight;

// ---------------------------------------------------------------------------------------------------------------------
// ADD INSTRUCTIONS TEXT
// ---------------------------------------------------------------------------------------------------------------------
// add text via rect => foreignObject => innerHTML
const foreignObjects = Array.from(
  document.querySelectorAll('[id^="foreign-object"]'),
);
foreignObjects.forEach((elem) => {
  const obj = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'foreignObject',
  );
  [...elem.attributes].map(({ name, value }) => obj.setAttribute(name, value));
  elem.replaceWith(obj);
});

const txt = experimentalInstructions(exp);

// ---------------------------------------------------------------------------------------------------------------------
// SAVE VIEWBOX VALUES
// ---------------------------------------------------------------------------------------------------------------------
// get viewBox size from whole SVG
exp.elemSpecs = {
  outerSVG: {
    ID: document.getElementById('outer-svg'),
    origViewBox: document.getElementById('outer-svg').getAttribute('viewBox'),
    origViewBoxX: parseFloat(
      document
        .getElementById('outer-svg')
        .getAttribute('viewBox')
        .split(' ')[0],
    ),
    origViewBoxY: parseFloat(
      document
        .getElementById('outer-svg')
        .getAttribute('viewBox')
        .split(' ')[1],
    ),
    origViewBoxWidth: parseFloat(
      document
        .getElementById('outer-svg')
        .getAttribute('viewBox')
        .split(' ')[2],
    ),
    origViewBoxHeight: parseFloat(
      document
        .getElementById('outer-svg')
        .getAttribute('viewBox')
        .split(' ')[3],
    ),
  },
};

// ---------------------------------------------------------------------------------------------------------------------
// SAVE DURATION OF AUDIO FILES
// ---------------------------------------------------------------------------------------------------------------------
exp.elemSpecs.animAudioDur = {};
const animAudioSrcs = [
  touch1Src,
  famHedge1Src,
  testHedge1Src,
  testHedge2Src,
];

animAudioSrcs.forEach((src) => {
  const audioTmp = new Audio();
  audioTmp.src = src;
  audioTmp.onloadedmetadata = () => {
    exp.elemSpecs.animAudioDur[src] = audioTmp.duration;
  };
});

// ---------------------------------------------------------------------------------------------------------------------
// GET ALL RELEVANT ELEMENTS IN SVG
// ---------------------------------------------------------------------------------------------------------------------
const textslide = document.getElementById('textslide');
const textslideButton = document.getElementById('textslide-button');
const textslideButtonText = document.getElementById('textslide-button-text');
const experimentslide = document.getElementById('experimentslide');
const experimentslideButton = document.getElementById('experimentslide-button');

const clickBubble = document.getElementById('click-bubble');
const clickableArea = document.getElementById('clickable-area');
const speaker = document.getElementById('speaker');
const hedge = document.getElementById('hedge');

// if you change animal agents or targets, then change ID here...
const female01 = document.getElementById('female01');
const female02 = document.getElementById('female02');
const female03 = document.getElementById('female03');
const female04 = document.getElementById('female04');

const male01 = document.getElementById('male01');
const male02 = document.getElementById('male02');
const male03 = document.getElementById('male03');
const male04 = document.getElementById('male04');

const agentsSingle = [
  female01,
  female02,
  female03,
  female04,
  male01,
  male02,
  male03,
  male04,
];

const agentsChar = [
  'female01',
  'female02',
  'female03',
  'female04',
  'male01',
  'male02',
  'male03',
  'male04',
];

// first of all, hide all agents. per trial, relevant agent will be shown
// const allAgents = Array.from(document.getElementsByClassName('agent'));
const allAgents = Array.from(document.getElementById('agents').children);
allAgents.forEach((agent) => {
  agent.setAttribute('visibility', 'hidden');
});

// NOTE: we believe that all target objects are the same size here!!
const balloonBlue = document.getElementById('balloon-blue');
const balloonRed = document.getElementById('balloon-red');
const balloonYellow = document.getElementById('balloon-yellow');
const balloonGreen = document.getElementById('balloon-green');
const targetsSingle = [balloonBlue, balloonRed, balloonYellow, balloonGreen];

// save the original eye positions (so when eye is in the center)
exp.elemSpecs.eyes = {};

agentsChar.forEach((agent) => {
  exp.elemSpecs.eyes[agent] = {
    radius: document.getElementById(`${agent}-eyeline-left`).getAttribute('r'),
    left: {
      center: {
        x: document.getElementById(`${agent}-eyeline-left`).getAttribute('cx'),
        y: document.getElementById(`${agent}-eyeline-left`).getAttribute('cy'),
      },
      bbox: {
        x: document.getElementById(`${agent}-eyeline-left`).getBBox().x, // same as cx - r
        y: document.getElementById(`${agent}-eyeline-left`).getBBox().y, // same as cy - r
      },
    },
    right: {
      center: {
        x: document.getElementById(`${agent}-eyeline-right`).getAttribute('cx'),
        y: document.getElementById(`${agent}-eyeline-right`).getAttribute('cy'),
      },
      bbox: {
        x: document.getElementById(`${agent}-eyeline-right`).getBBox().x, // same as cx - r
        y: document.getElementById(`${agent}-eyeline-right`).getBBox().y, // same as cy - r
      },
    },
  };
});

// calculate some positions of the targets
exp.elemSpecs.targets = {
  center: {
    x: balloonBlue.getBBox().x,
    y: balloonBlue.getBBox().y,
  },
  // define coords from which point onwards the balloon is hidden behind hedge
  halfway: {
    // position mid, same as in center.x
    x: balloonBlue.getBBox().x,
    // BBox of hedge is a bit too high to hide balloon (because of single grass halms), therefore / 1.1
    y: exp.elemSpecs.outerSVG.origViewBoxHeight - hedge.getBBox().height / 1.1,
  },
  // right side of screen as upper boundary
  borderRight:
    exp.elemSpecs.outerSVG.origViewBoxWidth - balloonBlue.getBBox().width,
  // calculate y coords for balloon (-20 for little distance from lower border)
  groundY:
    exp.elemSpecs.outerSVG.origViewBoxHeight -
    balloonBlue.getBBox().height -
    20,
};

// ---------------------------------------------------------------------------------------------------------------------
// RANDOMIZATION OF AGENTS, TARGETS AND TARGET POSITIONS
// ---------------------------------------------------------------------------------------------------------------------
// create arrays with agents, targets, positions etc. for all the trials
randomizeTrials(exp, agentsSingle, targetsSingle);
if (devmode) console.log('exp object', exp);

// gsap timeline that will save our animation specifications
let timeline = null;
let targetClickTimer5sec = null;

// ---------------------------------------------------------------------------------------------------------------------
// UNLOCK AUDIOS
// ---------------------------------------------------------------------------------------------------------------------
exp.soundEffect = new Audio();

// event touchstart only works for touchscreens
// on first user interaction, later we adjust the source
document.body.addEventListener(
  'touchstart',
  () => {
    exp.soundEffect.play();
  },
  { capture: false, once: true },
);

// ---------------------------------------------------------------------------------------------------------------------
// NOT NEEDED FOR DEMO
// ASYNC PROMISIFIABLE VIDEO UPLOAD FUNCTION
// ---------------------------------------------------------------------------------------------------------------------
async function endRecording() {
  // stop recorder and upload video
  mrec.stopRecorder();

  // show upload spinner
  switch (exp.subjData.lang) {
    case 'de':
      mrec.modalContent(
        '<img src=\'images/spinner-upload-de.svg\' style="width: 75vw">',
        '#E1B4B4',
      );
      break;
    case 'en':
      mrec.modalContent(
        '<img src=\'images/spinner-upload-en.svg\' style="width: 75vw">',
        '#E1B4B4',
      );
      break;
    default:
      console.log('error in setting textslideButtonText');
  }

  await pause(1000);

  const dt = new Date();

  const dtFormat = `${dt.getFullYear().toString().padStart(4, '0')}-${(
    dt.getMonth() + 1
  )
    .toString()
    .padStart(2, '0')}-${dt.getDate().toString().padStart(2, '0')}-${dt
    .getHours()
    .toString()
    .padStart(2, '0')}-${dt.getMinutes().toString().padStart(2, '0')}-${dt
    .getSeconds()
    .toString()
    .padStart(2, '0')}`;

  switch (exp.subjData.lang) {
    case 'de':
      mrec.uploadVideo(
        {
          fname: `gafo-${exp.subjData.subjID}-${dtFormat}`,
          uploadContent:
            '<img src=\'images/spinner-upload-de.svg\' style="width: 75vw">',
          uploadColor: '#E1B4B4',
          successContent:
            '<img src=\'images/spinner-done-de.svg\' style="width: 75vw">',
          successColor: '#D3F9D3',
        },
        './data/upload_video.php',
      );
      break;
    case 'en':
      mrec.uploadVideo(
        {
          fname: `gafo-${exp.subjData.subjID}-${dtFormat}`,
          uploadContent:
            '<img src=\'images/spinner-upload-en.svg\' style="width: 75vw">',
          uploadColor: '#E1B4B4',
          successContent:
            '<img src=\'images/spinner-done-en.svg\' style="width: 75vw">',
          successColor: '#D3F9D3',
        },
        './data/upload_video.php',
      );
      break;
    default:
      console.log('error in setting textslideButtonText');
  }

  await pause(1000);

  mrec.toggleModal();
}

// ---------------------------------------------------------------------------------------------------------------------
// DEFINE EVENTLISTENER FUNCTIONS
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN WELCOME BUTTON IS CLICKED
// ---------------------------------------------------------------------------------------------------------------------
// save in const variables in order to pass on event to function
const handleWelcomeClick = (event) => {
  event.preventDefault();
  document
    .getElementById('foreign-object-heading')
    .replaceChild(txt.instructionsTouchHeading, txt.welcomeHeading);
  document
    .getElementById('foreign-object-center-left')
    .replaceChild(txt.instructionsTouchParagraph, txt.welcomeParagraph);
  document
    .getElementById('foreign-object-center-right')
    .replaceChild(txt.instructionsTouchImage, txt.familyImage);

  switch (exp.subjData.lang) {
    case 'de':
      textslideButtonText.innerHTML = 'weiter';
      break;
    case 'en':
      textslideButtonText.innerHTML = 'continue';
      break;
    default:
      console.log('error in setting textslideButtonText');
  }

  if (devmode) {
    showSlide([speaker], []);
  } else {
    showSlide([speaker], [textslideButton]);
    // enable fullscreen mode
    openFullscreen();
  }
  textslideButton.addEventListener('click', handleTransitionClick, {
    capture: false,
    once: true,
  });
};
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN TRANSITION BUTTON IS CLICKED (between touch, fam and test trials)
// ---------------------------------------------------------------------------------------------------------------------
const handleTransitionClick = (event) => {
  event.preventDefault();

  showSlide(
    [experimentslide],
    [textslide, textslideButton, clickBubble, speaker],
  );

  prepareTrial(exp);
  timeline = gsap.timeline({ paused: true });
  timeline.add(changeGaze(exp));
  exp.responseLog[exp.trials.count].durationAnimationComplete =
    timeline.duration();
};

// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN GOODBYE BUTTON IS CLICKED
// ---------------------------------------------------------------------------------------------------------------------
const handleGoodbyeClick = async function tmp(event) {
  event.preventDefault();

  // pause audio
  exp.soundEffect.pause();
  exp.soundEffect.currentTime = 0;

  // disable fullscreen mode
  if (!devmode) {
    closeFullscreen();
  }

  window.location.replace(`./goodbye.html?ID=${exp.subjData.subjID}`);
};
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN "weiter" BUTTON IS CLICKED
// ---------------------------------------------------------------------------------------------------------------------
const handleExperimentslideButtonClick = async function tmp(event) {
  event.preventDefault();

  if (devmode) console.log('');
  if (devmode) console.log('trial: ', exp.trials.count);

  // hide blurr canvas and button
  showSlide(
    [],
    [experimentslideButton, document.getElementById('cover-blurr')],
  );

  // set event listener to see whether participants click too early
  exp.elemSpecs.outerSVG.ID.addEventListener('click', handleEarlyClick, false);

  // animate balloon & eye movement to randomized positions
  await timeline.play();
  await pause(200);

  // for any trial without voiceover
  if (!exp.trials.voiceover[exp.trials.count]) {
    exp.soundEffect.src = promptGeneralSrc;
    exp.soundEffect.play();

    // for touch trials with voiceover
  } else if (exp.trials.type[exp.trials.count] === 'touch') {
    await playFullAudio(exp.soundEffect, promptTouchLongSrc);

    // for tablet hedge version fam trials with voiceover
  } else if (
    exp.trials.type[exp.trials.count] === 'fam'
  ) {
    await playFullAudio(exp.soundEffect, promptHedgeSrc);
  }

  // save current time to calculate response time later
  exp.responseLog[exp.trials.count].responseTime = {
    t0: new Date().getTime(),
    t1: 0,
  };

  targetClickTimer5sec = window.setTimeout(noTargetClickWithin5sec, 5000);

  // remove event listener that checks whether participants clicked too early
  exp.elemSpecs.outerSVG.ID.removeEventListener(
    'click',
    handleEarlyClick,
    false,
  );

  // for touch trials, particiapnts can click in clickable area
  if (exp.trials.type[exp.trials.count] === 'touch') {
    clickableArea.setAttribute('pointer-events', 'all');
    clickableArea.addEventListener('click', handleTargetClick, {
      capture: false,
      once: true,
    });

    // for trials with hedge, participants should click on there
  } else {
    clickableArea.setAttribute('pointer-events', 'none');
    hedge.addEventListener('click', handleTargetClick, {
      capture: false,
      once: true,
    });

  exp.elemSpecs.outerSVG.ID.addEventListener(
    'click',
    handleWrongAreaClick,
    false,
  );
};
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN TARGET (HEDGE) IS CLICKED
// ---------------------------------------------------------------------------------------------------------------------
// async so we can await animation!
const handleTargetClick = async function tmp(event) {
  // stop audio that is potentially playing
  exp.soundEffect.pause();
  exp.soundEffect.currentTime = 0;

  // we save current time, so that we can calculate response time
  exp.responseLog[exp.trials.count].responseTime.t1 = new Date().getTime();

  // clear timer that awaits participant's click
  // otherwise, it will run even after target click
  clearTimeout(targetClickTimer5sec);

  // remove eventListener that was responsible for "wrong input" sound
  exp.elemSpecs.outerSVG.ID.removeEventListener(
    'click',
    handleWrongAreaClick,
    false,
  );
  event.preventDefault();

  // function to save all relevant information
  logResponse(event, exp);
  if (devmode) console.log('responseLog: ', exp.responseLog[exp.trials.count]);

  // just for safety: upload data to server already
  // if participants passed touch+fam training and at least 4 test trials
  // if (exp.trials.count >= exp.trials.touchNr + exp.trials.famNr + 4) {
  //   devmode
  //     ? console.log('download data for safety')
  //     : downloadData(exp.responseLog, exp.subjData.subjID);
  // }

  // so that we don't rush into next trial
  await pause(500);

  // prepare next trial
  exp.trials.count += 1;

  // then depending on trialcount, decide what happens next...
  // for touch trials
  if (exp.trials.count < exp.trials.touchNr) {
    prepareTrial(exp);
    timeline = gsap.timeline({ paused: true });
    timeline.add(changeGaze(exp));
    exp.responseLog[exp.trials.count].durationAnimationComplete =
      timeline.duration();

    // for transition from touching into familiarization
  } else if (exp.trials.count === exp.trials.touchNr) {
    document
      .getElementById('foreign-object-heading')
      .replaceChild(txt.instructionsFamHeading, txt.instructionsTouchHeading);
    document
      .getElementById('foreign-object-center-left')
      .replaceChild(
        txt.instructionsFamParagraph,
        txt.instructionsTouchParagraph,
      );
    document
      .getElementById('foreign-object-center-right')
      .replaceChild(txt.instructionsFamImage, txt.instructionsTouchImage);

    textslideButton.addEventListener('click', handleTransitionClick, {
      capture: false,
      once: true,
    });

    showSlide(
      [textslide, textslideButton],
      [
        experimentslide,
        hedge,
        female01,
        female02,
        female03,
        female04,
        male01,
        male02,
        male03,
        male04,
        balloonBlue,
        balloonGreen,
        balloonRed,
        balloonYellow,
        speaker,
      ],
    );

    // for familiarization trials
  } else if (exp.trials.count < exp.trials.touchNr + exp.trials.famNr) {
    prepareTrial(exp);
    timeline = gsap.timeline({ paused: true });
    timeline.add(changeGaze(exp));
    exp.responseLog[exp.trials.count].durationAnimationComplete =
      timeline.duration();

    // for transition from familiarization to test trials
  } else if (exp.trials.count === exp.trials.touchNr + exp.trials.famNr) {
    document
      .getElementById('foreign-object-heading')
      .replaceChild(txt.instructionsTestHeading, txt.instructionsFamHeading);
    document
      .getElementById('foreign-object-center-left')
      .replaceChild(
        txt.instructionsTestParagraph,
        txt.instructionsFamParagraph,
      );
    document
      .getElementById('foreign-object-center-right')
      .replaceChild(txt.instructionsTestImage, txt.instructionsFamImage);

    textslideButton.addEventListener('click', handleTransitionClick, {
      capture: false,
      once: true,
    });

    showSlide(
      [textslide, textslideButton],
      [
        experimentslide,
        hedge,
        female01,
        female02,
        female03,
        female04,
        male01,
        male02,
        male03,
        male04,
        balloonBlue,
        balloonGreen,
        balloonRed,
        balloonYellow,
        speaker,
      ],
    );

    // for test trials
  } else if (exp.trials.count < exp.trials.totalNr) {
    prepareTrial(exp);
    timeline = gsap.timeline({ paused: true });
    timeline.add(changeGaze(exp));
    exp.responseLog[exp.trials.count].durationAnimationComplete =
      timeline.duration();

    // for goodbye after test trials
  } else if (exp.trials.count === exp.trials.totalNr) {
    // hide everything for duration of video uploading
    showSlide(
      [],
      [
        experimentslide,
        hedge,
        female01,
        female02,
        female03,
        female04,
        male01,
        male02,
        male03,
        male04,
        balloonBlue,
        balloonGreen,
        balloonRed,
        balloonYellow,
        textslideButton,
      ],
    );

    // save data, download locally and upload to server
    if (!devmode) {
      // uploadData(exp.responseLog, exp.subjData.subjID);
      downloadData(exp.responseLog, exp.subjData.subjID);
    }

    // save the video
    if (!exp.subjData.iOSSafari) {
      mrec.stopRecorder();

      // give some time to create Video Blob

      const day = new Date().toISOString().substr(0, 10);
      const time = new Date().toISOString().substr(11, 8);

      // download video
      setTimeout(
        () => mrec.downloadVideo(`gafo-${exp.subjData.subjID}-${day}-${time}`),
        1000,
      );

      // upload video
      await endRecording();
    }

    // if (!exp.subjData.iOSSafari) await endRecording();

    document
      .getElementById('foreign-object-heading')
      .replaceChild(txt.goodbyeHeading, txt.instructionsTestHeading);
    document
      .getElementById('foreign-object-center-left')
      .replaceChild(txt.goodbyeParagraph, txt.instructionsTestParagraph);
    document
      .getElementById('foreign-object-center-right')
      .replaceChild(txt.familyImage, txt.instructionsTestImage);

    textslideButton.addEventListener('click', handleGoodbyeClick, {
      capture: false,
      once: true,
    });

    switch (exp.subjData.lang) {
      case 'de':
        textslideButtonText.innerHTML = 'weiter';
        break;
      case 'en':
        textslideButtonText.innerHTML = 'continue';
        break;
      default:
        console.log('error in setting textslideButtonText');
    }

    showSlide(
      [textslide, speaker, textslideButton],
      [
        experimentslide,
        hedge,
        female01,
        female02,
        female03,
        female04,
        male01,
        male02,
        male03,
        male04,
        balloonBlue,
        balloonGreen,
        balloonRed,
        balloonYellow,
      ],
    );
  }
};
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN WRONG CLICK
// ---------------------------------------------------------------------------------------------------------------------
const handleEarlyClick = (event) => {
  event.preventDefault();
  exp.responseLog[exp.trials.count].earlyClick++;
};

const handleWrongAreaClick = (event) => {
  event.preventDefault();
  // from participant screen size, calculate where there was a click
  const screenScalingHeight =
    exp.elemSpecs.outerSVG.origViewBoxHeight / exp.subjData.offsetHeight;
  const clickY =
    event.clientY - exp.elemSpecs.outerSVG.ID.getBoundingClientRect().top;
  const clickScaledY = screenScalingHeight * clickY;
  if (clickScaledY < hedge.getBBox().y) {
    // count how often a participant clicked in the wrong area
    exp.responseLog[exp.trials.count].wrongAreaClick++;
  }
};
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN SPEAKER IN INSTRUCTIONS HAS BEEN CLICKED
// ---------------------------------------------------------------------------------------------------------------------
const handleSpeakerClick = async function tmp(event) {
  event.preventDefault();

  if (exp.trials.count === 0) {
    // play instructions audio, only show button once audio is finished playing
    showSlide([], [textslideButton]);
    await playFullAudio(exp.soundEffect, welcomeSrc);
    showSlide([textslideButton], []);
    // for goodbye message
  } else if (exp.trials.count === exp.trials.totalNr) {
    await playFullAudio(exp.soundEffect, goodbyeSrc);
  }
};

// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN PARTICIPANT HASN'T CLICKED WITHIN CERTAIN AMOUNT OF TIME
// ---------------------------------------------------------------------------------------------------------------------
const noTargetClickWithin5sec = () => {
  if (exp.trials.type[exp.trials.count] === 'touch') {
    exp.soundEffect.src = promptTouchSrc;
    exp.soundEffect.play();
  } else if (
    exp.trials.type[exp.trials.count] !== 'touch'
  ) {
    exp.soundEffect.src = promptHedgeSrc;
    exp.soundEffect.play();
  }
};
// ---------------------------------------------------------------------------------------------------------------------
// ACTUALLY RUNNING:
// ---------------------------------------------------------------------------------------------------------------------
// INSTRUCTIONS: show slide
document
  .getElementById('foreign-object-heading')
  .appendChild(txt.welcomeHeading);
document
  .getElementById('foreign-object-center-left')
  .appendChild(txt.welcomeParagraph);
document
  .getElementById('foreign-object-center-right')
  .appendChild(txt.familyImage);

showSlide(
  [textslide],
  // first hide buttons, participants can only start once they listened to the instructions
  [experimentslide, speaker, clickableArea],
);

// add event listeners
textslideButton.addEventListener('click', handleWelcomeClick, {
  capture: false,
  once: true,
});
experimentslideButton.addEventListener(
  'click',
  handleExperimentslideButtonClick,
  { capture: false },
);
speaker.addEventListener('click', handleSpeakerClick, {
  capture: false,
  once: false,
});

// initially check device orientation
if (window.innerHeight > window.innerWidth) {
  // eslint-disable-next-line no-alert
  alert(`${txt.landscapemode}`);
}

// detect device orientation changes and alert, if portrait mode is used instead of landscape
window.addEventListener('orientationchange', () => {
  const afterOrientationChange = () => {
    // eslint-disable-next-line no-alert
    if (window.innerHeight > window.innerWidth) alert(`${txt.landscapemode}`);
  };
  // the orientationchange event is triggered before the rotation is complete.
  // therefore, await resize and then evaluate innerHeight & innerWidth
  window.addEventListener('resize', afterOrientationChange, {
    capture: false,
    once: true,
  });
});
