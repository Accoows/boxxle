import { Levels } from './level.js';

const gameboard = document.getElementById("gameboard");

let currentLevel = 0;
let grid = JSON.parse(JSON.stringify(Levels[currentLevel]));
let initialGrid = JSON.parse(JSON.stringify(Levels[currentLevel]));

let playerPosition = {x: 0, y: 0};
let playerDirection = "front";
let animationFrame = 1;
let animationCounter = 0;
let animationMax = 10;
let animationRequest = null;

function displayLevel(level) {
  gameboard.innerHTML = "";

  const rows = level.length;
  const cols = level[0].length;

  gameboard.style.gridTemplateRows = `repeat(${rows}, 64px)`;
  gameboard.style.gridTemplateColumns = `repeat(${cols}, 64px)`;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const value = level[y][x];
      const origin = initialGrid[y][x];
      const cell = document.createElement("div");
      cell.classList.add("cell");

      if (origin === 4) {
        cell.classList.add("targetbox");
      }

      if (value === 2 && origin === 4) {
        cell.classList.add("box-on-target");
      } else if (value === 2) {
        cell.classList.add("box");
      } else if (value === 3) {
        playerPosition = {x, y};
        cell.classList.add("player");
        cell.style.backgroundImage = `url('./assets/Player/player_${playerDirection}_0${animationFrame}.png')`;
      } else if (value === 1) {
        cell.classList.add("wall");
      } else if (value === 0) {
        cell.classList.add("empty");
      }

      gameboard.appendChild(cell);
    }
  }
}

function animatePlayer() {
  animationCounter++;

  animationFrame = animationFrame === 2 ? 3 : 2;

  displayLevel(grid);

  if (animationCounter >= animationMax) {
    animationFrame = 1;
    animationCounter = 0;
    cancelAnimationFrame(animationRequest);
    animationRequest = null;
    displayLevel(grid);

    if (isLevelComplete()) {
      setTimeout(() => {
        alert("Level Complete!");
      }, 100);
    }

    return
  }

  animationRequest = requestAnimationFrame(animatePlayer);
}

displayLevel(Levels[0]);

function movePlayer(dx, dy) {
  const newX = playerPosition.x + dx;
  const newY = playerPosition.y + dy;
  const nextX = newX + dx;
  const nextY = newY + dy;

  if (isWalkable(newX, newY)) {
    grid[playerPosition.y][playerPosition.x] = (initialGrid[playerPosition.y][playerPosition.x] === 4) ? 4 : 0;
    grid[newY][newX] = 3;
    playerPosition = {x: newX, y: newY};
    return true;
  }

  if (isBox(newX, newY) && isWalkable(nextX, nextY)) {
    grid[playerPosition.y][playerPosition.x] = (initialGrid[playerPosition.y][playerPosition.x] === 4) ? 4 : 0;
    grid[newY][newX] = 3;
    grid[nextY][nextX] = 2;
    playerPosition = {x: newX, y: newY};
    return true;
  }

  return false;
}

window.addEventListener("keydown", (event) => {
  if (animationRequest) return;

  let dx = 0, dy = 0;

  switch (event.key) {
    case "ArrowUp":
      dy = -1;
      playerDirection = "back";
      break;
    case "ArrowDown":
      dy = 1;
      playerDirection = "front";
      break;
    case "ArrowLeft":
      dx = -1;
      playerDirection = "left";
      break;
    case "ArrowRight":
      dx = 1;
      playerDirection = "right";
      break;
    default:
      return;
  }

  const moved = movePlayer(dx, dy);

  animationFrame = 2;
  animationCounter = 0;
  animatePlayer();
});

function isWalkable(x, y) {
  return grid[y]?.[x] === 0 || grid[y]?.[x] === 4;
}

function isBox(x, y) {
  return grid[y]?.[x] === 2;
}

function isLevelComplete() {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] !== 2 && initialGrid[y][x] === 4) {
        return false;
      }
    }
  }
  return true;
}

/* Bouton de réinitialisation du niveau et suivant */

// Reset button
document.getElementById("resetButton").addEventListener("click", () => {
  grid = JSON.parse(JSON.stringify(Levels[currentLevel]));
  initialGrid = JSON.parse(JSON.stringify(Levels[currentLevel]));
  animationFrame = 1;
  animationCounter = 0;
  playerDirection = "front";
  displayLevel(grid);
});

// Next button
document.getElementById("nextButton").addEventListener("click", () => {
  currentLevel++;
  if (currentLevel >= Levels.length) {
    alert("You've completed all levels!");
    currentLevel = 0;
  }

  grid = JSON.parse(JSON.stringify(Levels[currentLevel]));
  initialGrid = JSON.parse(JSON.stringify(Levels[currentLevel]));
  animationFrame = 1;
  animationCounter = 0;
  playerDirection = "front";
  displayLevel(grid);
});
