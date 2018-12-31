import { initialConfig } from './_initialConfig';
import getRandomInt from "./getRandomInt.js";
export default class Butterfly {
  constructor(x, y=x) {
    this.x = x;
    this.y = y;
    this.grid_size = initialConfig.grid_size;
    /** 1 -> Right
       -1 -> Left
        2 -> Top
       -2 -> Bottom
    **/
    this.facingAngle = 90;
    Object.freeze(this.grid_size);
  }

  isPositionOdd() {
    return this.x % 2 === 0;
  }

  add(that) {
    return new Butterfly(
      this.x + that.x,
      this.y + that.y
    );
  }

  isEqual(that) {
    return this.x == that.x && this.y == that.y;
  }

  clone() {
    return new Butterfly(this.x, this.y);
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
   * @param {Butterfly} min 
   * @param {Butterfly} max 
   */
  isBetween(min, max) {
    return min.x <= this.x && this.x < max.x &&
      min.y <= this.y && this.y < max.y;
  }

  translateTo(x, y, timeout) {
    return {
      tx: x + 1,
      ty: y + 1
    }
  }

  isCellInsideGrid() {
    return this.isBetween(new Butterfly(0), new Butterfly(this.grid_size))
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