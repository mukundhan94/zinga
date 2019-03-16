<template>
  <div>
    <v-grid v-bind="{
        butterflies,
        canvasResolution,
        cellAspectRatio,
        size: grid_size,
        frog_head,
        tail,
        rocks,
        prev_frog_head,
        path,
        gridCenter
      }"
      v-on="{turn, addCellToPath, navigatePath}">
    </v-grid>
  </div>
</template>

<script>
import Grid from "./Grid.vue";
import { getRandomInt } from "../utils.js";
import Frog from "../Frog.js";
import Butterfly from "../Butterfly.js";
import { gameConfig } from '../_config.js';

export default {
  components: {
    "v-grid": Grid
  },
  data: () => gameConfig, 
  mounted() {
    this.spawnRocks();
    this.spawnButterflies();
    this.spawnSneakySnake();
  }, 
  computed: {
    gameStarted() {
      return this.direction !== null;
    },
    gameRunning() {
      return this.gameStarted && !this.gameIsOver;
    },
    cellAspectRatio() {
      return (this.canvasResolution / this.grid_size);
    },
    gridCenter() {
        return {
          x: this.canvasResolution / 2,
          y: this.canvasResolution / 2
        };
    },
    record() {
      return {
        score: this.score
      };
    }
  },
  methods: {
    turn(direction) {
      const new_frog_head = this.frog_head.add(direction);
      if (this.rocksContainesCell(new_frog_head)) {
        return;
      }
      this.direction = direction.clone();
      this.update();
    },
    pathContainesCell(cell) {
      return this.path.find(part => part.isEqual(cell))
    },
    rocksContainesCell(cell) {
      return this.rocks.find(part => part.isEqual(cell))
    },
    addCellToPath(direction) {
      const _newPathHead = this.path_head.add(direction);
      if (_newPathHead.isCellInsideGrid() && !this.pathContainesCell(_newPathHead)
        && !this.rocksContainesCell(_newPathHead)) {
        this.path.push(_newPathHead);
        this.path_head = _newPathHead; 
      }
    },
    move(direction) {
      const new_head = this.frog_head.add(direction);
      // game over if frog bumped into a snake
      {
        if (!new_head.isBetween(new Frog(0), new Frog(this.grid_size))) {
          // this.onGameOver();
          return;
        }
      }
      // actually move
      {
        this.prev_frog_head = this.frog_head.clone();
        this.frog_head = new_head;
      }
      // eat butterflies
      {
        let butterflies = this.frog_head.getButterfliesInRange(this.butterflies); 
        if (butterflies.length) {
          this.score += butterflies.length;
          butterflies.forEach(b => {
            let index = this.butterflies.indexOf(b);
            if (!this.butterflies[index].alive) {
              // let it die passaway slowly
              this.butterflies[index].passAway();
            } else {
              // remove from array if its gone.
              this.butterflies.splice(index, 1);
            }
          });
        }
      }
    },
    onGameOver() {
      this.gameIsOver = true;
      this.$emit("game-over", this.record);
    },
    spawnRocks() {
      while (this.rocks.length < this.rockSprinkleCount) {
        this.rocks.push(
          new Frog(
            getRandomInt(0, this.grid_size),
            getRandomInt(0, this.grid_size)
          )
        );
      }
    },
    spawnSneakySnake() {
      // todo.
      if (this.tail.length > 0) {
        const first_tail_part = this.tail.slice(-1)[0];
        if (new_head.isEqual(first_tail_part)) {
          return;
        }
      }
    },
    spawnButterflies() {
      while (this.butterflies.length < this.butterflyCount) {
        const butterfly = new Butterfly(
            getRandomInt(0, this.grid_size),
            getRandomInt(0, this.grid_size)
        );
        butterfly.fly();
        if (!this.rocksContainesCell(butterfly)) {
          this.butterflies.push(butterfly);
        }
      }
    },
    navigatePath() {
      const paths = this.path.map(data => data.clone());
      let pathLength = paths.length;
      let currentPath = 0;
      const pathNavigator = setInterval(() => {
        if (currentPath < pathLength) {
          this.prev_frog_head = this.frog_head.clone();
          this.frog_head = paths[currentPath].clone();
          this.path.splice(0, 1);
          currentPath += 1;
        } else {
          clearInterval(pathNavigator);
        }
      }, 500);
    },
    update() {
      if (this.gameRunning) {
        this.move(this.direction);
      }
    },
  }
};
</script>

<style scoped>

</style>
