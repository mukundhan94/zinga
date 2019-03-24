import { initialConfig } from './_initialConfig';
import Sprite from './Sprite';

const directions = {
  up: new Sprite(0, -1), // up arrow key
  left: new Sprite(-1, 0), // left arrow key
  down: new Sprite(0, 1), // down arrow key
  right: new Sprite(1, 0), // right arrow key
};

export default class Snake {
  constructor(x, y=x) {
    this.x = x;
    this.y = y;
    this.grid_size = initialConfig.grid_size;
    // facing up by default
    this.defaultFacingAngle = 90;
    this.facingAngle = this.defaultFacingAngle;
    this.movingDirection = 'up';
    this.bodyPosition = null;
    this.bodyLength = null;
    this.headAngleDiff = -90;
    this.tailAngleDiff = -90;
    this.frontPos = {
      x: this.x,
      y: this.y
    };
    this.behindPos = {
      x: this.x,
      y: this.y
    };

    Object.freeze(this.x);
    Object.freeze(this.y);
    Object.freeze(this.grid_size);
    Object.freeze(this.image);
  }

  setBodyLength(bodyLength) {
    this.bodyLength = bodyLength;
  }

  setNxtfrontPos(frontPos, behindPos) {
    this.behindPos = behindPos;
    this.frontPos = frontPos;
  }

  setBodyPosition(index) {
    if (index == 0) {
      this.bodyPosition = 'head';
      this.defaultFacingAngle = this.headAngleDiff; 
    } else if (index === (this.bodyLength -1)) {
      this.bodyPosition = 'tail';
      this.defaultFacingAngle = this.tailAngleDiff;
    } else {
      // position found to be 'body' 
      this.setBodyType();
    }
  }

  setBodyType() {
     const { behindPos, frontPos, x, y } = this;
     const currentPos = {
       x, y
     };
     if (this.doesPositionsParallel(frontPos, currentPos, behindPos)) {
      this.bodyPosition = 'body';
     } else {
      this.bodyPosition = 'twistedBody';
     }
  }

  doesPositionsParallel(frontPos, currentPos, behindPos) {
    return (frontPos.x === currentPos.x &&  currentPos.x=== behindPos.x) || 
           (frontPos.y === currentPos.y &&  currentPos.y=== behindPos.y);
  }

  isPositionOdd() {
    return this.x % 2 === 0;
  }

  drawSketch(sketch, cell, grid, pos) {
    // sketch.push();  
    // sketch.stroke(255);
    // sketch.fill("blue");
    // sketch.rect(cell.center.x, cell.center.y, cell.size.x, cell.size.y);
    // sketch.pop();
    if (pos === 0) {
        sketch.push();
        const tongue = this.add(directions[this.movingDirection]);
        const tongueCell = grid.gridToCanvas(sketch, tongue);
        tongue.bodyPosition = "tongue";
        tongue.facingAngle = this.facingAngle; 
        this.drawSnake(sketch, tongueCell, grid, "tongue");
        sketch.pop();
    }
    if (this.bodyPosition === 'twistedBody') {
      // sketch.translate(-20, -20);
    }
    this.drawSnake(sketch, cell, grid, this.bodyPosition);
  }

  drawSnake(sketch, cell, grid, bodyPos) {
    sketch.translate(cell.center.x, cell.center.y);
    sketch.rotate(sketch.radians(this.facingAngle));
    if (this.bodyPosition === "head") {
      sketch.push();
      sketch.translate(cell.center.x +1 , cell.center.y +1);
      sketch.rotate(sketch.radians(this.facingAngle));
      sketch.image(grid.tongue, 0, 0, cell.size.x , cell.size.y );  
      sketch.pop();
    }
    sketch.image(grid[bodyPos], 0, 0, cell.size.x , cell.size.y );
  }

  setFacingAngleWithMovingPos() {
    const angleByDirection = {
      up: this.defaultFacingAngle,
      right: this.defaultFacingAngle + 90,
      down: this.defaultFacingAngle + 180,
      left: this.defaultFacingAngle - 90
    }
    let movingDirection = this.movingDirection;
    const frontX = this.frontPos.x;
    const frontY = this.frontPos.y;
    const behindX = this.behindPos.x;
    const behindY = this.behindPos.y;
    const currentX = this.x;
    const currentY = this.y;
    /**
     0  1   2   4 ====>x
     1      
     2  *   *   
     3      * 
     y

      // on turn x and y co-ordinates
         x= 2->2->1   left turn
         y= 3->2->2
      //
      snake 
      index  =>  0                 1               2            3 
      body   => (frontPos)======(currentPos)=====(behindPos)======()
                head                                          tail
      This way of approach works only from head to last part before tail
     */
    if (this.bodyPosition === 'body' || this.bodyPosition === 'head') { 
      if (currentX < behindX) {
        movingDirection = 'left';
      } else if (currentX > behindX) {
        movingDirection = 'right'; 
      } else if (currentY < behindY) {
        movingDirection = 'up';
      } else if (currentY > behindY) {
        movingDirection = 'down';
      }
    }
    // for tail we have to compare with front position
    if (this.bodyPosition === 'tail') {
      if (currentX > frontX) {
        movingDirection = 'left';
      } else if (currentX < frontX) {
        movingDirection = 'right'; 
      } else if (currentY > frontY) {
        movingDirection = 'up';
      } else if (currentY < frontY) {
        movingDirection = 'down';
      }
    }
    this.movingDirection = movingDirection;
    this.facingAngle = angleByDirection[movingDirection];
    if (this.bodyPosition === 'twistedBody') {
      this.setFacingAngleForTwistedBody();
    }
    
  }

  setFacingAngleForTwistedBody() {
    const { behindPos, frontPos, x, y } = this;
    const currentPos = {
      x, y
    };
    let angleDiff = {
      up_left: 0,
      right_down: 0,
      up_right: 270,
      left_down: 270,
      right_up: 90,
      down_left: 90,
      down_right: 180,
      left_up: 180
    };
    // body twisted angle can be calculated based on prev current and nextpos
    // there are  possible turn from a point
    let firstMov;
    let secondMov;
    const frontX = frontPos.x;
    const frontY = frontPos.y;
    const behindX = behindPos.x;
    const behindY = behindPos.y;
    const currentX = currentPos.x;
    const currentY = currentPos.y;
    // firstMov
    if (currentX < behindX) {
      firstMov = 'left';
    } else if (currentX > behindX) {
      firstMov = 'right'; 
    } else if (currentY < behindY) {
      firstMov = 'up';
    } else if (currentY > behindY) {
      firstMov = 'down';
    }
    // secondMov
    if ( frontX < currentX) {
      secondMov = 'left';
    } else if ( frontX > currentX) {
      secondMov = 'right'; 
    } else if (frontY < currentY) {
      secondMov = 'up';
    } else if (frontY > currentY) {
      secondMov = 'down';
    }
    this.movingDirection = firstMov;
    this.facingAngle = angleDiff[`${firstMov}_${secondMov}`];
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
    direction.facingAngle = this.setmovingDirection(direction);
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

  setmovingDirection(direction) {
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
