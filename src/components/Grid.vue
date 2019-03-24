<template>
  <div class="center">
    <!-- <div><pre>size-{{size}}</pre></div><br/>
    <div><pre>frog_head-{{frog_head}}</pre></div><br/>
    <div><pre>tail-{{tail}}</pre></div><br/>
    <div><pre>rocks-{{rocks}}</pre></div><br/> -->
    <!-- <vue-p5 
        @sketch="sketch"
        @preload="preload"
        @setup="setup" 
        @draw="draw"
        @keypressed="keyPressed"
        @mousemoved="mouseMoved"
        @mousedragged="mouseDragged">
    </vue-p5> -->
    <vue-p5 v-on="{ setup, preload, draw, keypressed }"></vue-p5>
  </div>
</template>

<script>
import VueP5 from "vue-p5";
import Frog from "../Frog.js";
import Sprite from "../Sprite.js";
import Butterfly from "../Butterfly.js";

const snakeSprites = {
  head: '../assets/snake/redHeadStaight.png',
  body: '../assets/snake/redBodyStraight.png',
  tail: '../assets/snake/redTail.png'
};

const directions = {
  up: new Sprite(0, -1), // up arrow key
  left: new Sprite(-1, 0), // left arrow key
  down: new Sprite(0, 1), // down arrow key
  right: new Sprite(1, 0), // right arrow key
};

let frameCount = 0;
let called = false;
const throttle = (func, timeout) => {
  if (!called) {
    called = true;
    setTimeout(() => {
      called = false;
      func.apply(this);
    }, timeout);
  }
}

/****************HELPERS****************/


let  xpos, ypos; // Starting position of shape
let  xspeed = 8; // Speed of the shape
let  yspeed = 8; // Speed of the shape
let  rotate = 0;
let rock_rotate_angle = 0;

export default {
  components: {
    "vue-p5": VueP5
  },
  data() {
    return {}
  },
  props: [
    "butterflies",
    "size",
    "frog_head",
    "rocks",
    "prev_frog_head",
    "path", 
    "grid_size",
    "canvasResolution",
    "cellAspectRatio",
    "gridCenter",
    "snake"
  ],
  methods: {
    drawCanvas(sketch) {
      for (let i = 0; i <= this.size; ++i) {
        for (let j = 0; j <= this.size; ++j) {
          const { center: { x, y }, size } = this.gridToCanvas(sketch, new Frog(i, j));
          sketch.image(this.grass, x, y, size.x, size.y);
        }
      }
    },
    setup(sketch) {
      sketch.createCanvas(this.canvasResolution, this.canvasResolution);
      sketch.rectMode(sketch.CENTER);
      sketch.imageMode(sketch.CENTER);
      this.sketch = sketch;
    },
    preload(sketch) {
      this.frogImage = sketch.loadImage("../assets/black_frog.png");
      this.rock = sketch.loadImage("../assets/rock_1.png");
      this.stone = sketch.loadImage("../assets/rock_2.png");
      this.grass = sketch.loadImage("../assets/grass.jpeg");
      this.blue = sketch.loadImage("../assets/butterfly_blue.png");
      this.pink = sketch.loadImage("../assets/butterfly_pink.png");
      this.red = sketch.loadImage("../assets/butterfly_red.png");
      this.head = sketch.loadImage("../assets/snake/redHeadStaight.png");
      this.body = sketch.loadImage("../assets/snake/redBodyStraight.png");
      this.tail = sketch.loadImage("../assets/snake/redTail.png");
      this.tongue = sketch.loadImage("../assets/snake/redTongue.png");
      this.twistedBody = sketch.loadImage("../assets/snake/redBodyTurn.png");
    },
    drawRocksAndWaters(sketch) {
      // draw rocks
      sketch.strokeWeight(1);
      this.rocks.forEach(r => {
        sketch.push();
        const cell = this.gridToCanvas(sketch, r);
        sketch.translate(cell.center.x, cell.center.y);
        // sketch.rotate(sketch.radians(rock_rotate_angle));
        sketch.scale(0.6);
        sketch.image(r.isPositionOdd() ? this.rock : this.stone, 0, 0, cell.size.x, cell.size.y);
        rock_rotate_angle += 0.1;
        sketch.pop();
      });
    },
    drawPath(sketch) {
      this.path.forEach(cellpath => {
        if (!cellpath.isEqual(this.frog_head)) {
          const cell = this.gridToCanvas(sketch, cellpath);
          sketch.fill("orange");
          sketch.rect(cell.center.x, cell.center.y, cell.size.x, cell.size.y);
        }
      });
    },
    drawButterFlies(sketch) {
      // draw butterflies
      this.butterflies.forEach((buffly, index) => {
        // sketch.translate();
        sketch.push(this.cellAspectRatio/2 *10);
        const cell = this.gridToCanvas(sketch, buffly);
        if (!buffly.getMovingPos().xpos) {
          // setting initial canvas position.
          buffly.setMovingPos({
            xpos: cell.center.x,
            ypos: cell.center.y
          });
        }
        const {
          x_direction,
          y_direction,
          facingAngle
        } = buffly.getMovingDirection(buffly.oldPath);
        if (buffly.alive) {
          if (!buffly.dying) {
            if (!buffly.hasArrivedToPos(cell.center)) {
              buffly.addMovingPos({
                xpos: x_direction,
                ypos: y_direction
              });
              buffly.rotateTo(facingAngle, this.cellAspectRatio);
            } else {
              buffly.facingAngle = facingAngle;
            }
            sketch.scale(buffly.scale);
            sketch.translate(buffly.movingPos.xpos, buffly.movingPos.ypos);
          } else {
            // simulate dying progress translate and scale to fade in the same place.
            buffly.shrink(0.03);
            sketch.translate(buffly.movingPos.xpos, buffly.movingPos.ypos);
            sketch.scale(buffly.scale);
          }
            sketch.rotate(sketch.radians(buffly.facingAngle));
            sketch.image(this[buffly.color], 0, 0, cell.size.x *.6, cell.size.y *.6);
        }
        sketch.pop();
      });
    },
    drawSneakySnake(sketch) {
      this.snake.forEach((sb, index) => {
        const cell = this.gridToCanvas(sketch, sb);
        sketch.push();
        sb.drawSketch(sketch, cell, this, index);
        sketch.pop();
      });
    },
    drawCurrentFrogPosition(sketch) {
      sketch.push();
      sketch.strokeWeight(1);
      sketch.fill("blue");
      const cell = this.gridToCanvas(sketch, this.frog_head);
      const prevCell = this.gridToCanvas(sketch, this.prev_frog_head);
      const {
        x_direction,
        y_direction,
        facingAngle
      } = this.frog_head.getMovingDirection(this.prev_frog_head);
      if (this.frog_head.isEqual(this.prev_frog_head)) {
        xpos = cell.center.x;
        ypos = cell.center.y;
      }
      // Animate frog position. Update the position of the shape
      if (xpos !== cell.center.x || ypos !== cell.center.y) {
        if (x_direction !== 0) {
          xpos = xpos + (this.cellAspectRatio / 2) * x_direction;
        } else {
          ypos = ypos + (this.cellAspectRatio / 2) * y_direction;
        }
        sketch.scale(1.05);
      } else {
        sketch.scale(1);
      }
      if (rotate !== facingAngle) {
        rotate = rotate > facingAngle ?
         rotate -= 10: 
         rotate += 10;
      }
      console.log('facingAngle', rotate, facingAngle);
      sketch.translate(xpos, ypos);
      sketch.rotate(sketch.radians(rotate));
      sketch.image(this.frogImage, 0, 0, cell.size.x * 1.2, cell.size.y * 1.2);
      sketch.pop();
    },
    draw(sketch) {
      if (frameCount > 10000) {
        frameCount = 0;
      } else {
        frameCount += 1;
      }
      this.drawCanvas(sketch);
      // draw rocks and tails. not added as of now.
      this.drawRocksAndWaters(sketch);
      // drawing path for the frog
      this.drawPath(sketch);
      // draw frog_head
      this.drawCurrentFrogPosition(sketch);
      // draw butterflies
      this.drawButterFlies(sketch);
      // draw sneakySnake
      this.drawSneakySnake(sketch);
    },

    keypressed({ keyCode }) {
      console.log('keyCode', keyCode);
      const frogDirectionKeys = {
          87: new Sprite(0, -1), // 'w' key
          65: new Sprite(-1, 0), // 'a' key
          83: new Sprite(0, 1), // 's' key
          68: new Sprite(1, 0), // 'd' key
      };
      const snakeDirectionKeys = {
          38: new Sprite(0, -1), // up arrow key
          37: new Sprite(-1, 0), // left arrow key
          40: new Sprite(0, 1), // down arrow key
          39: new Sprite(1, 0), // right arrow key
      };
      /**
       * Throttle to wait for frog/snake to move to jump and move.
       */
      throttle(() => {
        if (keyCode in frogDirectionKeys) {
          this.$emit("turnFrog", frogDirectionKeys[keyCode]);
        } else if (keyCode in snakeDirectionKeys) {
          this.$emit("turnSnake", snakeDirectionKeys[keyCode]);
        }
      }, 200);
    },
    
    gridToCanvas({ width, height }, sprite) {
      const topLeft = sprite;
      const center = sprite.add(new Sprite(0.5));
      const bottomRight = sprite.add(new Sprite(1));
      const toCanvas = ({ x, y }) => new Sprite(
        x * width / this.size,
        y * height / this.size
      );
      return {
        topLeft: toCanvas(topLeft),
        center: toCanvas(center),
        bottomRight: toCanvas(bottomRight),
        size: new Sprite(width / this.size, height / this.size)
      };
    }
  }
};

</script>
<style lang="css" scoped>
  .center {
    display: flex;
    justify-content: center;
    align-self: center;
    background: antiquewhite;
  }
</style>
