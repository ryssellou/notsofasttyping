const RANDOM_QUOTE_API_URL = 'https://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');

let interval;
let startTime;
let timerStarted = false; // Add a flag to track the timer's state

quoteInputElement.addEventListener('input', () => {
  // Start the timer only on the first character typed and if the timer hasn't already started
  if (!timerStarted && quoteInputElement.value.length === 1) {
    startTimer();
    timerStarted = true; // Set the flag to true to indicate the timer has started
  }

  const arrayQuote = quoteDisplayElement.querySelectorAll('span');
  const arrayValue = quoteInputElement.value.split('');

  let correct = true;
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      characterSpan.classList.remove('correct');
      characterSpan.classList.remove('incorrect');
      correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add('correct');
      characterSpan.classList.remove('incorrect');
    } else {
      characterSpan.classList.remove('correct');
      characterSpan.classList.add('incorrect');
      correct = false;
    }
  });

  if (correct) {
    clearInterval(interval); // Stop the timer
    const totalTime = getTimerTime() || 1; // Ensure totalTime is not zero to avoid division by zero error
    const wordCount = quoteDisplayElement.innerText.split(' ').length;
    const wpm = Math.round((wordCount / totalTime) * 60); // Calculate WPM
    alert(`Your WPM is ${wpm}`); // Display WPM
    renderNewQuote(); // Load a new quote
  }
});

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then(response => response.json())
    .then(data => data.content)
    .catch(error => console.error("Failed to fetch quote: ", error)); // Error handling
}

async function renderNewQuote() {
  if (interval) clearInterval(interval); // Clear existing timer
  timerStarted = false; // Reset the timerStarted flag so the timer can start with the next input

  const quote = await getRandomQuote();
  quoteDisplayElement.innerHTML = '';
  quote.split('').forEach(character => {
    const characterSpan = document.createElement('span');
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });
  quoteInputElement.value = null;
  // Do not automatically start the timer here; it will start on first input
}

function startTimer() {
  timerElement.innerText = 0;
  startTime = new Date();
  interval = setInterval(() => {
    timerElement.innerText = getTimerTime();
  }, 1000);
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

renderNewQuote();
