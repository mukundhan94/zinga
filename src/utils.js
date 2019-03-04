/** Get random integer number from [min, max) half-interval */
export const getRandomInt = (min, max) => {
  return min + Math.floor((max - min) * Math.random());
}

/** Get random integer number from [min, max) half-interval */
export const getRandomDirection = () => {
  const relativePos = [
    [
      [-1, 1],
      [0, 1],
      [1, 1]
    ],
    [
      [-1, 1],
      [0, 0],
      [1, 0]
    ],
    [
      [-1, -1],
      [0, -1],
      [1, -1]
    ]
  ];
  /**
   * [00 ,01 , 02]
   * [10 ,11 , 12]
   * [20 ,21 , 22]
   */
  const direction = {
    topLeft: relativePos[0][0],
    top: relativePos[0][1],
    topRight: relativePos[0][2],
    left: relativePos[1][0],
    center: relativePos[1][1],
    right: relativePos[1][2],
    bottomLeft: relativePos[2][0],
    bottom: relativePos[2][1],
    bottomRight: relativePos[2][2]
  }

  return relativePos[getRandomInt(0, 3)][getRandomInt(0, 3)];
}