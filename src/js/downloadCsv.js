/**
 * Function for downloading user data as a CSV to your device. Some data wrangling is done before downloading so that the data is easier to read.
 *
 * @param {Object} log - An object that will be converted into a string and downloaded as a CSV
 * @param {String} ID - An identifier, e.g. participant ID, which will be part of the file name
 *
 * @example
 *     downloadCsv(csvContent, "testID")
 */
export function downloadCsv(log, ID) {
  log.forEach((item) => {
    // create a new variable for each trial, indicating whether it should be kept in the analysis or not
    // only keep trials that are test trials and have no voiceover
    if (item.trialType !== 'test') {
      item.keep_trial = false;
    } else if (!item.voiceover) {
      item.keep_trial = true;
    } else {
      item.keep_trial = false;
    }

    // round targetCenterX and clickX to two decimal places
    item.targetCenterX = parseFloat(item.targetCenterX.toFixed(2));

    if (item.clickX) {
      item.clickX = parseFloat(item.clickX.toFixed(2));
      // if targetCenterX does not exist, skip this trial
    } else {
      item.keep_trial = false;
      item.clickX = null;
    }

    // remove 'balloon-' from the target value
    item.target = item.target.replace('balloon-', '');
  });

  // specify the order in which the variables will be saved into the CSV
  const titleKeys = [
    'id',
    'lang',
    'bg',
    'trialNr',
    'trialType',
    'voiceover',
    'keep_trial',
    'agent',
    'target',
    'bin',
    'targetCenterX',
    'clickX',
    'absoluteClickDistance',
    'timestamp',
    'responsetime',
  ];

  // rename the variables for better readability in CSV
  const columnNames = [
    'id',
    'language',
    'background',
    'trial_number',
    'study_phase',
    'audio_instructions',
    'keep_trial',
    'agent',
    'balloon_color',
    'balloon_bin',
    'balloon_center',
    'click',
    'absolute_click_distance',
    'timestamp',
    'responsetime_ms',
  ];

  // create a mapping for the background values
  const backgroundMapping = {
    '01': 'white_house',
    '02': 'clay_house',
    '03': 'brick_house',
    '04': 'wood_house',
  };

  // create a mapping for the study phase values
  const studyphaseMapping = {
    touch: 'training1',
    fam: 'training2',
    test: 'test',
  };

  // use the column names for the first row
  const refinedData = [];
  refinedData.push(columnNames);

  // use the keys to create the other rows
  log.forEach((item) => {
    const row = titleKeys.map((key) => {
      // If the key is 'background', use the mapping to get the new value
      if (key === 'bg') {
        return backgroundMapping[item[key]];
      }
      if (key === 'trialType') {
        return studyphaseMapping[item[key]];
      }
      // otherwise, return the original value
      else {
        return item[key];
      }
    });
    refinedData.push(row);
  });

  // convert our data array into a CSV string
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
