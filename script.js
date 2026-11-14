const QUOTES = [
  "The quick brown fox jumps over the lazy dog while mastering clean JavaScript DOM manipulation.",
  "Programming is not about typing, it is about thinking clearly and breaking problems into small steps.",
  "Consistent daily practice builds muscle memory, reduces errors, and boosts your confidence at the keyboard.",
  "Clean code always looks like it was written by someone who cares deeply about the craft of software.",
  "Modern web browsers provide powerful native APIs that require zero external libraries to build fast apps."
];

const MAX_TIME = 60;
let timeLeft = MAX_TIME;
let timer = null;
let isTyping = false;
let mistakes = 0;

const quoteDisplay = document.getElementById("quote-display");
const quoteInput = document.getElementById("quote-input");
const timeDisplay = document.getElementById("time-display");
const mistakesDisplay = document.getElementById("mistakes-display");
const wpmDisplay = document.getElementById("wpm-display");
const accuracyDisplay = document.getElementById("accuracy-display");
const restartBtn = document.getElementById("restart-btn");
const resultModal = document.getElementById("result-modal");
const modalRestartBtn = document.getElementById("modal-restart-btn");

function loadQuote() {
  const randomIndex = Math.floor(Math.random() * QUOTES.length);
  const selectedQuote = QUOTES[randomIndex];
  quoteDisplay.innerHTML = "";

  selectedQuote.split("").forEach((char, index) => {
    const span = document.createElement("span");
    span.innerText = char;
    if (index === 0) span.classList.add("active");
    quoteDisplay.appendChild(span);
  });
}

function initGame() {
  clearInterval(timer);
  timeLeft = MAX_TIME;
  isTyping = false;
  mistakes = 0;

  quoteInput.value = "";
  quoteInput.disabled = false;
  timeDisplay.innerText = `${timeLeft}s`;
  mistakesDisplay.innerText = "0";
  wpmDisplay.innerText = "0";
  accuracyDisplay.innerText = "100%";

  if (resultModal.open) {
    resultModal.close();
  }

  loadQuote();
  quoteInput.focus();
}

function calculateMetrics() {
  const totalTyped = quoteInput.value.length;
  const timeElapsedInMinutes = (MAX_TIME - timeLeft) / 60;

  let netWpm = 0;
  if (timeElapsedInMinutes > 0) {
    netWpm = Math.round(((totalTyped - mistakes) / 5) / timeElapsedInMinutes);
  }
  if (netWpm < 0 || Number.isNaN(netWpm)) {
    netWpm = 0;
  }

  let accuracy = 100;
  if (totalTyped > 0) {
    const correctChars = Math.max(0, totalTyped - mistakes);
    accuracy = Math.round((correctChars / totalTyped) * 100);
  }

  wpmDisplay.innerText = netWpm;
  accuracyDisplay.innerText = `${accuracy}%`;
  return { netWpm, accuracy };
}

function updateTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timeDisplay.innerText = `${timeLeft}s`;
    calculateMetrics();
  } else {
    finishGame();
  }
}

function finishGame() {
  clearInterval(timer);
  quoteInput.disabled = true;
  const { netWpm, accuracy } = calculateMetrics();

  document.getElementById("final-wpm").innerText = netWpm;
  document.getElementById("final-acc").innerText = `${accuracy}%`;
  document.getElementById("final-mistakes").innerText = mistakes;
  resultModal.showModal();
}

quoteInput.addEventListener("input", () => {
  const spanArray = quoteDisplay.querySelectorAll("span");
  const userTyped = quoteInput.value;

  if (!isTyping && userTyped.length > 0) {
    isTyping = true;
    timer = setInterval(updateTimer, 1000);
  }

  let currentMistakes = 0;

  spanArray.forEach((span, index) => {
    const char = userTyped[index];
    span.classList.remove("active");

    if (char == null) {
      span.className = "";
    } else if (char === span.innerText) {
      span.className = "correct";
    } else {
      span.className = "incorrect";
      currentMistakes++;
    }
  });

  if (userTyped.length < spanArray.length) {
    spanArray[userTyped.length].classList.add("active");
  }

  mistakes = currentMistakes;
  mistakesDisplay.innerText = mistakes;
  calculateMetrics();

  if (userTyped.length >= spanArray.length) {
    finishGame();
  }
});

restartBtn.addEventListener("click", initGame);
modalRestartBtn.addEventListener("click", initGame);

initGame();