/**
 * Function that returns an integer random number between min (included) and max (included)
 *
 * @param {number} min - A lower boundary for the random number
 * @param {number} max - An upper boundary for the random number
 * @return {number} A random integer number betweeen min and max
 *
 * @example
 *     randomInteger(2, 9)
 */
export function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
