import CubeCoord from "./cubeCoord";
import Vec2 from "./vec2";
import simplex2D from "./simplexValueNoise2D";
import seedrandom from "seedrandom";

const handyRandom = seedrandom('default handyRandom');

class Color {
  data: Uint8ClampedArray;
  constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 0) {
    this.data = new Uint8ClampedArray([r, g, b, a]);
  }
  get r() { return this.data[0]; }
  get g() { return this.data[1]; }
  get b() { return this.data[2]; }
  get a() { return this.data[3]; }
  set r(x: number) { this.data[0] = x; }
  set g(x: number) { this.data[1] = x; }
  set b(x: number) { this.data[2] = x; }
  set a(x: number) { this.data[3] = x; }
  toString() {
    const { r, g, b } = this;
    return `rgb(${r},${g},${b})`;
  }
  add(f: number): Color { return new Color(...this.data.map((n) => n + f)); }
  // add(f: number): Color { return new Color(this.r+f,this.g+f,this.b+f,this.a+f); }
  sub(f: number): Color { return this.add(-f); }
}
const DARK_GREEN = new Color(0, 117, 43, 255);
const CERULEAN = new Color(42, 82, 190, 255);
const BROWN = new Color(128, 107, 79, 255);
const SAND = new Color(237, 227, 175, 255);
// const BEACH = new Color(225, 197, 145, 255);
const BLACK = new Color(0, 0, 0, 255);
const DIRT_GRAY = new Color(168, 157, 139, 255);

const MAP_HEX_SIZE: number = 0.5;
const GOLDEN_RATIO: number = 1.618034;

/* NB: Would be nice if this could just extend CanvasRenderingContext2D,
   but in Chromium I get an error when super is called in its constructor,
   leading me to believe that class was ever meant to be extended.

   It's pretty irrelevant though. I could see an argument for things being
   better this way anyway, because there's a clear distinction between what
   falls back to the CanvasRenderingContext2D and what is something we've
   implemented, making it easier to grok if you already know HTML5 Canvas */
class Renderer {
  ctx: CanvasRenderingContext2D;
  constructor(canvas: HTMLCanvasElement, scale?: Vec2) {
    const ctx = canvas.getContext("2d");
    if (ctx == null)
      throw new Error(
        "Couldn't get CanvasRenderingContext2D from HTMLCanvasElement"
      );

    if (scale != null)
      ctx.scale(scale.x, scale.y);

    this.ctx = ctx;
  }
  setColor(color: Color) {
    this.ctx.globalAlpha = color.a;
    this.ctx.fillStyle = color.toString();
    this.ctx.strokeStyle = color.toString();
  }
  private setHex(pos: Vec2, size: number) {
    this.ctx.beginPath();
    this.ctx.lineWidth = 0.1;
    for (let i = 0; i <= 6; i++) {
      let rot = Math.PI / 180 * (60 * i - 30);
      let { x, y } = pos.add(Vec2.fromRot(rot).mulf(size));
      this.ctx[i > 0 ? 'lineTo' : 'moveTo'](x, y);
    }
  }
  drawCircle(x: number, y: number, radius: number, color: Color): void;
  drawCircle(pos: Vec2, radius: number, color: Color): void;

  drawCircle(
    xOrPos: number | Vec2,
    yOrRadius: number,
    radiusOrColor: number | Color,
    colorArg?: Color
  ) {
    let pos, radius, color;
    if (xOrPos instanceof Vec2) {
      pos = xOrPos;
      radius = yOrRadius;
      color = radiusOrColor as Color;
    } else {
      pos = new Vec2(xOrPos, yOrRadius);
      radius = radiusOrColor as number;
      color = colorArg as Color;
    }
    this.setColor(color);
    this.ctx.beginPath();
    this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
  drawRect(x: number, y: number, w: number, h: number, color: Color, border: number = 0) {
    this.setColor(color);
    this.ctx.fillRect(x-border, y-border, w+border*2, h+border*2);
  }
  drawHex(pos: Vec2, size: number, color: Color) {
    this.setColor(color);
    this.setHex(pos, size);
    this.ctx.fill();
  }
  outlineHex(pos: Vec2, size: number, color: Color) {
    this.setColor(color);
    this.setHex(pos, size);
    this.ctx.stroke();
  }
}

type LeafBubble = { x: number, y: number, radius: number };
const foliage: LeafBubble[] = [
  { x:  0.80, y: 2.2, radius: 0.8 },
  { x:  0.16, y: 3.0, radius: 1.0 },
  { x: -0.80, y: 2.5, radius: 0.9 },
  { x: -0.16, y: 2.0, radius: 0.8 },
];

type Render = { zIndex: number, draw: (rcx: Renderer) => void };

class Ent {
  constructor(public pos: Vec2, public scale: number) {}
  get x() { return this.pos.x; }
  get y() { return this.pos.y; }
  renders(): Render[] { return [] }
}
class Tree extends Ent {
  renders(): Render[] {
    return [
      {
        zIndex: this.y - 0.75,
        draw: rdr => {
          rdr.ctx.save();
          rdr.ctx.translate(this.x, this.y);
          rdr.ctx.scale(this.scale, this.scale);
          const colorAdd = [0, 10, 20, 30];
          for (const [i, {x, y, radius}] of foliage.entries())
            rdr.drawCircle(x, y, radius, DARK_GREEN.add(colorAdd[i]));
          rdr.ctx.restore();
        }
      },
      {
        zIndex: this.y,
        draw: rdr => {
          rdr.ctx.save();
          rdr.ctx.translate(this.x, this.y);
          rdr.ctx.scale(this.scale, this.scale);
          { /* draw trunk */
            const w = 0.8;
            const h = GOLDEN_RATIO * 0.8;
            const r = 0.4;
            rdr.drawCircle(0, r, r, BROWN);
            rdr.drawRect(w / -2.0, r, w, h, BROWN);
          }

          for (const {x, y, radius} of foliage)
            rdr.drawCircle(x, y, radius+0.055/this.scale, DARK_GREEN.sub(20));
          rdr.ctx.restore();
        }
      }
    ];
  }
}

const stoneImg: HTMLCanvasElement = (() => {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 300;
  const ctx = canvas.getContext('2d')!;
  ctx.translate(canvas.width/2, 0);
  ctx.scale(145, 145);

  ctx.beginPath();
  ctx.moveTo(-0.8, 0);
  ctx.lineTo(-0.4, 2);
  ctx.lineTo( 0.4, 1.6);
  ctx.lineTo( 0.8, 0);
  ctx.fillStyle = "" + DIRT_GRAY.sub(30);
  ctx.fill();

  ctx.strokeStyle = "" + DIRT_GRAY.sub(60);
  ctx.lineWidth = 0.12;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-0.35, 1.85);
  ctx.lineTo( 0.32, 1.51);
  ctx.lineTo(-0.05, 1.3);
  ctx.fillStyle = "" + DIRT_GRAY.sub(10);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo( 0.32, 1.41);
  ctx.lineTo(-0.05, 1.2);
  ctx.lineTo(-0.15, 0.1);
  ctx.lineTo( 0.65, 0.1);
  ctx.fillStyle = "" + DIRT_GRAY.sub(40);
  ctx.fill();

  return canvas;
})();

class Stone extends Ent {
  renders(): Render[] {
    return [{
      zIndex: this.y,
      draw: rdr => {
        let { x, y, scale } = this;
        scale *= 2;
        rdr.ctx.drawImage(stoneImg, x - scale/2, y - scale/2, scale, scale);
      }
    }];
  }
}
class Cactus extends Ent {
  renders(): Render[] {
    const CACTUS_GREEN = DARK_GREEN.add(50);

    const limb_w = 0.28;
    const BORDER_GREEN = CACTUS_GREEN.sub(50);
    const scale = 0.7*this.scale;
    const border = 0.055/scale;
    return [
      {
        zIndex: this.y - 0.3,
        draw: rdr => {
          rdr.ctx.save();
          rdr.ctx.translate(this.x, this.y);
          rdr.ctx.scale(scale, scale);

          rdr.drawCircle(0, 0, 0.6, CACTUS_GREEN.sub(20));
          rdr.drawRect(-0.6, 0, 1.2, 2.0, CACTUS_GREEN);
          rdr.drawCircle(0, 0.2, 0.6, CACTUS_GREEN);
          rdr.drawCircle(0, 2.0, 0.6, CACTUS_GREEN);
          rdr.drawRect(-1.0, 0.9-limb_w, 0.8, limb_w*2, CACTUS_GREEN);
          rdr.drawCircle(-1.0, 0.9, limb_w, CACTUS_GREEN);
          rdr.drawRect(-1.0-limb_w, 0.9, limb_w*2, 0.8, CACTUS_GREEN);
          rdr.drawCircle(-1.0, 1.7, limb_w, CACTUS_GREEN);
          
          /* highlights */
          rdr.drawCircle(0.2, 2.1, 0.25, CACTUS_GREEN.add(20));
          rdr.drawCircle(-0.95, 1.7, limb_w*0.5, CACTUS_GREEN.add(20));

          rdr.ctx.restore();
        }
      },
      {
        zIndex: this.y,
        draw: rdr => {
          rdr.ctx.save();
          rdr.ctx.translate(this.x, this.y);
          rdr.ctx.scale(scale, scale);

          rdr.drawCircle(0, 0, 0.6+border, BORDER_GREEN);
          rdr.drawRect(-0.6, 0, 1.2, 2.0, BORDER_GREEN, border);
          rdr.drawCircle(0, 2.0, 0.6+border, BORDER_GREEN);
          rdr.drawRect(-1.0, 0.9-limb_w, 0.8, limb_w*2, BORDER_GREEN, border);
          rdr.drawCircle(-1.0, 0.9, limb_w+border, BORDER_GREEN);
          rdr.drawRect(-1.0-limb_w, 0.9, limb_w*2, 0.8, BORDER_GREEN, border);
          rdr.drawCircle(-1.0, 1.7, limb_w+border, BORDER_GREEN);

          rdr.ctx.restore();
        }
      }
    ];
  }
}

interface NoiseOptions {
  width: number;
  height: number;
  amplitude?: number;
  frequency?: number;
  octaves?: number;
  persistence?: number;
}

function noisePlane(seed: string, opts: NoiseOptions): number[][] {
  const amplitude = opts.amplitude ?? 1.0;
  const frequency = opts.frequency ?? 1.0;
  const octaves = Math.floor(opts.octaves ?? 1);
  const persistence = opts.persistence ?? 0.5;
  const noise = simplex2D(seedrandom(seed));

  const { width, height } = opts;
  const field = new Array(width);
  for (let x = 0; x < width; x++) {
    field[x] = new Array(height);
    for (let y = 0; y < height; y++) {
      let value = 0.0;
      for (let octave = 0; octave < octaves; octave++) {
        const freq = frequency * Math.pow(2, octave);
        const coord = new Vec2(x, y).mulf(freq).hexToCart(1);
        value += noise(coord) * (amplitude * Math.pow(persistence, octave));
      }
      field[x][y] = value / (2 - 1 / Math.pow(2, octaves - 1));
    }
  }
  return field;
}

const enum Biome { Forest, Quarry, Desert, River, COUNT }
const biomeColors = [ DARK_GREEN.add(50), DIRT_GRAY, SAND, CERULEAN ];
const biomeProps = [ Tree, Stone, Cactus ];

class TileMap {
  tiles: Biome[][];
  image: HTMLCanvasElement;

  constructor(public width: number, public height: number) {
    /* biome noise */
    const biomeNoiseOpts = { width, height, frequency: 0.015, octaves: 8, persistence: 0.3 };
    const humidity = noisePlane('default humidity', biomeNoiseOpts);
    const minerals = noisePlane('default minerals', biomeNoiseOpts);

    this.tiles = new Array(width).fill(0).map(_ => new Array(height).fill(0));
    const tiles = this.tiles;

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (humidity[x][y] > 0)
          tiles[x][y] = Biome.Forest;
        else 
          tiles[x][y] = (minerals[x][y] > 0) ? Biome.Quarry : Biome.Desert;
      }
    }
    const clumpMap = new Array(width).fill(0).map(_ => new Array(height).fill(0));
    class Clump {
      edges: Vec2[] = [];
      memberCount: number = 0;
      constructor() {}
    }
    const clumps: Map<number, Clump> = new Map();

    const floodfill = (pos: Vec2, clump: number, biome: Biome) => {
      if (clumpMap[pos.x][pos.y] != 0)
        return;
      clumpMap[pos.x][pos.y] = clump;
      clumps.get(clump)!.memberCount++;
      for (let n of this.neighborsOnMap(pos)) {
        if (tiles[n.x][n.y] != biome)
          clumps.get(clump)!.edges.push(n);
        else
          floodfill(n, clump, biome);
      }
    };
    let nextClump = 1;
    for (let x = 0; x < width; x++)
      for (let y = 0; y < height; y++)
        if (clumpMap[x][y] == 0) {
          nextClump++;
          clumps.set(nextClump, new Clump());
          floodfill(new Vec2(x, y), nextClump, tiles[x][y]);
        }

    for (let [_, clump] of clumps)
      for (let edge of clump.edges)
        tiles[edge.x][edge.y] = Biome.River;

    this.image = document.createElement('canvas');
    this.image.width = this.image.height = 1 << 11;
    this.draw(new Renderer(this.image, new Vec2(47.7, 47.7)));
  }

  neighborsOnMap(n: Vec2): Vec2[] {
    let { width, height } = this;
    return n.hexNeighbors(new Vec2(), new Vec2(width, height));
  }

  draw(rdr: Renderer) {
    const { width, height, tiles } = this;

    /* draw tiles */
    for (let layer of [0, 1]) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const pos = new Vec2(x, y).hexToCart(MAP_HEX_SIZE);
          const biome = tiles[x][y];
          const color = biomeColors[biome];
          if (biome == Biome.River) continue;
          const draw = (biome == Biome.Quarry) ? 'drawHex' : 'drawCircle';

          if (layer == 0)
            rdr[draw](pos, MAP_HEX_SIZE+0.25, color.sub(20));
          if (layer == 1)
            rdr[draw](pos, MAP_HEX_SIZE+0.03, color);
        }
      }
    }
  }

  get size() {
    return new Vec2(this.width, this.height).hexToCart(MAP_HEX_SIZE);
  }
}

class Game {
  map: TileMap;
  ents: Ent[];

  constructor() {
    const map = new TileMap(50, 40);
    let { tiles, width, height } = map;

    const ents = new Array();
    /* prop noise */
    const propNoiseOpts = { width, height, frequency: 0.1, octaves: 8 };
    const propSizes = noisePlane('default prop size', propNoiseOpts);
    const xOffset = noisePlane('default xOffset', propNoiseOpts);
    const yOffset = noisePlane('default yOffset', propNoiseOpts);
    for (const [x, row] of propSizes.entries()) {
      for (const [y, propSize] of row.entries()) {
        let biome = tiles[x][y];
        if (biome == Biome.Desert && handyRandom() < 0.6) continue;
        let prop = biomeProps[biome];
        if (propSize > 0 && prop != undefined) {
          const size = 0.5 + 0.5*propSize;
          const pos = new Vec2(x, y).hexToCart(MAP_HEX_SIZE);
          pos.x += xOffset[x][y];
          pos.y += yOffset[x][y];
          let hex = CubeCoord.fromVec2(pos, MAP_HEX_SIZE).toOffset();
          if (map.neighborsOnMap(hex).some(n => tiles[n.x][n.y] == Biome.River))
            continue;
          ents.push(new prop(pos, size*0.7));
        }
      }
    }

    this.ents = ents;
    this.map = map;
  }

  draw(rdr: Renderer) {
    let { ents } = this;

    /* draw ents */
    const renders = ents.flatMap(ent => ent.renders());
    renders.sort((a, b) => b.zIndex - a.zIndex);
    for (const render of renders) render.draw(rdr);
  }
}

class GlRenderer {
  gl: WebGLRenderingContext;
  program: WebGLProgram;

  constructor(canvas: HTMLCanvasElement, background: HTMLCanvasElement, size: Vec2) {
    const gl = canvas.getContext('webgl', { alpha: false });
    if (gl == null) throw new Error(
      "Couldn't get WebGLRenderingContext from HTMLCanvasElement"
    );
    this.gl = gl;

    const vertSource = `
    uniform vec4 u_camera;

    attribute vec4 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;

    void main() {
      vec2 offset = u_camera.xy;
      vec2 extents = u_camera.zw;
      gl_Position = vec4((offset + a_position.xy)/extents, a_position.zw);
      v_texCoord = a_texCoord;
    }
    `;
    const fragSource = `
    precision mediump float;

    uniform sampler2D u_image;

    varying vec2 v_texCoord;

    void main() {
      gl_FragColor = texture2D(u_image, v_texCoord);
    }
    `;
    const program = this.program = this.createProgram(vertSource, fragSource);
    gl.useProgram(program);

    const hs = Math.max(size.x, size.y)/2;
    const buffers = {
      a_position: { 
        data: [
          -hs, -hs,
          -hs,  hs,
           hs, -hs,
          -hs,  hs,
           hs,  hs,
           hs, -hs,
        ]
      },
      a_texCoord: {
        data: [
          0.0, 0.0,
          0.0, 1.0,
          1.0, 0.0,
          0.0, 1.0,
          1.0, 1.0,
          1.0, 0.0,
        ]
      }
    };
    for (const [key, {data}] of Object.entries(buffers)) {
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
      const aLoc = gl.getAttribLocation(program, key);
      gl.enableVertexAttribArray(aLoc);
      gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);
    }

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, background);
    gl.generateMipmap(gl.TEXTURE_2D);
  }

  createProgram(vertex: string, fragment: string): WebGLProgram {
    const { gl } = this;

    function createShader(kind: GLenum, source: string): WebGLShader {
      const shader = gl.createShader(kind)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(shader)!);
      return shader;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, createShader(gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error(gl.getProgramInfoLog(program)!);

    return program;
  }
}

window.onload = () => {
  const game = new Game();

  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const glr = new GlRenderer(canvas, game.map.image, game.map.size);

  window.addEventListener("resize", () => glr.gl.viewport(
    0, 0, canvas.width = window.innerWidth, canvas.height = window.innerHeight
  ));
  window.dispatchEvent(new UIEvent("resize"));

  // const camera = game.map.size.divf(2).add(new Vec2(0.4, 0.4));
  const camera = new Vec2(0, 6.5);
  const winWidth = () => window.innerWidth;
  const winHeight = () => window.innerHeight;
  const renderZoom = () => {
    const aspect = winWidth() / winHeight();
    const zoom = 20;
    return new Vec2(aspect, aspect).mulf(zoom);
  };

  // let mousePos = new Vec2(1, 1);
  // window.addEventListener('mousemove', ev => {
  //   const halfWin = new Vec2(winWidth(), winHeight()).divf(2.0);
  //   const screenPos = new Vec2(ev.pageX, ev.pageY).sub(halfWin);
  //   const worldPos = screenPos.div(renderZoom()).sub(camera);
  //   mousePos = CubeCoord.fromVec2(worldPos, MAP_HEX_SIZE).toCart(MAP_HEX_SIZE);
  // });

  const frameTimes: number[] = [];
  (function frame() {
    const start = performance.now();

    const { gl } = glr;
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(CERULEAN.r/255, CERULEAN.g/255, CERULEAN.b/255, CERULEAN.a/255);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const aspect = window.innerHeight / window.innerWidth;
    let zoom = 21.65;
    const extents = new Vec2(zoom, zoom*aspect);
    const centerC = camera.add(game.map.size.divf(2).sub(extents).max(0).divf(4));
    gl.uniform4f(gl.getUniformLocation(glr.program, "u_camera"),
                 centerC.x, centerC.y,
                 extents.x, extents.y);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    frameTimes.push(performance.now() - start);

    if (frameTimes.length > 100) {
      frameTimes.shift();
      const average = frameTimes.reduce((a, c) => a + c) / frameTimes.length;
      console.log(`Last 100 frames average: ${average}`)
    }

    requestAnimationFrame(frame);
  })();
};
