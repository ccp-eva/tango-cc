window.addEventListener('load', function () {
  const spinner = document.getElementById('spinner-wrapper');
  spinner.style.display = 'none';
});

// store already selected variables from index page
const url = new URL(document.location.href);
const lang = url.searchParams.get('lang') || 'eng-uk';
let selectedAgents = url.searchParams.get('agents');
let selectedBackground = url.searchParams.get('bg');
const webcam = JSON.parse(url.searchParams.get('webcam')) || false;

// TRIAL NUMBERS
// for touch, fam and test, check whether user input is valid
const touch = document.getElementById('touch');
const fam = document.getElementById('fam');
const test = document.getElementById('test');
const trialNumbers = [touch, fam, test];

trialNumbers.forEach((trial) => {
  trial.addEventListener('input', function () {
    // minimum 1, maximum 100
    if (this.value <= 0) {
      this.value = 1;
    }
    if (this.value > 100) {
      this.value = 100;
    }

    // if user entered a number, check if it's a whole number
    if (this.value !== '') {
      if (!Number.isInteger(parseFloat(this.value))) {
        this.value = Math.round(parseFloat(this.value));
      }
    }

    // if user entered a character, remove it
    if (this.value === '0') {
      this.value = '';
    }
  });
});

// SELECT BACKGROUND
function selectBackground(image) {
  // Remove the 'selected' class from all images
  const images = document.querySelectorAll('.bg-container img');
  images.forEach((image) => image.classList.remove('selected'));

  // Add the 'selected' class to the clicked image
  const imgID = image.getAttribute('id');
  const selectedImage = document.querySelector(`.bg-img[id="${imgID}"]`);
  selectedImage.classList.add('selected');
  selectedBackground = imgID;
}

// attach the event listener
const backgrounds = document.querySelectorAll('.bg-container img');
backgrounds.forEach((bg) => {
  bg.addEventListener('click', function () {
    selectBackground(this);
  });
});

// SELECT AGENTS
let selectedAgentsArray = [];

// Check if the image is selected or not, and add / delete from array
function selectAgents(image) {
  const imgID = image.getAttribute('id');
  image.classList.toggle('selected');
  if (image.classList.contains('selected')) {
    selectedAgentsArray.push(imgID);
  } else {
    const index = selectedAgentsArray.indexOf(imgID);
    if (index !== -1) {
      selectedAgentsArray.splice(index, 1);
    }
  }
  selectedAgents = selectedAgentsArray.join('-');
}
// Attach the event listener to all images once they're loaded
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.agents-container img');
  images.forEach((image) => {
    image.addEventListener('click', function () {
      selectAgents(this);
    });
  });
});

document.addEventListener('click', (event) => {
  const img = event.target.closest('.toggle-image');
  if (img && img.nextElementSibling.tagName === 'FIGCAPTION') {
    img.nextElementSibling.classList.toggle('hidden');
  }
});

const allagentsCheckbox = document.getElementById('select-all-agents');
allagentsCheckbox.addEventListener('change', function (e) {
  if (e.target.checked) {
    document.querySelectorAll('.agents-container img').forEach((img) => {
      img.classList.add('selected');
    });
    selectedAgentsArray = [
      'f01',
      'f02',
      'f03',
      'f04',
      'f05',
      'f06',
      'f07',
      'f08',
      'f09',
      'f10',
      'f11',
      'f12',
      'f13',
      'f14',
      'f15',
      'f16',
      'f17',
      'f18',
      'f19',
      'f20',
      'f21',
      'f22',
      'f23',
      'f24',
      'f25',
      'm01',
      'm02',
      'm03',
      'm04',
      'm05',
      'm06',
      'm07',
      'm08',
      'm09',
      'm10',
      'm11',
      'm12',
      'm13',
      'm14',
      'm15',
      'm16',
      'm17',
      'm18',
      'm19',
      'm20',
      'm21',
      'm22',
      'm23',
      'm24',
      'm25',
    ];
  } else {
    document.querySelectorAll('.agents-container img').forEach((img) => {
      img.classList.remove('selected');
    });
    selectedAgentsArray = [];
  }
  selectedAgents = selectedAgentsArray.join('-');
});

// continue on button click
const button = document.getElementById('button-center-item');
const handleContinueClick = () => {
  const touch = parseFloat(document.getElementById('touch').value);
  const fam = parseFloat(document.getElementById('fam').value);
  const test = parseFloat(document.getElementById('test').value);
  window.location.href = `./id.html?lang=${lang}&touch=${touch}&fam=${fam}&test=${test}&bg=${selectedBackground}&agents=${selectedAgents}`;
};
button.addEventListener('click', handleContinueClick, { capture: false });
