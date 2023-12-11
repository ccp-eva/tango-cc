// store already selected variables from index page
const url = new URL(document.location.href);
const subjID = url.searchParams.get('ID') || 'testID';
const lang = url.searchParams.get('lang') || 'eng-uk';
const webcam = JSON.parse(url.searchParams.get('webcam')) || false;

// SELECT BACKGROUND
let selectedBackground;
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
let selectedAgents;

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

// continue on button click
const button = document.getElementById('button-center-item');
const handleContinueClick = () => {
  const touch = parseFloat(document.getElementById('touch').value);
  const fam = parseFloat(document.getElementById('fam').value);
  const test = parseFloat(document.getElementById('test').value);
  window.location.href = `./tango.html?ID=${subjID}&lang=${lang}&webcam=${webcam}&touch=${touch}&fam=${fam}&test=${test}&bg=${selectedBackground}&agents=${selectedAgents}`;
};
button.addEventListener('click', handleContinueClick, { capture: false });
