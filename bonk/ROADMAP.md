# BONK · Impact Test Bay · ROADMAP

Current version: v0.6.0 (Oct 9 2026)
Deployed files (all flat, no subfolders): index.html, manifest.webmanifest, sw.js, icon-192.png, icon-512.png, icon-192-maskable.png, icon-512-maskable.png, apple-touch-icon.png
Built for: a Yanke coworker having a rough week who asked for a stick figure he can run into a wall over and over.

## What it is
A crash test dummy, a wall, and several ways to combine them. Side view, 2D.

## Shipped
v0.1 (Oct 8)
- ON FOOT speed slider 1-25 mph; GO sends the dummy into the wall; it gets up and jogs back on its own.
- LOOP repeats the run (or cannon shot) until switched off.
- CANNON muzzle 25-200 mph, auto-aimed at head height.
- ROCKET hold-to-BURN, thrust follows the spine, 1.6 s fuel, refills on getup.
- Grab-and-throw any body part, any mode.
- Stats saved on device: bonks, last mph, best mph, head hits.
- Feel: hit-stop, shake (toggle), piling wall cracks, concrete chips, speed ghosts, synth thuds (toggle), haptics.

v0.2 (Oct 8)  -- attempted joint limits + muscle tone  [REVERTED in v0.2.1]
- Added angle-constraint joint limits (no knee/elbow hyperextension) and a pose-spring muscle tone.
- Pulled in v0.2.1: the angle constraints pumped energy into the Verlet solver and launched the ragdoll on impact ("bouncing all over"), worst at gentle speeds. Could not be made stable alongside the distance solver (moving-pivot energy injection). Lesson for next time: angle springs/limits in this point-and-stick engine are not worth it; if we revisit hyperextension, do it with a proper angular-velocity-damped joint, not a position spring.

v0.2.1 (Oct 8)  -- muscle tone (stable) + honest scoring
- MUSCLE TONE slider (LIMP <-> STIFF), applies to all modes. Driven by velocity damping, which is dissipative and physically cannot add energy, so the ragdoll can never explode. Limp = loose, floppy flail; stiff = heavier, limbs move together and settle controlled. Default 0.35. (Note: milder than the "stays standing and staggers" idea, which needed the pose spring that caused the launch bug.)
- Honest scoring: reported mph is capped by mode (feet can't read faster than the run speed, cannon not past muzzle), so a solver glitch can never post a bogus score.
- Ragdoll is otherwise back to the stable v0.1 distance-only solver. Verified across a speed x tone sweep: nothing launches (highest point stays at body height ~2m), no per-frame teleporting.

v0.3.0 (Oct 9)  -- aiming, distance, walkthrough, installable PWA
- DISTANCE slider (all modes, 2-14 m): sets how far back the figure starts. START_X and the cannon position are derived from store.dist via applyDist(); dragging it while idle repositions the figure/cannon live. Short run-ups mean he may not reach full speed before the wall (emergent).
- ANGLE slider (Cannon + Rocket), shown above POWER so the order reads distance -> angle -> power -> GO. Cannon auto-aim was removed; the user sets elevation (0-80 deg). Rocket angle (0-70 deg) sets the launch lean, and thrust follows the spine.
- Aim guides: cannon draws a dashed ballistic trajectory with an X marker on the exact wall-hit point (live as you change angle/power/distance); rocket draws a red heading arrow along the launch direction.
- Cannon mode now shows the dummy loaded INSIDE the barrel (barrelPose while idle), and the camera frames cannon -> wall so the whole shot is visible while aiming. The cannon is only drawn in cannon mode.
- Walkthrough overlay ("HOW TO BONK", 7 steps): shows on first run (localStorage bonk.guide1), reopens via the "?" button top-left.
- Installable PWA: manifest.webmanifest (standalone, crash-test-dummy icons 192/512 + maskable + apple-touch 180), sw.js with cache name bonk-v0.3.0 (MUST match the badge every deploy). SW is network-first for page navigations (so the live version is always fresh online and we never fight stale cache) and cache-first for icons/manifest; offline falls back to the cached page. An "install" chip + in-guide INSTALL button appear when the browser offers beforeinstallprompt (Android/desktop Chrome); iOS users get a Share -> Add to Home Screen tip. Install only works from the https GitHub Pages URL, not a downloaded file.

v0.4.0 (Oct 9)  -- he looks like the coworker, blood toggle, achievements + records, bullseye
- SKIN toggle (chip): "him" draws the coworker (dark bowl cut, clear safety glasses, black Yanke tee with a small white chest mark, skin arms with short black sleeves, navy jeans, dark sneakers, goatee). "dummy" is the original crash-test figure. Same 12-point skeleton; only the renderer changes (drawHuman / humanHead / shoe / sleeve). Default: him.
- BLOOD toggle (chip, default OFF): wall splats with drips, floor pools, red spray particles that land and leave pools. Turning it off clears the splats. Cartoon red, no detail.
- BULLSEYE target painted on the wall at a random height (0.7-3.2 m), re-rolled after every hit. Scoring by impact height vs center: center 50 (counts a bullseye + streak), inner 25, outer 10. Shows as rings on the wall body plus scoring bands on the wall face. HUD got a 5th stat: bulls.
- ACHIEVEMENTS (20) + RECORDS under the "awards" chip: totals (bonks, head, bullseyes, target pts, best streak, max height) and best mph per launcher (on foot / cannon / rocket / thrown). Unlocks toast + two-tone ding. Impact speed and records are attributed by lastLaunch ('feet' | 'cannon' | 'rocket' | 'throw'), which also drives the honest speed cap.
- v0.4.1 fix: muscle-tone damping now acts only on each point's velocity RELATIVE to the body's mean velocity (td=1-tone*.02 per substep), so free fall is never slowed. The v0.2.1 whole-body damping had made him fall in slow motion (terminal velocity ~6.5 m/s at default tone, ~2.5 m/s at STIFF).
- v0.4.2 rocket: FUEL_MAX 1.6s -> 3.6s (longer burn), thrust ROCKET_A 38 -> 30. STEERING while holding BURN: thumb up/down (steerBaseY vs clientY /90, clamped -1..1, also Arrow keys) blends world-vertical into the thrust and the body noses toward it (velocity-neutral rotation about COM). A burn-only speed clamp (.016/substep ~7.7 m/s) turns the long burn into steerable cruise instead of a launch to orbit. BURN label shows CLIMB / STEER / DIVE live.
- v0.4.3 rocket steering redo: the old version only had a vertical axis (climb/dive, no forward/back) and felt broken. Now the BURN button is a 2D JOYSTICK - thumb offset from the press point (steerBaseX/Y) is the thrust direction in world space (right = toward wall/forward, left = back, up/down = climb/dive, diagonals combine), deadzone .12, full at 70px. An on-screen ring (#stick) at the press point with a draggable dot shows it; arrow keys also steer. setSteer(x,y) is the test hook. Verified: forward travels +x toward wall, back travels -x, up climbs, diagonal does both.
- v0.5.0 CAMERA + FUEL. Camera now pans VERTICALLY (new camBottom; wy2s(y)=groundY-(y-camBottom)*scale) and follows the figure with a bounded zoom (SCMIN=cw/13, SCMAX=cw/5) so he never shrinks to a dot when flying high - verified ~77px tall even at 22 m up, camBottom follows to ~20. Scale/pan from the figure bbox + velocity lookahead; ground re-anchors (camBottom->0) when he's low. drawScene reworked so ground, floor, ruler, hazard stripes, back wall, test wall and grid all scroll with camBottom (grY=wy2s(0), gyc=min(grY,ch), visible y-range for grid/bricks). toWorld and s2w include camBottom. Rocket fuel tank 3.6s -> 6s, plus a FUEL chip toggling tank vs unlimited (store.unlfuel; gauge shows infinity). More air time for maneuvering.
- Deploy location: lives at motbuchanan.github.io/DecisionDeck/bonk/ (folder inside the DecisionDeck repo). All paths relative, so the PWA works there.

v0.6.0 (Oct 9)  -- destroyable walls + arenas
- WALLS are now real objects, not a half-plane. Each wall is {x, material, hp, broken}. Five materials with their own color, shatter threshold (sh) and health: drywall (sh 6, hp 14), plywood (12 / 30), brick (24 / 60), concrete (45 / 120), steel (85 / 240). Thickness TH=0.34.
- Two ways a wall goes down: SHATTER (one hard hit -- impact speed vn >= the material's sh instantly breaks it and spawns debris shards) or CHIP (softer hits below sh accumulate damage; hp drops by (vn-1.5)*1.2 per contact until it breaks). So a cannon shot blows straight through drywall but only dents steel; a foot-run slowly wears a wall down over many bonks.
- Collision is point-vs-slab per wall (front face / back face / interior), so a standing wall still never lets the body tunnel through at any speed, but a BROKEN wall is skipped entirely and the body flies on through the gap -- which is what makes the breakthrough chain work. Impact velocity vn = VX/h (world units/sec); MATS sh values are tuned against it (200 mph cannon ~= vn 89, 25 mph foot ~= vn 11).
- ARENA chip cycles three layouts (saved): SINGLE (one concrete wall, the classic), BREAKTHROUGH (five walls front-to-back in rising hardness drywall->steel; blast as deep as your speed allows -- a max cannon shot chains all five, a medium shot stops dead at the first wall too hard to break), BOUNCE (two close steel walls, a chamber to ricochet inside -- restitution tuning for proper Mario-bounce is a v0.7 job).
- Debris: a broken wall throws rotating shard rects tinted to its material; chip hits still spit the old concrete dust.
- Camera: idle cannon framing now extends the right edge to the back of the deepest wall (Rr=max(WALL_X+.9, worldR-1.8)) so the whole stack is visible while aiming, without zooming the cannon down past the SCMIN floor. In-flight the pan clamp (clMax=worldR-vw) already follows the body through the stack. worldR/CATCH_X are recomputed per arena in buildArena().
- Blood splats now land on whichever wall was actually hit (imp.wx), not a fixed WALL_X.
- Walls reset to full on every launch (fireCannon / burnStart / foot GO) so each attempt starts from a fresh wall.
- Test hooks added: __bonk.walls, wallsUp, arena, setArena(a). New headless suite test/wall.mjs (16 checks): shatter vs chip, no-tunnel through standing walls, breakthrough chaining, per-arena build. Stability sweep still shows 0 launches.

## How it works (for the next chat)
- Kinematic walk/run cycle (function pose) on its feet; on wall contact it hands velocities to a Verlet ragdoll (function sub): 12 points, 11 sticks, 9 min/max distance limits. 8 substeps, 5 iterations. No angle constraints (removed in v0.2.1). START_X/CAN_X are dynamic (applyDist). Cannon fires along store.cAng; rocket leans by store.rAng. Test hook window.__bonk adds dist, cAng, startX, canX, guideOpen.
- Muscle tone = per-point velocity damping (dmp = .9996 - tone*.0078). Dissipative only, so it cannot inject energy.
- Walls are destroyable slab objects (array `walls`, built by buildArena per store.arena); floor and back-catch are half-planes. A standing wall is point-vs-slab so nothing tunnels at 200 mph; a broken wall is skipped so the body passes through. See the v0.6.0 notes for materials/arenas.
- Storage key bonk.v1 (guarded). Test hook window.__bonk (state, tone, bbh, kneeMax/elbowMax, pts). Headless playthrough in test/smoke.mjs (working folder, not shipped).

## Locked decisions
- Dummy, not a person. Yellow/black crash markings. No blood or injury detail.
- Silent until first tap. Sound and shake both toggle.
- Stable filename index.html. Version lives in the head meta "build" tag, drives the badge.

## Open queue (nothing started)
- v0.7 ARENA BUILDER + PRESETS (next): walls are objects now, so let the user place/drag them anywhere with a material each (freeform editor), and save layouts to localStorage. Finish-the-set presets: a proper BOUNCE (raise wall restitution so the body actually ping-pongs Mario-style between the two steel walls instead of just chipping/bouncing off dead), and GAUNTLET (an obstacle course of FINITE-HEIGHT walls with gaps to fly or shoot the body through -- needs per-wall y0/y1 in the slab model and vertical-gap collision, which v0.6 left flat/full-height).
- Horizontal world expansion (bigger play space) pairs with the builder, since start distance / ruler / camera clamps key off worldR/LEFT_X.
- Horizontal world expansion (bigger LEFT_X..WALL_X play space) comes with the wall refactor, since start distance / ruler / camera clamps all key off those bounds.
- More launchers: giant spring, slingshot with aim line, treadmill, wrecking ball, trebuchet
- Things to hit besides the wall: box stack, glass pane, filing cabinet, second wall behind him
- Slow-motion replay of the last hit (Matter.js ragdoll demo eases timescale to 0.05 and back)
- (Maybe) no-hyperextension knees/elbows done RIGHT this time: angular-velocity-damped joints, not a position spring. Only if it stays rock-solid.
- Coworker's name on the dummy's chest, or a custom wall label
- About card + file-size line if it goes on motbuchanan.com
