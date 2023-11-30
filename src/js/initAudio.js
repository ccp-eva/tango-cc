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

/**
 * Function for saving audio durations and unlocking Audio element
 *
 * @param {Object} exp - An object storing our experiment data
 *
 * @example
 *     initAudio(exp)
 */
export function initAudio(exp) {
  // SAVE DURATION OF AUDIO FILES
  exp.elemSpecs.audioDur = {};
  const audioSrcs = [
    touch1SrcF,
    touch1SrcM,
    famHedge1SrcF,
    famHedge1SrcM,
    testHedge1SrcF,
    testHedge1SrcM,
    testHedge2SrcF,
    testHedge2SrcM,
    testHedge3SrcF,
    testHedge3SrcM,
  ];

  audioSrcs.forEach((src) => {
    const audioTmp = new Audio();
    audioTmp.src = src;
    audioTmp.onloadedmetadata = () => {
      exp.devmode
        ? (exp.elemSpecs.audioDur[src] = audioTmp.duration / 4)
        : (exp.elemSpecs.audioDur[src] = audioTmp.duration);
    };
  });

  // create Audio element that will play all our audios
  exp.soundEffect = new Audio();

  // unlock audio element on first user interaction
  // later we adjust the source to each individual audio file
  // (event touchstart only works for touchscreens)
  document.body.addEventListener(
    'touchstart',
    () => {
      exp.soundEffect.play();
    },
    { capture: false, once: true },
  );
}
