document.addEventListener('DOMContentLoaded', function () {
  const questions = Array.from(document.querySelectorAll('.faq-question'));
  const answers = Array.from(document.querySelectorAll('.faq-answer'));

  // automatically add ids to questions and answers, so that they can be dynamically be shown/hidden
  questions.forEach((question, index) => {
    question.id = 'faq-question' + (index + 1);
  });

  answers.forEach((answer, index) => {
    answer.id = 'faq-answer' + (index + 1);
  });

  // search bar
  const searchInput = document.getElementById('search-input');

  // mark text that matches query
  function markText(node, query) {
    // only mark text nodes
    if (node.nodeType === Node.TEXT_NODE) {
      const regex = new RegExp(`\\b${query}\\b`, 'gi');
      const matches = node.textContent.match(regex);

      // if there are matches, replace the text node with a fragment
      if (matches) {
        const frag = document.createDocumentFragment();
        let lastIdx = 0;

        // replace each match with a mark element
        // mark changes background color to yellow
        node.textContent.replace(regex, (match, idx) => {
          const part = document.createTextNode(
            node.textContent.slice(lastIdx, idx),
          );
          const marked = document.createElement('mark');
          marked.textContent = match;

          frag.appendChild(part);
          frag.appendChild(marked);

          lastIdx = idx + match.length;
        });

        // append the rest of the text
        const end = document.createTextNode(node.textContent.slice(lastIdx));
        frag.appendChild(end);

        node.parentNode.replaceChild(frag, node);
      }
      // if the node is not a text node, recursively call markText on its children
    } else {
      node.childNodes.forEach((child) => markText(child, query));
    }
  }

  // create count variable for search results
  let currentMatchIndex = 0;
  let matches = [];
  let originalHTML = {}; // Store the original HTML

  // Add an event listener for the input event on the search input field
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    currentMatchIndex = 0; // Reset the current match index
    matches = []; // Reset the matches

    questions.forEach((question, index) => {
      const answer = answers[index];
      const questionText = question.textContent.toLowerCase();
      const answerText = answer.textContent.toLowerCase();

      // Store the original HTML if it's not already stored
      if (!originalHTML[`question${index}`]) {
        originalHTML[`question${index}`] = question.innerHTML;
      }
      if (!originalHTML[`answer${index}`]) {
        originalHTML[`answer${index}`] = answer.innerHTML;
      }

      // If the query is empty, restore the original HTML
      if (query.length === 0) {
        answer.style.display = 'none';
        question.innerHTML = originalHTML[`question${index}`]; // Restore the original HTML
        answer.innerHTML = originalHTML[`answer${index}`]; // Restore the original HTML
        // If the query is not empty and the question or answer contains the query,
        // display the question and answer and mark the text
      } else if (questionText.includes(query) || answerText.includes(query)) {
        question.style.display = 'block';
        answer.style.display = 'block';

        markText(question, query);
        markText(answer, query);

        matches.push(question);
        // If the query is not empty and the question or answer does not contain the query,
        // hide the question and answer and restore the original HTML
      } else {
        answer.style.display = 'none';
        question.innerHTML = originalHTML[`question${index}`]; // Restore the original HTML
        answer.innerHTML = originalHTML[`answer${index}`]; // Restore the original HTML
      }
    });

    // If there are matches, scroll to the first match
    if (matches.length > 0) {
      matches[0].scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Add an event listener for the keydown event on the search input field
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && matches.length > 0) {
      event.preventDefault(); // Prevent form submission

      currentMatchIndex = (currentMatchIndex + 1) % matches.length; // Update the current match index
      matches[currentMatchIndex].scrollIntoView({ behavior: 'smooth' }); // Scroll to the current match
    }
  });

  // show answer when question is clicked
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

// back to top button
const backToTopButton = document.getElementById('back-to-top-button-item');
backToTopButton.addEventListener('click', () => {
  window.scrollTo(0, 0);
});

// continue on button click
const button = document.getElementById('faq-back-button-item');
const handleContinueClick = () => {
  window.location.href = `./index.html`;
};
button.addEventListener('click', handleContinueClick, { capture: false });
