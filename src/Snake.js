import { initialConfig } from './_initialConfig';
export default class Snake {
  constructor(x, y=x) {
    this.x = x;
    this.y = y;
    this.grid_size = initialConfig.grid_size;
    this.facingAngle = 90;

    this.bodyPosition = null;
    this.bodyLength = null;

    Object.freeze(this.x);
    Object.freeze(this.y);
    Object.freeze(this.grid_size);
    Object.freeze(this.image);
  }

  setBodyLength(bodyLength) {
    this.bodyLength = bodyLength;
  }

  setBodyPosition(index) {
    if (index == 0) {
      this.bodyPosition = 'head';
    } else if (index === (this.bodyLength -1)) {
      this.bodyPosition = 'tail';
    } else {
      this.bodyPosition = 'body';
    }
  }


  isPositionOdd() {
    return this.x % 2 === 0;
  }

  drawSketch(sketch, cell, grid) {
    sketch.image(grid[this.bodyPosition], 0, 0, cell.size.x, cell.size.y);
  }

  add(that) {
    return new Snake(
      this.x + that.x,
      this.y + that.y
    );
  }

  isEqual(that) {
    return this.x == that.x && this.y == that.y;
  }

  clone() {
    return new Snake(this.x, this.y);
  }

  getMovingDirection({x,y}) {
    let direction =  {
      x_direction: this.x > x ? 1 : this.x < x ? -1 : 0,
      y_direction: this.y > y ? 1 : this.y < y ? -1 : 0
    }
    direction.facingAngle = this.setFacingDirection(direction);
    return direction;
  }

  /**
   * Each coordinate is on [min, max) half-interval
   * @param {Snake} min 
   * @param {Snake} max 
   */
  isBetween(min, max) {
    return min.x <= this.x && this.x < max.x &&
      min.y <= this.y && this.y < max.y;
  }

  isCellInsideGrid() {
    return this.isBetween(new Snake(0), new Snake(this.grid_size))
  }

  setFacingDirection(direction) {
    const { x_direction, y_direction } = direction;
    if (x_direction > 0) {
      this.facingAngle = 90;
    } else if (x_direction < 0) {
      this.facingAngle = 270;
    } else if (y_direction > 0) {
      this.facingAngle = 180;
    } else if (y_direction < 0) {
      this.facingAngle = 360;
    } 
    return this.facingAngle;
  }
}