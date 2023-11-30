const button = document.getElementById('button-center-item');
let continueIDOK = false;

// FOR INPUT FORM
const textField = document.querySelector('.mdc-text-field__input');

// define what happens on input
const handleInput = (event) => {
  event.preventDefault();
  // to get most recent value, get element fresh
  // count number of characters and display the count
  document.querySelector('.mdc-text-field-character-counter').innerHTML = `${
    document.querySelector('.mdc-text-field__input').value.length
  } / 8`;

  continueIDOK =
    document.querySelector('.mdc-text-field__input').value.length === 8;
  // enable button when eight characters are entered
  button.disabled = !continueIDOK;
};

textField.addEventListener('keyup', handleInput, { capture: false });

// LANGUAGE CHOICE
const languageOptions = document.getElementById('language-options');
let lang = languageOptions.value;

languageOptions.addEventListener('change', function () {
  lang = languageOptions.value;
});

// WEBCAM YES OR NO?
const webcamOptions = document.getElementsByName('webcam-options');
let webcam = false; // no as default

for (const option of webcamOptions) {
  option.onclick = () => {
    if (option.checked) {
      webcam = option.value;
    }
  };
}

// define what happens on button click
const handleContinueClick = (event) => {
  event.preventDefault();
  const subjID = document.querySelector('.mdc-text-field__input').value;
  // console.log(`./tango.html?ID=${subjID}&lang=${lang}&webcam=${webcam}`);
  window.location.href = `./tango.html?ID=${subjID}&lang=${lang}&webcam=${webcam}`;
};

button.addEventListener('click', handleContinueClick, { capture: false });
