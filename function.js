let numbers = [];
let called = [];

function generateNumbers() {
  const letters = ["B", "I", "N", "G", "O"];
  numbers = [];

  for (let i = 0; i < 5; i++) {
    const start = i * 15 + 1;
    const end = start + 14;
    for (let j = start; j <= end; j++) {
      numbers.push(`${letters[i]}${j}`);
    }
  }
}

function shuffleNumber() {
  if (numbers.length === 0) {
    alert("All numbers have been called!");
    return;
  }

  const display = document.getElementById("currentNumber");
  const currentLetter = document.getElementById("currentLetter");
  const currentDigit = document.getElementById("currentDigit");

  // Show suspense message
  currentLetter.textContent = "";
  currentDigit.textContent = "...";
  display.className = "bingo-display";

  // Disable button temporarily
  const shuffleBtn = document.querySelector(".shuffle");
  shuffleBtn.disabled = true;
  shuffleBtn.textContent = "Drawing...";

  // Delay for 5 seconds
  setTimeout(() => {
    const index = Math.floor(Math.random() * numbers.length);
    const selected = numbers.splice(index, 1)[0];
    called.push(selected);

    const letter = selected.charAt(0);
    const number = selected.substring(1);

    // Update display
    currentLetter.textContent = letter;
    currentDigit.textContent = number;

    // Update color style
    display.className = "bingo-display";
    display.classList.add(`bingo-${letter}`, "bounce");

    setTimeout(() => display.classList.remove("bounce"), 600);

    // Speak result
    const synth = window.speechSynthesis;
    if (synth) {
      const utter = new SpeechSynthesisUtterance(`${letter} ${number}`);
      utter.rate = 0.9;
      synth.cancel();
      synth.speak(utter);
    }

    // Add to history
    const calledList = document.getElementById("calledNumbers");
    const div = document.createElement("div");
    div.className = "called-number";
    div.textContent = selected;
    calledList.prepend(div);

    // Update last 5 display
    updateLastFive();

    // Re-enable button
    shuffleBtn.disabled = false;
    shuffleBtn.textContent = "Shuffle";
  }, 2500); // 5-second delay
}

function updateLastFive() {
  const lastFive = called.slice(-5).reverse(); // Get last 5, most recent first
  const container = document.getElementById("lastFive");
  container.innerHTML = ""; // Clear old

  lastFive.forEach((item) => {
    const ball = document.createElement("div");
    const letter = item.charAt(0);
    ball.className = `ball ${letter}`;
    ball.textContent = item;
    container.appendChild(ball);
  });
}

function resetGame() {
  generateNumbers();
  called = [];

  // Reset current ball properly
  const display = document.getElementById("currentNumber");
  const currentLetter = document.getElementById("currentLetter");
  const currentDigit = document.getElementById("currentDigit");

  currentLetter.textContent = "-";
  currentDigit.textContent = "--";
  display.className = "bingo-display";

  // Clear history
  document.getElementById("calledNumbers").innerHTML = "";
  document.getElementById("lastFive").innerHTML = "";

  // Reset button state
  const shuffleBtn = document.querySelector(".shuffle");
  shuffleBtn.disabled = false;
  shuffleBtn.textContent = "Shuffle";

  // Cancel voice
  window.speechSynthesis.cancel();
}

// Theme Toggle
const themeBtn = document.getElementById("themeToggle");

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// On load, apply saved theme
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️ Light Mode";
  }
});

function startGame() {
  const startScreen = document.getElementById("startScreen");
  startScreen.classList.add("hidden");
}

function startCallerMode() {
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("callerUI").style.display = "block";
}

function startPlayerMode() {
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("playerUI").style.display = "block";
  generatePlayerCard();
}

function generatePlayerCard() {
  const container = document.getElementById("playerCard");
  container.innerHTML = "";

  const letters = ["B", "I", "N", "G", "O"];

  // Create header row
  letters.forEach((letter) => {
    const header = document.createElement("div");
    header.classList.add("card-header");
    header.textContent = letter;
    container.appendChild(header);
  });

  // Generate numbers for each column
  const columns = [];

  for (let i = 0; i < 5; i++) {
    const start = i * 15 + 1;
    const end = start + 14;
    const nums = [];

    while (nums.length < 5) {
      const num = Math.floor(Math.random() * 15) + start;
      if (!nums.includes(num)) nums.push(num);
    }

    columns.push(nums);
  }

  // Fill the card row by row (i = row, j = col)
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const box = document.createElement("div");

      if (i === 2 && j === 2) {
        box.textContent = "★"; // Free space
        box.classList.add("free");
      } else {
        const value = columns[j][i];
        box.textContent = value;

        box.addEventListener("click", () => {
          box.classList.toggle("hit");

          // 🔊 Sound on click
          const audio = document.getElementById("hitSound");
          if (audio) {
            audio.currentTime = 0;
            audio.play();
          }
        });
      }

      container.appendChild(box);
    }
  }
}

function resetHits() {
  const cells = document.querySelectorAll("#playerCard div");

  cells.forEach((cell) => {
    // Only reset non-free cells
    if (!cell.classList.contains("free")) {
      cell.classList.remove("hit");
    }
  });
}

function goBackToStart() {
  document.getElementById("callerUI").style.display = "none";
  document.getElementById("playerUI").style.display = "none";
  document.getElementById("startScreen").classList.remove("hidden");
}

// Initial setup
generateNumbers();
