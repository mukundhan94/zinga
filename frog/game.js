var s;
var scl = 20;
var rocks;

function setup() {
  createCanvas(1200, 1200);
  s = new Frog();
  frameRate(10);
  pickLocation();
}

function pickLocation() {
  var cols = floor(width/scl);
  var rows = floor(height/scl);
  rocks = createVector(floor(random(cols)), floor(random(rows)));
  rocks.mult(scl);
}

function mousePressed() {
  s.total++;
}

function draw() {
  background(51);
  if (s.eat(rocks)) {
    pickLocation();
  }
  s.death();
  s.update();
  s.show();
  fill(255, 0, 100);
  rect(rocks.x, rocks.y, scl, scl);
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    s.dir(0, -1);
  } else if (keyCode === DOWN_ARROW) {
    s.dir(0, 1);
  } else if (keyCode === RIGHT_ARROW) {
    s.dir(1, 0);
  } else if (keyCode === LEFT_ARROW) {
    s.dir(-1, 0);
  }
}
