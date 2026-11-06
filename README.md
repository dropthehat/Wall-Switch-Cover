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

When the mix of covered switches and outlets changes, cavity depth is rewritten unless the chassis section is locked: 11.0 mm while any switch is covered, 5.6 mm for a cover-bezel outlet with no covered switch, otherwise `max(2.4, 5.2 + 0.43 − face thickness)` mm. Slide switch mode raises it again, to at least 12.5 mm and usually a bit more, so the shuttle clears a rocker whose raised end is 10.5 mm above the support frame. Lock the chassis section if you want to keep a cavity you typed in by hand.

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
| Slide Base | `Arteor_v25_Slide_BaseTrack_<fixMode>.stl` |
| Shuttles only | `Arteor_v25_Slide_Shuttles_x<count>.stl` |
| Stops only | `Arteor_v25_Slide_Stops_x<count>.stl` |
| Slide Cover | `Arteor_v25_Slide_Cover_<coverBuild>.stl` |
| Fit tracks | `Arteor_v25_Slide_Fit_Tracks_F40_F55_F70.stl` |
| Ramp tracks | `Arteor_v25_Slide_Ramp_Tracks_R55_R60_R65.stl` |
| Fit shuttles | `Arteor_v25_Slide_Fit_Shuttles_F40_F55_F70.stl` |
| Ramp shuttles | `Arteor_v25_Slide_Ramp_Shuttles_R55_R60_R65.stl` |
| Fit stops | `Arteor_v25_Slide_Fit_Stops_F40_F55_F70.stl` |
| Ramp stops | `Arteor_v25_Slide_Ramp_Stops_R55_R60_R65.stl` |

- **Part 1** is the chassis (mount, base, and snap or magnet features).
- **Bare cover** is the faceplate and any bubble geometry, without the 3D overlay, so the top stays flat for a separate overlay you glue on.
- **Waffle / Overlay** is only the overlay. The name uses the overlay menu value, including `none`.
- **Cover + Overlay** is the faceplate, bubbles, and overlay in one mesh.
- **Full assembly** is the chassis, faceplate, bubbles, and overlay. It does not include the knob.
- The stem name prints the stud diameter to one decimal place. The tip name prints stud diameter plus thread tolerance to two decimal places. Defaults are a 4.0 mm stud and 0.35 mm tolerance.
- A screw joint adds a helical stud on the stem, except on the stadium blade and the bat stick. The matching tip bore is omitted for those two as well. A one-piece joint, or the bat stick, puts the tip mesh in the stem file.
- **Slide Base** is the current chassis, including the H-pin bridge or the 83.5 mm screw ears, plus the dovetail track with one open end. It does not contain shuttles or stops. **Shuttles only** and **Stops only** are two separate files from the same button. **Slide Cover** is the snap-on fascia and its vertical slots, without the overlay. **Coupon parts** saves six files: fit tracks, ramp tracks, fit shuttles, ramp shuttles, fit stops, and ramp stops. A track file contains only tracks.

The color palette is a viewport preview. STL files have no color. A plate STL/OBJ or a knob OBJ/STL imported in this session is part of the preview and of the STL you export afterward. Those meshes are not stored in a saved setup.

## Saving and loading setups

**Save**, **Load**, and **✕** use `localStorage` under the key `arteor_cad_v24_profiles`. The key is not tied to `APP_VERSION`, so changing the version does not hide setups already saved in this browser.

**Save** asks for a name. The suggested name is `Arteor v25` plus the current time, hours and minutes. **Load** applies the name selected in the menu. **✕** deletes it. A locked section is skipped, including when a preset runs.

**⬇JSON** downloads the current controls as `arteor_v25_profile.json`. **⬆** reads a JSON file and applies it. A file that does not parse shows `Invalid JSON`. Importing does not write `localStorage` until you save.

Stored values are the designer controls (fixation, chassis, modules, slide dimensions, plate, overlay, knob, and colors), the multi-color knobs checkbox, and the slide detent / PTFE checkboxes. Not stored: imported meshes, camera, explode / wireframe / back view, the light slider, the slide preview scrubber, the side-section toggle, or which sections are locked. The storage key is still `arteor_cad_v24_profiles`. Older saves simply omit the slide fields; loading one does not erase a slide setup you have not written into that save, and it does not rename the key.

The buttons above the steps (Alu-Blade, B+P Knurl, Dimwit, and the rest) fill the unlocked controls with a named style.

## Slide switch

**Switch Exposure → Slide switch** gives every switch module a shuttle that rides vertically in a 45° dovetail. The look is a grip bar with two thumb ridges, not a round puck. Card **3b** holds the dimensions. The **↕ Slide** preset turns the mode on with a plain fascia so the slots are easy to see.

The shuttle carries two wedges on its underside. Sliding **up** drives the lower ramp onto the bottom half of the rocker and pushes that half in. Sliding **down** drives the upper ramp onto the top half. Each ramp ends in a short flat dwell, then a 0.7 mm relief, so once the rocker has clicked the plastic is not left pressed against it. The rocker's own spring holds the shuttle at that end of travel. An optional cantilever on the shuttle drops a small nub into a notch at each park position; the beam is straight when the nub is in the notch.

These are the measured rocker heights the ramps are built against, taken from the support-frame face: pressed end 5.2 mm, raised end 10.5 mm, so the edge moves about 5.3 mm. The ramp meets the rocker about 15 mm from the pivot. Defaults:

| Control | Default | Range |
| --- | --- | --- |
| Ramp height | 6.0 mm (5.3 mm of edge travel + about 0.7 mm overtravel) | 4.5–7.5 |
| Slide travel | 11 mm | 8–14 |
| Ramp angle | `atan(ramp height / active slope length)`, about 29° at the defaults | readout; 27–30° is the aim |
| Contact | 15 mm from the pivot | 12–18 |
| Dovetail X clearance | 0.50 mm per side (1.00 mm total). The gap normal to the 45° face is this number times cos 45° (0.35 mm at the default) | 0.25–0.80 per side |
| Dovetail Z clearance | 0.30 mm under the tongue and under the lip | 0.15–0.50 |
| Grip length | 12.5 mm | 10–18 |
| Cover slot | grip length + travel + 0.5 mm, by grip width + 1.05 mm | follows the sliders |
| Detent | on | checkbox |
| PTFE nose slot | off | checkbox; ramp height at least 5.5 mm |

The active slope length is `max(5.5, travel × 0.96)` mm. The angle readout turns green inside 27–30°. The nose of each wedge is rounded to about 1.7 mm. **Side Section** clips the model through the middle module, draws both rocker states (orange raised-top, blue pressed-top), and switches the corner inspector to the same side view. **Rock Switch** parks the preview at the other end. The preview scrubber moves between them.

The track is part of the base, not the cover. Rails flank each module window. The dovetail opens toward the room, so a 45° undercut prints without support with the room side up. The two rails stay a fixed distance apart: a sole runs under each rail, a cross-sole ties them at the loading end, and a full-height bar ties them at the other end. Nothing in that loop has to be cut or flexed to get the shuttle in.

The loading end is the end with the arrow and the letters **IN**. That end of the dovetail is open. Slide the shuttle in from there, grip toward the room, until it is past the two slots. Then drop the removable stop into those slots. The stop is a separate piece. Lift it out to remove the shuttle. On the wall plate the fascia sits over the stop and keeps it from falling toward the room. H-pins and the 83.5 mm screw ears are unchanged. Existing overlay styles still cut around the slot. A monolithic cover is split into a snap-on fascia while slide mode is on, because the shuttle has to go in before the face does.

The number in **X/side** is the horizontal gap between the tongue and the rail on each side, and it is the same at every height along the 45° face. Total horizontal clearance is twice that. It is not the gap measured perpendicular to the sloping face; that normal gap is X/side × cos 45°. **Z gap** is the separate vertical clearance under the tongue and under the lip.

### Print orientation

Print the **base** with the room side up (the orientation of the STL). The dovetail mouth is the narrow end, so each layer of the rail is smaller than the one under it.

Print the **shuttle** on its side. The shuttle STL is already rotated that way: the slide direction lies on the bed, and the layers stack across the shuttle's width, so the layer lines run along the slide instead of stair-stepping the ramp. PETG is the right material here; the ramp is a wear surface. If you would rather not slide PETG on the rocker, turn on **PTFE slot** and press a short 4 mm PTFE tube into each ramp nose. The pocket is 4.2 mm across and opens toward the rocker so the tube sits proud of the wedge. Leave it off for the first fit check.

The **cover** prints as a normal faceplate, slots up or down as you prefer, and snaps onto the base.

### Test coupons

**⬇ Coupon parts** saves six STLs. Tracks, shuttles, and stops are never in the same file, so supports can be enabled on the shuttle files only. Each part carries its ID sunk into a non-mating face: the closed-end tab on a track (with **IN** and an arrow toward the open end), the handle top on a shuttle, and the top of a stop. Pips (1, 2, or 3) are sunk into the closed end of the shuttle, off the dovetail.

The first printed set mixed a tight dovetail, a detent nub, and identification pips on the mating tongue, and one end of the frame was closed by a bar while the other end had a fixed finger in the channel. The mesh of that set also did not have the labelled 0.15 / 0.22 / 0.30 mm at the lip: the vertical clearance consumed the horizontal gap, so the minimum X gap per side on those three was about −0.05 / +0.02 / +0.10 mm. That is a description of the old model, not a measurement of how much the printed parts interfered. Carl's print of that plate could not be assembled without cutting a side, and all three fits were too tight. The revised plates separate those questions and open the loading end.

**Fit tracks** `Arteor_v25_Slide_Fit_Tracks_F40_F55_F70.stl`, with matching `Arteor_v25_Slide_Fit_Shuttles_F40_F55_F70.stl` and `Arteor_v25_Slide_Fit_Stops_F40_F55_F70.stl`. Ramp height is 6.0 mm on every station. Detent is off. Only the horizontal clearance changes.

| ID | Pips | X gap per side | X gap total | Z gap | Normal-to-45° gap | Ramp |
| --- | --- | --- | --- | --- | --- | --- |
| F40 | 1 | 0.40 mm | 0.80 mm | 0.30 mm | 0.28 mm | 6.0 mm |
| F55 | 2 | 0.55 mm | 1.10 mm | 0.30 mm | 0.39 mm | 6.0 mm |
| F70 | 3 | 0.70 mm | 1.40 mm | 0.30 mm | 0.49 mm | 6.0 mm |

**Ramp tracks** `Arteor_v25_Slide_Ramp_Tracks_R55_R60_R65.stl`, with matching `Arteor_v25_Slide_Ramp_Shuttles_R55_R60_R65.stl` and `Arteor_v25_Slide_Ramp_Stops_R55_R60_R65.stl`. Clearance is the F55 pair (0.55 mm per side, 0.30 mm in Z) on every station. Only the ramp height changes: 5.5, 6.0, and 6.5 mm.

Print the fit plate in PLA first, the same layer height you intend to use. For each ID: leave the stop out, slide the shuttle in from the **IN** end, then drop that station's stop into the two slots. The rails should not be cut or spread. Note which ID runs and which is sloppy. Then print the ramp plate at the clearance you chose and see which wedge clicks the real rocker (pressed edge 5.2 mm, raised edge 10.5 mm, 5.3 mm of edge travel) and sits in the relief afterward. Copy those two numbers into **X/side** and **Ramp H**. None of these clearances has been confirmed by a print of this revision.

The stop on the coupon is meant to be lifted out by hand. On the full plate, **Shuttles / Stops** writes the shuttles and the stops as two files. The shuttles are on their sides. The stops are flat.

## Printing

These are wall covers, so they can sit in sun or next to warm fittings. **PETG or ASA** is a better choice than **PLA**, which softens at a lower temperature. This page does not set a nozzle, a bed, or any other slicer profile. Export the part you want and slice that STL. The bare cover and the overlay are the pair meant to be printed separately and glued. Cover + Overlay is those same faces in one mesh.
