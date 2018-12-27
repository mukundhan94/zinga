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
let  xpos, ypos; // Starting position of shape
let  xspeed = 8; // Speed of the shape
let  yspeed = 8; // Speed of the shape
let  rotate = 0;

export default {
  components: {
    "vue-p5": VueP5
  },
  data() {
    return {}
  },
  props: ["size", "head", "tail", "rocks", "prev_head", "path"],
  methods: {
    drawCanvas(sketch) {
      sketch.background("lightgreen");
      // draw grid
      sketch.stroke("black");
      sketch.strokeWeight(0.1);
      for (let i = 0; i <= this.size; ++i) {
        // i-th diagonal junction
        const { topLeft: { x, y } } = this.gridToCanvas(sketch, new Frog(i));
        sketch.line(x, 0, x, sketch.height);
        sketch.line(0, y, sketch.width, y);
      }
    },
    setup(sketch) {
      sketch.createCanvas(500, 500);
      sketch.rectMode(sketch.CENTER);
      sketch.imageMode(sketch.CENTER);
      this.sketch = sketch;
    },
    preload(sketch) {
      this.frogImage = sketch.loadImage("../assets/black_frog.png");
      this.rockImage = sketch.loadImage("../assets/black_frog.png");
    },
    drawRocksAndWaters(sketch) {
      // draw rocks
      sketch.strokeWeight(1);
      this.rocks.forEach(f => {
        const cell = this.gridToCanvas(sketch, f);
        sketch.rect(cell.center.x, cell.center.y, cell.size.x, cell.size.y);
      });
      // draw tail
      sketch.strokeWeight(1);
      sketch.fill("lightblue");
      this.tail.forEach(part => {
        const cell = this.gridToCanvas(sketch, part);
        sketch.ellipse(cell.center.x, cell.center.y, cell.size.x, cell.size.y);
      });
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
          xpos = xpos + x_direction;
        } else {
          ypos = ypos + y_direction;
        }
        sketch.scale(1.05);
      } else {
        sketch.scale(1);
      }
      if (rotate !== facingAngle) {
        rotate = rotate > facingAngle ?
         rotate -= 10 : 
         rotate += 10;
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
    },

    keypressed({ keyCode }) {
      const keys = {
        87: new Frog(0, -1), // 'w' key
        65: new Frog(-1, 0), // 'a' key
        83: new Frog(0, 1), // 's' key
        68: new Frog(1, 0), // 'd' key
      };
      if (keyCode in keys) {
        this.$emit("addCellToPath", keys[keyCode]);
        // this.$emit("turn", keys[keyCode]);
      } else if (keyCode === 13) {
        this.$emit("navigatePath");
      }
    },
    
    gridToCanvas({ width, height }, position) {
      const topLeft = position;
      const center = position.add(new Frog(0.5));
      const bottomRight = position.add(new Frog(1));
      const toCanvas = ({ x, y }) => new Frog(
        x * width / this.size,
        y * height / this.size
      );
      return {
        topLeft: toCanvas(topLeft),
        center: toCanvas(center),
        bottomRight: toCanvas(bottomRight),
        size: new Frog(width / this.size, height / this.size)
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
  }
</style>
