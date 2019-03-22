import Frog from "./Frog.js";
import Snake from "./Snake.js";
import { initialConfig } from './_initialConfig';
const initialFrogPosition = new Frog(0, 0);
const initialSnakeHead = new Snake(initialConfig.grid_size / 2, initialConfig.grid_size / 2);
export const gameConfig = {
  frog_head: initialFrogPosition,
  prev_frog_head: initialFrogPosition,
  snake_head: initialSnakeHead,
  snake: [initialSnakeHead],
  prev_snake_head: initialSnakeHead,
  path: [],
  path_frog_head: initialFrogPosition,
  ...initialConfig
};
