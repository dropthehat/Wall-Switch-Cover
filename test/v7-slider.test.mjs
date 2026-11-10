/**
 * Compare the 2-module V7 export with the validated STL kit, and check that
 * 1-, 3- and 4-lane plates are watertight and stay inside the lane envelope.
 *
 *   npm install
 *   npm run test:v7
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Module from 'manifold-3d';
import { buildKit, inspectMesh, parseSTL, rawToSTL } from '../v7-slider.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fix = path.join(root, 'test/fixtures/v7');

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

function loadRef(name) {
  const buf = fs.readFileSync(path.join(fix, name));
  return inspectMesh(parseSTL(buf).pos, parseSTL(buf).idx);
}

function cmp(label, gotMesh, refName, volTol, boxTol) {
  const got = inspectMesh(gotMesh.pos, gotMesh.idx);
  const ref = loadRef(refName);
  const volErr = Math.abs(got.volume - ref.volume) / ref.volume;
  const boxErr = Math.max(...got.extents.map((v, i) => Math.abs(v - ref.extents[i])));
  const row = {
    part: label,
    gotVolume: round(got.volume),
    refVolume: round(ref.volume),
    volumeErrorPct: Number((volErr * 100).toExponential(3)),
    gotExtents: got.extents.map((v) => round(v, 4)),
    refExtents: ref.extents.map((v) => round(v, 4)),
    bboxErrorMm: Number(boxErr.toExponential(3)),
    watertight: got.watertight,
    components: got.components,
    pass: volErr <= volTol && boxErr <= boxTol && got.watertight && got.components === 1
  };
  return row;
}

function round(n, d = 2) {
  const p = 10 ** d;
  return Math.round(n * p) / p;
}

const rows = [];
let failed = 0;
function expect(cond, msg) {
  if (!cond) { failed++; console.error('FAIL', msg); }
  else console.log('ok', msg);
}

console.log('building validated 2-module kit…');
const t0 = Date.now();
const kit = buildKit(Manifold, CrossSection, { lanes: 2, frame: 'kit' });
console.log(`built in ${((Date.now() - t0) / 1000).toFixed(1)}s`, kit.layout.validated, kit.checks);

const comparisons = [
  ['base', kit.print.base, 'V6_01_Base_ReinforcedTrack_print_flat.stl'],
  ['gate', kit.print.gate, 'V6_04_Internal_StopGate_UNCHANGED_from_V4_rear_face_down.stl'],
  ['cover finished', kit.print.coverFinished, 'V7_02_Cover_SolidKeepers_FINISHED_reference_face_down.stl'],
  ['cover print', kit.print.cover, 'V7_02_Cover_SolidKeepers_PRINT_with_snip_ears_face_down.stl'],
  ['slider', kit.print.slider, 'V7_03a_Shuttle_SLIDER_print_side_runner_down.stl'],
  ['cap', kit.print.cap, 'V7_03b_Shuttle_PUCK_CAP_print_FACE_UP.stl'],
  ['shuttle assembly', kit.installed.shuttle, 'V7_03_Shuttle_TwoPiece_ASSEMBLY_reference.stl']
];

// 0.35% volume and 0.15 mm on the bounding box. A faithful port lands far inside this.
for (const [label, mesh, file] of comparisons) {
  const row = cmp(label, mesh, file, 0.0035, 0.15);
  rows.push(row);
  console.log(JSON.stringify(row));
  expect(row.pass, `${label} matches ${file}`);
}

expect(kit.checks.pass, '2-module envelope, lane gap, cover fit, watertight, on the bed');
expect(kit.checks.shuttleWidth <= 22.5, `shuttle width ${kit.checks.shuttleWidth.toFixed(3)} mm stays within 22.5`);
expect(kit.layout.validated, '2-module kit is marked validated');

// Round-trip the slider STL the way the browser downloads it.
const sliderSTL = rawToSTL(kit.print.slider.pos, kit.print.slider.idx);
const roundTrip = inspectMesh(parseSTL(sliderSTL).pos, parseSTL(sliderSTL).idx);
const direct = inspectMesh(kit.print.slider.pos, kit.print.slider.idx);
expect(Math.abs(roundTrip.volume - direct.volume) / direct.volume < 1e-4, 'STL writer preserves slider volume');

const variants = [
  { lanes: 1, frame: 'studio', baseW: 114.5, baseH: 79.5, screwPitch: 83.5, name: '1 lane in 3-module chassis' },
  { lanes: 3, frame: 'studio', baseW: 137, baseH: 79.5, screwPitch: 106, name: '3 lanes in 4-module chassis' },
  { lanes: 4, frame: 'studio', baseW: 137, baseH: 79.5, screwPitch: 106, name: '4 lanes in 4-module chassis' },
  { lanes: 1, frame: 'kit', name: '1 lane on the test-kit plate' },
  { lanes: 3, frame: 'kit', name: '3 lanes grown from the test-kit plate' },
  { lanes: 4, frame: 'kit', name: '4 lanes grown from the test-kit plate' }
];

for (const v of variants) {
  console.log('building', v.name);
  const k = buildKit(Manifold, CrossSection, v);
  const c = k.checks;
  console.log(JSON.stringify({
    name: v.name,
    validated: k.layout.validated,
    enlarged: k.layout.enlarged,
    base: [round(k.layout.baseW, 2), round(k.layout.baseH, 2)],
    cover: [round(k.layout.coverW, 2), round(k.layout.coverH, 2)],
    shuttleWidth: round(c.shuttleWidth, 3),
    laneGap: round(c.laneGap, 3),
    volumes: {
      base: round(inspectMesh(k.print.base.pos, k.print.base.idx).volume),
      cover: round(inspectMesh(k.print.cover.pos, k.print.cover.idx).volume),
      slider: round(inspectMesh(k.print.slider.pos, k.print.slider.idx).volume),
      cap: round(inspectMesh(k.print.cap.pos, k.print.cap.idx).volume),
      gate: round(inspectMesh(k.print.gate.pos, k.print.gate.idx).volume)
    },
    pass: c.pass
  }));
  expect(c.pass, v.name);
  expect(!k.layout.validated, v.name + ' is labelled untested');
  for (const [part, mesh] of Object.entries(k.print)) {
    const info = inspectMesh(mesh.pos, mesh.idx);
    expect(info.watertight && info.components === 1 && info.volume > 0, `${v.name} ${part} watertight`);
  }
}

fs.writeFileSync(path.join(root, 'test/v7-comparison.json'), JSON.stringify({ comparisons: rows, failed }, null, 2));
if (failed) {
  console.error(`${failed} check(s) failed`);
  process.exit(1);
}
console.log('ALL PASS');
