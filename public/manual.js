document.addEventListener('DOMContentLoaded', function () {
  const questions = document.querySelectorAll('.faq-question');
  const answers = document.querySelectorAll('.faq-answer');

  for (let i = 0; i < questions.length; i++) {
    questions[i].id = 'faq-question' + (i + 1);
  }

  for (let i = 0; i < answers.length; i++) {
    answers[i].id = 'faq-answer' + (i + 1);
  }

  questions.forEach(function (question, index) {
    question.addEventListener('click', function () {
      toggleAnswer(index + 1);
    });
  });
});

function toggleAnswer(questionNumber) {
  const answer = document.getElementById(`faq-answer${questionNumber}`);
  if (answer.style.display === 'none' || answer.style.display === '') {
    answer.style.display = 'block';
  } else {
    answer.style.display = 'none';
  }
}

// continue on button click
const button = document.getElementById('button-center-item');
const handleContinueClick = () => {
  window.location.href = `./index.html`;
};
button.addEventListener('click', handleContinueClick, { capture: false });
