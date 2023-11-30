import { checkForTouchscreen } from './checkForTouchscreen';
import * as DetectRTC from 'detectrtc';

/**
 * Function for creating our exp object that stores all variables.
 * Please note, the "exp" object will be manipulated in other functions.
 *
 * @return {object} exp, an object storing our experiment data
 *
 * @example
 *     initDatastructure()
 */
export function initDatastructure() {
  const url = new URL(document.location.href);

  const exp = {
    devmode: true, // true speeds up developing (e.g. playback rate)
    trial: 0, // counter which trial we are in

    // create empty variables for future storing
    log: [], // stores all participant responses & randomization
    elemSpecs: {}, // stores measurements & audio durations

    meta: {
      // get some values out of URL parameters, handed over from index.html, entered by users
      subjID: url.searchParams.get('ID') || 'testID',
      lang: url.searchParams.get('lang') || 'ger',
      webcam: JSON.parse(url.searchParams.get('webcam')) || false,
      nrTouch: url.searchParams.get('touch') || 1,
      nrFam: url.searchParams.get('fam') || 2,
      nrTest: url.searchParams.get('test') || 2,
      // save some setting values
      touchscreen: checkForTouchscreen(),
      offsetHeight: document.body.offsetHeight,
      offsetWidth: document.body.offsetWidth,
      ballonwidth: 160,

      // TODO: convert this into: see whether face is male / female, adjust audio accordingly
      firstVoiceover: Math.random() < 0.5 ? 'M' : 'F',
    },
  };

  exp.meta.trialsTotal = exp.meta.nrTouch + exp.meta.nrFam + exp.meta.nrTest;

  // concatenate trials to go through different study phases
  exp.state = ['welcome']
    .concat(
      new Array(exp.meta.nrTouch).fill('touch'),
      ['transition'],
      new Array(exp.meta.nrFam).fill('fam'),
      ['transition'],
      new Array(exp.meta.nrTest).fill('test'),
      'goodbye',
    )
    .flat();

  // log user testing setup
  DetectRTC.load(() => {
    exp.meta.safari = DetectRTC.browser.isSafari || false;
    exp.meta.iOSSafari = exp.meta.touchscreen && exp.meta.safari;
  });

  return exp;
}
