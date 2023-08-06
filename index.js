//Here are the placed items
import { randomElementFromArray, wait } from "./extra.js";

const foodItemsArray = [
  "🐁",
  "🍇",
  "🍉",
  "🍈",
  "🍓",
  "🍍",
  "🍌",
  "🥝",
  "🍏",
  "🍎",
  "🍔",
  "🍅",
  "🥚",
];


//These are the game's elements and the parameters
const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector("span");
const startBtn = document.querySelector(".start-btn");
//const keyBtns = document.querySelectorAll(".keys-container button");

const width = 20;
 const numCells = width * width;

//Here's the snake
let currentSnake = [2, 1, 0];
let snakeColor = Math.floor(Math.random() * 360);
let snakeColorIncrement = 5;
//Here's the moving base
let direction = 1;
let intervalTime = 200; 
let interval = 0;
 let foodItemIndex = 0
 let score = 0

grid.style.width = `${width * 20 * 2}px`;
grid.style.height = `${width * 20 * 2}px`;
 for(let i = 0; i < width * width; i++) {
  const cell = document.createElement("div");
  cell.style.width = `${width * 2}px`;
cell.style.height = `${width * 2}px`;
  grid.appendChild(cell);
}
const cells = document.querySelectorAll(".grid div");

//This places all the food for the snake
async function createFood() {
  foodItemIndex = Math.floor(Math.random() * numCells);
  if (currentSnake.includes(foodItemIndex)) {
    await wait(100);
    createFood();
  } else {
    cells[foodItemIndex].classList.add('food-item');
    cells[foodItemIndex].innerText = randomElementFromArray(foodItemsArray);
  }
}

//This should be what happens when I click the start button on the page
function startGame() {
   grid.classList.remove('shake');
  currentSnake.forEach((i) => {
    cells[i].style.background = "none";
    cells[i].classList.remove("snake");
    cells[i].innerText = "";
  });
  clearInterval(interval);
  direction = 1;
    currentSnake = [2, 1, 0];
    currentSnake.forEach((i) => {
    snakeColor += snakeColorIncrement % 360;
      cells[i].style.background = `hsl(${snakeColor}, 100%, 50%)`;
      cells[i].classList.add("snake");
    });
    cells[foodItemIndex].classList.remove('food-item');
    cells[foodItemIndex].innerText = '';
  createFood();
   score = 0;
   
   scoreDisplay.innerHTML = score;
    interval = setInterval(gameplay, intervalTime);
  }
  //This is what runs the game
  function gameplay() {
    
    //This is the collision code
    if (
      (currentSnake[0] + width >= width * width && direction === width) || 
      (currentSnake[0] % width === width - 1 && direction === 1) || 
      (currentSnake[0] % width === 0 && direction === -1) || 
      (currentSnake[0] - width < 0 && direction === -width) || 
      cells[currentSnake[0] + direction].classList.contains('snake') 
    ) {
      grid.classList.add('shake');
      clearInterval(interval);
      return;
    }
   
    //This is what happens when the snake eats a food item
    cells[currentSnake[0]].innerText = "";
    const tail = currentSnake.pop();
    cells[tail].classList.remove("snake");
    cells[tail].style.background = "none";
    currentSnake.unshift(currentSnake[0] + direction); 
    if (cells[currentSnake[0]].classList.contains('food-item')) {
      cells[currentSnake[0]].classList.remove('food-item');
      cells[tail].classList.add('snake');
      snakeColor += snakeColorIncrement % 360;
      cells[tail].style.background = `hsl(${snakeColor}, 100%, 50%)`;
      currentSnake.push(tail);
      score++;
      
      scoreDisplay.textContent = score;
    
      createFood();
    }
    cells[currentSnake[0]].classList.add("snake");
      cells[currentSnake[0]].innerText = "👀";
  snakeColor += snakeColorIncrement % 360;
    cells[currentSnake[0]].style.background = `hsl(${snakeColor}, 100%, 50%)`;
    
    function moveSnake(moveDirection) {
let directionVal;
      if (moveDirection === "ArrowRight" && direction !== -1) {
     directionVal = 1;
        if (currentSnake[0] + directionVal === currentSnake[1]) return;
       direction = directionVal;
  }
    if (moveDirection === "ArrowLeft" && direction !== 1) {
        directionVal = -1;
        if (currentSnake[0] + directionVal === currentSnake[1]) return;
        direction = directionVal;
      }
  if (moveDirection === "ArrowUp" && direction !== width) {
        directionVal = -width;
        if (currentSnake[0] + directionVal === currentSnake[1]) return;
     direction = directionVal;
      }
      if (moveDirection === "ArrowDown" && direction !== -width) {
        directionVal = width;
       if (currentSnake[0] + directionVal === currentSnake[1]) return;
        direction = directionVal;
      }
    }
    
    function handleKeyMove(e) {
      if (!["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key))
        return;
      moveSnake(e.key);
    }
    
    document.addEventListener("keydown", handleKeyMove);
    
  }
  startBtn.addEventListener("click", startGame);