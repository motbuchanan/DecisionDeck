# BONK · Impact Test Bay · ROADMAP

Current version: v0.3.0 (Oct 9 2026)
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

## How it works (for the next chat)
- Kinematic walk/run cycle (function pose) on its feet; on wall contact it hands velocities to a Verlet ragdoll (function sub): 12 points, 11 sticks, 9 min/max distance limits. 8 substeps, 5 iterations. No angle constraints (removed in v0.2.1). START_X/CAN_X are dynamic (applyDist). Cannon fires along store.cAng; rocket leans by store.rAng. Test hook window.__bonk adds dist, cAng, startX, canX, guideOpen.
- Muscle tone = per-point velocity damping (dmp = .9996 - tone*.0078). Dissipative only, so it cannot inject energy.
- Wall/floor/back-wall are half-planes, so nothing tunnels at 200 mph.
- Storage key bonk.v1 (guarded). Test hook window.__bonk (state, tone, bbh, kneeMax/elbowMax, pts). Headless playthrough in test/smoke.mjs (working folder, not shipped).

## Locked decisions
- Dummy, not a person. Yellow/black crash markings. No blood or injury detail.
- Silent until first tap. Sound and shake both toggle.
- Stable filename index.html. Version lives in the head meta "build" tag, drives the badge.

## Open queue (nothing started)
- More launchers: giant spring, slingshot with aim line, treadmill, wrecking ball, trebuchet
- Things to hit besides the wall: box stack, glass pane, filing cabinet, second wall behind him
- Slow-motion replay of the last hit (Matter.js ragdoll demo eases timescale to 0.05 and back)
- (Maybe) no-hyperextension knees/elbows done RIGHT this time: angular-velocity-damped joints, not a position spring. Only if it stays rock-solid.
- Coworker's name on the dummy's chest, or a custom wall label
- About card + file-size line if it goes on motbuchanan.com
