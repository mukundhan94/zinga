import { initialConfig } from './_initialConfig';
export default class Frog {
  constructor(x, y=x) {
    this.x = x;
    this.y = y;
    this.grid_size = initialConfig.grid_size;
    this.image = initialConfig.primaryFrog;
    Object.freeze(this);
  }

  add(that) {
    return new Frog(
      this.x + that.x,
      this.y + that.y
    );
  }

  isEqual(that) {
    return this.x == that.x && this.y == that.y;
  }

  clone() {
    return new Frog(this.x, this.y);
  }

  getMovingDirection({x,y}) {
    return {
      x_direction: this.x > x,
      y_direction: this.y > y
    }
  }

  /**
   * Each coordinate is on [min, max) half-interval
   * @param {Frog} min 
   * @param {Frog} max 
   */
  isBetween(min, max) {
    return min.x <= this.x && this.x < max.x &&
      min.y <= this.y && this.y < max.y;
  }

  isCellInsideGrid() {
    return this.isBetween(new Frog(0), new Frog(this.grid_size))
  }
}