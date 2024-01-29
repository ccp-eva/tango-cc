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
  const textslide = document.getElementById('textslide');
  const button = document.getElementById('textslide-button');
  const downloadIcon = document.getElementById('download-icon');
  const experimentslide = document.getElementById('experimentslide');
  const speaker = document.getElementById('speaker');
  const clickableArea = document.getElementById('clickable-area');

  document
    .getElementById('foreign-object-heading')
    .appendChild(exp.txt.welcomeHeading);
  document
    .getElementById('foreign-object-center-left')
    .appendChild(exp.txt.welcomeParagraph);
  document
    .getElementById('foreign-object-center-right')
    .appendChild(exp.txt.familyImage);

  showSlide(
    [textslide],
    [experimentslide, speaker, clickableArea, downloadIcon],
  );

  // when button is clicked, advance to instructions
  button.addEventListener(
    'click',

    // needs to be within unnamed function because otherwise directly called & "skips" welcome content
    function () {
      exp.state.shift();
      showInstructionSlide(exp);
    },
    {
      capture: false,
      once: true,
    },
  );
}
