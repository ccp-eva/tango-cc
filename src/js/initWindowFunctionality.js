import * as mrec from '@ccp-eva/media-recorder';
import { downloadCsv } from './downloadCsv';

/**
 * Function for checking device orientation.
 * Attaches eventListener to the browser window, starts webcam recording.
 *
 * @param {Object} exp - An object storing our experiment data
 *
 * @example
 *     initWindowFunctionality(exp)
 */
export function initWindowFunctionality(exp) {
  // display spinner until everything is loaded
  window.addEventListener('load', function () {
    const spinner = document.getElementById('spinner-wrapper');
    spinner.style.display = 'none';
  });

  // initially check device orientation
  if (window.innerHeight > window.innerWidth && !exp.devmode) {
    alert('Please turn your device to watch the website in landscape format!');
  }

  // detect device orientation changes and alert, if portrait mode is used instead of landscape
  window.addEventListener('orientationchange', () => {
    const afterOrientationChange = () => {
      if (window.innerHeight > window.innerWidth)
        alert(`${exp.txt.landscapemode}`);
    };
    // the orientationchange event is triggered before the rotation is complete.
    // therefore, await resize and then evaluate innerHeight & innerWidth
    window.addEventListener('resize', afterOrientationChange, {
      capture: false,
      once: true,
    });
  });

  // ---------------------------------------------------------------------------------------------------------------------
  // PUT DOWNLOAD FUNCTIONS INTO GLOBAL SCOPE SO THAT WE CAN DOWNLOAD FROM CONSOLE
  // ---------------------------------------------------------------------------------------------------------------------
  window.downloadCsv = () => {
    downloadCsv(exp.log, exp.meta.subjID);
  };

  window.mrec = mrec;
  window.downloadWebm = () => {
    mrec.stopRecorder();
    // give some time to create Video Blob
    const day = new Date().toISOString().substring(0, 10);
    const time = new Date().toISOString().substring(11, 19);
    setTimeout(
      () => mrec.downloadVideo(`tangoCC-${exp.meta.subjID}-${day}-${time}`),
      1000,
    );
  };

  // ---------------------------------------------------------------------------------------------------------------------
  // START WEBCAM RECORDING
  // only if not iOS Safari and if selected by user
  // ---------------------------------------------------------------------------------------------------------------------
  if (!exp.meta.iOSSafari && exp.meta.webcam) {
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
}
