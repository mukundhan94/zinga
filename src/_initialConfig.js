import primaryFrog from '../assets/black_frog.png';


const directions = {
  up: { x: 0, y:-1}, // up arrow key
  left: { x: -1,y: 0}, // left arrow key
  down: { x: 0, y:1}, // down arrow key
  right: { x: 1, y:0}, // right arrow key
};

export const initialConfig = {
  grid_size: 10,
  frogDirection: null,
  snakeDirection: directions.up,
  tail: [],
  gameIsOver: false,
  rocks: [],
  butterflies: [],
  ponds: [],
  score: 1,
  rockSprinkleCount: 5,
  butterflyCount: 2,
  canvasResolution: 400,
  snakeBodyLength: 3,
  primaryFrog
};
