<template>
  <div class="center">
    <vue-p5 v-on="{ setup, draw }"></vue-p5>
  </div>
</template>

<script>
import VueP5 from "vue-p5";
import Frog from "../Frog.js";

let xpos, ypos; // Starting position of shape
let xspeed = 8; // Speed of the shape
let yspeed = 8; // Speed of the shape

function Ball(xin, yin, din, idin, oin) {
  this.x = xin;
  this.y = yin;
  var vx = 0;
  var vy = 0;
  this.diameter = din;
  this.id = idin;
  this.others = oin;

  this.collide = function(sketch) {
    for (var i = this.id + 1; i < numBalls; i++) {
      // console.log(others[i]);
      var dx = this.others[i].x - this.x;
      var dy = this.others[i].y - this.y;
      var distance = sketch.sqrt(dx * dx + dy * dy);
      var minDist = this.others[i].diameter / 2 + this.diameter / 2;
      //   console.log(distance);
      //console.log(minDist);
      if (distance < minDist) {
        //console.log("2");
        var angle = sketch.atan2(dy, dx);
        var targetX = this.x + sketch.cos(angle) * minDist;
        var targetY = this.y + sketch.sin(angle) * minDist;
        var ax = (targetX - this.others[i].x) * spring;
        var ay = (targetY - this.others[i].y) * spring;
        vx -= ax;
        vy -= ay;
        this.others[i].vx += ax;
        this.others[i].vy += ay;
      }
    }
  };

  this.move = function(sketch) {
    vy += gravity;
    this.x += vx;
    this.y += vy;
    if (this.x + this.diameter / 2 > sketch.width) {
      this.x = sketch.width - this.diameter / 2;
      vx *= friction;
    } else if (this.x - this.diameter / 2 < 0) {
      this.x = this.diameter / 2;
      vx *= friction;
    }
    if (this.y + this.diameter / 2 > sketch.height) {
      this.y = sketch.height - this.diameter / 2;
      vy *= friction;
    } else if (this.y - this.diameter / 2 < 0) {
      this.y = this.diameter / 2;
      vy *= friction;
    }
  };

  this.display = function(sketch) {
    sketch.ellipse(this.x, this.y, this.diameter, this.diameter);
  };
}

var numBalls = 13;
var spring = 0.05;
var gravity = 0.03;
var friction = -0.9;
var balls = [];

export default {
  components: {
    "vue-p5": VueP5
  },
  data() {
    return {};
  },
  props: ["size", "head", "tail", "rocks", "prev_head", "path"],
  methods: {
    setup(sketch) {
      sketch.createCanvas(720, 400);
      for (var i = 0; i < numBalls; i++) {
        balls[i] = new Ball(
          sketch.random(sketch.width),
          sketch.random(sketch.height),
          sketch.random(30, 70),
          i,
          balls
        );
      }
      noStroke();
      fill(255, 204);
    },

    draw(sketch) {
      sketch.background(0);
      balls.forEach(ball => {
        ball.collide(sketch);
        ball.move(sketch);
        ball.display(sketch);
      });
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
