const grid = document.getElementById("grid");
const message = document.getElementById("message");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const powerCountEl = document.getElementById("powerCount");

let hiddenTiles = [];
let selectedTiles = [];
let timer = 0;
let timerInterval;
let score = 0;
let powerUps = 3;
let difficulty = "easy";
let gridSize = 5;
let allowedTries = 10;

function startGame() {
  difficulty = document.getElementById("difficulty").value;
  grid.innerHTML = "";
  selectedTiles = [];
  score = 0;
  powerUps = 3;
  timer = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer++;
    timerEl.textContent = timer;
  }, 1000);
  scoreEl.textContent = 0;
  powerCountEl.textContent = powerUps;
  message.textContent = "";

  switch (difficulty) {
    case "easy":
      allowedTries = 10;
      break;
    case "medium":
      allowedTries = 8;
      break;
    case "hard":
      allowedTries = 6;
      break;
  }

  generateGrid();
  hiddenTiles = generateHiddenPattern();
}

function generateGrid() {
  for (let i = 0; i < gridSize * gridSize; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.dataset.index = i;
    tile.addEventListener("click", handleClick);
    grid.appendChild(tile);
  }
}

function generateHiddenPattern() {
  const total = {
    easy: 4,
    medium: 5,
    hard: 6,
  }[difficulty];

  const set = new Set();
  while (set.size < total) {
    set.add(Math.floor(Math.random() * gridSize * gridSize));
  }
  return [...set];
}

function handleClick(e) {
  const tile = e.target;
  const index = parseInt(tile.dataset.index);

  if (selectedTiles.includes(index)) return;

  tile.classList.add("clicked");
  selectedTiles.push(index);

  if (hiddenTiles.includes(index)) {
    tile.classList.add("correct");
    score += 10;
  } else {
    score -= 2;
  }

  scoreEl.textContent = score;

  if (selectedTiles.length >= hiddenTiles.length + allowedTries) {
    endGame(false);
  }

  checkWin();
}

function usePowerUp() {
  if (powerUps <= 0) {
    message.textContent = "No more power-ups!";
    return;
  }

  powerUps--;
  powerCountEl.textContent = powerUps;

  const hint = hiddenTiles.find(i => !selectedTiles.includes(i));
  if (hint !== undefined) {
    const hintTile = document.querySelector(`[data-index='${hint}']`);
    hintTile.classList.add("hint");
    setTimeout(() => {
      hintTile.classList.remove("hint");
    }, 1500);
  }
}

function checkWin() {
  const found = hiddenTiles.every(i => selectedTiles.includes(i));
  if (found) {
    endGame(true);
  }
}

function endGame(won) {
  clearInterval(timerInterval);
  message.textContent = won
    ? `🎉 You uncovered the Shadow Grid in ${timer}s! Score: ${score}`
    : `💀 Game Over! You failed to find the pattern.`;
}
