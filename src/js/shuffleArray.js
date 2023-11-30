/**
 * Function that shuffles an Array.
 *
 * @param {Array} array - An Array to shuffle
 * @return {Array} A shuffled array
 *
 * @example
 *       shuffle([1, 2, 3, 4]);
 */
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
