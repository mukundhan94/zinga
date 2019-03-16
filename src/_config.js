import Frog from "./Frog.js";
import { initialConfig } from './_initialConfig';
const initialFrogPosition = new Frog(0, 0);
export const gameConfig = {
  frog_head: initialFrogPosition,
  prev_frog_head: initialFrogPosition,
  path: [],
  path_frog_head: initialFrogPosition,
  ...initialConfig
};
