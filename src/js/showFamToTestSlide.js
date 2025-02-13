import { showSlide } from './showSlide';
import { prepareTrial } from './prepareTrial';

/**
 * Function that shows text between fam and test trials.
 *
 * @param {Object} exp - An object storing our experiment data
 *
 * @example
 *       showFamToTestSlide(exp);
 */
export function showFamToTestSlide(exp) {
  const button = document.getElementById('textslide-button');
  const textslide = document.getElementById('textslide');
  const experimentslide = document.getElementById('experimentslide');
  const hedge = document.getElementById('hedge');
  const speaker = document.getElementById('speaker');

  document
    .getElementById('foreign-object-heading')
    .replaceChild(
      exp.txt.instructionsTestHeading,
      exp.txt.instructionsFamHeading,
    );
  document
    .getElementById('foreign-object-center-left')
    .replaceChild(
      exp.txt.instructionsTestParagraph,
      exp.txt.instructionsFamParagraph,
    );
  document
    .getElementById('foreign-object-center-right')
    .replaceChild(exp.txt.instructionsTestImage, exp.txt.instructionsFamImage);

  showSlide(
    [textslide, button],
    [
      experimentslide,
      hedge,
      exp.meta.selectedAgents,
      exp.meta.selectedTargets,
      exp.meta.selectedBackground,
      speaker,
    ],
  );

  // on button click, advance to next trial
  const handleContinueClick = () => {
    exp.state.shift();
    prepareTrial(exp);
    showSlide([experimentslide], [textslide, button]);
  };

  button.addEventListener('click', handleContinueClick, {
    capture: false,
    once: true,
  });
}
