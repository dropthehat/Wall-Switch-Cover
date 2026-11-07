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

The track is part of the base, not the cover. Rails flank each module window. The dovetail opens toward the room, so a 45° undercut prints without support with the room side up. The fixed-rail plate still puts a full-width plate across the loading end. That plate sits in the path of the cams, and a printed shuttle will not pass it. Cutting the lips near the middle lets one side in and leaves the other forced. Do not reprint the six coupon files to solve that. The print to try is the tool-free F55 test below. It has no screw.

On the full plate the fascia still snaps on after the shuttle, and the H-pins and 83.5 mm screw ears are unchanged. Existing overlay styles still cut around the slot. A monolithic cover is split into a snap-on fascia while slide mode is on.

The number in **X/side** is the horizontal gap between the tongue and the rail on each side, and it is the same at every height along the 45° face. Total horizontal clearance is twice that. It is not the gap measured perpendicular to the sloping face; that normal gap is X/side × cos 45°. **Z gap** is the separate vertical clearance under the tongue and under the lip.

### Print orientation

Print the **base** with the room side up (the orientation of the STL). The dovetail mouth is the narrow end, so each layer of the rail is smaller than the one under it.

Print the **shuttle** on its side. The shuttle STL is already rotated that way: the slide direction lies on the bed, and the layers stack across the shuttle's width, so the layer lines run along the slide instead of stair-stepping the ramp. PETG is the right material here; the ramp is a wear surface. If you would rather not slide PETG on the rocker, turn on **PTFE slot** and press a short 4 mm PTFE tube into each ramp nose. The pocket is 4.2 mm across and opens toward the rocker so the tube sits proud of the wedge. Leave it off for the first fit check.

The **cover** prints as a normal faceplate, slots up or down as you prefer, and snaps onto the base.

### Test coupons

These six files are the older fixed-rail coupons. They are not the removable-rail fit test. A later print still could not be assembled without cutting the lips.

**⬇ Coupon parts** saves six STLs. Tracks, shuttles, and stops are never in the same file, so supports can be enabled on the shuttle files only. Before each file is written, every track, shuttle, and stop is boolean-unioned with its ID into one closed solid. The letters are not separate boxes. Each ID is on a non-mating face: the closed-end tab on a track (with **IN** and an arrow toward the open end), the handle top on a shuttle, and the top of a stop. Pips (1, 2, or 3) are part of the closed end of the shuttle, off the dovetail. A file of three parts is three solids, not one fused plate.

The first printed set mixed a tight dovetail, a detent nub, and identification pips on the mating tongue, and one end of the frame was closed by a bar while the other end had a fixed finger in the channel. The mesh of that set also did not have the labelled 0.15 / 0.22 / 0.30 mm at the lip: the vertical clearance consumed the horizontal gap, so the minimum X gap per side on those three was about −0.05 / +0.02 / +0.10 mm. That is a description of the old model, not a measurement of how much the printed parts interfered. Carl's print of that plate could not be assembled without cutting a side, and all three fits were too tight. The revised plates separate those questions and open the loading end.

**Fit tracks** `Arteor_v25_Slide_Fit_Tracks_F40_F55_F70.stl`, with matching `Arteor_v25_Slide_Fit_Shuttles_F40_F55_F70.stl` and `Arteor_v25_Slide_Fit_Stops_F40_F55_F70.stl`. Ramp height is 6.0 mm on every station. Detent is off. Only the horizontal clearance changes.

| ID | Pips | X gap per side | X gap total | Z gap | Normal-to-45° gap | Ramp |
| --- | --- | --- | --- | --- | --- | --- |
| F40 | 1 | 0.40 mm | 0.80 mm | 0.30 mm | 0.28 mm | 6.0 mm |
| F55 | 2 | 0.55 mm | 1.10 mm | 0.30 mm | 0.39 mm | 6.0 mm |
| F70 | 3 | 0.70 mm | 1.40 mm | 0.30 mm | 0.49 mm | 6.0 mm |

**Ramp tracks** `Arteor_v25_Slide_Ramp_Tracks_R55_R60_R65.stl`, with matching `Arteor_v25_Slide_Ramp_Shuttles_R55_R60_R65.stl` and `Arteor_v25_Slide_Ramp_Stops_R55_R60_R65.stl`. Clearance is the F55 pair (0.55 mm per side, 0.30 mm in Z) on every station. Only the ramp height changes: 5.5, 6.0, and 6.5 mm.

### Single-switch plate test (the one to print)

**⬇ Plate test F55 — one switch, two wall screws** writes three files: `Arteor_v25_PlateTest_F55_Base.stl`, `Arteor_v25_PlateTest_F55_Shuttle.stl`, and `Arteor_v25_PlateTest_F55_Cover.stl`. This is a new model. It is not the coupon below.

Carl measured the original Arteor rocker at 22.5 mm, widest exterior, left to right. That is the limit for the rails, the shuttle, and the cover catches. On the exported meshes those widths are 22.20 mm for the channel, 22.40 mm for the cover, and 16.10 mm for the shuttle.

The first plate was a 100 by 112 mm rectangle. That size is not an Arteor frame. The files to print now are `Arteor_v25_Plate3M_F55_Base.stl`, `Arteor_v25_Plate3M_F55_Shuttle.stl`, and `Arteor_v25_Plate3M_F55_Cover.stl`. The plate outline is the studio’s 3-module reference frame face: **113.7 by 78.7 mm**, corner radius 2.5 mm, ear 2.4 mm, back on the support-frame face. The screws stay on **83.5 mm** centers. 114.5 by 79.5 mm is the chassis inner default, not the outside of this plate, and 119.5 by 84.5 mm is that inner size plus a design wall. Neither of those is a measured faceplate. If Carl’s frame is a different size, this plate will not match it.

The open end is the top of the plate, the end marked **TOP**. The bottom is closed. The cover's slot ends stop the shuttle. The dovetail lips stop it lifting out. Three fingers hook under a shelf and two hoods, so the cover stays on without relying on gravity. Nothing loose sits in the mechanism: no stop, nut, or bolt. Pinch the fingers about 1 mm to put the cover on or take it off. The grip passes through the slot.

The first shuttle's ridges stopped at 18.45 mm, 1.33 mm below the cover face at 19.77 mm, so the grip could not be used. **⬇ Taller grip only** writes `Arteor_v25_Plate3M_F55_Shuttle_TallGrip.stl` and nothing else. The stem is 6.33 mm taller. The ridges stand at 24.77 mm, 5.00 mm above the cover face. The cams, the dovetail, and the plate and cover files are unchanged. That cover is the same file as the earlier plate-test cover, so the taller shuttle fits both. It has not been printed.

This plate has not been printed. The mesh checks do not show that it mounts or that the cams move a real rocker. Print notes are in the zip.

### Tool-free F55 coupon (already printed, do not reprint)

The track and the shuttle that Carl printed are unchanged. Do not reprint them. The first stop falls out. **⬇ Clip stop only** writes a replacement stop that squeezes the two posts already on that track. Those posts have no head, so this is a friction grip, not a snap. The clip is wider than 22.5 mm, so it is not used on the plate.

The replacement file is `Arteor_v25_ToolFree_F55_Stop_Clip.stl`. Print it flat face down, feet and arms up, supports off. Press it onto the two posts at **OPEN**. Pull it straight off to remove it. Turn the coupon over and shake it gently. It should stay. If the arms whiten or a post chips, stop. This grip has not been printed.

The proven files, left as printed, are `Arteor_v25_ToolFree_F55_Track.stl` and `Arteor_v25_ToolFree_F55_Shuttle.stl`. The old `Arteor_v25_ToolFree_F55_Stop.stl` is the one that falls out.

### Older removable-rail test (do not print)

Carl rejected this one because it needs a screw and a nut. The button is still in the app so the files can be told apart. It is not the current test.

| Part | File | Print |
| --- | --- | --- |
| Base, fixed rail on one side | `Arteor_v25_RailFit_F55_Base.stl` | Flat on the bed, channel up. Supports off. |
| Loose rail | `Arteor_v25_RailFit_F55_Rail.stl` | Foot on the bed, dovetail up. Supports off. |
| Slider | `Arteor_v25_RailFit_F55_Slider.stl` | Already turned on its side. Supports on, this file only. |

Hardware, not printed: one **M3×12** socket or machine screw and one **M3 nut**. The channel walls set the rail spacing. The screw only pulls the loose rail down onto the floor. It does not pinch the two rails together.

The slider dovetail is the F55 size: **0.55 mm per side** and **0.30 mm in Z**. The loose rail's foot has **0.20 mm** of air on the slider side of the channel and **0.28 mm** on the outer side, plus **0.15 mm** under the foot so it can slide in. The screw takes up that 0.15 mm. The side play stays. In the designed seat the shuttle gap is still 0.55 mm. The center of the base is open under the slider, about 6 mm below the rail floor, for cams that are not in this test. The guide is 32 mm long and stays under both lips through 11 mm of travel.

1. Put the base on the bench with **OPEN** toward you. **F55** is on the far end.
2. Slide the yellow slider in from **OPEN** onto the fixed rail until it sits in the middle. The loose rail is still off.
3. Slide the M3 nut, flats horizontal, into the tunnel in the **OPEN** end.
4. Slide the teal rail in from **OPEN**, foot in the channel, until it stops at the far end.
5. Run the M3×12 screw down through the tab into the nut. Snug. Do not crush the rail.
6. Move the slider by hand. It should travel and stay in both grooves. Removal is the screw, then the teal rail, then the slider, all back out of **OPEN**.

Pass if that happens with no cutting and no bent rail, and the outside width of the base changes by less than 0.2 mm. This file set has not been printed.

Print the fit plate in PLA first, the same layer height you intend to use. For each ID: leave the stop out, slide the shuttle in from the **IN** end, then drop that station's stop into the two slots. The rails should not be cut or spread. Note which ID runs and which is sloppy. Then print the ramp plate at the clearance you chose and see which wedge clicks the real rocker (pressed edge 5.2 mm, raised edge 10.5 mm, 5.3 mm of edge travel) and sits in the relief afterward. Copy those two numbers into **X/side** and **Ramp H**. None of these clearances has been confirmed by a print of this revision.

The stop on the coupon is meant to be lifted out by hand. On the full plate, **Shuttles / Stops** writes the shuttles and the stops as two files. The shuttles are on their sides. The stops are flat.

## Printing

These are wall covers, so they can sit in sun or next to warm fittings. **PETG or ASA** is a better choice than **PLA**, which softens at a lower temperature. This page does not set a nozzle, a bed, or any other slicer profile. Export the part you want and slice that STL. The bare cover and the overlay are the pair meant to be printed separately and glued. Cover + Overlay is those same faces in one mesh.
