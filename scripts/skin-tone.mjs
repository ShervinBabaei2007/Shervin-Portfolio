// Local skin-tone evener for the About portraits. Inside a feathered ellipse it shifts the colour (Lab a/b only, so
// brightness, shadows and beard texture are untouched) of skin pixels toward the average colour of a reference patch
// (forehead), which evens out blotches without flattening the face. Dark beard pixels are left alone by a lightness ramp.
const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const gam = (c) => 255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)
const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : ((24389 / 27) * t + 16) / 116)
const finv = (t) => (t ** 3 > 216 / 24389 ? t ** 3 : (116 * t - 16) / (24389 / 27))
const WHITE = [0.95047, 1, 1.08883]

export function rgbToLab(r, g, b) {
  const [R, G, B] = [lin(r), lin(g), lin(b)]
  const x = (0.4124564 * R + 0.3575761 * G + 0.1804375 * B) / WHITE[0]
  const y = 0.2126729 * R + 0.7151522 * G + 0.072175 * B
  const z = (0.0193339 * R + 0.119192 * G + 0.9503041 * B) / WHITE[2]
  const [fx, fy, fz] = [f(x), f(y), f(z)]
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)]
}

export function labToRgb(L, a, b) {
  const fy = (L + 16) / 116
  const x = finv(fy + a / 500) * WHITE[0]
  const y = finv(fy)
  const z = finv(fy - b / 200) * WHITE[2]
  const R = 3.2404542 * x - 1.5371385 * y - 0.4985314 * z
  const G = -0.969266 * x + 1.8760108 * y + 0.041556 * z
  const B = 0.0556434 * x - 0.2040259 * y + 1.0572252 * z
  return [R, G, B].map((c) => Math.max(0, Math.min(255, gam(Math.max(0, Math.min(1, c))))))
}

const smooth = (e0, e1, x) => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)))
  return t * t * (3 - 2 * t)
}
// How much a pixel counts as skin: 0 for dark beard/hair, 1 for lit skin.
const skinWeight = (L) => smooth(26, 46, L)
// Only warm pixels count as skin, so water, walls and clothing next to the face are never touched.
const warmGate = (a, b) => smooth(3, 9, a) * smooth(3, 9, b)

/** buf: RGB bytes (3 channels), edited in place. ref: {cx, cy, r}. region: {cx, cy, rx, ry}. strength: 0 to 1 (colour pull). lift: 0 to 1 (brightness). */
export function evenSkin(buf, width, height, { ref, region, strength = 0.7, lift = 0 }) {
  let sl = 0
  let sa = 0
  let sb = 0
  let sw = 0
  for (let y = Math.max(0, ref.cy - ref.r); y < Math.min(height, ref.cy + ref.r); y++) {
    for (let x = Math.max(0, ref.cx - ref.r); x < Math.min(width, ref.cx + ref.r); x++) {
      if ((x - ref.cx) ** 2 + (y - ref.cy) ** 2 > ref.r ** 2) continue
      const i = (y * width + x) * 3
      const [L, a, b] = rgbToLab(buf[i], buf[i + 1], buf[i + 2])
      const w = skinWeight(L)
      sl += L * w
      sa += a * w
      sb += b * w
      sw += w
    }
  }
  const refL = sl / sw
  const refA = sa / sw
  const refB = sb / sw

  const x0 = Math.max(0, Math.floor(region.cx - region.rx))
  const x1 = Math.min(width, Math.ceil(region.cx + region.rx))
  const y0 = Math.max(0, Math.floor(region.cy - region.ry))
  const y1 = Math.min(height, Math.ceil(region.cy + region.ry))
  const edge = (x, y) => smooth(1, 0.6, Math.hypot((x - region.cx) / region.rx, (y - region.cy) / region.ry))

  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * width + x) * 3
      const [L, a, b] = rgbToLab(buf[i], buf[i + 1], buf[i + 2])
      const gate = warmGate(a, b)
      const w = skinWeight(L) * gate * edge(x, y) * strength
      if (w <= 0) continue
      // Optional brightness lift for bare skin that sits in shadow; thin stubble (low L) is left dark.
      const lifted = L + Math.max(0, refL - L) * lift * smooth(30, 44, L) * gate * edge(x, y)
      const [r, g, bl] = labToRgb(lifted, a + (refA - a) * w, b + (refB - b) * w)
      buf[i] = Math.round(r)
      buf[i + 1] = Math.round(g)
      buf[i + 2] = Math.round(bl)
    }
  }
}
