// server/polyfills.cjs
// Robust polyfills for headless serverless runtimes (Vercel, AWS Lambda, Docker)
// Required by canvas, pdf-parse, and geometry parsers

class DOMMatrixPolyfill {
  constructor(init) {
    this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
    this.m11 = 1; this.m12 = 0; this.m13 = 0; this.m14 = 0;
    this.m21 = 0; this.m22 = 1; this.m23 = 0; this.m24 = 0;
    this.m31 = 0; this.m32 = 0; this.m33 = 1; this.m34 = 0;
    this.m41 = 0; this.m42 = 0; this.m43 = 0; this.m44 = 1;
    this.is2D = true;
    this.isIdentity = true;
    if (typeof init === 'string') {
      // parse simple matrix string if needed
    } else if (Array.isArray(init)) {
      if (init.length === 6) {
        this.a = this.m11 = init[0];
        this.b = this.m12 = init[1];
        this.c = this.m21 = init[2];
        this.d = this.m22 = init[3];
        this.e = this.m41 = init[4];
        this.f = this.m42 = init[5];
      } else if (init.length === 16) {
        this.m11 = init[0]; this.m12 = init[1]; this.m13 = init[2]; this.m14 = init[3];
        this.m21 = init[4]; this.m22 = init[5]; this.m23 = init[6]; this.m24 = init[7];
        this.m31 = init[8]; this.m32 = init[9]; this.m33 = init[10]; this.m34 = init[11];
        this.m41 = init[12]; this.m42 = init[13]; this.m43 = init[14]; this.m44 = init[15];
        this.a = this.m11; this.b = this.m12; this.c = this.m21; this.d = this.m22;
        this.e = this.m41; this.f = this.m42;
        this.is2D = false;
      }
    }
  }
  multiply(other) { return this; }
  preMultiplySelf(other) { return this; }
  translate(tx = 0, ty = 0, tz = 0) { return this; }
  scale(scaleX = 1, scaleY, scaleZ = 1) { return this; }
  rotate(rotX = 0, rotY = 0, rotZ = 0) { return this; }
  transformPoint(p) { return p; }
  inverse() { return new DOMMatrixPolyfill(); }
  invertSelf() { return this; }
  toFloat32Array() {
    return new Float32Array([
      this.m11, this.m12, this.m13, this.m14,
      this.m21, this.m22, this.m23, this.m24,
      this.m31, this.m32, this.m33, this.m34,
      this.m41, this.m42, this.m43, this.m44
    ]);
  }
  toFloat64Array() {
    return new Float64Array([
      this.m11, this.m12, this.m13, this.m14,
      this.m21, this.m22, this.m23, this.m24,
      this.m31, this.m32, this.m33, this.m34,
      this.m41, this.m42, this.m43, this.m44
    ]);
  }
}

class ImageDataPolyfill {
  constructor(width = 1, height = 1) {
    this.width = width;
    this.height = height;
    this.data = new Uint8ClampedArray(width * height * 4);
  }
}

class Path2DPolyfill {
  constructor() {}
  addPath() {}
  closePath() {}
  moveTo() {}
  lineTo() {}
  bezierCurveTo() {}
  quadraticCurveTo() {}
  arc() {}
  arcTo() {}
  ellipse() {}
  rect() {}
}

const targetScope = typeof globalThis !== 'undefined' ? globalThis : (typeof global !== 'undefined' ? global : window);

if (typeof targetScope.DOMMatrix === 'undefined') {
  targetScope.DOMMatrix = DOMMatrixPolyfill;
}
if (typeof targetScope.ImageData === 'undefined') {
  targetScope.ImageData = ImageDataPolyfill;
}
if (typeof targetScope.Path2D === 'undefined') {
  targetScope.Path2D = Path2DPolyfill;
}

if (typeof global !== 'undefined') {
  if (typeof global.DOMMatrix === 'undefined') global.DOMMatrix = DOMMatrixPolyfill;
  if (typeof global.ImageData === 'undefined') global.ImageData = ImageDataPolyfill;
  if (typeof global.Path2D === 'undefined') global.Path2D = Path2DPolyfill;
}

module.exports = {
  DOMMatrixPolyfill,
  ImageDataPolyfill,
  Path2DPolyfill
};
