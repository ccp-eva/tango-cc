/**
 * Function for playing audio (not-promisifiable).
 * For quicker developer experience, increases playrate speed in devmode.
 *
 * @param {Object} exp - An object storing our experiment data. Contains Audio element ("soundEffect").
 * @param {string} src - A source of the MP3 you want to play
 *
 * @example
 *     playAudio(exp, welcomeSrc)
 */
export function playAudio(exp, src) {
  try {
    if (exp.devmode) exp.soundEffect.playbackRate = 4;
    exp.soundEffect.src = src;
    exp.soundEffect.play();
  } catch (error) {
    console.error('src: ', src, 'error: ', error);
  }
}
