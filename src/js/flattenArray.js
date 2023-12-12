/**
 * Function that flattens arrays, i.e., gets all elements out of subarrays.
 *
 * @param {Array} array - An Array to be flattened
 * @return {Array} An array that does not contain subarrays
 *
 * @example
 *       flattenArray([1, [2, 3], [4,5]]);
 */
export function flattenArray(array) {
  return array.reduce(function (flat, toFlatten) {
    return flat.concat(
      Array.isArray(toFlatten) ? flattenArray(toFlatten) : toFlatten,
    );
  }, []);
}
