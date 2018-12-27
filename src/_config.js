import Frog from "./Frog.js";
import { initialConfig } from './_initialConfig';
const initialFrogPosition = new Frog(0, 0);
export const gameConfig = {
  head: initialFrogPosition,
  prev_head: initialFrogPosition,
  path: [],
  path_head: initialFrogPosition,
  ...initialConfig
};
