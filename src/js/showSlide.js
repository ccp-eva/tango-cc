import { gsap } from 'gsap';

/**
 * Function that shows one array of elements, while hiding the second one.
 *
 * @param {Array} toSee - An Array containing SVG elements to show
 * @param {Array} toHide - An Array containing SVG elements to hide
 *
 * @example
 *       showSlide([speaker], [textslideButton]);
 */
export function showSlide(toSee, toHide) {
  toSee.forEach((element) => {
    gsap.set(element, { attr: { visibility: 'visible' } });
  });
  toHide.forEach((element) => {
    gsap.set(element, { attr: { visibility: 'hidden' } });
  });
}
