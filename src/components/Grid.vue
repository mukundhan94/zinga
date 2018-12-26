<template>
  <div class="center">
    <!-- <div><pre>size-{{size}}</pre></div><br/>
    <div><pre>head-{{head}}</pre></div><br/>
    <div><pre>tail-{{tail}}</pre></div><br/>
    <div><pre>food-{{food}}</pre></div><br/> -->
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

export default {
  components: {
    "vue-p5": VueP5
  },
  data() {
    return {}
  },
  props: ["size", "head", "tail", "food", "prev_head", "path"],
  methods: {
    setup(sketch) {
      sketch.resizeCanvas(500, 500);
      this.sketch = sketch;
    },
    preload(sketch) {
      this.frogImage = sketch.loadImage("../assets/black_frog.png");
    },
    draw(sketch) {
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

      // draw food
      sketch.strokeWeight(0.5);
      sketch.fill("yellow");
      this.food.forEach(f => {
        const cell = this.gridToCanvas(sketch, f);
        sketch.rect(cell.topLeft.x, cell.topLeft.y, cell.size.x, cell.size.y);
      });

      // draw tail
      sketch.strokeWeight(1);
      sketch.fill("lightblue");
      this.tail.forEach(part => {
        const cell = this.gridToCanvas(sketch, part);
        sketch.ellipse(cell.center.x, cell.center.y, cell.size.x, cell.size.y);
      });

      // drawing path for the frog
      this.path.forEach(cellpath => {
        if (!cellpath.isEqual(this.head)) {
          const cell = this.gridToCanvas(sketch, cellpath);
          sketch.fill("orange");
          sketch.rect(cell.topLeft.x, cell.topLeft.y, cell.size.x, cell.size.y);
        }
      });

      // draw head
      sketch.strokeWeight(1);
      sketch.fill("blue");
      const cell = this.gridToCanvas(sketch, this.head);
      const prevCell = this.gridToCanvas(sketch, this.prev_head);

      const {
        x_direction,
        y_direction
      } = this.head.getMovingDirection(this.prev_head);
      
      if (this.head.isEqual(this.prev_head)) {
        xpos = cell.topLeft.x;
        ypos = cell.topLeft.y;
      }

      // // Update the position of the shape
      if (xpos <= cell.topLeft.x || ypos <= cell.topLeft.y) {
        if (x_direction) {
          xpos = xpos + 1;
        } else {
          ypos = ypos + 1;
        }
      }
      console.log('PI',sketch.PI, sketch);
      sketch.image(this.frogImage, xpos, ypos, cell.size.x, cell.size.y);
      sketch.rotate(sketch.PI / 3.0);
      // sketch.image(this.frogImage, cell.topLeft.x, cell.topLeft.y, cell.size.x, cell.size.y);
      // sketch.ellipse(cell.center.x, cell.center.y, cell.size.x, cell.size.y);
    },

    keypressed({ keyCode }) {
      const keys = {
        87: new Frog(0, -1), // 'w' key
        65: new Frog(-1, 0), // 'a' key
        83: new Frog(0, 1), // 's' key
        68: new Frog(1, 0), // 'd' key
      };
      if (keyCode in keys) {
        this.$emit("setPath", keys[keyCode]);
        // this.$emit("turn", keys[keyCode]);
      } else if (keyCode === 13) {
        this.$emit("navigatePath");
      }
    },
    
    gridToCanvas({ width, height }, position) {
      const topLeft = position;
      const center = position.add(new Frog(0.5));
      const bottomRight = position.add(new Frog(1));

      const toCanvas = ({ x, y }) =>
        new Frog(x * width / this.size, y * height / this.size);

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
