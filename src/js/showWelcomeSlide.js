import { showSlide } from './showSlide';
import { showInstructionSlide } from './showInstructionSlide';

/**
 * Function that shows text on welcome slide and passes over to instructions text.
 *
 * @param {Object} exp - An object storing our experiment data
 *
 * @example
 *       showWelcomeSlide(exp);
 */
export function showWelcomeSlide(exp) {
  const button = document.getElementById('textslide-button');
  const textslide = document.getElementById('textslide');
  const experimentslide = document.getElementById('experimentslide');
  const speaker = document.getElementById('speaker');

  document
    .getElementById('foreign-object-heading')
    .appendChild(exp.txt.welcomeHeading);
  document
    .getElementById('foreign-object-center-left')
    .appendChild(exp.txt.welcomeParagraph);
  document
    .getElementById('foreign-object-center-right')
    .appendChild(exp.txt.familyImage);

  showSlide([textslide], [experimentslide, speaker]);

  // when button is clicked, advance to instructions
  button.addEventListener(
    'click',

    // needs to be within unnamed function because otherwise directly called & "skips" welcome content
    function () {
      showInstructionSlide(exp);
    },
    {
      capture: false,
      once: true,
    },
  );
}
