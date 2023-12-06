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
  const button = document.getElementById('textslide-button');
  const speaker = document.getElementById('speaker');
  const textslide = document.getElementById('textslide');
  const experimentslide = document.getElementById('experimentslide');
  const hedge = document.getElementById('hedge');
  const female01 = document.getElementById('female01');
  const female02 = document.getElementById('female02');
  const female03 = document.getElementById('female03');
  const female04 = document.getElementById('female04');
  const male01 = document.getElementById('male01');
  const male02 = document.getElementById('male02');
  const male03 = document.getElementById('male03');
  const male04 = document.getElementById('male04');
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

  showSlide(
    [textslide, speaker, button],
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

  // on button click, advance to first trial
  const handleContinueClick = () => {
    // pause audio
    exp.soundEffect.pause();
    exp.soundEffect.currentTime = 0;

    // disable fullscreen mode
    if (!exp.devmode) {
      closeFullscreen();
    }

    // TODO Goodbye html?
    // window.location.replace(`./goodbye.html`);
  };

  button.addEventListener('click', handleContinueClick, {
    capture: false,
    once: true,
  });
}
