/**
 * Function for pausing the browser.
 * Promisifiable, so that we can wait for it
 *
 * @param {number} ms - A number in milliseconds
 * @return {Promise} A Promise-based time-out
 *
 * @example
 *     pause(1000)
 */
export function pause(ms) {
  new Promise((resolve) => setTimeout(resolve, ms));
}
