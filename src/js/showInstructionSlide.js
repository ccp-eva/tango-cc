import { showSlide } from './showSlide';
import { openFullscreen } from './openFullscreen';
import { handleSpeakerClick } from './handleSpeakerClick';
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
  const textslide = document.getElementById('textslide');
  const experimentslide = document.getElementById('experimentslide');
  const speaker = document.getElementById('speaker');

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

  // ---------------------------------------------------------------------------------------------------------------------
  // START AUDIO WHEN SPEAKER HAS BEEN CLICKED
  // ---------------------------------------------------------------------------------------------------------------------
  // const handleSpeakerClick = async function tmp(event) {
  //   event.preventDefault();
  //   if (!exp.devmode) openFullscreen();
  //   if (!exp.devmode) await playFullAudio(exp, welcomeSrc);
  //   button.style.pointerEvents = 'auto';
  //   gsap.to(button, { autoAlpha: 1 });
  // };

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

  // ---------------------------------------------------------------------------------------------------------------------
  // SWITCH TO TRIALS WHEN CONTINUE HAS BEEN CLICKED
  // ---------------------------------------------------------------------------------------------------------------------
  // const handleContinueClick = (event) => {
  //   event.preventDefault();

  //   // advance experiment state
  //   exp.state.shift();
  //   prepareTrial(exp);
  //   showSlide([experimentslide], [textslide]);
  // };

  // button.addEventListener('click', handleContinueClick, {
  //   capture: false,
  //   once: true,
  // });
}
