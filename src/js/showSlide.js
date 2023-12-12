import { flattenArray } from './flattenArray';

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
  // first make sure arrays are flat, don't contain subarrays
  const toSeeFlat = flattenArray(toSee);
  const toHideFlat = flattenArray(toHide);

  // show first array, hide second
  toSeeFlat.forEach((element) => {
    element.setAttribute('visibility', 'visible');
  });
  toHideFlat.forEach((element) => {
    element.setAttribute('visibility', 'hidden');
  });
}
