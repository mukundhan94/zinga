import { initialConfig } from './_initialConfig';
import { getRandomDirection, getRandomInt } from "./utils.js";
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
    this.flapTiming = 100;
    this.color = this.getRandomColor();
    this.flying = false;
    this.oldPath = {
      x: this.x,
      y: this.y
    };
    this.movingPos = {
      xpos: null,
      ypos: null
    };
    this.facingAngle = 0;
    this.dying = false;
    this.lastMoments = 3000;
    this.scale = 1;
    this.resting = false;
    this.facingDirection = 'top';
    this.alive = true;
    Object.freeze(this.grid_size);
  }

  isPositionOdd() {
    return this.x % 2 === 0;
  }

  setMovingPos({
    xpos,
    ypos
  }) {
    this.movingPos = { xpos, ypos };
  }

  addMovingPos({
    xpos, ypos
  }) {
    /**since relative position cannot be used for translated object.
    // '-11': 'topLeft' |=> bottomLeft [-1,-1]
    '-10': 'left' |=> left [-1,0]
    // '-1-1': 'bottomLeft' |=> topLeft [-1,1] 
    // '01': 'top' |=> bottom [0,-1]
    // '00': 'center' |=> center [0,0]
    // '0-1': 'bottom' |=> top [0,1]
    // '11': 'topRight' |=> bottomRight [1,-1]
          '10': 'right' |=> right [0,1]
    // '1-1': 'bottomRight |=> topRight [1,1]**/
    const mappedPosByOrigin = {
        '-11': [-1,-1],
        '-10': [-1,0],
        '-1-1': [-1,1],
        '01': [0,-1],
        '00': [0,0],
        '0-1': [0,1],
        '11': [1,-1],
        '10': [1,0],
        '1-1': [1,1],
    };
    let [x, y] = mappedPosByOrigin[`${xpos}${ypos}`];
    this.movingPos.xpos += x * 0.5;
    this.movingPos.ypos += y * 0.5;
  }


  passAway() {
    this.flying = false;
    this.dying = true;
  }

  grow(scale) {
    this.scale += scale;
  }

  shrink(scale) {
    this.scale -= scale;
    if (this.scale <= 0) {
      this.alive = false;
    }
  }

  flap() {
    this.grow(0.01);
    setTimeout(() => {
      this.shrink(0.01);
    }, this.flapTiming);
  }

  rotateTo(facingAngle, cellAspectRatio) {
    // if (this.facingAngle !== facingAngle) {
      this.facingAngle = facingAngle;
      // this.facingAngle > facingAngle ? this.facingAngle -= 1 :  this.facingAngle += 1;
    // }
  }

  getMovingPos() {
    return this.movingPos;
  }

  getRandomColor() {
    const randomNumber = Math.floor(2* Math.random());
    return randomNumber ? 'red' : 'blue';
  }
  
  fly() {
    this.flying = true;
    const flappingInterval = setInterval(() => {
      if (this.flying) {
        // && !this.resting
        if (!this.resting) {
          this.flap();
        }
      } else {
        clearInterval(flappingInterval);
      }
    }, getRandomInt(150, 200));
    this.flyTo(...getRandomDirection(-2, 2));
    const flyingInterval = setInterval(() => {
      if (this.flying) {
        this.flyTo(...getRandomDirection(-2, 2));
      } else {
        clearInterval(flyingInterval);
      }
    }, 5000);
  }

  flyTo(x, y) {
    let direction =  {
      x: this.x,
      y: this.y
    };
    direction['x'] += x;
    direction['y'] += y;
    // when not flying
    if (x == 0 && y == 0) { 
      this.resting = true;
    } else {
      this.resting = false;
    }
    this.moveTo(direction);
  };

  hasArrivedToPos({ x, y }) {
    return (x == this.movingPos.xpos && y == this.movingPos.ypos);
  }

  moveTo({ x, y }) {
    if(new Butterfly(x, y).isCellInsideGrid()) {
      this.oldPath = {
        x: this.x,
        y: this.y
      };
      this.x = x;
      this.y = y;
    }
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
    direction.facingAngle = this.getFacingDirectionByRelativePos(direction);
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

  getFacingDirectionByRelativePos(direction) {
    /**
     * [-1  1 , 0  1 , 1  1]
     * [-1  0 , 0  0 , 1  0]
     * [-1 -1 , 0 -1 , 1 -1]
     */
    const anglesByRelativePos = {
      '-11': 315,
      '-10': 270,
      '-1-1': 225,
      '01': 0,
      '00': 0,
      '0-1': 180,
      '11': 45,
      '10': 90,
      '1-1': 135
    };

    const directionByPosition = {
      '-11': 'topLeft',
      '-10': 'left',
      '-1-1': 'bottomLeft',
      '01': 'top',
      '00': 'center',
      '0-1': 'bottom',
      '11': 'topRight',
      '10': 'right',
      '1-1': 'bottomRight'
    };

    const { x_direction, y_direction } = direction;
    /**
     * console.log(
      `${x_direction}, ${y_direction}`,
      anglesByRelativePos[`${x_direction}${y_direction}`],
      directionByPosition[`${x_direction}${y_direction}`]
    );*/
    this.facingDirection = directionByPosition[`${x_direction}${y_direction}`];
    return anglesByRelativePos[`${x_direction}${y_direction}`];
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