/**
 * Function for downloading user data to device
 *
 * @param {Object} safe - An object that will be downloaded as a JSON file
 * @param {Object} ID - An identifier, e.g. participant ID, which will be part of the file name
 *
 * @example
 *     downloadData(responses, "testID")
 *     downloadData({ meta: exp.meta, log: exp.log }, exp.meta.subjID);
 */
export function downloadData(safe, ID) {
  const toSave = new Blob([JSON.stringify(safe, null, 1)]);
  const day = new Date().toISOString().substr(0, 10);
  // note: it's UTC time (so for germany add +1)
  const time = new Date().toISOString().substr(11, 8);

  const hiddenElement = document.createElement('a');
  hiddenElement.href = window.URL.createObjectURL(toSave);
  hiddenElement.download = `tango-cc-${ID}-${day}-${time}.json`;
  hiddenElement.click();
}
