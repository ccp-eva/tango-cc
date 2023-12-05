import { gsap } from 'gsap';

/**
 * Function for visbility of faces, storing original eye positions,
 * target positions, enabling text via foreignObjects
 *
 * @param {Object} exp - An object storing our experiment data
 *
 * @example
 *     initStimuli(exp)
 */
export function initStimuli(exp) {
  const svg = document.getElementById('svg');
  const hedge = document.getElementById('hedge');

  // TODO: flexible face selection
  // if you change animal agents or targets, then change ID here...
  const female01 = document.getElementById('female01');
  const female02 = document.getElementById('female02');
  const female03 = document.getElementById('female03');
  const female04 = document.getElementById('female04');

  const male01 = document.getElementById('male01');
  const male02 = document.getElementById('male02');
  const male03 = document.getElementById('male03');
  const male04 = document.getElementById('male04');

  const agentsSingle = [
    female01,
    female02,
    female03,
    female04,
    male01,
    male02,
    male03,
    male04,
  ];

  const agentsChar = [
    'female01',
    'female02',
    'female03',
    'female04',
    'male01',
    'male02',
    'male03',
    'male04',
  ];

  const allAgents = Array.from(document.getElementById('agents').children);

  // NOTE: we believe that all target objects are the same size here!!
  const balloonBlue = document.getElementById('balloon-blue');
  const balloonRed = document.getElementById('balloon-red');
  const balloonYellow = document.getElementById('balloon-yellow');
  const balloonGreen = document.getElementById('balloon-green');
  const targetsSingle = [balloonBlue, balloonRed, balloonYellow, balloonGreen];

  // hide all agents & balloons
  [allAgents, targetsSingle].forEach((target) => {
    gsap.set(target, { attr: { visibility: 'hidden' } });
  });

  // save the original eye positions (so when eye is in the center)
  exp.elemSpecs.eyes = {};

  agentsChar.forEach((agent) => {
    exp.elemSpecs.eyes[agent] = {
      radius: document
        .getElementById(`${agent}-eyeline-left`)
        .getAttribute('r'),
      left: {
        center: {
          x: document
            .getElementById(`${agent}-eyeline-left`)
            .getAttribute('cx'),
          y: document
            .getElementById(`${agent}-eyeline-left`)
            .getAttribute('cy'),
        },
        bbox: {
          x: document.getElementById(`${agent}-eyeline-left`).getBBox().x, // same as cx - r
          y: document.getElementById(`${agent}-eyeline-left`).getBBox().y, // same as cy - r
        },
      },
      right: {
        center: {
          x: document
            .getElementById(`${agent}-eyeline-right`)
            .getAttribute('cx'),
          y: document
            .getElementById(`${agent}-eyeline-right`)
            .getAttribute('cy'),
        },
        bbox: {
          x: document.getElementById(`${agent}-eyeline-right`).getBBox().x, // same as cx - r
          y: document.getElementById(`${agent}-eyeline-right`).getBBox().y, // same as cy - r
        },
      },
    };
  });

  // get viewBox size from whole SVG
  exp.elemSpecs.outerSVG = {
    ID: document.getElementById('svg'),
    origViewBox: svg.getAttribute('viewBox'),
    origViewBoxX: parseFloat(svg.getAttribute('viewBox').split(' ')[0]),
    origViewBoxY: parseFloat(svg.getAttribute('viewBox').split(' ')[1]),
    origViewBoxWidth: parseFloat(svg.getAttribute('viewBox').split(' ')[2]),
    origViewBoxHeight: parseFloat(svg.getAttribute('viewBox').split(' ')[3]),
  };

  // calculate some positions of the targets
  exp.elemSpecs.targets = {
    width: balloonBlue.getBBox().width,
    height: balloonBlue.getBBox().height,
    center: {
      x: balloonBlue.getBBox().x,
      y: balloonBlue.getBBox().y,
    },
    // define coords from which point onwards the balloon is hidden behind hedge
    halfway: {
      // position mid, same as in center.x
      x: balloonBlue.getBBox().x,
      // BBox of hedge is a bit too high to hide balloon (because of single grass halms), therefore / 1.1
      y:
        exp.elemSpecs.outerSVG.origViewBoxHeight - hedge.getBBox().height / 1.1,
    },
    // right side of screen as upper boundary
    borderRight:
      exp.elemSpecs.outerSVG.origViewBoxWidth - balloonBlue.getBBox().width,
    // calculate y coords for balloon (-20 for little distance from lower border)
    groundY:
      exp.elemSpecs.outerSVG.origViewBoxHeight -
      balloonBlue.getBBox().height -
      20,
  };

  // enable text for instructions via rect => foreignObject => innerHTML
  const foreignObjects = Array.from(
    document.querySelectorAll('[id^="foreign-object"]'),
  );
  foreignObjects.forEach((elem) => {
    const obj = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'foreignObject',
    );
    [...elem.attributes].map(({ name, value }) =>
      obj.setAttribute(name, value),
    );
    elem.replaceWith(obj);
  });
}
