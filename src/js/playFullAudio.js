/**
 * Function for playing audio (PROMISIFIABLE).
 * For quicker developer experience, increases playrate speed in devmode.
 *
 * @param {Object} exp - An object storing our experiment data. Contains Audio element ("soundEffect").
 * @param {string} src - A source of the MP3 you want to play
 *
 * @example
 *     await playFullAudio(exp, welcomeSrc)
 */
export async function playFullAudio(exp, src) {
  return new Promise((resolve, reject) => {
    exp.soundEffect.src = src;
    if (exp.devmode) exp.soundEffect.playbackRate = 4;
    exp.soundEffect.play();
    exp.soundEffect.onended = resolve;
    // WHEN ACTIVE: GETS THROWN; THEN OBVIOUSLY PROMISE "OVER"; AWAIT DONE...
    // audio.onerror = reject(new Error(`Error in playing audio ${audio.src}`));
  }).catch((error) => console.log(error));
}
