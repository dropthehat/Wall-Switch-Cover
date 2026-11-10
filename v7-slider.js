/**
 * Round-knob slider cover (Arteor V7), ported from the validated manifold3d kit:
 *   v4_reference_kit.py, build_v5_shuttle.py, build_v6.py, build_v7.py, build_v7_cover.py.
 *
 * Installed datum Z = 0 is the support-frame face. Millimetres.
 * Protected coupon kinematics are literals below and are not scaled with lane count.
 * Two lanes on the 115×78 test-kit frame reproduce the physical V7 parts.
 * Other lane counts and plate sizes keep that mechanism and move only the frame,
 * outer fences, screws, posts, keys, keepers and the gate. Those are untested.
 */
export const PITCH = 22.5;
export const TRACK_W = 20.9;
export const TRACK_HALF = TRACK_W / 2; // 10.45
export const ROOF_Z = 18.6;
export const ROOF_T = 2.6;
export const TOP_Z = ROOF_Z + ROOF_T; // 21.2
export const MASK_BOTTOM = 16.75;
export const MASK_TOP = 17.95;
export const GRIP_BOTTOM = (18.3 + 2.6) - 1.0; // 19.9 installed
export const MB = MASK_BOTTOM - 11.3;          // shield underside, local
export const MT = MASK_TOP - 11.3;
export const R = 9.2;
export const EDGE_R = 1.6;
export const DOME = 0.6;
export const ZB = GRIP_BOTTOM - 11.3;          // puck bottom, local
export const ZTOP = 8.6 + 6.5;                 // puck top, local (literal, as in V5)
export const CONE_R0 = R - (ZB - MT);
export const FIL = 0.6;
export const SPLIT = MB;
export const STROKE = 7;
export const KIT_BASE_W = 115;
export const KIT_BASE_H = 78;
export const KIT_SCREW_PITCH = 83.5;

const COUPON = {
  shuttle_w: 19.8, shuttle_l: 59, flange_h: 2.4, cam_w: 16,
  y_toe: 19.5, y_knee: 28, y_end: 29.5, cam_drop: 5.3
};

const LIP_BOTTOM = 14.05;
const LIP_TOP = 15.05;
const GATE_END_Y = 32;
const CH = 0.5;
const EAR_R = 7, EAR_T = 0.6, EAR_GAP = 0.8, WEB_T = 0.24, WEB_HALF_DEG = 35, WEB_IN = 0.4;

export function resolveRequest(opts = {}) {
  const lanes = Math.round(Number(opts.lanes ?? 2));
  if (lanes < 1 || lanes > 4) throw new Error('lane count must be 1, 2, 3 or 4');
  if (opts.frame === 'kit' || opts.frame == null && opts.baseW == null) {
    return { lanes, baseW: KIT_BASE_W, baseH: KIT_BASE_H, screwPitch: KIT_SCREW_PITCH, frame: 'kit' };
  }
  return {
    lanes,
    baseW: Number(opts.baseW),
    baseH: Number(opts.baseH),
    screwPitch: Number(opts.screwPitch ?? KIT_SCREW_PITCH),
    frame: opts.frame || 'studio'
  };
}

/** Frame around the fixed mechanism. Bearing Y values stay at the validated literals. */
export function makeLayout(opts = {}) {
  const req = resolveRequest(opts);
  const lanes = [];
  for (let i = 0; i < req.lanes; i++) lanes.push((i - (req.lanes - 1) / 2) * PITCH);
  const trackOuter = Math.abs(lanes[0]) + TRACK_HALF;
  const v4FenceOut = trackOuter + 0.8;
  const fenceOut = trackOuter + 2.3;
  const fenceOutGate = trackOuter + 1.8;
  // Validated side land outside the V6 fence (57.5 − 24) holds screws, posts and keys.
  const minHalfW = fenceOut + 33.5;
  const minHalfH = KIT_BASE_H / 2;
  let baseW = req.baseW;
  let baseH = req.baseH;
  let enlarged = false;
  if (!(baseW >= minHalfW * 2)) { baseW = minHalfW * 2; enlarged = true; }
  if (!(baseH >= minHalfH * 2)) { baseH = minHalfH * 2; enlarged = true; }
  const halfW = baseW / 2;
  const halfH = baseH / 2;
  const postX = halfW - 13.5;
  const postY = halfH - 13;
  const keyX0 = halfW - 7;
  const headReach = 1.2 + 4.5;
  let screwX = req.screwPitch / 2;
  const screwFits = (screwX - headReach) > (fenceOut + 1) && (screwX + headReach) < (halfW - 1);
  if (!screwFits) screwX = halfW - 15.75;
  const shoulderX = v4FenceOut + 5.5;
  const gateHalf = shoulderX + 5;
  const orientX = v4FenceOut + 10.5;
  const coverW = baseW + 6;
  const coverH = baseH + 14;
  const wallInner = coverW / 2 - 2.6;
  const validated = req.lanes === 2
    && Math.abs(baseW - KIT_BASE_W) < 1e-6
    && Math.abs(baseH - KIT_BASE_H) < 1e-6
    && Math.abs(screwX - 41.75) < 1e-6
    && !enlarged;
  const gateClearance = (coverH / 2 - 2.6) - 42.9;
  return {
    ...req, lanes, trackOuter, v4FenceOut, fenceOut, fenceOutGate,
    baseW, baseH, halfW, halfH, postX, postY, keyX0, pocketX: keyX0 - 0.3,
    screwX, shoulderX, gateHalf, orientX, coverW, coverH, wallInner,
    enlarged, validated, minBaseW: minHalfW * 2, minBaseH: minHalfH * 2,
    gateClearance, requestedBaseW: req.baseW, requestedBaseH: req.baseH
  };
}

export function describeLayout(L) {
  const n = L.lanes.length;
  const bits = [
    `${n} lane${n === 1 ? '' : 's'} at ${PITCH} mm`,
    `base ${L.baseW.toFixed(1)}×${L.baseH.toFixed(1)}`,
    `cover ${L.coverW.toFixed(1)}×${L.coverH.toFixed(1)}×${TOP_Z.toFixed(1)}`,
    `screws ±${L.screwX.toFixed(2)}`
  ];
  if (L.validated) bits.push('validated against the physical 2-module V7 kit');
  else bits.push('untested — not the physical 2-module kit');
  if (L.enlarged) {
    bits.push(`plate enlarged from ${L.requestedBaseW.toFixed(1)}×${L.requestedBaseH.toFixed(1)} so the fences, posts and keys still fit`);
  }
  return bits.join(' · ');
}

function bind(Manifold, CrossSection) {
  const box = (size, at = [0, 0, 0]) => Manifold.cube(size, false).translate(at);
  const circlePts = (x, y, r, n = 96) => {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i * 2 * Math.PI) / n;
      pts.push([x + r * Math.cos(a), y + r * Math.sin(a)]);
    }
    return pts;
  };
  const orient = (pts) => {
    let a = 0;
    for (let i = 0; i < pts.length; i++) {
      const j = (i + 1) % pts.length;
      a += pts[i][0] * pts[j][1] - pts[j][0] * pts[i][1];
    }
    return a < 0 ? pts.slice().reverse() : pts.slice();
  };
  const csOf = (pts) => new CrossSection([orient(pts)]);
  const hull2 = (sections) => CrossSection.hull(sections);
  const circleCS = (x, y, r, n = 96) => new CrossSection([circlePts(x, y, r, n)]);
  const rounded = (w, h, r, n = 96) => hull2([-1, 1].flatMap((sx) => [-1, 1].map((sy) =>
    circleCS(sx * (w / 2 - r), sy * (h / 2 - r), r, n))));
  const stadium = (w, length, n = 96) => hull2([-1, 1].map((s) =>
    circleCS(0, s * (length - w) / 2, w / 2, n)));
  const extrude = (section, h, z = 0) => {
    let m = section.extrude(h);
    if (z) m = m.translate([0, 0, z]);
    return m;
  };
  const extrusion = (pts, h, z = 0) => extrude(csOf(pts), h, z);
  const cy = (d, h, z = 0, segs = 96) => {
    let m = Manifold.cylinder(h, d / 2, d / 2, segs, false);
    if (z) m = m.translate([0, 0, z]);
    return m;
  };
  const addAll = (parts) => {
    let s = parts[0];
    for (let i = 1; i < parts.length; i++) s = s.add(parts[i]);
    return s;
  };
  const prismY = (xz, y0, y1) => {
    const pts = [];
    for (const y of [y0, y1]) for (const [x, z] of xz) pts.push([x, y, z]);
    return Manifold.hull(pts);
  };
  const prismX = (yz, x0, x1) => {
    const pts = [];
    for (const x of [x0, x1]) for (const [y, z] of yz) pts.push([x, y, z]);
    return Manifold.hull(pts);
  };
  const prismZ = (xy, z0, z1) => {
    const pts = [];
    for (const z of [z0, z1]) for (const [x, y] of xy) pts.push([x, y, z]);
    return Manifold.hull(pts);
  };

  function couponLower() {
    const p = COUPON;
    const runner = box([p.shuttle_w, p.shuttle_l, p.flange_h], [-p.shuttle_w / 2, -p.shuttle_l / 2, 0]);
    const wedge2d = [[p.y_toe, 0], [p.y_knee, -p.cam_drop], [p.y_end, -p.cam_drop], [p.y_end, 0]];
    const wedge = extrusion(wedge2d, p.cam_w).rotate([90, 0, 90]).translate([-p.cam_w / 2, 0, 0]);
    return runner.add(wedge).add(wedge.mirror([0, 1, 0]));
  }

  function skis() {
    const parts = [];
    for (const sign of [1, -1]) {
      let support = box([2.0, 36, 2.77], [6.4, -18, 2.38]);
      let wing = box([3.05, 36, 1.4], [6.4, -18, 3.75]);
      if (sign < 0) { support = support.mirror([1, 0, 0]); wing = wing.mirror([1, 0, 0]); }
      parts.push(support, wing);
    }
    return parts;
  }

  function fill() {
    const pts = [];
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      pts.push([sx * 6.4, sy * 24, 2.4], [sx * 9.45, sy * 24, 5.5]);
    }
    return Manifold.hull(pts);
  }

  function puck() {
    const rr = R, er = EDGE_R;
    const ze = ZTOP - EDGE_R - DOME;
    const pts = [];
    const ring = (rad, z) => {
      for (let i = 0; i < 128; i++) {
        const a = (i * 2 * Math.PI) / 128;
        pts.push([rad * Math.cos(a), rad * Math.sin(a), z]);
      }
    };
    ring(rr, ZB);
    ring(rr, ze);
    for (let i = 1; i < 10; i++) {
      const p = (i * Math.PI / 2) / 9;
      ring(rr - er * (1 - Math.cos(p)), ze + er * Math.sin(p));
    }
    const rim = rr - er;
    for (let i = 1; i < 8; i++) {
      const t = i / 7;
      const rho = rim * (1 - t);
      ring(Math.max(rho, 0.05), ze + er + DOME * (1 - (rho / rim) ** 2));
    }
    return Manifold.hull(pts);
  }

  function neckCone() {
    return Manifold.cylinder(ZB - MT + 0.005, CONE_R0 - 0.005, R, 128, false).translate([0, 0, MT - 0.005]);
  }
  function neckFillet() {
    return Manifold.cylinder(FIL + 0.005, CONE_R0 + FIL + 0.005, CONE_R0, 128, false).translate([0, 0, MT - 0.005]);
  }

  const TX0 = -3.8, TX1 = 3.8, TY = 5.0, TZ1 = 8.85, TCH = 0.4, CLR = 0.15, TOP_CLR = 0.15, RIB_R = 0.35;
  const RIB_X = [-2.4, 0];
  function tenonPts(dx = 0, dz = 0, z0 = SPLIT - 0.15) {
    const x0 = TX0 - dx, x1 = TX1 + dx, ty = TY + dx, zt = TZ1 + dz;
    const P = [];
    for (const y of [-ty, ty]) {
      P.push([x0, y, z0], [x1, y, z0], [x1, y, SPLIT]);
      P.push([x0, y, zt - TCH], [x1 - (zt - TCH - SPLIT), y, zt - TCH]);
    }
    for (const y of [-(ty - TCH), ty - TCH]) {
      P.push([x0 + TCH, y, zt], [x1 - (zt - SPLIT), y, zt]);
    }
    return P;
  }
  function tenon() {
    let t = Manifold.hull(tenonPts());
    for (const x of RIB_X) {
      for (const s of [-1, 1]) {
        const z0 = SPLIT, z1 = TZ1 - TCH - 0.3, z2 = TZ1 - TCH + 0.05;
        const pts = [];
        for (const zz of [z0, z1]) {
          for (const [dx, dy] of [[RIB_R, 0], [-RIB_R, 0], [0, RIB_R], [0, -RIB_R]]) {
            pts.push([x + dx, s * TY + dy, zz]);
          }
        }
        pts.push([x, s * TY, z2]);
        const rib = Manifold.hull(pts);
        const clip = box([20, 2 * (TY + RIB_R) + 0.01, TZ1], [-10, -(TY + RIB_R) - 0.005, SPLIT - 0.1]);
        t = t.add(rib.intersect(clip));
      }
    }
    return t;
  }
  function socket() {
    const d = CLR;
    const body = Manifold.hull(tenonPts(0, 0, SPLIT - 1));
    const cube = box([2 * d, 2 * d, 2 * d], [-d, -d, -d]);
    let core = body.minkowskiSum(cube);
    core = core.add(core.translate([0, 0, TOP_CLR]));
    const zt = TZ1 + d + TOP_CLR;
    const x0 = TX0 + TCH - d, x1 = TX1 - (TZ1 - SPLIT) + d, ty = TY - TCH + d;
    const h = Math.min(x1 - x0, 2 * ty) / 2;
    const e = 0.3;
    const roof = Manifold.hull([
      [x0 - e, -ty - e, zt - e], [x1 + e, -ty - e, zt - e],
      [x0 - e, ty + e, zt - e], [x1 + e, ty + e, zt - e],
      [(x0 + x1) / 2, -ty + h, zt + h], [(x0 + x1) / 2, ty - h, zt + h]
    ]);
    const m = 0.4;
    const X0 = TX0 - d, XR = TX1 + d * Math.SQRT2, TYY = TY + d;
    const mouthPts = [];
    for (const [z, ee] of [[SPLIT - 1, m], [SPLIT, m], [SPLIT + m, 0]]) {
      for (const x of [X0 - ee, XR - Math.max(0, z - SPLIT)]) {
        for (const y of [-TYY - ee, TYY + ee]) mouthPts.push([x, y, z]);
      }
    }
    return core.add(roof).add(Manifold.hull(mouthPts));
  }

  function sliderBody() {
    const cut = box([60, 90, 30], [-30, -45, SPLIT - 30]);
    let low = couponLower();
    for (const p of skis()) low = low.add(p);
    low = low.add(fill().intersect(cut));
    return low.add(tenon());
  }
  function capBody() {
    let c = extrude(rounded(21.8, 50, 1), MT - MB, MB);
    c = c.add(neckCone()).add(neckFillet()).add(puck());
    return c.subtract(socket());
  }
  function assembledShuttle() {
    const sl = sliderBody();
    const cp = capBody();
    return sl.add(cp).add(socket());
  }

  function baseAdditions(L) {
    const zTop = 16.4;
    let a = box([L.fenceOut - L.trackOuter, GATE_END_Y + 37.5, zTop - 11.28], [L.trackOuter, -37.5, 11.28]);
    a = a.add(box([L.fenceOutGate - L.trackOuter, 37.5 - GATE_END_Y, zTop - 11.28], [L.trackOuter, GATE_END_Y, 11.28]));
    const apX = L.v4FenceOut + 0.4;
    let but = box([L.fenceOut - L.v4FenceOut, GATE_END_Y + 37, 11.3 - 2.5], [L.v4FenceOut, -37, 2.5]);
    but = but.subtract(box([apX * 2, 45.8, 12.28], [-apX, -22.9, -1]));
    a = a.add(but);
    const foot = prismY([
      [L.fenceOut - 0.01, 2.5],
      [L.fenceOut + 1.5, 2.5],
      [L.fenceOut - 0.01, 2.5 + 1.5]
    ], -37, GATE_END_Y - 0.5);
    return a.add(foot);
  }

  function blends(L) {
    const e = 0.01, blend = 0.3;
    const A = [[10.45 + e, 14.05 + e], [10.45 - blend, 14.05 + e], [10.45 + e, 14.05 - blend]];
    const B = [[10.0 + e, 15.05 - e], [10.0 - blend, 15.05 - e], [10.0 + e, 15.05 + blend]];
    let u = null;
    for (const x of L.lanes) {
      for (const s of [1, -1]) {
        for (const tri of [A, B]) {
          let p = prismY(tri, -34.5, 34.5);
          if (s < 0) p = p.mirror([1, 0, 0]);
          p = p.translate([x, 0, 0]);
          u = u ? u.add(p) : p;
        }
      }
    }
    return u;
  }

  function baseBody(L) {
    let b = extrude(rounded(L.baseW, L.baseH, 2.5), 2.5);
    const span = L.v4FenceOut * 2;
    b = b.add(box([span, 14.1, 11.3], [-L.v4FenceOut, 22.9, 0]));
    b = b.add(box([span, 14.1, 11.3], [-L.v4FenceOut, -37, 0]));
    const apX = L.v4FenceOut + 0.4;
    b = b.subtract(box([apX * 2, 45.8, 25], [-apX, -22.9, -1]));
    for (const x of L.lanes) b = b.subtract(box([17.5, 76, 20], [x - 8.75, -38, 2.5]));
    for (const x of [-L.screwX, L.screwX]) {
      const shank = hull2([circleCS(x - 1.2, 0, 2.2), circleCS(x + 1.2, 0, 2.2)]);
      const head = hull2([circleCS(x - 1.2, 0, 4.5), circleCS(x + 1.2, 0, 4.5)]);
      b = b.subtract(extrude(shank, 6, -1));
      b = b.subtract(extrude(head, 5, 1.4));
    }
    b = b.add(box([0.8, 75, 5.12], [-L.v4FenceOut, -37.5, 11.28]));
    b = b.add(box([0.8, 75, 5.12], [L.trackOuter, -37.5, 11.28]));
    for (let i = 0; i < L.lanes.length - 1; i++) {
      const x0 = L.lanes[i] + TRACK_HALF;
      b = b.add(box([1.6, 75, 5.12], [x0, -37.5, 11.28]));
    }
    for (const x of L.lanes) {
      for (const sign of [1, -1]) {
        let lip = box([1.57, 69, 1], [8.9, -34.5, LIP_BOTTOM]);
        let upper = box([1.25, 75, 1.37], [10, -37.5, 15.03]);
        let stop = box([0.9, 2, 2.42], [8.9, -38.5, 11.28]);
        if (sign < 0) {
          lip = lip.mirror([1, 0, 0]);
          upper = upper.mirror([1, 0, 0]);
          stop = stop.mirror([1, 0, 0]);
        }
        b = b.add(lip.translate([x, 0, 0])).add(upper.translate([x, 0, 0])).add(stop.translate([x, 0, 0]));
      }
    }
    const side = baseAdditions(L);
    b = b.add(side).add(side.mirror([1, 0, 0]));
    b = b.add(blends(L));
    for (const x of [-L.postX, L.postX]) {
      for (const y of [-L.postY, L.postY]) {
        b = b.add(box([6, 8, 15.62], [x - 3, y - 4, 0]));
        b = b.add(box([10, 8, 2], [x - 5, y - 4, 15.6]));
      }
    }
    const key = box([4, 4, 3.8], [L.keyX0, -2, 0]);
    b = b.add(key).add(key.mirror([1, 0, 0]));
    for (const x of [-L.shoulderX, L.shoulderX]) {
      b = b.add(box([8, 7.3, 8], [x - 4, 33, 0]));
      b = b.add(box([5, 3, 4.02], [x - 2.5, 35.5, 7.98]));
    }
    b = b.add(box([6, 6, 19], [L.orientX, 5, 0]));
    return b;
  }

  function gateBody(L) {
    let g = box([L.gateHalf * 2, 4.8, 3.2], [-L.gateHalf, 38.1, 11.3]);
    for (const x of [-L.shoulderX, L.shoulderX]) {
      let foot = box([8, 9.9, 6.5], [x - 4, 33, 8]);
      foot = foot.subtract(box([5.6, 3.6, 4.9], [x - 2.8, 35.5, 7.5]));
      g = g.add(foot);
      g = g.add(box([6, 2.4, 3.52], [x - 3, 40.5, 14.48]));
    }
    for (const x of L.lanes) {
      for (const sign of [1, -1]) {
        let stop = box([1.3, 1.9, 2.4], [8.4, 36.5, 11.3]);
        if (sign < 0) stop = stop.mirror([1, 0, 0]);
        g = g.add(stop.translate([x, 0, 0]));
      }
    }
    for (const x of [-L.shoulderX, L.shoulderX]) {
      g = g.subtract(box([5.6, 3.6, 4.9], [x - 2.8, 35.5, 7.5]));
    }
    return g;
  }

  function outerEased(L) {
    const a = extrude(rounded(L.coverW, L.coverH, 4), TOP_Z - CH);
    const b = extrude(rounded(L.coverW - 2 * CH, L.coverH - 2 * CH, 4 - CH), 0.001, TOP_Z - 0.001);
    return Manifold.hull([a, b]);
  }

  function coverV4(L) {
    let c = extrude(rounded(L.coverW, L.coverH, 4), TOP_Z);
    c = c.subtract(extrude(rounded(L.coverW - 5.2, L.coverH - 5.2, 2), ROOF_Z + 1, -1));
    const stad = stadium(19.2, 33.2);
    for (const x of L.lanes) c = c.subtract(extrude(stad, 40, -1).translate([x, 0, 0]));
    for (const x of [-L.postX, L.postX]) {
      for (const y of [-L.postY, L.postY]) {
        let h = box([16, 20, ROOF_Z - 12.4 + 0.02], [x - 8, y - 12, 12.4]);
        h = h.subtract(box([10.6, 12.6, 7], [x - 5.3, y - 8.3, 14.4]));
        h = h.subtract(box([10.6, 8.6, 12], [x - 5.3, y - 8.3, 11.4]));
        h = h.subtract(box([8, 12.6, 12], [x - 4, y - 8.3, 11.4]));
        c = c.add(h);
      }
    }
    const oldX = L.keyX0 - 1;
    let keeper = box([6, 8, ROOF_Z - 3 + 0.02], [oldX, -4, 3]);
    keeper = keeper.subtract(box([4.6, 4.6, 2.5], [L.pocketX, -2.3, 2.5]));
    c = c.add(keeper).add(keeper.mirror([1, 0, 0]));
    c = c.subtract(box([6.6, 10.6, 1.0], [L.orientX - 0.3, 0.7, 18.4]));
    return c;
  }

  function keeperOne(L) {
    const Rtop = ROOF_Z + 0.01;
    const KX0 = L.wallInner - 9.4;
    const KX1 = L.wallInner + 0.3;
    const KY = 6, KZ0 = 3, G_ROOF = 3, G_WALL = 2.5;
    let b = box([KX1 - KX0, 2 * KY, Rtop - KZ0], [KX0, -KY, KZ0]);
    for (const s of [-1, 1]) {
      b = b.add(prismX([[s * KY, Rtop], [s * (KY + G_ROOF), Rtop], [s * KY, Rtop - G_ROOF]], KX0, KX1));
      const wallX = L.wallInner + 0.05;
      b = b.add(prismZ([[wallX, s * KY], [wallX - G_WALL, s * KY], [wallX, s * (KY + G_WALL)]], KZ0, Rtop));
    }
    b = b.add(prismY([[KX0, Rtop], [KX0 - G_ROOF, Rtop], [KX0, Rtop - G_ROOF]], -KY, KY));
    b = b.subtract(box([4.6, 4.6, 2.5], [L.pocketX, -2.3, 2.5]));
    return b;
  }

  function solidKeepers(L) {
    const one = keeperOne(L);
    const both = one.add(one.mirror([1, 0, 0]));
    const cavity = extrude(rounded(L.coverW - 5.2, L.coverH - 5.2, 2), ROOF_Z, -1);
    const grown = cavity.minkowskiSum(box([0.6, 0.6, 0.02], [-0.3, -0.3, -0.01]));
    return both.intersect(grown);
  }

  function coverFinished(L) {
    let c = coverV4(L).intersect(outerEased(L));
    c = c.add(solidKeepers(L));
    const pocket = box([4.6, 4.6, 2.5], [L.pocketX, -2.3, 2.5]);
    c = c.subtract(pocket).subtract(pocket.mirror([1, 0, 0]));
    return c;
  }

  function ears(L) {
    const parts = [];
    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        const C = [sx * (L.coverW / 2 - 4), sy * (L.coverH / 2 - 4)];
        const d = [sx / Math.SQRT2, sy / Math.SQRT2];
        const pc = [C[0] + d[0] * (4 + EAR_GAP + EAR_R), C[1] + d[1] * (4 + EAR_GAP + EAR_R)];
        const pad = Manifold.cylinder(EAR_T, EAR_R, EAR_R, 96, false).translate([pc[0], pc[1], TOP_Z - EAR_T]);
        const ang0 = Math.atan2(d[1], d[0]);
        const a0 = ang0 - WEB_HALF_DEG * Math.PI / 180;
        const a1 = ang0 + WEB_HALF_DEG * Math.PI / 180;
        const r0 = (4 - CH) - WEB_IN;
        const r1 = 4 + EAR_GAP + 1.0;
        const poly = [];
        for (let i = 0; i < 24; i++) {
          const a = a0 + (a1 - a0) * i / 23;
          poly.push([C[0] + r0 * Math.cos(a), C[1] + r0 * Math.sin(a)]);
        }
        for (let i = 23; i >= 0; i--) {
          const a = a0 + (a1 - a0) * i / 23;
          poly.push([C[0] + r1 * Math.cos(a), C[1] + r1 * Math.sin(a)]);
        }
        parts.push(pad.add(extrusion(poly, WEB_T, TOP_Z - WEB_T)));
      }
    }
    return addAll(parts);
  }

  function coverPrintBody(L) {
    return coverFinished(L).add(ears(L));
  }

  const sliderPrint = (m) => m.rotate([0, 90, 0]).translate([5.3, 29.5, 9.9]);
  const capPrint = (m) => m.translate([0, 0, -SPLIT]);
  const coverPrintXform = (m) => m.rotate([180, 0, 0]).translate([0, 0, TOP_Z]);
  const gatePrint = (m, L) => m.rotate([-90, 0, 0]).translate([L.gateHalf, -8, 42.9]);

  return {
    sliderBody, capBody, assembledShuttle, baseBody, gateBody, coverFinished, coverPrintBody,
    sliderPrint, capPrint, coverPrintXform, gatePrint
  };
}

function meshOf(m) {
  const mesh = m.getMesh();
  const n = mesh.numProp;
  const src = mesh.vertProperties;
  const nv = src.length / n;
  const pos = new Float32Array(nv * 3);
  for (let i = 0; i < nv; i++) {
    pos[i * 3] = src[i * n];
    pos[i * 3 + 1] = src[i * n + 1];
    pos[i * 3 + 2] = src[i * n + 2];
  }
  return { pos, idx: new Uint32Array(mesh.triVerts) };
}

function mustSolid(name, m) {
  const st = m.status();
  const vol = m.volume();
  if (st !== 'NoError' || !(vol > 0)) throw new Error(`${name} is not a solid (${st}, volume ${vol})`);
  return m;
}

export function buildKit(Manifold, CrossSection, opts = {}) {
  const L = makeLayout(opts);
  const api = bind(Manifold, CrossSection);
  const slider = mustSolid('slider', api.sliderBody());
  const cap = mustSolid('cap', api.capBody());
  const shuttle = mustSolid('shuttle', api.assembledShuttle());
  const base = mustSolid('base', api.baseBody(L));
  const gate = mustSolid('gate', api.gateBody(L));
  const cover = mustSolid('cover', api.coverFinished(L));
  const coverPrint = mustSolid('cover print', api.coverPrintBody(L));
  const pack = (m) => meshOf(m);
  const kit = {
    layout: L,
    installed: {
      base: pack(base),
      gate: pack(gate),
      shuttle: pack(shuttle),
      slider: pack(slider),
      cap: pack(cap),
      cover: pack(cover)
    },
    print: {
      base: pack(base),
      gate: pack(api.gatePrint(gate, L)),
      slider: pack(api.sliderPrint(slider)),
      cap: pack(api.capPrint(cap)),
      cover: pack(api.coverPrintXform(coverPrint)),
      coverFinished: pack(api.coverPrintXform(cover))
    }
  };
  kit.checks = checkKit(L, kit);
  return kit;
}

export function checkKit(L, kit) {
  const shuttle = inspectMesh(kit.installed.shuttle.pos, kit.installed.shuttle.idx);
  const base = inspectMesh(kit.installed.base.pos, kit.installed.base.idx);
  const cover = inspectMesh(kit.installed.cover.pos, kit.installed.cover.idx);
  const gate = inspectMesh(kit.installed.gate.pos, kit.installed.gate.idx);
  const width = shuttle.bbox[1][0] - shuttle.bbox[0][0];
  const laneGap = PITCH - width;
  const coverInnerW = L.coverW - 5.2;
  const coverInnerH = L.coverH - 5.2;
  const baseFits = (base.bbox[1][0] - base.bbox[0][0]) <= coverInnerW + 0.05
    && (base.bbox[1][1] - base.bbox[0][1]) <= coverInnerH + 0.05;
  const gateFits = gate.bbox[1][1] <= (L.coverH / 2 - 2.6) + 0.05;
  const parts = {
    base: inspectMesh(kit.print.base.pos, kit.print.base.idx),
    gate: inspectMesh(kit.print.gate.pos, kit.print.gate.idx),
    slider: inspectMesh(kit.print.slider.pos, kit.print.slider.idx),
    cap: inspectMesh(kit.print.cap.pos, kit.print.cap.idx),
    cover: inspectMesh(kit.print.cover.pos, kit.print.cover.idx)
  };
  const watertight = Object.values(parts).every((p) => p.watertight && p.components === 1 && p.volume > 0);
  const onBed = Object.values(parts).every((p) => p.bbox[0][2] > -0.05 && p.bbox[0][2] < 0.05);
  return {
    shuttleWidth: width,
    withinLane: width <= PITCH + 1e-3,
    laneGap,
    lanesClear: laneGap >= -1e-3,
    baseFitsCover: baseFits,
    gateFitsCover: gateFits,
    watertight,
    printOnBed: onBed,
    validated: L.validated,
    openings: L.lanes.length,
    cover,
    pass: width <= PITCH + 1e-3 && laneGap >= -1e-3 && baseFits && gateFits && watertight && onBed && L.gateClearance > 0
  };
}

export function inspectMesh(pos, idx, tol = 1e-4) {
  const nv = pos.length / 3;
  const map = new Map();
  const remap = new Uint32Array(nv);
  let uniq = 0;
  const q = (v) => Math.round(v / tol);
  for (let i = 0; i < nv; i++) {
    const k = `${q(pos[i * 3])},${q(pos[i * 3 + 1])},${q(pos[i * 3 + 2])}`;
    let id = map.get(k);
    if (id === undefined) { id = uniq++; map.set(k, id); }
    remap[i] = id;
  }
  const parent = new Uint32Array(uniq);
  for (let i = 0; i < uniq; i++) parent[i] = i;
  const find = (a) => {
    while (parent[a] !== a) { parent[a] = parent[parent[a]]; a = parent[a]; }
    return a;
  };
  const unite = (a, b) => { a = find(a); b = find(b); if (a !== b) parent[b] = a; };
  const edges = new Map();
  const bump = (a, b) => {
    if (a > b) { const t = a; a = b; b = t; }
    const k = a + ',' + b;
    edges.set(k, (edges.get(k) || 0) + 1);
  };
  let vol = 0;
  const bmin = [Infinity, Infinity, Infinity];
  const bmax = [-Infinity, -Infinity, -Infinity];
  const nTri = idx.length / 3;
  for (let t = 0; t < nTri; t++) {
    const ia = remap[idx[t * 3]], ib = remap[idx[t * 3 + 1]], ic = remap[idx[t * 3 + 2]];
    if (ia === ib || ib === ic || ic === ia) continue;
    unite(ia, ib); unite(ib, ic); unite(ic, ia);
    bump(ia, ib); bump(ib, ic); bump(ic, ia);
    const ax = pos[idx[t * 3] * 3], ay = pos[idx[t * 3] * 3 + 1], az = pos[idx[t * 3] * 3 + 2];
    const bx = pos[idx[t * 3 + 1] * 3], by = pos[idx[t * 3 + 1] * 3 + 1], bz = pos[idx[t * 3 + 1] * 3 + 2];
    const cx = pos[idx[t * 3 + 2] * 3], cy = pos[idx[t * 3 + 2] * 3 + 1], cz = pos[idx[t * 3 + 2] * 3 + 2];
    vol += ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx);
    for (const [x, y, z] of [[ax, ay, az], [bx, by, bz], [cx, cy, cz]]) {
      if (x < bmin[0]) bmin[0] = x; if (y < bmin[1]) bmin[1] = y; if (z < bmin[2]) bmin[2] = z;
      if (x > bmax[0]) bmax[0] = x; if (y > bmax[1]) bmax[1] = y; if (z > bmax[2]) bmax[2] = z;
    }
  }
  let boundary = 0, nonmanifold = 0;
  for (const c of edges.values()) {
    if (c === 1) boundary++;
    else if (c !== 2) nonmanifold++;
  }
  const roots = new Set();
  for (let i = 0; i < uniq; i++) if (find(i) === i) roots.add(i);
  // Isolated welded vertices that never joined a triangle are not components.
  let components = 0;
  const seen = new Set();
  for (let t = 0; t < nTri; t++) {
    const ia = remap[idx[t * 3]], ib = remap[idx[t * 3 + 1]], ic = remap[idx[t * 3 + 2]];
    if (ia === ib || ib === ic || ic === ia) continue;
    const r = find(ia);
    if (!seen.has(r)) { seen.add(r); components++; }
  }
  return {
    volume: Math.abs(vol) / 6,
    bbox: [bmin, bmax],
    extents: [bmax[0] - bmin[0], bmax[1] - bmin[1], bmax[2] - bmin[2]],
    triangles: nTri,
    boundary,
    nonmanifold,
    components,
    watertight: boundary === 0 && nonmanifold === 0 && Math.abs(vol) > 0
  };
}

export function rawToSTL(pos, idx) {
  const nTri = idx.length / 3;
  const buf = new ArrayBuffer(84 + nTri * 50);
  const view = new DataView(buf);
  view.setUint32(80, nTri, true);
  let o = 84;
  const at = (i) => [pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]];
  for (let t = 0; t < nTri; t++) {
    const a = at(idx[t * 3]), b = at(idx[t * 3 + 1]), c = at(idx[t * 3 + 2]);
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const len = Math.hypot(nx, ny, nz) || 1;
    nx /= len; ny /= len; nz /= len;
    view.setFloat32(o, nx, true); view.setFloat32(o + 4, ny, true); view.setFloat32(o + 8, nz, true);
    const flat = [...a, ...b, ...c];
    for (let k = 0; k < 9; k++) view.setFloat32(o + 12 + k * 4, flat[k], true);
    view.setUint16(o + 48, 0, true);
    o += 50;
  }
  return new Uint8Array(buf);
}

export function parseSTL(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const nTri = view.getUint32(80, true);
  const pos = new Float32Array(nTri * 9);
  const idx = new Uint32Array(nTri * 3);
  let o = 84;
  for (let t = 0; t < nTri; t++) {
    o += 12;
    for (let k = 0; k < 9; k++) pos[t * 9 + k] = view.getFloat32(o + k * 4, true);
    for (let k = 0; k < 3; k++) idx[t * 3 + k] = t * 3 + k;
    o += 38;
  }
  return { pos, idx };
}

function crc32(data) {
  let c = ~0;
  for (let i = 0; i < data.length; i++) {
    c ^= data[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

/** Uncompressed ZIP of {name, data:Uint8Array} entries. */
export function encodeZip(files) {
  const chunks = [];
  const central = [];
  let offset = 0;
  const nameBytes = (s) => new TextEncoder().encode(s);
  for (const f of files) {
    const name = nameBytes(f.name);
    const crc = crc32(f.data);
    const local = new Uint8Array(30 + name.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(8, 0, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, f.data.length, true);
    lv.setUint32(22, f.data.length, true);
    lv.setUint16(26, name.length, true);
    local.set(name, 30);
    chunks.push(local, f.data);
    const cen = new Uint8Array(46 + name.length);
    const cv = new DataView(cen.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, f.data.length, true);
    cv.setUint32(24, f.data.length, true);
    cv.setUint16(28, name.length, true);
    cv.setUint32(42, offset, true);
    cen.set(name, 46);
    central.push(cen);
    offset += local.length + f.data.length;
  }
  const cenLen = central.reduce((s, c) => s + c.length, 0);
  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(8, files.length, true);
  ev.setUint16(10, files.length, true);
  ev.setUint32(12, cenLen, true);
  ev.setUint32(16, offset, true);
  const out = new Uint8Array(offset + cenLen + 22);
  let p = 0;
  for (const c of chunks) { out.set(c, p); p += c.length; }
  for (const c of central) { out.set(c, p); p += c.length; }
  out.set(end, p);
  return out;
}

export const PRINT_NOTES = {
  printer: 'Bambu A1',
  nozzle: '0.4 mm',
  filament: 'PLA+',
  slider: { layer: '0.12 mm', orientation: 'side-on, runner edge on the plate', supports: 'tree, only under cam side faces, wing edges and the lip channel' },
  cap: { layer: '0.08 mm', orientation: 'face up, shield flat on the plate', supports: 'none' },
  cover: { layer: '0.12 mm', orientation: 'face down; snip off the corner ears after printing' },
  base: { layer: '0.12 mm', orientation: 'flat on the bed' },
  gate: { layer: '0.12 mm', orientation: 'rear face down, as in the V4 gate' }
};
