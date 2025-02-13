import { gsap } from 'gsap';

/**
 * Function that shows one position in an array while hiding the other elements.
 *
 * @param {Array} elements - An Array containing SVG elements
 * @param {number} trialCount - A counter variable indicating which element of the Array to show
 *
 * @example
 *       showElement(exp.agents, exp.trial);
 */
export function showElement(elements, trialCount) {
  for (let i = 0; i < elements.length; i++) {
    if (elements[i] === elements[trialCount]) {
      gsap.set(elements[i], { autoAlpha: 1 });
    } else {
      gsap.set(elements[i], { autoAlpha: 0 });
    }
  }
}
