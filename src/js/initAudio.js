/**
 * Function for saving audio durations and unlocking Audio element
 *
 * @param {Object} exp - An object storing our experiment data
 *
 * @example
 *     initAudio(exp)
 */
export async function initAudio(exp) {
  // create Audio element that will play all our audios
  exp.soundEffect = new Audio();

  // unlock audio element on first user interaction
  // later we adjust the source to each individual audio file
  // (event touchstart only works for touchscreens)
  document.body.addEventListener(
    'touchstart',
    () => {
      exp.soundEffect.play();
    },
    { capture: false, once: true },
  );

  // depending on study language, dynamically load sound sources
  const audioSrcs = [
    `./sounds/${exp.meta.lang}/balloon-lands.mp3`,
    `./sounds/${exp.meta.lang}/blink.mp3`,
    `./sounds/${exp.meta.lang}/fam-hedge-1-f.mp3`,
    `./sounds/${exp.meta.lang}/fam-hedge-1-m.mp3`,
    `./sounds/${exp.meta.lang}/goodbye.mp3`,
    `./sounds/${exp.meta.lang}/positive-feedback.mp3`,
    `./sounds/${exp.meta.lang}/prompt-general.mp3`,
    `./sounds/${exp.meta.lang}/prompt-hedge-long.mp3`,
    `./sounds/${exp.meta.lang}/prompt-hedge.mp3`,
    `./sounds/${exp.meta.lang}/prompt-touch-long.mp3`,
    `./sounds/${exp.meta.lang}/prompt-touch.mp3`,
    `./sounds/${exp.meta.lang}/test-hedge-1-f.mp3`,
    `./sounds/${exp.meta.lang}/test-hedge-1-m.mp3`,
    `./sounds/${exp.meta.lang}/test-hedge-2-f.mp3`,
    `./sounds/${exp.meta.lang}/test-hedge-2-m.mp3`,
    `./sounds/${exp.meta.lang}/test-hedge-3-f.mp3`,
    `./sounds/${exp.meta.lang}/test-hedge-3-m.mp3`,
    `./sounds/${exp.meta.lang}/touch-1-f.mp3`,
    `./sounds/${exp.meta.lang}/touch-1-m.mp3`,
    `./sounds/${exp.meta.lang}/welcome.mp3`,
  ];

  exp.elemSpecs.audioDur = {};

  // save durations of the mp3s so that we can wait with animations later on
  audioSrcs.forEach((src) => {
    const audioTmp = new Audio();
    audioTmp.src = src;
    audioTmp.onloadedmetadata = () => {
      exp.devmode
        ? (exp.elemSpecs.audioDur[src] = audioTmp.duration / 4)
        : (exp.elemSpecs.audioDur[src] = audioTmp.duration);
    };
  });
}
