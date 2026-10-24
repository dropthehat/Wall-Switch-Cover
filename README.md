# ArteorCAD v25 Studio

ArteorCAD is a single-file browser tool (`index.html`) for designing 3D-printed wall switch covers. It builds the cover parametrically with three.js, shows it in an orbit view, and downloads binary STL files with the mesh shifted so its lowest point sits on Z = 0.

The product version lives in one place, `APP_VERSION` (`v25`), in the script at the top of `index.html`. That token is the page title, every STL filename, the JSON setup download, and the suggested name when you save a setup. The green header badge is the same token plus `.0 Studio`, so it reads **v25.0 Studio**.

## Run it

Tailwind and three.js **0.128.0** (OrbitControls, STLExporter, STLLoader, and OBJLoader) are loaded from CDNs. The browser needs a network connection.

Open `index.html` directly, or from this folder:

```bash
python3 -m http.server
```

Then open `http://localhost:8000/`.

On startup the **Alu-Blade** preset is applied. The chassis readout is then **119.5 × 84.5 mm**: 3-module inner size 114.5 × 79.5 mm and wall 2.5 mm. That preset writes a 0.8 mm corner, and the corner slider steps by 0.5 mm, so the control settles on 1 mm. That is still under 1.2 mm, which is why the outer size does not grow past the wall thickness.

## Mounting

**Wall Fixation Method** is one of three modes. The page shows only that mode’s controls.

### Factory H-Bridge Snap Pins (`hpins`, the default)

Four ribbed pins on a connected web: the pin-bridge mount. Defaults are pin OD 5.25 mm, length 5.2 mm, 4 ribs, rib depth 0.35 mm, spacing 94.2 mm in X and 53.3 mm in Y, lug thickness 1.4 mm, and H-web 0.9 mm.

### Universal 2-Screw Slotted Ears (`screwtabs`)

Two slotted ears for wall-box screws. Defaults are a screw pitch of 83.5 mm, a slot diameter of 4.2 mm, and an ear thickness of 2.4 mm. Each slot is a vertical pill (the hole is the slot diameter wide and 3.2 mm taller, with semicircular ends).

### Slip-Over Cavity + Snap-Lip (`slipover`)

A cover that sits on an existing plate. It builds a cavity over the inner opening and an inward snap lip. Defaults are a lip bite of 0.65 mm, a lip height of 2.2 mm, and lips on the top and bottom edges only. The lip control can switch that to all four walls. This mode does not add H-pins or screw ears. A lip bite at or below 0.02 mm adds no lip.

Cover construction is separate from the wall mount. The cover can be one solid piece, or a two-part cover (an inlay, or a full top over the base) held by snap catches or by four magnet pockets. The opening preset is a two-part full top with magnet pockets and a minimal rim base. The control default before that preset runs is a full-top snap cover on the minimal skeleton base. Skeleton wrap is not used for slip-over; that mount keeps the cavity shell.

## Frame sizes

**Legrand Chassis Capacity** writes sizes when you change 3-module / 4-module. A locked fixation or chassis section is left alone.

| Choice | Inner width | Pin spacing X | Screw pitch |
| --- | --- | --- | --- |
| 3-module standard | 114.5 mm, or 116.0 mm if slip-over is the current mount | 94.2 mm | 83.5 mm |
| 4-module wide | 137.0 mm, or 138.5 mm if slip-over is the current mount | 116.7 mm | 106.0 mm |

Inner height is not changed by that menu. Its default is 79.5 mm. Wall, corner radius, face thickness, skirt, and cavity depth have their own sliders.

The label beside step 2 is the outer size. It is the inner size plus the wall thickness on each side. Outside slip-over mode, a corner radius above 1.2 mm also adds `(corner − 1.2) × 0.415` mm per side. Slip-over does not add that corner extension.

The central switch pocket is 69.8 mm wide on a 3-module chassis and 92.3 mm wide on a 4-module chassis. Pocket height is the module height plus 2 mm, and at least 47.4 mm. Module pitch defaults to 22.5 mm and module height to 45.2 mm. You can place 0–4 switches, and an outlet labeled **1M Outlet (22.5×45)** or **2M Schuko (45×45)**, on the left, right, or center.

A rectangular outlet cut is the module pitch (times two for Schuko) plus 0.2 mm, by the module height. Schuko **Cover Bezel** mode cuts a 39.5 mm round well instead. The 1M cover-bezel option cuts two 5.4 mm pin holes, 9.5 mm above and below center. Uncovered switches open a rectangle of `(pitch + 0.2)` by the module height. Covered switches use the slot width, height, and shape (pill, rectangle, or circle).

When the mix of covered switches and outlets changes, cavity depth is rewritten unless the chassis section is locked: 11.0 mm while any switch is covered, 5.6 mm for a cover-bezel outlet with no covered switch, otherwise `max(2.4, 5.2 + 0.43 − face thickness)` mm.

## Parts the STL buttons export

Each button downloads a binary STL and drops the mesh onto Z = 0. Names use `APP_VERSION` (`v25` today). `fixMode` is `hpins`, `screwtabs`, or `slipover`. `coverBuild` is the cover-construction value (`fulltop_snaps` in the control default, `fulltop_magnets` after the opening Alu-Blade preset).

| Button | File |
| --- | --- |
| Part 1: Base | `Arteor_v25_Part1_SkeletonBase_<fixMode>_<coverBuild>.stl` |
| Part 2: Bare Cover | `Arteor_v25_Part2_BareCover_NoOverlay_<coverBuild>.stl` |
| Waffle / Overlay | `Arteor_v25_AMS_Overlay_<overlay style>_READY.stl` |
| Cover + Overlay | `Arteor_v25_Part2_CoverWithOverlay_<coverBuild>.stl` |
| STL: Stem (+Thread) | `Arteor_v25_Stem_M<stud Ø>_PositiveThread_READY.stl` |
| STL: Tip (-Thread) | `Arteor_v25_Tip_<tip style>_<stud Ø + tolerance>mm_NegativeThread_READY.stl` |
| Full Assembly STL | `Arteor_v25_FullAssembly_<coverBuild>.stl` |

- **Part 1** is the chassis (mount, base, and snap or magnet features).
- **Bare cover** is the faceplate and any bubble geometry, without the 3D overlay, so the top stays flat for a separate overlay you glue on.
- **Waffle / Overlay** is only the overlay. The name uses the overlay menu value, including `none`.
- **Cover + Overlay** is the faceplate, bubbles, and overlay in one mesh.
- **Full assembly** is the chassis, faceplate, bubbles, and overlay. It does not include the knob.
- The stem name prints the stud diameter to one decimal place. The tip name prints stud diameter plus thread tolerance to two decimal places. Defaults are a 4.0 mm stud and 0.35 mm tolerance.
- A screw joint adds a helical stud on the stem, except on the stadium blade and the bat stick. The matching tip bore is omitted for those two as well. A one-piece joint, or the bat stick, puts the tip mesh in the stem file.

The color palette is a viewport preview. STL files have no color. A plate STL/OBJ or a knob OBJ/STL imported in this session is part of the preview and of the STL you export afterward. Those meshes are not stored in a saved setup.

## Saving and loading setups

**Save**, **Load**, and **✕** use `localStorage` under the key `arteor_cad_v24_profiles`. The key is not tied to `APP_VERSION`, so changing the version does not hide setups already saved in this browser.

**Save** asks for a name. The suggested name is `Arteor v25` plus the current time, hours and minutes. **Load** applies the name selected in the menu. **✕** deletes it. A locked section is skipped, including when a preset runs.

**⬇JSON** downloads the current controls as `arteor_v25_profile.json`. **⬆** reads a JSON file and applies it. A file that does not parse shows `Invalid JSON`. Importing does not write `localStorage` until you save.

Stored values are the designer controls (fixation, chassis, modules, plate, overlay, knob, and colors) and the multi-color knobs checkbox. Not stored: imported meshes, camera, explode / wireframe / back view, the light slider, or which sections are locked.

The buttons above the steps (Alu-Blade, B+P Knurl, Dimwit, and the rest) fill the unlocked controls with a named style.

## Printing

These are wall covers, so they can sit in sun or next to warm fittings. **PETG or ASA** is a better choice than **PLA**, which softens at a lower temperature. This page does not set a nozzle, a bed, or any other slicer profile. Export the part you want and slice that STL. The bare cover and the overlay are the pair meant to be printed separately and glued. Cover + Overlay is those same faces in one mesh.
