# lxr-editor todo

## next
- filter type names VERIFIED on device (2026-08-08): lp hp bp ubp nch pek
  lp2 off (values 0-7, in that order) — now a named stepper
- remaining on-device check: paced send-all of a loaded kit should now
  reproduce it 1:1 on the device (flood fixed) — worth one A/B listen
- NRPN layer from the manual (9.8): filter TYPE + drive, mix/mod select,
  velocity mod, lfo waveform/target/retrigger/sync/offset, transient
  generator (vol/waveform/freq), audio output routing, FX section
  (type/routing/amount/dist type/params/ratio/ringmod/delay). pwm already
  done as the first nrpn control
- browser support messaging done (banner for safari/firefox); web midi
  reality: chrome/edge/opera desktop + chrome android. iOS: never
- decide: git init this folder (private) — 13 playwright tests + the
  reverse-engineered format deserve version control. NOTE: the fingerprint
  learning tooling was removed 2026-08-07 after baking the map; if a
  firmware update rearranges the .snd layout, rewrite it (~40 lines,
  method: two cc-fingerprint passes saved on device, intersect offsets;
  documented in page comments)
- before ever publishing: check license on the embedded hrtl kits (erica
  distributes them free; page currently embeds 32 for the kit browser)
- keyboard shortcuts are invisible since the keys: line was removed — make
  them discoverable: the orange letters on the trigger buttons ARE the keys
  but nothing says so. ideas: tooltip on hover ("press K"), a one-line hint
  near the triggers, and/or flash the button when its key is pressed (the
  .hit flash already fires — that may be enough once someone notices).
  maybe a tiny "?" that reveals all shortcuts
- envelope graphs: draggable attack/decay handles (direct manipulation)
- kit A/B compare (hold to hear previous kit)
- "random kit" button (bounded-random values -> the garbage kit designer
  from the sonicgarbage TODO; kits-as-json bridge)

## ship it (in order)
- currently NOT a vite/react app — one self-contained vanilla index.html,
  zero deps, runs from file:// (deliberate). KEEP that spirit when bundling
- bundle as a vite app: split js into modules (ccmap, snd, midi, ui),
  kits as a json asset, vite build -> still a tiny static site
- deploy with disco to lxr.greg.technology (needs https for web midi ✓).
  remember the usual: favicon + opengraph title/desc/image
- little video demo: screen capture of pick-kit -> drum on keys -> tweak
  sliders -> save .snd. the editor demos itself in ~60s
- open source the repo (public — explicit decision at that moment, after
  the hrtl kit license check above; consider "open source, closed
  contribution" per the main project's policy thinking)
- post it where the lxr-02 people already are: the gearspace lxr-02 thread,
  modwiggler (sonic potions + erica threads), elektronauts lxr-02 thread —
  all three have active multi-year threads (found during research). also:
  erica synths support/forum + sonic potions forum, maybe r/synthesizers.
  angle: "the editor the lxr-02 never had, free, in your browser"

## known truths (hard-won, do not relearn)
- .SND = 8-byte name + 247 param bytes. TWO blocks: cc params VERBATIM at
  offset 7+cc (cc 2..127), nrpn params at offset 136+nrpn. file byte =
  front-panel knob value, for EVERYTHING (proven by predicting factory-kit
  screen values from bytes alone — zubat byte-perfect + jurapark predicted
  100% blind including unseen rows, 2026-08-08. the model is SETTLED)
- the earlier "value-shaper" theory was WRONG: fingerprint mismatches were
  caused by OUR unpaced send-all flooding the lxr's internal serial link
  (mainboard->front runs at midi speed). sends are now paced 2ms apart.
  never bulk-send unpaced
- displays: coarse tune = byte-60 (-60..+67), fine = byte-63 (-63..+64),
  waveforms 0-5 = sin tri saw rec noi pwm (6+ shows phantom "s.." names —
  removed-feature leftovers, not real)
- note names: octave = midi/12, no offset -> C5 = 60, b4 = 59. VERIFIED
  on the device 2026-08-08 (screen shows C5 at our note 60)
- cc number = original-firmware enum index + 1 (cc 6 gap = nrpn data entry)
- cc 120-127 collide with reserved midi mode messages (all-notes-off etc.)
  — fine point-to-point, may confuse daws/routers in between (soundengine
  blog 2026-07)
- voice midi note/channel settings are saved per-kit AND per-project
- note 60 = every voice's "as designed" pitch; other notes transpose when
  voice note = "any"
- localStorage is BANNED on file:// in safari — it kills the whole script
- midi.guide's list has errors at cc 55/57/73/74 — the OFFICIAL MANUAL
  (lxr02-docs/0.lxr02manual.pdf p.35-37) is the authority

## footer (add when shipping)
- contact: hi@greg.technology
- github repo link (once published)
