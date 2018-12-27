<template>
  <div>
    <!-- Level: {{ snakeLevel }} <br/>
    Score: {{ score }} -->
    <v-grid v-bind="{size: grid_size, head, tail, rocks, prev_head, path}"
      v-on="{turn, addCellToPath, navigatePath}">
    </v-grid>
    <!-- <button @click="reset">Restart</button> -->
    <!-- <label v-if="gameIsOver" class="red">The game is over!</label> -->
  </div>
</template>

<script>
import Grid from "./Grid.vue";
import getRandomInt from "../getRandomInt.js";
import Frog from "../Frog.js";
import { gameConfig } from '../_config.js';

// const initialFrogPosition = new Frog(0, 0);

/** const gameConfig = {
  grid_size: 10,
  head: initialFrogPosition,
  direction: null,
  tail: [],
  gameIsOver: false,
  rocks: [],
  score: 1,
  prev_head: initialFrogPosition,
  path: [initialFrogPosition],
  path_head: initialFrogPosition
}; **/

export default {
  components: {
    "v-grid": Grid
  },
  data: () => gameConfig,
  computed: {
    gameStarted() {
      return this.direction !== null;
    },
    gameRunning() {
      return this.gameStarted && !this.gameIsOver;
    },
    snakeLevel() {
      return Math.floor(Math.sqrt(1 + this.score));
    },
    length() {
      return this.score;
    },
    record() {
      return {
        level: this.snakeLevel,
        score: this.score
      };
    }
  },
  methods: {

    turn(direction) {
      if (this.gameIsOver) {
        return;
      }

      if (this.tail.length > 0) {
        const first_tail_part = this.tail.slice(-1)[0];
        const new_head = this.head.add(direction);
        if (new_head.isEqual(first_tail_part)) {
          return;
        }
      }

      this.direction = direction.clone();
      this.update();
    },

    pathContainesCell(cell) {
      return this.path.find(part => part.isEqual(cell))
    },

    addCellToPath(direction) {
      const _newPathHead = this.path_head.add(direction);
      if (_newPathHead.isCellInsideGrid() && !this.pathContainesCell(_newPathHead)) {
        this.path.push(_newPathHead);
        this.path_head = _newPathHead; 
      }
    },
  
    move(direction) {
      const new_head = this.head.add(direction);
      // game over if bumped into a wall
      {
        if (!new_head.isBetween(new Frog(0), new Frog(this.grid_size))) {
          // can be enabled if end game on frog hitting the walls
          // this.onGameOver();
          return;
        }
      }

      // actually move
      {
        // this.tail.push(this.head);
        // this.tail = this.tail.slice(-this.length);
        this.prev_head = this.head.clone();
        this.head = new_head;
      }

      // game over if ate own tail
      {
        if (this.tail.find(part => part.isEqual(this.head))) {
          this.onGameOver();
          return;
        }
      }

      // eat rocks
      {
        let f;
        if ((f = this.rocks.find(f => f.isEqual(this.head)))) {
          this.score += 1;
          let index = this.rocks.indexOf(f);
          this.rocks.splice(index, 1);
        }
      }
    },
    onGameOver() {
      this.gameIsOver = true;
      this.$emit("game-over", this.record);
    },
    spawnFood() {
      while (this.rocks.length < this.snakeLevel) {
        this.rocks.push(
          new Frog(
            getRandomInt(0, this.grid_size),
            getRandomInt(0, this.grid_size)
          )
        );
      }
    },
    navigatePath() {
      const paths = this.path.map(data => data.clone());
      let pathLength = paths.length;
      let currentPath = 0;
      const pathNavigator = setInterval(() => {
        if (currentPath < pathLength) {
          this.prev_head = this.head.clone();
          this.head = paths[currentPath].clone();
          this.path.splice(0, 1);
          currentPath += 1;
        } else {
          clearInterval(pathNavigator);
        }
      }, 1000);
    },
    update() {
      if (this.gameRunning) {
        this.move(this.direction);
      }
      this.spawnFood();
    },
    reset() {
      Object.assign(this.$data, getDefaultData());
    }
  },
  mounted() {
    // setInterval(this.update, 500);
  }
};
</script>

<style scoped>
.red {
  color: red;
}
</style>
