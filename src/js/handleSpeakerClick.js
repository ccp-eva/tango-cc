import { showSlide } from './showSlide';
import { playFullAudio } from './playFullAudio';

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
    await playFullAudio(exp, `../sounds/${exp.meta.lang}/welcome.mp3`);
    showSlide([textslideButton], []);
  }

  // for goodbye message
  if (exp.trial === exp.meta.trialsTotal) {
    await playFullAudio(exp, `../sounds/${exp.meta.lang}/goodbye.mp3`);
  }
}
