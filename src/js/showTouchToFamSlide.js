import { showSlide } from './showSlide';
import { prepareTrial } from './prepareTrial';

/**
 * Function that shows text between touch and fam trials.
 *
 * @param {Object} exp - An object storing our experiment data
 *
 * @example
 *       showTouchToFamSlide(exp);
 */
export function showTouchToFamSlide(exp) {
  const button = document.getElementById('textslide-button');
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
  const speaker = document.getElementById('speaker');

  document
    .getElementById('foreign-object-heading')
    .replaceChild(
      exp.txt.instructionsFamHeading,
      exp.txt.instructionsTouchHeading,
    );
  document
    .getElementById('foreign-object-center-left')
    .replaceChild(
      exp.txt.instructionsFamParagraph,
      exp.txt.instructionsTouchParagraph,
    );
  document
    .getElementById('foreign-object-center-right')
    .replaceChild(exp.txt.instructionsFamImage, exp.txt.instructionsTouchImage);

  showSlide(
    [textslide, button],
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
