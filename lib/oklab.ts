// OKLab color space conversions
// Reference: https://bottosson.github.io/posts/oklab/

export interface OklabColor {
  L: number;
  a: number;
  b: number;
}

function srgbTransferToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToSrgbTransfer(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

export function srgbToOklab(r: number, g: number, b: number): OklabColor {
  var lr = srgbTransferToLinear(r);
  var lg = srgbTransferToLinear(g);
  var lb = srgbTransferToLinear(b);

  var l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  var m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  var s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  var lp = Math.cbrt(l);
  var mp = Math.cbrt(m);
  var sp = Math.cbrt(s);

  return {
    L: 0.2104542553 * lp + 0.7936177850 * mp - 0.0040720468 * sp,
    a: 1.9779984951 * lp - 2.4285922050 * mp + 0.4505937099 * sp,
    b: 0.0259040371 * lp + 0.7827717662 * mp - 0.8086757660 * sp,
  };
}

export function oklabToSrgb(L: number, a: number, b: number): { r: number; g: number; b: number } {
  var lp = L + 0.3963377774 * a + 0.2158037573 * b;
  var mp = L - 0.1055613458 * a - 0.0638541728 * b;
  var sp = L - 0.0894841775 * a - 1.2914855480 * b;

  var l = lp * lp * lp;
  var m = mp * mp * mp;
  var s = sp * sp * sp;

  var r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  var g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  var bOut = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  return {
    r: Math.max(0, Math.min(1, linearToSrgbTransfer(r))),
    g: Math.max(0, Math.min(1, linearToSrgbTransfer(g))),
    b: Math.max(0, Math.min(1, linearToSrgbTransfer(bOut))),
  };
}

export function hexToOklab(hex: string): OklabColor {
  var h = hex.replace("#", "");
  var r = parseInt(h.slice(0, 2), 16) / 255;
  var g = parseInt(h.slice(2, 4), 16) / 255;
  var b = parseInt(h.slice(4, 6), 16) / 255;
  return srgbToOklab(r, g, b);
}

export function oklabToHex(L: number, a: number, b: number): string {
  var c = oklabToSrgb(L, a, b);
  var r = Math.round(c.r * 255).toString(16).padStart(2, "0");
  var g = Math.round(c.g * 255).toString(16).padStart(2, "0");
  var bStr = Math.round(c.b * 255).toString(16).padStart(2, "0");
  return `#${r}${g}${bStr}`;
}

export function oklabLerp(c1: OklabColor, c2: OklabColor, t: number): OklabColor {
  return {
    L: c1.L + (c2.L - c1.L) * t,
    a: c1.a + (c2.a - c1.a) * t,
    b: c1.b + (c2.b - c1.b) * t,
  };
}

export function isInGamut(L: number, a: number, b: number): boolean {
  var c = oklabToSrgb(L, a, b);
  var raw = oklabToLinearRaw(L, a, b);
  return raw.r >= -0.001 && raw.r <= 1.001 &&
         raw.g >= -0.001 && raw.g <= 1.001 &&
         raw.b >= -0.001 && raw.b <= 1.001;
}

function oklabToLinearRaw(L: number, a: number, b: number): { r: number; g: number; b: number } {
  var lp = L + 0.3963377774 * a + 0.2158037573 * b;
  var mp = L - 0.1055613458 * a - 0.0638541728 * b;
  var sp = L - 0.0894841775 * a - 1.2914855480 * b;

  var l = lp * lp * lp;
  var m = mp * mp * mp;
  var s = sp * sp * sp;

  return {
    r: +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  };
}
