/**
 * Function for calculating the distance between two points.
 *
 * @param {Object} coord1 - An object containing x- and y-values for point 1
 * @param {Object} coord2 - An object containing x- and y-values for point 2
 * @return {number} The distance between the two points (in 2D space)
 *
 * @example
 *     distancePoints(startPos, endPos)
 */
export function distancePoints(coord1, coord2) {
  return Math.abs(
    Math.sqrt((coord2.x - coord1.x) ** 2 + (coord2.y - coord1.y) ** 2),
  );
}
