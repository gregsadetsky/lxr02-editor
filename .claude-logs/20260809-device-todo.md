# lxr device session — things to do later (2026-08-09)

## STATUS: completed 2026-08-09, except:
- ch-0 omni test (waiting for a project that shows global ch 0)
- editor code work: lfo dst file translation (voi-aware), fx section
everything else below is DONE — results live in CHECKS.md

self-contained list, roughly by value. editor = https://lxr02.greg.technology
(full detail lives in CHECKS.md; this is the hands-on runsheet)

## 1. dst file-byte calibration (the big one — cracks the last encoding)
the dst byte in .SND files is neither the menu position nor the midi id
(sent id 40 -> file 135, id 22 -> file 93, both reproduced twice).
- on the DEVICE (knob, not editor): set drum1's LFO dst = off AND
  cl hh's VEL dst = off
- save to a TMP slot
- step BOTH dsts one menu entry forward (coa, fin, wav, pwm, atk, ...)
  and save again. ~8-10 saves. write down the pair of names per save
- mount the card, tell claude: consecutive diffs isolate the two dst
  bytes -> name->byte pairs, two voices per save. mapping counts only
  if it predicts 3+ unseen values, else stays "unexplained"
- bonus: the pwm/click steps reveal file ids of nrpn-backed params

## 2. remaining page walks (screen vs editor, one dense kit both sides)
- snare osc pane: where do nse frq / mix osc nse sit? is pwm shown?
- clp/cym fm pane: confirm f1 f2 g1 g2 wav wav (editor assumes = hats)
- clp/cym + snare amp pane: where does rpt (eg repeat) sit?
- clp/cym + hats modulation pane: really just dst amt vol?
- displays: lfo frq and click frq — scaled or verbatim numbers?
  vol slp / mod slp — verbatim (63 = linear)?

## 3. quick enum leftovers (move editor slider, read screen)
- lfo voi (target voice): does the screen show voice names or numbers?
- snare + clp/cym vel dst steppers: tap through a few entries in the
  editor, confirm the device shows the same names (drums + cl hh
  verified; these two are pattern-assumed)

## 4. global ch 0 mystery (needs a project that shows ch 0)
- editor cc ch 1, then 5, then 10 — if ALL work, 0 = omni (and probably
  only reachable as the never-touched default)

## 5. sd-card odds and ends (one card mount covers all)
- filename test: put GARBAGE.SND and 10-GARBAGE.SND in a project folder —
  which shows up in the device's kit list? does it load?
- round trip: editor-load a factory kit off the card, save unchanged,
  claude diffs the two files (must be byte-identical)
- ch/nte in the file: save the same kit twice changing only mix-page ch
  (3 -> 7), two TMP slots, claude diffs -> locates the byte or proves absence
- "len" on the mix page: what does it do? what range?

## editor build tasks queued behind the answers
- fx section (nrpn 106-117) as a master column, then re-run the a/b diff
- translate dst bytes on .snd save/load once #1 cracks the encoding
  (until then: editor-saved kits carry midi ids in dst bytes — the
  device would misread those if it loads the file from the card)
