import { showSlide } from './showSlide';
import { handleSpeakerClick } from './handleSpeakerClick';
import { downloadCsv } from './downloadCsv';
import { closeFullscreen } from './closeFullscreen';

/**
 * Function that shows text after last trial and initiates download of data.
 *
 * @param {Object} exp - An object storing our experiment data
 *
 * @example
 *       showGoodbyeSlide(exp);
 */
export function showGoodbyeSlide(exp) {
  const downloadIcon = document.getElementById('download-icon');
  const button = document.getElementById('textslide-button');
  const buttonText = document.getElementById('textslide-button-text');
  const speaker = document.getElementById('speaker');
  const textslide = document.getElementById('textslide');
  const experimentslide = document.getElementById('experimentslide');
  const hedge = document.getElementById('hedge');
  const balloonBlue = document.getElementById('balloon-blue');
  const balloonYellow = document.getElementById('balloon-yellow');
  const balloonRed = document.getElementById('balloon-red');
  const balloonGreen = document.getElementById('balloon-green');

  document
    .getElementById('foreign-object-heading')
    .replaceChild(exp.txt.goodbyeHeading, exp.txt.instructionsTestHeading);
  document
    .getElementById('foreign-object-center-left')
    .replaceChild(exp.txt.goodbyeParagraph, exp.txt.instructionsTestParagraph);
  document
    .getElementById('foreign-object-center-right')
    .replaceChild(exp.txt.familyImage, exp.txt.instructionsTestImage);

  buttonText.innerHTML = 'exit';

  showSlide(
    [textslide, speaker, button, downloadIcon],
    [
      experimentslide,
      hedge,
      exp.meta.selectedAgents,
      exp.meta.selectedTargets,
      exp.meta.selectedBackground,
      balloonBlue,
      balloonGreen,
      balloonRed,
      balloonYellow,
    ],
  );

  // start audio when speaker has been clicked
  speaker.addEventListener(
    'click',
    function () {
      handleSpeakerClick(exp);
    },
    {
      capture: false,
      once: false,
    },
  );

  // save data, download locally
  downloadCsv(exp.log, exp.meta.subjID);

  // save the video locally
  if (!exp.meta.iOSSafari && exp.meta.webcam) {
    mrec.stopRecorder();
    // give some time to create Video Blob
    const day = new Date().toISOString().substring(0, 10);
    const time = new Date().toISOString().substring(11, 19);
    setTimeout(
      () => mrec.downloadVideo(`tangoCC-${exp.meta.subjID}-${day}-${time}`),
      1000,
    );
  }

  // on button click, trigger download
  const handleDownloadClick = () => {
    downloadCsv(exp.log, exp.meta.subjID);
    if (!exp.meta.iOSSafari && exp.meta.webcam) {
      mrec.stopRecorder();
      const day = new Date().toISOString().substring(0, 10);
      const time = new Date().toISOString().substring(11, 19);
      setTimeout(
        () => mrec.downloadVideo(`tangoCC-${exp.meta.subjID}-${day}-${time}`),
        1000,
      );
    }
  };

  downloadIcon.addEventListener('click', handleDownloadClick, {
    capture: false,
    once: false,
  });

  // on button click, advance to first trial
  const handleContinueClick = () => {
    // pause audio
    exp.soundEffect.pause();
    exp.soundEffect.currentTime = 0;

    // disable fullscreen mode
    if (!exp.devmode) {
      closeFullscreen();
    }

    window.location.replace(`./goodbye.html`);
  };

  button.addEventListener('click', handleContinueClick, {
    capture: false,
    once: true,
  });
}
