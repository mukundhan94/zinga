<template>
  <div class="center">
    <!-- <div><pre>size-{{size}}</pre></div><br/>
    <div><pre>head-{{head}}</pre></div><br/>
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

let  xpos, ypos; // Starting position of shape
let  xspeed = 8; // Speed of the shape
let  yspeed = 8; // Speed of the shape
let  rotate = 0;
let rock_rotate_angle = 0;
let butterflyPaths = {

};

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
    "head",
    "tail",
    "rocks",
    "prev_head",
    "path", 
    "grid_size",
    "canvasResolution",
    "cellAspectRatio"
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
      sketch.push();
      // draw tail
      sketch.strokeWeight(1);
      sketch.fill("lightblue");
      this.tail.forEach(part => {
        const cell = this.gridToCanvas(sketch, part);
        sketch.ellipse(cell.center.x, cell.center.y, cell.size.x, cell.size.y);
      });
      sketch.pop();
    },
    drawPath(sketch) {
      this.path.forEach(cellpath => {
        if (!cellpath.isEqual(this.head)) {
          const cell = this.gridToCanvas(sketch, cellpath);
          sketch.fill("orange");
          sketch.rect(cell.center.x, cell.center.y, cell.size.x, cell.size.y);
        }
      });
    },
    drawButterFlies(sketch) {
      // draw butterflies
      this.butterflies.forEach((b, index) => {
        sketch.push();
        const cell = this.gridToCanvas(sketch, b);
        if (!butterflyPaths[`b${index}`]) {
          butterflyPaths[`b${index}`] = {
            x: b.x,
            y: b.y,
            xpos: cell.center.x,
            ypos: cell.center.y
          }
        }
        const oldPath = butterflyPaths[`b${index}`];
        const {
          x_direction,
          y_direction,
          facingAngle
        } = b.getMovingDirection(b.oldPath);
        const { xpos, ypos } = butterflyPaths[`b${index}`];
        if (!(cell.center.x == xpos && cell.center.y == ypos)) {
          butterflyPaths[`b${index}`]['xpos'] = butterflyPaths[`b${index}`]['xpos'] + x_direction;
          butterflyPaths[`b${index}`]['ypos'] = butterflyPaths[`b${index}`]['ypos'] + y_direction;
          if (butterflyPaths[`b${index}`]['rotate'] !== facingAngle) {
            if (!butterflyPaths[`b${index}`]['rotate']) {
              const samePlace = b.getMovingDirection(b.oldPath);
              butterflyPaths[`b${index}`]['rotate'] = samePlace.facingAngle;
            }
            butterflyPaths[`b${index}`]['rotate'] = butterflyPaths[`b${index}`]['rotate'] > facingAngle ?
            butterflyPaths[`b${index}`]['rotate'] -= (this.cellAspectRatio / 2) : 
            butterflyPaths[`b${index}`]['rotate'] += (this.cellAspectRatio / 2);
          }
        } else {
          butterflyPaths[`b${index}`] = {
            x: b.x,
            y: b.y,
            xpos: cell.center.x,
            ypos: cell.center.y
          }
        }
        if ((butterflyPaths[`b${index}`]['xpos'] + butterflyPaths[`b${index}`]['ypos']) % 0.5) {
          sketch.scale(0.6);
        } else {
          sketch.scale(0.6);
        }
        sketch.translate(butterflyPaths[`b${index}`]['xpos'],butterflyPaths[`b${index}`]['ypos']);
        sketch.rotate(sketch.radians(butterflyPaths[`b${index}`]['rotate']));
        sketch.image(this[b.color], 0, 0, cell.size.x, cell.size.y);
        sketch.pop();
      });
    },
    drawCurrentFrogPosition(sketch) {
      sketch.push();
      sketch.strokeWeight(1);
      sketch.fill("blue");
      const cell = this.gridToCanvas(sketch, this.head);
      const prevCell = this.gridToCanvas(sketch, this.prev_head);
      const {
        x_direction,
        y_direction,
        facingAngle
      } = this.head.getMovingDirection(this.prev_head);
      if (this.head.isEqual(this.prev_head)) {
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
         rotate -= (this.cellAspectRatio / 2) : 
         rotate += (this.cellAspectRatio / 2);
      }
      sketch.translate(xpos, ypos);
      sketch.rotate(sketch.radians(rotate));
      sketch.image(this.frogImage, 0, 0, cell.size.x, cell.size.y);
      sketch.pop();
    },
    draw(sketch) {
      this.drawCanvas(sketch);
      // draw rocks and tails. not added as of now.
      this.drawRocksAndWaters(sketch);
      // drawing path for the frog
      this.drawPath(sketch);
      // draw head
      this.drawCurrentFrogPosition(sketch);
      // draw butterflies
      this.drawButterFlies(sketch);
    },

    keypressed({ keyCode }) {
      throttle(() => {
        const keys = {
          87: new Frog(0, -1), // 'w' key
          65: new Frog(-1, 0), // 'a' key
          83: new Frog(0, 1), // 's' key
          68: new Frog(1, 0), // 'd' key
        };
        if (keyCode in keys) {
          this.$emit("turn", keys[keyCode]);
        } else if (keyCode === 13) {
          this.$emit("navigatePath");
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
