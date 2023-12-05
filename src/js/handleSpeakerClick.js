import { showSlide } from './showSlide';
import { playFullAudio } from './playFullAudio';
import welcomeSrc from '../sounds/ger/welcome.mp3';
import goodbyeSrc from '../sounds/ger/goodbye.mp3';

/**
 * Function for when speaker in instructions has been clicked.
 *
 * @param {Object} exp - An object storing our experiment data
 *
 * @example
 *      handleSpeakerClick(exp)
 */
export async function handleSpeakerClick(exp) {
  // for welcome message
  if (exp.trial === 0) {
    const textslideButton = document.getElementById('textslide-button');
    // play instructions audio, only show button once audio is finished playing
    showSlide([], [textslideButton]);
    await playFullAudio(exp, welcomeSrc);
    showSlide([textslideButton], []);
  }

  // for goodbye message
  if (exp.trial === exp.meta.trialsTotal) {
    await playFullAudio(exp, goodbyeSrc);
  }
}
