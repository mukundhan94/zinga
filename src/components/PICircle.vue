<template>
  <div class="center">
    <vue-p5 v-on="{ setup, draw }"></vue-p5>
  </div>
</template>

<script>
import VueP5 from "vue-p5";
import Frog from "../Frog.js";


let linesLow = 3;
let linesHigh = 25;
let radiusHigh;
let distLow;
let circles = [];
let zColor = null;
let NUM_CIRCLES = 8;
let d;


function Circle(sketch){
  this.radius = sketch.random(radiusHigh);
  //this.x = sketch.random(-width/3, width/3);
  //this.y = sketch.random(-height/3, height/3);
  this.x = 0;
  this.y = 0;
  this.theta = 0;
  this.numLines = sketch.random(3, 25);
  
  if (sketch.random() < 0.5){
    this.rotateSpeed = sketch.random(0.005, 0.034);
  }  else{
    this.rotateSpeed = -sketch.random(0.005, 0.034);
  }
  
  if (sketch.random() < 0.5){
    this.radialSpeed = sketch.random(0.3, 1.4);
  }  else {
    this.radialSpeed = -sketch.random(0.3, 1.4);
  }
  
  this.update = function(){
    this.theta += this.rotateSpeed;
    this.radius += this.radialSpeed;
    if (Math.abs(this.radius) > radiusHigh){
      this.radialSpeed *= -1
    }
  }
}


function ZColor(sketch){
  this.r = sketch.random(20, 255);
  this.g = sketch.random(20, 255);
  this.b = sketch.random(20, 255);
  // rate of change of color
  this.speedMin = 0.2;
  this.speedMax = 0.8;
  
  this.getRandSpeed = function(){
    var dir = 1;
    if(sketch.random() < 0.5){
      dir = -1;
    }
    return dir * sketch.random(this.speedMin, this.speedMax);
  };
  
  this.rSpeed = this.getRandSpeed();
  this.gSpeed = this.getRandSpeed();
  this.bSpeed = this.getRandSpeed();
  
  this.colorToggle = function(c, s){
    if ( c > 255 || c < 20 ){
      return -s;
    }
    return s;
  };
  
  this.update = function(){
    this.r += this.rSpeed;
    this.rSpeed = this.colorToggle(this.r, this.rSpeed);
    this.g += this.gSpeed;
    this.gSpeed = this.colorToggle(this.g, this.gSpeed);
    this.b += this.bSpeed;
    this.bSpeed = this.colorToggle(this.b, this.bSpeed);
  };
}

function connectCircles(c1, c2, sketch){
  var r1 = c1.radius;
  var r2 = c2.radius;
  var n1 = c1.numLines;
  var n2 = c2.numLines;
  // mapping min(r1, r2) to range (0.08, 1)
  var rCoeff = sketch.map(sketch.min(Math.abs(r1), Math.abs(r2)), 
                  0, radiusHigh,
                  0.08, 1);
  for (var i=0; i< n1; i++){
    // circle1.x + cosine_of { i out_of 2PI/n1 slices + circle1.theta}
    var x1 = c1.x + r1* sketch.cos( ((i* sketch.TWO_PI) / n1) + c1.theta );
    var y1 = c1.y + r1* sketch.sin( ((i* sketch.TWO_PI) / n1) + c1.theta );
    // iterate through num lines of circle2
    for (var j=0; j<n2; j++){
      var x2 = c2.x + r2* sketch.cos( ((j* sketch.TWO_PI) / n2) + c2.theta );
      var y2 = c2.y + r2* sketch.sin( ((j* sketch.TWO_PI) / n2) + c2.theta );
      
      // distance between (x1,y1), (x2,y2)
      d = sketch.dist(x1,y1,x2,y2);

      if (d < distLow){
        // set stroke Color
        sketch.stroke(zColor.r + r2/1.5,
              zColor.g + r2/2.2,
              zColor.b + r2/1.5,
              sketch.map(d, 0, distLow, 140, 0)*rCoeff); // alpha
        // draw line
        sketch.line(x1, y1, x2, y2);
      }
    }
  }
}

export default {
  components: {
    "vue-p5": VueP5
  },
  data() {
    return {};
  },
  props: ["size", "head", "tail", "rocks", "prev_head", "path"],
  methods: {
    initGraphics(sketch){
      zColor = new ZColor(sketch);
      circles = [];
      for (var i=0; i< NUM_CIRCLES; i++){
        circles.push(new Circle(sketch));    
      }
    },    
    setup(sketch)  {
      sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
      sketch.frameRate(50);
      sketch.fill(0, 60);
      radiusHigh = sketch.min(sketch.width, sketch.height)/2;
      distLow = sketch.max(sketch.width, sketch.height)/3.5;
      this.initGraphics(sketch);
    },
    draw(sketch) {
      sketch.noStroke();
      sketch.rect(0, 0, sketch.width, sketch.height);
      sketch.translate(sketch.width/2, sketch.height/2);
      zColor.update();
      for (var i=0; i<circles.length; i++){
        circles[i].update();
        for (var j = i+1; j < circles.length; j++){
          connectCircles(circles[i], circles[j], sketch);
        }
      }
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

