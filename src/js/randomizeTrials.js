import { divideWithRemainder } from './divideWithRemainder';
import { shuffleArray } from './shuffleArray';
import { randomInteger } from './randomInteger';

// ---------------------------------------------------------------------------------------------------------------------
// RANDOMIZATION OF OUR AGENTS, TARGETS AND TARGET POSITIONS
// saves all important arrays in our exp object
// ---------------------------------------------------------------------------------------------------------------------
/**
 * Function that randomizes order of agents & balloon colors, and target positions.
 * Directly manipulates the exp object, stores randomization in log.
 *
 * @param {Object} exp - An object storing our experiment data
 * @param {Array} selectedAgents - An array containing one of each face (HTML element) to be shown in the study
 * @param {Array} selectedTargets - An array containing one of each balloon (HTML element) to be shown in the study
 *
 * @example
 *     randomizeTrials(exp, [male01, female01], [balloonBlue, balloonGreen]);

 */
export function randomizeTrials(exp, selectedAgents, selectedTargets) {
  // create array with trials (filter out text slides)
  let trialArray = exp.state.filter((e) => e !== 'welcome');
  trialArray = trialArray.filter((e) => e !== 'instruction');
  trialArray = trialArray.filter((e) => e !== 'transition');
  trialArray = trialArray.filter((e) => e !== 'goodbye');

  // create response log for each trial
  for (let i = 0; i < exp.meta.trialsTotal; i++) {
    exp.log[i] = {};
    exp.log[i].trialType = trialArray[i];
    exp.log[i].trialNr = i + 1; // since array starts with 0
  }

  // voice over for first trial of each trial kind
  exp.devmode ? (exp.log[0].voiceover = false) : (exp.log[0].voiceover = true);

  for (let i = 1; i < exp.meta.trialsTotal; i++) {
    if (exp.devmode) {
      exp.log[i].voiceover = false;
    } else {
      exp.log[i].voiceover =
        exp.log[i].trialType == exp.log[i - 1].trialType ? false : true;
    }
  }

  // ---------------------------------------------------------------------------------------------------------------------
  // FIX AGENT'S GENDER FOR FIRST 4 TRIALS (coin flip which order in experiment.js)
  // ---------------------------------------------------------------------------------------------------------------------
  let agents = [];

  // calculate how many times each agent should be repeated, based on trialNumber
  const agentsDiv = divideWithRemainder(
    exp.meta.trialsTotal,
    selectedAgents.length,
  );

  for (let i = 0; i < agentsDiv.quotient; i++) {
    const agentsShuffled = shuffleArray(selectedAgents);
    agents = agents.concat(agentsShuffled);
  }

  // if our trialNumber is not divisable by number of agents, put random agents for remainder number:
  // create random array with agents
  // keep only as many entries in array as we need (remove rest)
  // combine with list of repeated agents
  if (agentsDiv.remainder > 0) {
    const agentsTmp = shuffleArray(selectedAgents);
    agentsTmp.splice(0, agentsTmp.length - agentsDiv.remainder);
    agents = agents.concat(agentsTmp);
  }

  // ---------------------------------------------------------------------------------------------------------------------
  // SAME FOR TARGET
  // ---------------------------------------------------------------------------------------------------------------------
  const targetsDiv = divideWithRemainder(
    exp.meta.trialsTotal,
    selectedTargets.length,
  );

  let targets = [];
  for (let i = 0; i < targetsDiv.quotient; i++) {
    const targetsShuffled = shuffleArray(selectedTargets);
    targets = targets.concat(targetsShuffled);
  }

  if (targetsDiv.remainder > 0) {
    const targetsTmp = shuffleArray(selectedTargets);
    targetsTmp.splice(0, targetsTmp.length - targetsDiv.remainder);
    targets = targets.concat(targetsTmp);
  }

  // ---------------------------------------------------------------------------------------------------------------------
  // FOR POSITIONS OF TARGET
  // ---------------------------------------------------------------------------------------------------------------------
  // define possible positions: ten equally big sections, where targets can land
  let positions = [];
  const possiblePositionsCoords = [];
  const bins = 10;
  let prevMax = 0;
  for (let i = 1; i <= bins; i++) {
    const section = {
      bin: i,
      type: 'randomLocation',
      x: randomInteger(prevMax, (exp.elemSpecs.targets.borderRight / bins) * i),
      y: exp.elemSpecs.targets.groundY,
    };
    prevMax = (exp.elemSpecs.targets.borderRight / bins) * i;
    possiblePositionsCoords.push(section);
  }

  // for touch+fam trials that are less than all nr of possible locations:
  // take the most extreme positions
  if (exp.meta.nrTouch + exp.meta.nrFam <= bins) {
    let lower = 0;
    let upper = bins - 1;
    for (let i = 0; i < exp.meta.nrTouch + exp.meta.nrFam; i++) {
      // alternate from which end of the array we take the position
      // for even numbers, take from the upper end; for odd, take from lower end
      if (i % 2 === 0) {
        positions.push(possiblePositionsCoords[upper]);
        upper--;
      }
      if (i % 2 !== 0) {
        positions.push(possiblePositionsCoords[lower]);
        lower++;
      }
    }
  }
  positions = shuffleArray(positions);

  // how many trials are completely randomized
  const randomPositionsNr =
    exp.meta.nrTouch + exp.meta.nrFam <= bins
      ? exp.meta.nrTest
      : exp.trials.totalNr;

  // how many times can we repeat each section
  const positionsDiv = divideWithRemainder(
    randomPositionsNr,
    possiblePositionsCoords.length,
  );

  for (let i = 0; i < positionsDiv.quotient; i++) {
    const positionsShuffled = shuffleArray(possiblePositionsCoords);
    positions = positions.concat(positionsShuffled);
  }

  // if division with remainder, fill up array
  if (positionsDiv.remainder > 0) {
    const positionsTmp = shuffleArray(possiblePositionsCoords);
    positionsTmp.splice(0, positionsTmp.length - positionsDiv.remainder);
    positions = positions.concat(positionsTmp);
  }

  // ---------------------------------------------------------------------------------------------------------------------
  // PREPARE RESPONSE LOG
  // ---------------------------------------------------------------------------------------------------------------------
  for (let i = 0; i < exp.meta.trialsTotal; i++) {
    exp.log[i].agent = agents[i].getAttribute('id');
    exp.log[i].target = targets[i].getAttribute('id');
    exp.log[i].bin = positions[i].bin;
    exp.log[i].targetX = positions[i].x;
    exp.log[i].targetCenterX = positions[i].x + exp.meta.targetWidth / 2;
    exp.log[i].targetY = positions[i].y;
  }
}
