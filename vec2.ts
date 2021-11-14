export default class Vec2 {
  constructor(public x: number = 0, public y: number = 0) {}

  mulf(f: number) { return new Vec2(this.x * f, this.y * f); }
  divf(f: number) { return new Vec2(this.x / f, this.y / f); }
  addf(f: number) { return new Vec2(this.x + f, this.y + f); }
  subf(f: number) { return new Vec2(this.x - f, this.y - f); }

  mul({x,y}: Vec2) { return new Vec2(this.x * x, this.y * y); }
  div({x,y}: Vec2) { return new Vec2(this.x / x, this.y / y); }
  add({x,y}: Vec2) { return new Vec2(this.x + x, this.y + y); }
  sub({x,y}: Vec2) { return new Vec2(this.x - x, this.y - y); }

  max(f: number) { return new Vec2(Math.max(f, this.x), Math.max(f, this.y)); }

  static fromRot(rot: number) { return new Vec2(Math.cos(rot), Math.sin(rot)); }

  hexToCart(size: number): Vec2 {
    const x = Math.sqrt(3) * (this.x + 0.5 * (this.y&1));
    return new Vec2(x, 3/2 * this.y).mulf(size);
  }

  hexNeighbor(direction: number): Vec2 {
    const oddr_directions = [
      [[+1,  0], [ 0, -1], [-1, -1], 
       [-1,  0], [-1, +1], [ 0, +1]],
      [[+1,  0], [+1, -1], [ 0, -1], 
       [-1,  0], [ 0, +1], [+1, +1]],
    ];

    const parity = this.y & 1;
    const dir = oddr_directions[parity][direction];
    return new Vec2(this.x + dir[0], this.y + dir[1]);
  }

  hexNeighbors(
    min: Vec2 = new Vec2(-Infinity, -Infinity),
    max: Vec2 = new Vec2(Infinity, Infinity)
  ): Vec2[] {
    return new Array(6)
      .fill(0)
      .map((_, i) => this.hexNeighbor(i))
      .filter(({x,y}) => (x >= min.x && x < max.x) && (y >= min.y && y < max.y))
  }
}
