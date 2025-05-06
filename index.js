import { Levels } from './level.js';

const gameboard = document.getElementById("gameboard");

let currentLevel = 0;
let grid = JSON.parse(JSON.stringify(Levels[currentLevel]));

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
      const cell = document.createElement("div");
      cell.classList.add("cell");

      switch (value) {
        case 0:
          cell.classList.add("empty");
          break;
        case 1:
          cell.classList.add("wall");
          break;
        case 2:
          cell.classList.add("box");
          break;
        case 3:
          playerPosition = {x, y};
          cell.classList.add("player");
          cell.style.backgroundImage = `url('./assets/Player/player_${playerDirection}_0${animationFrame}.png')`;
          break;
        case 4:
          cell.classList.add("targetbox");
          break;
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
    return
  }

  animationRequest = requestAnimationFrame(animatePlayer);
}

displayLevel(Levels[0]);

window.addEventListener("keydown", (event) => {
  if (animationRequest) return;

  switch (event.key) {
    case "ArrowUp":
      playerDirection = "back";
      break;
    case "ArrowDown":
      playerDirection = "front";
      break;
    case "ArrowLeft":
      playerDirection = "left";
      break;
    case "ArrowRight":
      playerDirection = "right";
      break;
    default:
      return;
  }

  animationFrame = 2;
  animationCounter = 0;
  animatePlayer();
});