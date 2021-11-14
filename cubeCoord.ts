import Vec2 from './vec2';

/* An alternative way of conceptualizing hexagonal coordinates.
   While offset coords (as Vec2s) are used generally, CubeCoords
   are preferable mathematically for operations such as finding
   the hex beneath the mouse, or the neighbors of a given hex

   more information can be found here: redblobgames.com/grids/hexagons */
export default class CubeCoord {
  constructor(public x: number, public y: number, public z: number) {}

  /* Rounds an offset coordinate stored in a Vec2 to the nearest CubeCoord */
  static fromVec2(point: Vec2, size: number): CubeCoord {
    const q = (Math.sqrt(3)/3 * point.x - 1/3 * point.y) / size;
    const r = (                           2/3 * point.y) / size;
    const cube = new CubeCoord(q, -q-r, r);
    let rx = Math.round(cube.x);
    let ry = Math.round(cube.y);
    let rz = Math.round(cube.z);

    const x_diff = Math.abs(rx - cube.x);
    const y_diff = Math.abs(ry - cube.y);
    const z_diff = Math.abs(rz - cube.z);

    if (x_diff > y_diff && x_diff > z_diff) {
      rx = -ry-rz;
    } else if (y_diff > z_diff) {
      ry = -rx-rz;
    } else {
      rz = -rx-ry;
    }

    return new CubeCoord(rx, ry, rz);
  }

  toCart(size: number) {
    const q = this.x;
    const r = this.z;
    const x = Math.sqrt(3) * q + Math.sqrt(3)/2 * r;
    const y =                              3./2 * r;
    return new Vec2(x, y).mulf(size);
  }

  toOffset() {
    let col = this.x + (this.z - (this.z&1)) / 2;
    let row = this.z;
    return new Vec2(col, row);
  }
}
