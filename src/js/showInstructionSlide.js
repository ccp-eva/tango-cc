import { showSlide } from './showSlide';
import { openFullscreen } from './openFullscreen';
import { handleSpeakerClick } from './handleSpeakerClick';
import { prepareTrial } from './prepareTrial';

/**
 * Function that shows text on instruction slide and prepares first trial.
 *
 * @param {Object} exp - An object storing our experiment data
 *
 * @example
 *       showInstructionSlide(exp);
 */
export function showInstructionSlide(exp) {
  const button = document.getElementById('textslide-button');
  const speaker = document.getElementById('speaker');
  const textslide = document.getElementById('textslide');
  const experimentslide = document.getElementById('experimentslide');

  if (!exp.devmode) openFullscreen();

  document
    .getElementById('foreign-object-heading')
    .replaceChild(exp.txt.instructionsTouchHeading, exp.txt.welcomeHeading);
  document
    .getElementById('foreign-object-center-left')
    .replaceChild(exp.txt.instructionsTouchParagraph, exp.txt.welcomeParagraph);
  document
    .getElementById('foreign-object-center-right')
    .replaceChild(exp.txt.instructionsTouchImage, exp.txt.familyImage);

  showSlide(
    [speaker],
    // first hide buttons, participants can only start once they listened to the instructions
    [button],
  );

  if (exp.devmode) {
    showSlide([button], []);
  }

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

  // on button click, advance to first trial
  const handleContinueClick = () => {
    prepareTrial(exp);
    showSlide([experimentslide], [textslide, speaker, button]);
  };

  button.addEventListener('click', handleContinueClick, {
    capture: false,
    once: true,
  });
}
