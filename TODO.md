# lxr-editor todo

live at https://lxr02.greg.technology · repo public · the few remaining
device unknowns live in CHECKS.md

## next (ideas, not commitments)
- keyboard shortcuts are invisible: the orange letters on the trigger
  buttons ARE the keys but nothing says so. tooltip ("press K"), a
  one-line hint, or a tiny "?" revealing all shortcuts
- envelope graphs: draggable attack/decay handles (direct manipulation)
- kit A/B compare (hold to hear previous kit)
- "random kit" button (bounded-random values -> the garbage kit designer
  from the sonicgarbage TODO)

## ship it
- little video demo: pick-kit -> drum on keys -> tweak sliders -> save
  .snd. the editor demos itself in ~60s
- post it where the lxr-02 people already are — the two concrete spots:
  https://gearspace.com/threads/erica-synths-lxr-02.1355285/page-13
  https://www.elektronauts.com/t/erica-synths-lxr-02-desktop-digital-drum-synthesizer/156287/61?page=48
  (also possible later: modwiggler, erica/sonic potions forums,
  r/synthesizers). angle: "the editor the lxr-02 never had, free, in
  your browser"
- maybe submit corrections to midi.guide (cc 55/57/73/74 errors + all
  the device-verified enum tables)

## known truths (hard-won, do not relearn) — fw v1.71
- .SND = 8-byte name + 247 param bytes. cc params VERBATIM at offset
  7+cc (cc 2..127), nrpn params at 136+nrpn. file byte = front-panel
  knob value (proven by blind-predicting factory-kit screens, plus
  zubtest/zubflaaa a-b diffs: 215/215 params round-trip byte-perfect)
- EXCEPTION: dst bytes (vel dst nrpn 21-26, lfo dst 39-44) store an
  index into ONE concatenated per-voice destination table — 0=off, then
  each voice's menu params at bases v1=1 v2=40 v3=78 sn=116 cp=153
  hats=190 (sizes 38/38/38/37/36/36, tiles exactly; measured via the
  NITK calibration save series 2026-08-09). lfo dst's voice block
  follows its VOI target. LIVE dst sends are different again: global
  param ids (= cc-1); nrpn-backed dests have no sendable id (file-only)
- running lfos / mod envelopes WRITE INTO their target params on the
  device; saving captures the modulated instant. a-b tests must zero
  lfo amt + env mod amt first (ZUBFLAT.SND exists for this)
- never bulk-send unpaced: the lxr's internal mainboard->front serial
  runs at midi speed; floods corrupt state (the old "value-shaper"
  theory was this bug). editor paces 2ms/message
- displays: coarse tune, fm frq, f1/f2 = byte-60 (-60..+67); fine and
  pan = byte-63 (-63..+64); everything else verbatim (lfo frq + click
  frq confirmed 0-127)
- device-verified enums: filter lp hp bp ubp nch pek lp2 off · click
  wav = EXACTLY 14: snp ofs clk ck2 tik kik rim drp hat clp kk2 snr tom
  sp2 (manual's 15-entry list is lxr-1 leftover; out-of-range = blank
  screen) · lfo wav sin tri sup sdn sqr rnd xup xdn · lfo snc off 4/1
  2/1 1/1 1/2 1/3 1/4 1/6 1/8 12 16 32 · lfo rtg off v1-v6 · voi shows
  numbers · out routing st1 st2 l1 r1 l2 r2 fx · fm mode 0=FM 1=Mix
- fx block (nrpn 106-117) is DYNAMIC per type on the device: typ (off
  drv rng cmp del), out (st1..r2), d/w 0-100, then per type: drv typ
  (tub fld clp, 109) + drv col ton vol; rng wav (sin..pwm, 115) + frq;
  cmp rat (1:1..8:1, 114) + atk dec tre gai; del typ (del pp, 117) +
  tim rng ton fbk. p1-p4 (110-113) are the reused param slots
- hats are TWO voices sharing one engine: pwm on cl hh only, decays d1
  (cc61) + d2 (cc62); pane orders all device-walked (see git history)
- note names: octave = midi/12 -> C5 = 60. cc = firmware enum + 1
  (cc 6 gap = data entry). cc 120-127 collide with midi mode messages —
  fine point-to-point
- nrpn map (manual 9.8, verified): flt drive 0-5, fm mode 6-8 (v1-3),
  vel>vol 9-14, vel amt 15-20, vel dst 21-26, lfo wav 27-32, lfo voi
  33-38, lfo dst 39-44, lfo rtg 45-50, lfo snc 51-56, lfo ofs 57-62,
  flt type 63-68, click vol 69-74, click wav 75-80, click frq 81-86,
  out 87-92, pwm 100-105, fx 106-117
- global midi channel: per project, filters to exactly that channel
  (the ch-0 sighting is parked in CHECKS.md)
- voice ch/nte are NOT in kit files (proven by a-b saves) — they're
  project data. "len" on the mix page = sequencer track length (1-64),
  also not kit data. sd card: the device ONLY lists NN- prefixed .SND
  files
- web midi: first send() OPENS the port and chrome fires statechange —
  ui must survive that (regression-tested with a fake midi stack).
  localStorage is BANNED on file:// in safari
- midi.guide has errors at cc 55/57/73/74 — the official manual
  (lxr02-docs/0.lxr02manual.pdf p.35-38) is the authority, except where
  the DEVICE disagrees (click wav list, mix/mod naming, srt/drv names)
- if a firmware update rearranges the .snd layout: the fingerprint
  tooling was removed after baking the map — rewrite is ~40 lines (two
  cc-fingerprint passes saved on device, intersect offsets)
