/**
 * Function for calculating integer divisor and remainder.
 *
 * @param {number} dividend - An integer to be divided
 * @param {number} divisor - An integer to divide by
 * @return {object} An object consisting of the quotient and the remainder
 *
 * @example
 *     divideWithRemainder(5, 3)
 */
export function divideWithRemainder(dividend, divisor) {
  let quotient = 0;
  let remainder = 0;
  if (dividend % divisor === 0) {
    quotient = dividend / divisor;
    // keep remainder = 0
  } else {
    quotient = Math.floor(dividend / divisor);
    remainder = dividend % divisor;
  }
  return { quotient, remainder };
}
