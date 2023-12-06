/**
 * Function for downloading user data as a CSV to your device
 *
 * @param {Object} log - An object that will be converted into a string and downloaded as a CSV
 * @param {String} ID - An identifier, e.g. participant ID, which will be part of the file name
 *
 * @example
 *     downloadCsv(csvContent, "testID")
 */
export function downloadCsv(log, ID) {
  // convert object into CSV string
  const titleKeys = Object.keys(log[0]);
  const refinedData = [];
  refinedData.push(titleKeys);

  log.forEach((item) => {
    refinedData.push(Object.values(item));
  });

  let csvContent = '';
  refinedData.forEach((row) => {
    csvContent += row.join(',') + '\n';
  });

  // save current date & time (note: UTC time!)
  const day = new Date().toISOString().substring(0, 10);
  const time = new Date().toISOString().substring(11, 19);

  // download via blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8,' });
  const objUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', objUrl);
  link.setAttribute('download', `tangoCC-${ID}-${day}-${time}.csv`);
  link.click();
}
