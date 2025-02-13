import { showSlide } from './showSlide';

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

  const window01 = document.getElementById('window01');
  const window02 = document.getElementById('window02');
  const window03 = document.getElementById('window03');
  const window04 = document.getElementById('window04');
  const wall01 = document.getElementById('wall01');
  const wall02 = document.getElementById('wall02');
  const wall03 = document.getElementById('wall03');
  const wall04 = document.getElementById('wall04');

  const bgs = [
    window01,
    window02,
    window03,
    window04,
    wall01,
    wall02,
    wall03,
    wall04,
  ];

  exp.meta.selectedBackground = [
    document.getElementById(`wall${exp.meta.bg}`),
    document.getElementById(`window${exp.meta.bg}`),
  ];

  const allAgents = Array.from(document.getElementById('agents').children);

  // convert short URL param into SVG element IDs
  exp.meta.stringAgents = exp.meta.agents
    .replaceAll('m', 'male')
    .replaceAll('f', 'female')
    .split('-');

  exp.meta.selectedAgents = [];
  exp.meta.stringAgents.forEach((agent) => {
    exp.meta.selectedAgents.push(document.getElementById(`${agent}`));
  });

  exp.meta.selectedTargets = [
    document.getElementById('balloon-blue'),
    document.getElementById('balloon-red'),
    document.getElementById('balloon-yellow'),
    document.getElementById('balloon-green'),
  ];

  // hide all agents & balloons
  showSlide([], [bgs, allAgents, exp.meta.selectedTargets]);

  // save the original eye positions (so when eye is in the center)
  exp.elemSpecs.eyes = {};

  exp.meta.stringAgents.forEach((agent) => {
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
    width: exp.meta.selectedTargets[0].getBBox().width,
    height: exp.meta.selectedTargets[0].getBBox().height,
    center: {
      x: exp.meta.selectedTargets[0].getBBox().x,
      y: exp.meta.selectedTargets[0].getBBox().y,
    },
    // define coords from which point onwards the balloon is hidden behind hedge
    halfway: {
      // position mid, same as in center.x
      x: exp.meta.selectedTargets[0].getBBox().x,
      // BBox of hedge is a bit too high to hide balloon (because of single grass halms), therefore / 1.1
      y:
        exp.elemSpecs.outerSVG.origViewBoxHeight - hedge.getBBox().height / 1.1,
    },
    // right side of screen as upper boundary
    borderRight:
      exp.elemSpecs.outerSVG.origViewBoxWidth -
      exp.meta.selectedTargets[0].getBBox().width,
    // calculate y coords for balloon (-20 for little distance from lower border)
    groundY:
      exp.elemSpecs.outerSVG.origViewBoxHeight -
      exp.meta.selectedTargets[0].getBBox().height -
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
