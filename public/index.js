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
    document.querySelector('.mdc-text-field__input').value.length > 0;
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
let webcam = 'false'; // no as default

for (const option of webcamOptions) {
  option.onclick = () => {
    if (option.checked) {
      webcam = option.value;
    }
  };
}

// CUSTOMZE YES OR NO?
const customizeOptions = document.getElementsByName('customize-options');
let customize = 'false'; // no as default

for (const option of customizeOptions) {
  option.onclick = () => {
    if (option.checked) {
      customize = option.value;
    }
  };
}

// define what happens on button click
const handleContinueClick = (event) => {
  event.preventDefault();
  const subjID = document.querySelector('.mdc-text-field__input').value;

  let agents;
  let bg = '01';
  switch (lang) {
    case 'bay':
      agents = 'f01-f02-f03-f04-m01-m02-m03-m04';
      break;
    case 'bem':
      agents = 'f01-f02-f03-f04-m01-m02-m03-m04';
      break;
    case 'chi':
      agents = 'f18-f19-f20-f21-m18-m19-m20-m21';
      break;
    case 'eng-in':
      agents = 'f22-f23-f24-f25-m22-m23-m24-m25';
      break;
    case 'eng-nz':
      agents = 'f05-f06-f11-f15-m05-m06-m11-m15';
      break;
    case 'eng-ni':
      agents = 'f01-f02-f03-f04-m01-m02-m03-m04';
      break;
    case 'eng-uk':
      agents = 'f05-f07-f08-f10-m03-m06-m09-m11';
      break;
    case 'eng-us':
      agents = 'f01-f05-f06-f09-m05-m06-m08-m09';
      break;
    case 'ger':
      agents = 'f05-f07-f08-f10-m03-m06-m09-m11';
      break;
    case 'hai':
      agents = 'f01-f02-f03-f04-m01-m02-m03-m04';
      break;
    case 'khw':
      agents = 'f01-f02-f03-f04-m01-m02-m03-m04';
      break;
    case 'lin':
      agents = 'f01-f02-f03-f04-m01-m02-m03-m04';
      break;
    case 'mar':
      agents = 'f22-f23-f24-f25-m22-m23-m24-m25';
      break;
    case 'sho':
      agents = 'f01-f02-f03-f04-m01-m02-m03-m04';
      break;
    case 'spa-ar':
      agents = 'f05-f07-f09-f21-m05-m07-m13-m18';
      break;
    case 'spa-me':
      agents = 'f05-f12-f15-f16-m13-m14-m15-m17';
      break;
    case 'swa':
      agents = 'f01-f02-f03-f04-m01-m02-m03-m04';
      break;
    case 'tur':
      agents = 'f05-f09-f18-f21-m05-m09-m18-m21';
      break;
  }

  // if wanted, continue to customize page
  if (customize === 'true') {
    window.location.href = `./customize.html?ID=${subjID}&lang=${lang}&webcam=${webcam}&agents=${agents}&bg=${bg}&touch=1&fam=2&test=16`;

    // otherwise, jump directly to study start
  } else {
    window.location.href = `./tango.html?ID=${subjID}&lang=${lang}&webcam=${webcam}&agents=${agents}&bg=${bg}&touch=1&fam=2&test=16`;
  }
};

button.addEventListener('click', handleContinueClick, { capture: false });
