(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // node_modules/seedrandom/lib/alea.js
  var require_alea = __commonJS({
    "node_modules/seedrandom/lib/alea.js"(exports, module) {
      (function(global, module2, define2) {
        function Alea(seed) {
          var me = this, mash = Mash();
          me.next = function() {
            var t = 2091639 * me.s0 + me.c * 23283064365386963e-26;
            me.s0 = me.s1;
            me.s1 = me.s2;
            return me.s2 = t - (me.c = t | 0);
          };
          me.c = 1;
          me.s0 = mash(" ");
          me.s1 = mash(" ");
          me.s2 = mash(" ");
          me.s0 -= mash(seed);
          if (me.s0 < 0) {
            me.s0 += 1;
          }
          me.s1 -= mash(seed);
          if (me.s1 < 0) {
            me.s1 += 1;
          }
          me.s2 -= mash(seed);
          if (me.s2 < 0) {
            me.s2 += 1;
          }
          mash = null;
        }
        function copy(f, t) {
          t.c = f.c;
          t.s0 = f.s0;
          t.s1 = f.s1;
          t.s2 = f.s2;
          return t;
        }
        function impl(seed, opts) {
          var xg = new Alea(seed), state = opts && opts.state, prng = xg.next;
          prng.int32 = function() {
            return xg.next() * 4294967296 | 0;
          };
          prng.double = function() {
            return prng() + (prng() * 2097152 | 0) * 11102230246251565e-32;
          };
          prng.quick = prng;
          if (state) {
            if (typeof state == "object")
              copy(state, xg);
            prng.state = function() {
              return copy(xg, {});
            };
          }
          return prng;
        }
        function Mash() {
          var n = 4022871197;
          var mash = function(data) {
            data = String(data);
            for (var i = 0; i < data.length; i++) {
              n += data.charCodeAt(i);
              var h = 0.02519603282416938 * n;
              n = h >>> 0;
              h -= n;
              h *= n;
              n = h >>> 0;
              h -= n;
              n += h * 4294967296;
            }
            return (n >>> 0) * 23283064365386963e-26;
          };
          return mash;
        }
        if (module2 && module2.exports) {
          module2.exports = impl;
        } else if (define2 && define2.amd) {
          define2(function() {
            return impl;
          });
        } else {
          this.alea = impl;
        }
      })(exports, typeof module == "object" && module, typeof define == "function" && define);
    }
  });

  // node_modules/seedrandom/lib/xor128.js
  var require_xor128 = __commonJS({
    "node_modules/seedrandom/lib/xor128.js"(exports, module) {
      (function(global, module2, define2) {
        function XorGen(seed) {
          var me = this, strseed = "";
          me.x = 0;
          me.y = 0;
          me.z = 0;
          me.w = 0;
          me.next = function() {
            var t = me.x ^ me.x << 11;
            me.x = me.y;
            me.y = me.z;
            me.z = me.w;
            return me.w ^= me.w >>> 19 ^ t ^ t >>> 8;
          };
          if (seed === (seed | 0)) {
            me.x = seed;
          } else {
            strseed += seed;
          }
          for (var k = 0; k < strseed.length + 64; k++) {
            me.x ^= strseed.charCodeAt(k) | 0;
            me.next();
          }
        }
        function copy(f, t) {
          t.x = f.x;
          t.y = f.y;
          t.z = f.z;
          t.w = f.w;
          return t;
        }
        function impl(seed, opts) {
          var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
            return (xg.next() >>> 0) / 4294967296;
          };
          prng.double = function() {
            do {
              var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
            } while (result === 0);
            return result;
          };
          prng.int32 = xg.next;
          prng.quick = prng;
          if (state) {
            if (typeof state == "object")
              copy(state, xg);
            prng.state = function() {
              return copy(xg, {});
            };
          }
          return prng;
        }
        if (module2 && module2.exports) {
          module2.exports = impl;
        } else if (define2 && define2.amd) {
          define2(function() {
            return impl;
          });
        } else {
          this.xor128 = impl;
        }
      })(exports, typeof module == "object" && module, typeof define == "function" && define);
    }
  });

  // node_modules/seedrandom/lib/xorwow.js
  var require_xorwow = __commonJS({
    "node_modules/seedrandom/lib/xorwow.js"(exports, module) {
      (function(global, module2, define2) {
        function XorGen(seed) {
          var me = this, strseed = "";
          me.next = function() {
            var t = me.x ^ me.x >>> 2;
            me.x = me.y;
            me.y = me.z;
            me.z = me.w;
            me.w = me.v;
            return (me.d = me.d + 362437 | 0) + (me.v = me.v ^ me.v << 4 ^ (t ^ t << 1)) | 0;
          };
          me.x = 0;
          me.y = 0;
          me.z = 0;
          me.w = 0;
          me.v = 0;
          if (seed === (seed | 0)) {
            me.x = seed;
          } else {
            strseed += seed;
          }
          for (var k = 0; k < strseed.length + 64; k++) {
            me.x ^= strseed.charCodeAt(k) | 0;
            if (k == strseed.length) {
              me.d = me.x << 10 ^ me.x >>> 4;
            }
            me.next();
          }
        }
        function copy(f, t) {
          t.x = f.x;
          t.y = f.y;
          t.z = f.z;
          t.w = f.w;
          t.v = f.v;
          t.d = f.d;
          return t;
        }
        function impl(seed, opts) {
          var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
            return (xg.next() >>> 0) / 4294967296;
          };
          prng.double = function() {
            do {
              var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
            } while (result === 0);
            return result;
          };
          prng.int32 = xg.next;
          prng.quick = prng;
          if (state) {
            if (typeof state == "object")
              copy(state, xg);
            prng.state = function() {
              return copy(xg, {});
            };
          }
          return prng;
        }
        if (module2 && module2.exports) {
          module2.exports = impl;
        } else if (define2 && define2.amd) {
          define2(function() {
            return impl;
          });
        } else {
          this.xorwow = impl;
        }
      })(exports, typeof module == "object" && module, typeof define == "function" && define);
    }
  });

  // node_modules/seedrandom/lib/xorshift7.js
  var require_xorshift7 = __commonJS({
    "node_modules/seedrandom/lib/xorshift7.js"(exports, module) {
      (function(global, module2, define2) {
        function XorGen(seed) {
          var me = this;
          me.next = function() {
            var X = me.x, i = me.i, t, v, w;
            t = X[i];
            t ^= t >>> 7;
            v = t ^ t << 24;
            t = X[i + 1 & 7];
            v ^= t ^ t >>> 10;
            t = X[i + 3 & 7];
            v ^= t ^ t >>> 3;
            t = X[i + 4 & 7];
            v ^= t ^ t << 7;
            t = X[i + 7 & 7];
            t = t ^ t << 13;
            v ^= t ^ t << 9;
            X[i] = v;
            me.i = i + 1 & 7;
            return v;
          };
          function init(me2, seed2) {
            var j, w, X = [];
            if (seed2 === (seed2 | 0)) {
              w = X[0] = seed2;
            } else {
              seed2 = "" + seed2;
              for (j = 0; j < seed2.length; ++j) {
                X[j & 7] = X[j & 7] << 15 ^ seed2.charCodeAt(j) + X[j + 1 & 7] << 13;
              }
            }
            while (X.length < 8)
              X.push(0);
            for (j = 0; j < 8 && X[j] === 0; ++j)
              ;
            if (j == 8)
              w = X[7] = -1;
            else
              w = X[j];
            me2.x = X;
            me2.i = 0;
            for (j = 256; j > 0; --j) {
              me2.next();
            }
          }
          init(me, seed);
        }
        function copy(f, t) {
          t.x = f.x.slice();
          t.i = f.i;
          return t;
        }
        function impl(seed, opts) {
          if (seed == null)
            seed = +new Date();
          var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
            return (xg.next() >>> 0) / 4294967296;
          };
          prng.double = function() {
            do {
              var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
            } while (result === 0);
            return result;
          };
          prng.int32 = xg.next;
          prng.quick = prng;
          if (state) {
            if (state.x)
              copy(state, xg);
            prng.state = function() {
              return copy(xg, {});
            };
          }
          return prng;
        }
        if (module2 && module2.exports) {
          module2.exports = impl;
        } else if (define2 && define2.amd) {
          define2(function() {
            return impl;
          });
        } else {
          this.xorshift7 = impl;
        }
      })(exports, typeof module == "object" && module, typeof define == "function" && define);
    }
  });

  // node_modules/seedrandom/lib/xor4096.js
  var require_xor4096 = __commonJS({
    "node_modules/seedrandom/lib/xor4096.js"(exports, module) {
      (function(global, module2, define2) {
        function XorGen(seed) {
          var me = this;
          me.next = function() {
            var w = me.w, X = me.X, i = me.i, t, v;
            me.w = w = w + 1640531527 | 0;
            v = X[i + 34 & 127];
            t = X[i = i + 1 & 127];
            v ^= v << 13;
            t ^= t << 17;
            v ^= v >>> 15;
            t ^= t >>> 12;
            v = X[i] = v ^ t;
            me.i = i;
            return v + (w ^ w >>> 16) | 0;
          };
          function init(me2, seed2) {
            var t, v, i, j, w, X = [], limit = 128;
            if (seed2 === (seed2 | 0)) {
              v = seed2;
              seed2 = null;
            } else {
              seed2 = seed2 + "\0";
              v = 0;
              limit = Math.max(limit, seed2.length);
            }
            for (i = 0, j = -32; j < limit; ++j) {
              if (seed2)
                v ^= seed2.charCodeAt((j + 32) % seed2.length);
              if (j === 0)
                w = v;
              v ^= v << 10;
              v ^= v >>> 15;
              v ^= v << 4;
              v ^= v >>> 13;
              if (j >= 0) {
                w = w + 1640531527 | 0;
                t = X[j & 127] ^= v + w;
                i = t == 0 ? i + 1 : 0;
              }
            }
            if (i >= 128) {
              X[(seed2 && seed2.length || 0) & 127] = -1;
            }
            i = 127;
            for (j = 4 * 128; j > 0; --j) {
              v = X[i + 34 & 127];
              t = X[i = i + 1 & 127];
              v ^= v << 13;
              t ^= t << 17;
              v ^= v >>> 15;
              t ^= t >>> 12;
              X[i] = v ^ t;
            }
            me2.w = w;
            me2.X = X;
            me2.i = i;
          }
          init(me, seed);
        }
        function copy(f, t) {
          t.i = f.i;
          t.w = f.w;
          t.X = f.X.slice();
          return t;
        }
        ;
        function impl(seed, opts) {
          if (seed == null)
            seed = +new Date();
          var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
            return (xg.next() >>> 0) / 4294967296;
          };
          prng.double = function() {
            do {
              var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
            } while (result === 0);
            return result;
          };
          prng.int32 = xg.next;
          prng.quick = prng;
          if (state) {
            if (state.X)
              copy(state, xg);
            prng.state = function() {
              return copy(xg, {});
            };
          }
          return prng;
        }
        if (module2 && module2.exports) {
          module2.exports = impl;
        } else if (define2 && define2.amd) {
          define2(function() {
            return impl;
          });
        } else {
          this.xor4096 = impl;
        }
      })(exports, typeof module == "object" && module, typeof define == "function" && define);
    }
  });

  // node_modules/seedrandom/lib/tychei.js
  var require_tychei = __commonJS({
    "node_modules/seedrandom/lib/tychei.js"(exports, module) {
      (function(global, module2, define2) {
        function XorGen(seed) {
          var me = this, strseed = "";
          me.next = function() {
            var b = me.b, c = me.c, d = me.d, a = me.a;
            b = b << 25 ^ b >>> 7 ^ c;
            c = c - d | 0;
            d = d << 24 ^ d >>> 8 ^ a;
            a = a - b | 0;
            me.b = b = b << 20 ^ b >>> 12 ^ c;
            me.c = c = c - d | 0;
            me.d = d << 16 ^ c >>> 16 ^ a;
            return me.a = a - b | 0;
          };
          me.a = 0;
          me.b = 0;
          me.c = 2654435769 | 0;
          me.d = 1367130551;
          if (seed === Math.floor(seed)) {
            me.a = seed / 4294967296 | 0;
            me.b = seed | 0;
          } else {
            strseed += seed;
          }
          for (var k = 0; k < strseed.length + 20; k++) {
            me.b ^= strseed.charCodeAt(k) | 0;
            me.next();
          }
        }
        function copy(f, t) {
          t.a = f.a;
          t.b = f.b;
          t.c = f.c;
          t.d = f.d;
          return t;
        }
        ;
        function impl(seed, opts) {
          var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
            return (xg.next() >>> 0) / 4294967296;
          };
          prng.double = function() {
            do {
              var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
            } while (result === 0);
            return result;
          };
          prng.int32 = xg.next;
          prng.quick = prng;
          if (state) {
            if (typeof state == "object")
              copy(state, xg);
            prng.state = function() {
              return copy(xg, {});
            };
          }
          return prng;
        }
        if (module2 && module2.exports) {
          module2.exports = impl;
        } else if (define2 && define2.amd) {
          define2(function() {
            return impl;
          });
        } else {
          this.tychei = impl;
        }
      })(exports, typeof module == "object" && module, typeof define == "function" && define);
    }
  });

  // (disabled):crypto
  var require_crypto = __commonJS({
    "(disabled):crypto"() {
    }
  });

  // node_modules/seedrandom/seedrandom.js
  var require_seedrandom = __commonJS({
    "node_modules/seedrandom/seedrandom.js"(exports, module) {
      (function(global, pool, math) {
        var width = 256, chunks = 6, digits = 52, rngname = "random", startdenom = math.pow(width, chunks), significance = math.pow(2, digits), overflow = significance * 2, mask = width - 1, nodecrypto;
        function seedrandom2(seed, options, callback) {
          var key = [];
          options = options == true ? { entropy: true } : options || {};
          var shortseed = mixkey(flatten(options.entropy ? [seed, tostring(pool)] : seed == null ? autoseed() : seed, 3), key);
          var arc4 = new ARC4(key);
          var prng = function() {
            var n = arc4.g(chunks), d = startdenom, x = 0;
            while (n < significance) {
              n = (n + x) * width;
              d *= width;
              x = arc4.g(1);
            }
            while (n >= overflow) {
              n /= 2;
              d /= 2;
              x >>>= 1;
            }
            return (n + x) / d;
          };
          prng.int32 = function() {
            return arc4.g(4) | 0;
          };
          prng.quick = function() {
            return arc4.g(4) / 4294967296;
          };
          prng.double = prng;
          mixkey(tostring(arc4.S), pool);
          return (options.pass || callback || function(prng2, seed2, is_math_call, state) {
            if (state) {
              if (state.S) {
                copy(state, arc4);
              }
              prng2.state = function() {
                return copy(arc4, {});
              };
            }
            if (is_math_call) {
              math[rngname] = prng2;
              return seed2;
            } else
              return prng2;
          })(prng, shortseed, "global" in options ? options.global : this == math, options.state);
        }
        function ARC4(key) {
          var t, keylen = key.length, me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];
          if (!keylen) {
            key = [keylen++];
          }
          while (i < width) {
            s[i] = i++;
          }
          for (i = 0; i < width; i++) {
            s[i] = s[j = mask & j + key[i % keylen] + (t = s[i])];
            s[j] = t;
          }
          (me.g = function(count) {
            var t2, r = 0, i2 = me.i, j2 = me.j, s2 = me.S;
            while (count--) {
              t2 = s2[i2 = mask & i2 + 1];
              r = r * width + s2[mask & (s2[i2] = s2[j2 = mask & j2 + t2]) + (s2[j2] = t2)];
            }
            me.i = i2;
            me.j = j2;
            return r;
          })(width);
        }
        function copy(f, t) {
          t.i = f.i;
          t.j = f.j;
          t.S = f.S.slice();
          return t;
        }
        ;
        function flatten(obj, depth) {
          var result = [], typ = typeof obj, prop;
          if (depth && typ == "object") {
            for (prop in obj) {
              try {
                result.push(flatten(obj[prop], depth - 1));
              } catch (e) {
              }
            }
          }
          return result.length ? result : typ == "string" ? obj : obj + "\0";
        }
        function mixkey(seed, key) {
          var stringseed = seed + "", smear, j = 0;
          while (j < stringseed.length) {
            key[mask & j] = mask & (smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++);
          }
          return tostring(key);
        }
        function autoseed() {
          try {
            var out;
            if (nodecrypto && (out = nodecrypto.randomBytes)) {
              out = out(width);
            } else {
              out = new Uint8Array(width);
              (global.crypto || global.msCrypto).getRandomValues(out);
            }
            return tostring(out);
          } catch (e) {
            var browser = global.navigator, plugins = browser && browser.plugins;
            return [+new Date(), global, plugins, global.screen, tostring(pool)];
          }
        }
        function tostring(a) {
          return String.fromCharCode.apply(0, a);
        }
        mixkey(math.random(), pool);
        if (typeof module == "object" && module.exports) {
          module.exports = seedrandom2;
          try {
            nodecrypto = require_crypto();
          } catch (ex) {
          }
        } else if (typeof define == "function" && define.amd) {
          define(function() {
            return seedrandom2;
          });
        } else {
          math["seed" + rngname] = seedrandom2;
        }
      })(typeof self !== "undefined" ? self : exports, [], Math);
    }
  });

  // node_modules/seedrandom/index.js
  var require_seedrandom2 = __commonJS({
    "node_modules/seedrandom/index.js"(exports, module) {
      var alea = require_alea();
      var xor128 = require_xor128();
      var xorwow = require_xorwow();
      var xorshift7 = require_xorshift7();
      var xor4096 = require_xor4096();
      var tychei = require_tychei();
      var sr = require_seedrandom();
      sr.alea = alea;
      sr.xor128 = xor128;
      sr.xorwow = xorwow;
      sr.xorshift7 = xorshift7;
      sr.xor4096 = xor4096;
      sr.tychei = tychei;
      module.exports = sr;
    }
  });

  // vec2.ts
  var Vec2 = class {
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }
    mulf(f) {
      return new Vec2(this.x * f, this.y * f);
    }
    divf(f) {
      return new Vec2(this.x / f, this.y / f);
    }
    addf(f) {
      return new Vec2(this.x + f, this.y + f);
    }
    subf(f) {
      return new Vec2(this.x - f, this.y - f);
    }
    mul({ x, y }) {
      return new Vec2(this.x * x, this.y * y);
    }
    div({ x, y }) {
      return new Vec2(this.x / x, this.y / y);
    }
    add({ x, y }) {
      return new Vec2(this.x + x, this.y + y);
    }
    sub({ x, y }) {
      return new Vec2(this.x - x, this.y - y);
    }
    max(f) {
      return new Vec2(Math.max(f, this.x), Math.max(f, this.y));
    }
    static fromRot(rot) {
      return new Vec2(Math.cos(rot), Math.sin(rot));
    }
    hexToCart(size) {
      const x = Math.sqrt(3) * (this.x + 0.5 * (this.y & 1));
      return new Vec2(x, 3 / 2 * this.y).mulf(size);
    }
    hexNeighbor(direction) {
      const oddr_directions = [
        [
          [1, 0],
          [0, -1],
          [-1, -1],
          [-1, 0],
          [-1, 1],
          [0, 1]
        ],
        [
          [1, 0],
          [1, -1],
          [0, -1],
          [-1, 0],
          [0, 1],
          [1, 1]
        ]
      ];
      const parity = this.y & 1;
      const dir = oddr_directions[parity][direction];
      return new Vec2(this.x + dir[0], this.y + dir[1]);
    }
    hexNeighbors(min = new Vec2(-Infinity, -Infinity), max = new Vec2(Infinity, Infinity)) {
      return new Array(6).fill(0).map((_, i) => this.hexNeighbor(i)).filter(({ x, y }) => x >= min.x && x < max.x && (y >= min.y && y < max.y));
    }
  };

  // cubeCoord.ts
  var CubeCoord = class {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
    static fromVec2(point, size) {
      const q = (Math.sqrt(3) / 3 * point.x - 1 / 3 * point.y) / size;
      const r = 2 / 3 * point.y / size;
      const cube = new CubeCoord(q, -q - r, r);
      let rx = Math.round(cube.x);
      let ry = Math.round(cube.y);
      let rz = Math.round(cube.z);
      const x_diff = Math.abs(rx - cube.x);
      const y_diff = Math.abs(ry - cube.y);
      const z_diff = Math.abs(rz - cube.z);
      if (x_diff > y_diff && x_diff > z_diff) {
        rx = -ry - rz;
      } else if (y_diff > z_diff) {
        ry = -rx - rz;
      } else {
        rz = -rx - ry;
      }
      return new CubeCoord(rx, ry, rz);
    }
    toCart(size) {
      const q = this.x;
      const r = this.z;
      const x = Math.sqrt(3) * q + Math.sqrt(3) / 2 * r;
      const y = 3 / 2 * r;
      return new Vec2(x, y).mulf(size);
    }
    toOffset() {
      let col = this.x + (this.z - (this.z & 1)) / 2;
      let row = this.z;
      return new Vec2(col, row);
    }
  };

  // simplexValueNoise2D.ts
  var G2 = (3 - Math.sqrt(3)) / 6;
  var Grad = [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
    [1, 0],
    [-1, 0],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [0, 1],
    [0, -1]
  ];
  function simplexValueNoise2D_default(random = Math.random) {
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++)
      p[i] = i;
    let n;
    let q;
    for (let i = 255; i > 0; i--) {
      n = Math.floor((i + 1) * random());
      q = p[i];
      p[i] = p[n];
      p[n] = q;
    }
    const perm = new Uint8Array(512);
    const permMod12 = new Uint8Array(512);
    for (let i = 0; i < 512; i++) {
      perm[i] = p[i & 255];
      permMod12[i] = perm[i] % 12;
    }
    return (xy) => {
      let { x, y } = xy;
      const s = (x + y) * 0.5 * (Math.sqrt(3) - 1);
      const i = Math.floor(x + s);
      const j = Math.floor(y + s);
      const t = (i + j) * G2;
      const X0 = i - t;
      const Y0 = j - t;
      const x0 = x - X0;
      const y0 = y - Y0;
      const i1 = x0 > y0 ? 1 : 0;
      const j1 = x0 > y0 ? 0 : 1;
      const x1 = x0 - i1 + G2;
      const y1 = y0 - j1 + G2;
      const x2 = x0 - 1 + 2 * G2;
      const y2 = y0 - 1 + 2 * G2;
      const ii = i & 255;
      const jj = j & 255;
      const g0 = Grad[permMod12[ii + perm[jj]]];
      const g1 = Grad[permMod12[ii + i1 + perm[jj + j1]]];
      const g2 = Grad[permMod12[ii + 1 + perm[jj + 1]]];
      const t0 = 0.5 - x0 * x0 - y0 * y0;
      const n0 = t0 < 0 ? 0 : Math.pow(t0, 4) * (g0[0] * x0 + g0[1] * y0);
      const t1 = 0.5 - x1 * x1 - y1 * y1;
      const n1 = t1 < 0 ? 0 : Math.pow(t1, 4) * (g1[0] * x1 + g1[1] * y1);
      const t2 = 0.5 - x2 * x2 - y2 * y2;
      const n2 = t2 < 0 ? 0 : Math.pow(t2, 4) * (g2[0] * x2 + g2[1] * y2);
      return 70.14805770653952 * (n0 + n1 + n2);
    };
  }

  // main.ts
  var import_seedrandom = __toModule(require_seedrandom2());
  var handyRandom = (0, import_seedrandom.default)("default handyRandom");
  var Color = class {
    constructor(r = 0, g = 0, b = 0, a = 0) {
      this.data = new Uint8ClampedArray([r, g, b, a]);
    }
    get r() {
      return this.data[0];
    }
    get g() {
      return this.data[1];
    }
    get b() {
      return this.data[2];
    }
    get a() {
      return this.data[3];
    }
    set r(x) {
      this.data[0] = x;
    }
    set g(x) {
      this.data[1] = x;
    }
    set b(x) {
      this.data[2] = x;
    }
    set a(x) {
      this.data[3] = x;
    }
    toString() {
      const { r, g, b } = this;
      return `rgb(${r},${g},${b})`;
    }
    add(f) {
      return new Color(...this.data.map((n) => n + f));
    }
    sub(f) {
      return this.add(-f);
    }
  };
  var DARK_GREEN = new Color(0, 117, 43, 255);
  var CERULEAN = new Color(42, 82, 190, 255);
  var BROWN = new Color(128, 107, 79, 255);
  var SAND = new Color(237, 227, 175, 255);
  var DIRT_GRAY = new Color(168, 157, 139, 255);
  var MAP_HEX_SIZE = 0.5;
  var GOLDEN_RATIO = 1.618034;
  var Renderer = class {
    constructor(canvas, scale) {
      const ctx = canvas.getContext("2d");
      if (ctx == null)
        throw new Error("Couldn't get CanvasRenderingContext2D from HTMLCanvasElement");
      if (scale != null)
        ctx.scale(scale.x, scale.y);
      this.ctx = ctx;
    }
    setColor(color) {
      this.ctx.globalAlpha = color.a;
      this.ctx.fillStyle = color.toString();
      this.ctx.strokeStyle = color.toString();
    }
    setHex(pos, size) {
      this.ctx.beginPath();
      this.ctx.lineWidth = 0.1;
      for (let i = 0; i <= 6; i++) {
        let rot = Math.PI / 180 * (60 * i - 30);
        let { x, y } = pos.add(Vec2.fromRot(rot).mulf(size));
        this.ctx[i > 0 ? "lineTo" : "moveTo"](x, y);
      }
    }
    drawCircle(xOrPos, yOrRadius, radiusOrColor, colorArg) {
      let pos, radius, color;
      if (xOrPos instanceof Vec2) {
        pos = xOrPos;
        radius = yOrRadius;
        color = radiusOrColor;
      } else {
        pos = new Vec2(xOrPos, yOrRadius);
        radius = radiusOrColor;
        color = colorArg;
      }
      this.setColor(color);
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
    drawRect(x, y, w, h, color, border = 0) {
      this.setColor(color);
      this.ctx.fillRect(x - border, y - border, w + border * 2, h + border * 2);
    }
    drawHex(pos, size, color) {
      this.setColor(color);
      this.setHex(pos, size);
      this.ctx.fill();
    }
    outlineHex(pos, size, color) {
      this.setColor(color);
      this.setHex(pos, size);
      this.ctx.stroke();
    }
  };
  var foliage = [
    { x: 0.8, y: 2.2, radius: 0.8 },
    { x: 0.16, y: 3, radius: 1 },
    { x: -0.8, y: 2.5, radius: 0.9 },
    { x: -0.16, y: 2, radius: 0.8 }
  ];
  var Ent = class {
    constructor(pos, scale) {
      this.pos = pos;
      this.scale = scale;
    }
    get x() {
      return this.pos.x;
    }
    get y() {
      return this.pos.y;
    }
    renders() {
      return [];
    }
  };
  var Tree = class extends Ent {
    renders() {
      return [
        {
          zIndex: this.y - 0.75,
          draw: (rdr) => {
            rdr.ctx.save();
            rdr.ctx.translate(this.x, this.y);
            rdr.ctx.scale(this.scale, this.scale);
            const colorAdd = [0, 10, 20, 30];
            for (const [i, { x, y, radius }] of foliage.entries())
              rdr.drawCircle(x, y, radius, DARK_GREEN.add(colorAdd[i]));
            rdr.ctx.restore();
          }
        },
        {
          zIndex: this.y,
          draw: (rdr) => {
            rdr.ctx.save();
            rdr.ctx.translate(this.x, this.y);
            rdr.ctx.scale(this.scale, this.scale);
            {
              const w = 0.8;
              const h = GOLDEN_RATIO * 0.8;
              const r = 0.4;
              rdr.drawCircle(0, r, r, BROWN);
              rdr.drawRect(w / -2, r, w, h, BROWN);
            }
            for (const { x, y, radius } of foliage)
              rdr.drawCircle(x, y, radius + 0.055 / this.scale, DARK_GREEN.sub(20));
            rdr.ctx.restore();
          }
        }
      ];
    }
  };
  var Stone = class extends Ent {
    renders() {
      return [{
        zIndex: this.y,
        draw: (rdr) => {
          let { x, y, scale } = this;
          rdr.ctx.save();
          rdr.ctx.translate(x, y);
          rdr.ctx.scale(scale, scale);
          scale *= 2;
          rdr.ctx.beginPath();
          rdr.ctx.moveTo(-0.8, 0);
          rdr.ctx.lineTo(-0.4, 2);
          rdr.ctx.lineTo(0.4, 1.6);
          rdr.ctx.lineTo(0.8, 0);
          rdr.ctx.fillStyle = "" + DIRT_GRAY.sub(30);
          rdr.ctx.fill();
          rdr.ctx.strokeStyle = "" + DIRT_GRAY.sub(60);
          rdr.ctx.lineWidth = 0.12;
          rdr.ctx.stroke();
          rdr.ctx.beginPath();
          rdr.ctx.moveTo(-0.35, 1.85);
          rdr.ctx.lineTo(0.32, 1.51);
          rdr.ctx.lineTo(-0.05, 1.3);
          rdr.ctx.fillStyle = "" + DIRT_GRAY.sub(10);
          rdr.ctx.fill();
          rdr.ctx.beginPath();
          rdr.ctx.moveTo(0.32, 1.41);
          rdr.ctx.lineTo(-0.05, 1.2);
          rdr.ctx.lineTo(-0.15, 0.1);
          rdr.ctx.lineTo(0.65, 0.1);
          rdr.ctx.fillStyle = "" + DIRT_GRAY.sub(40);
          rdr.ctx.fill();
          rdr.ctx.restore();
        }
      }];
    }
  };
  var Cactus = class extends Ent {
    renders() {
      const CACTUS_GREEN = DARK_GREEN.add(50);
      const limb_w = 0.28;
      const BORDER_GREEN = CACTUS_GREEN.sub(50);
      const scale = 0.7 * this.scale;
      const border = 0.055 / scale;
      return [
        {
          zIndex: this.y - 0.3,
          draw: (rdr) => {
            rdr.ctx.save();
            rdr.ctx.translate(this.x, this.y);
            rdr.ctx.scale(scale, scale);
            rdr.drawCircle(0, 0, 0.6, CACTUS_GREEN.sub(20));
            rdr.drawRect(-0.6, 0, 1.2, 2, CACTUS_GREEN);
            rdr.drawCircle(0, 0.2, 0.6, CACTUS_GREEN);
            rdr.drawCircle(0, 2, 0.6, CACTUS_GREEN);
            rdr.drawRect(-1, 0.9 - limb_w, 0.8, limb_w * 2, CACTUS_GREEN);
            rdr.drawCircle(-1, 0.9, limb_w, CACTUS_GREEN);
            rdr.drawRect(-1 - limb_w, 0.9, limb_w * 2, 0.8, CACTUS_GREEN);
            rdr.drawCircle(-1, 1.7, limb_w, CACTUS_GREEN);
            rdr.drawCircle(0.2, 2.1, 0.25, CACTUS_GREEN.add(20));
            rdr.drawCircle(-0.95, 1.7, limb_w * 0.5, CACTUS_GREEN.add(20));
            rdr.ctx.restore();
          }
        },
        {
          zIndex: this.y,
          draw: (rdr) => {
            rdr.ctx.save();
            rdr.ctx.translate(this.x, this.y);
            rdr.ctx.scale(scale, scale);
            rdr.drawCircle(0, 0, 0.6 + border, BORDER_GREEN);
            rdr.drawRect(-0.6, 0, 1.2, 2, BORDER_GREEN, border);
            rdr.drawCircle(0, 2, 0.6 + border, BORDER_GREEN);
            rdr.drawRect(-1, 0.9 - limb_w, 0.8, limb_w * 2, BORDER_GREEN, border);
            rdr.drawCircle(-1, 0.9, limb_w + border, BORDER_GREEN);
            rdr.drawRect(-1 - limb_w, 0.9, limb_w * 2, 0.8, BORDER_GREEN, border);
            rdr.drawCircle(-1, 1.7, limb_w + border, BORDER_GREEN);
            rdr.ctx.restore();
          }
        }
      ];
    }
  };
  function noisePlane(seed, opts) {
    var _a, _b, _c, _d;
    const amplitude = (_a = opts.amplitude) != null ? _a : 1;
    const frequency = (_b = opts.frequency) != null ? _b : 1;
    const octaves = Math.floor((_c = opts.octaves) != null ? _c : 1);
    const persistence = (_d = opts.persistence) != null ? _d : 0.5;
    const noise = simplexValueNoise2D_default((0, import_seedrandom.default)(seed));
    const { width, height } = opts;
    const field = new Array(width);
    for (let x = 0; x < width; x++) {
      field[x] = new Array(height);
      for (let y = 0; y < height; y++) {
        let value = 0;
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
  var Biome;
  (function(Biome2) {
    Biome2[Biome2["Forest"] = 0] = "Forest";
    Biome2[Biome2["Quarry"] = 1] = "Quarry";
    Biome2[Biome2["Desert"] = 2] = "Desert";
    Biome2[Biome2["River"] = 3] = "River";
    Biome2[Biome2["COUNT"] = 4] = "COUNT";
  })(Biome || (Biome = {}));
  var biomeColors = [DARK_GREEN.add(50), DIRT_GRAY, SAND, CERULEAN];
  var biomeProps = [Tree, Stone, Cactus];
  var TileMap = class {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      const biomeNoiseOpts = { width, height, frequency: 0.015, octaves: 8, persistence: 0.3 };
      const humidity = noisePlane("default humidity", biomeNoiseOpts);
      const minerals = noisePlane("default minerals", biomeNoiseOpts);
      this.tiles = new Array(width).fill(0).map((_) => new Array(height).fill(0));
      const tiles = this.tiles;
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          if (humidity[x][y] > 0)
            tiles[x][y] = 0;
          else
            tiles[x][y] = minerals[x][y] > 0 ? 1 : 2;
        }
      }
      const clumpMap = new Array(width).fill(0).map((_) => new Array(height).fill(0));
      class Clump {
        constructor() {
          this.edges = [];
          this.memberCount = 0;
        }
      }
      const clumps = new Map();
      const floodfill = (pos, clump, biome) => {
        if (clumpMap[pos.x][pos.y] != 0)
          return;
        clumpMap[pos.x][pos.y] = clump;
        clumps.get(clump).memberCount++;
        for (let n of this.neighborsOnMap(pos)) {
          if (tiles[n.x][n.y] != biome)
            clumps.get(clump).edges.push(n);
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
          tiles[edge.x][edge.y] = 3;
    }
    neighborsOnMap(n) {
      let { width, height } = this;
      return n.hexNeighbors(new Vec2(), new Vec2(width, height));
    }
    draw(rdr) {
      const { width, height, tiles } = this;
      for (let layer of [0, 1]) {
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const pos = new Vec2(x - width / 2, y - height / 2).hexToCart(MAP_HEX_SIZE);
            const biome = tiles[x][y];
            const color = biomeColors[biome];
            if (biome == 3)
              continue;
            const draw = biome == 1 ? "drawHex" : "drawCircle";
            if (layer == 0)
              rdr[draw](pos, MAP_HEX_SIZE + 0.25, color.sub(20));
            if (layer == 1)
              rdr[draw](pos, MAP_HEX_SIZE + 0.08, color);
          }
        }
      }
    }
  };
  var Game = class {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      const map = new TileMap(width, height);
      let { tiles } = map;
      const ents = new Array();
      const propNoiseOpts = { width, height, frequency: 0.1, octaves: 8 };
      const propSizes = noisePlane("default prop size", propNoiseOpts);
      const xOffset = noisePlane("default xOffset", propNoiseOpts);
      const yOffset = noisePlane("default yOffset", propNoiseOpts);
      for (const [x, row] of propSizes.entries()) {
        for (const [y, propSize] of row.entries()) {
          let biome = tiles[x][y];
          if (biome == 2 && handyRandom() < 0.6)
            continue;
          let prop = biomeProps[biome];
          if (propSize > 0 && prop != void 0) {
            const size = 0.5 + 0.5 * propSize;
            const pos = new Vec2(x, y).hexToCart(MAP_HEX_SIZE);
            pos.x += xOffset[x][y];
            pos.y += yOffset[x][y];
            let hex = CubeCoord.fromVec2(pos, MAP_HEX_SIZE).toOffset();
            if (map.neighborsOnMap(hex).some((n) => tiles[n.x][n.y] == 3))
              continue;
            ents.push(new prop(pos, size * 0.7));
          }
        }
      }
      this.ents = ents;
      this.map = map;
    }
    get mapSize() {
      return new Vec2(this.width, this.height).hexToCart(MAP_HEX_SIZE);
    }
    draw(rdr) {
      let { ents } = this;
      const renders = ents.flatMap((ent) => ent.renders());
      renders.sort((a, b) => b.zIndex - a.zIndex);
      for (const render of renders)
        render.draw(rdr);
    }
  };
  window.onload = () => {
    const canvas = document.getElementById("canvas");
    const rdr = new Renderer(canvas);
    (window.onresize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    })();
    const game = new Game(50, 33);
    const camera = game.mapSize.divf(-2).add(new Vec2(0.4, 0.4));
    const winWidth = () => window.innerWidth;
    const winHeight = () => window.innerHeight;
    const renderZoom = () => {
      const aspect = winWidth() / winHeight();
      const zoom = 20;
      return new Vec2(aspect, aspect).mulf(zoom);
    };
    let mousePos = new Vec2(1, 1);
    window.addEventListener("mousemove", (ev) => {
      const halfWin = new Vec2(winWidth(), winHeight()).divf(2);
      const screenPos = new Vec2(ev.pageX, ev.pageY).sub(halfWin);
      const worldPos = screenPos.div(renderZoom()).sub(camera);
      mousePos = CubeCoord.fromVec2(worldPos, MAP_HEX_SIZE).toCart(MAP_HEX_SIZE);
      mousePos.y *= -1;
    });
    const frameTimes = [];
    (function frame() {
      const start = performance.now();
      rdr.ctx.save();
      rdr.ctx.scale(1, -1);
      {
        rdr.drawRect(0, 0, winWidth(), -winHeight(), CERULEAN);
        rdr.ctx.translate(winWidth() / 2, -winHeight() / 2);
        {
          let { x, y } = renderZoom();
          rdr.ctx.scale(x, y);
        }
        game.map.draw(rdr);
        rdr.ctx.translate(camera.x, camera.y);
        game.draw(rdr);
      }
      rdr.ctx.restore();
      frameTimes.push(performance.now() - start);
      if (frameTimes.length > 100) {
        frameTimes.shift();
        const average = frameTimes.reduce((a, c) => a + c) / frameTimes.length;
        console.log(`Last 100 frames average: ${average} (${1e3 / average} fps)`);
      }
      requestAnimationFrame(frame);
    })();
  };
})();
