# lxr-editor todo

live at https://lxr02.greg.technology · repo public · device checks and
next probes live in CHECKS.md · session log in .claude-logs/

## next
- fx section (nrpn 106-117: type/routing/amount/dist type/p1-p4/ratio/
  ringmod wav/delay type) as a master-column section — the "fx" out
  routing proves the bus is real. then re-run the a2 a-b diff on it
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

## known truths (hard-won, do not relearn)
- .SND = 8-byte name + 247 param bytes. TWO blocks: cc params VERBATIM at
  offset 7+cc (cc 2..127), nrpn params at offset 136+nrpn. file byte =
  front-panel knob value, for EVERYTHING (proven by predicting factory-kit
  screen values from bytes alone — zubat byte-perfect + jurapark predicted
  100% blind including unseen rows, 2026-08-08. the model is SETTLED)
- THE FULL MAP IS DEVICE-VERIFIED (zubtest/zubflaaa a-b diffs 2026-08-08):
  every cc + nrpn the editor sends round-trips byte-perfect, 215/215
- the earlier "value-shaper" theory was WRONG: fingerprint mismatches were
  caused by OUR unpaced send-all flooding the lxr's internal serial link
  (mainboard->front runs at midi speed). sends are now paced 2ms apart.
  never bulk-send unpaced
- running lfos / mod envelopes WRITE INTO their target params on the
  device; saving captures the modulated instant. a-b tests must zero
  lfo amt + env mod amt first (that's what ZUBFLAT.SND is for)
- displays: coarse tune = byte-60 (-60..+67), fine AND pan = byte-63
  (-63..+64, both user-verified),
  waveforms 0-5 = sin tri saw rec noi pwm (6+ shows phantom "s.." names —
  removed-feature leftovers, not real)
- device-verified enums (all read off the screen 2026-08-08):
  filter types lp hp bp ubp nch pek lp2 off · click wav = EXACTLY 14
  entries snp ofs clk ck2 tik kik rim drp hat clp kk2 snr tom sp2 (manual
  p.32's 15-entry list is lxr-1 leftover; out-of-range bytes show BLANK) ·
  lfo wav sin tri sup sdn sqr rnd xup xdn · lfo snc off 4/1 2/1 1/1 1/2
  1/3 1/4 1/6 1/8 12 16 32 · lfo rtg off v1-v6 · out routing st1 st2 l1
  r1 l2 r2 fx · fm mode 0=FM 1=Mix (manual's "mix/mod" wording misleads)
- dst menus (lfo dst, vel dst) = the internal parameter table = the cc
  map shifted by one: menu index n = (cc n+1)'s param, holes show "off"
  (verified by 28-value sweep). file byte != menu index though: sent 40 ->
  file 135, 22 -> 93 (reproduced twice) — file encoding unexplained, and
  >127 is unsendable (7-bit data entry)
- note names: octave = midi/12, no offset -> C5 = 60, b4 = 59. VERIFIED
  on the device (screen shows C5 at our note 60)
- cc number = original-firmware enum index + 1 (cc 6 gap = nrpn data entry)
- cc 120-127 collide with reserved midi mode messages (all-notes-off etc.)
  — fine point-to-point, may confuse daws/routers in between (soundengine
  blog 2026-07)
- nrpn map (manual 9.8, verified): flt drive 0-5, fm mode 6-8 (v1-3 only),
  vel>vol on/off 9-14, vel amt 15-20, vel dst 21-26, lfo wav 27-32, lfo
  target voice 33-38, lfo dst 39-44, lfo retrig 45-50, lfo sync 51-56,
  lfo offset 57-62, flt type 63-68, click vol 69-74, click wav 75-80,
  click frq 81-86, out routing 87-92, pwm 100-105, fx 106-117
- global midi channel is stored per project; a nonzero value filters to
  exactly that channel; some projects show 0 (not dialable) — 0=omni
  suspected, unproven (test in CHECKS.md)
- voice midi note/channel settings are saved per-kit AND per-project;
  note 60 = every voice's "as designed" pitch, other notes transpose
  when voice note = "any"
- web midi: first send() OPENS the port and chrome fires statechange —
  ui must survive that (regression-tested with a fake midi stack)
- localStorage is BANNED on file:// in safari — it kills the whole script
- midi.guide's list has errors at cc 55/57/73/74 — the OFFICIAL MANUAL
  (lxr02-docs/0.lxr02manual.pdf p.35-37) is the authority
- "len" (mix page), ch/nte file encoding, dst file encoding, gap-slot
  bytes 8/13/105: unexplained (probes queued in CHECKS.md)
- if a firmware update ever rearranges the .snd layout: the fingerprint
  tooling was removed 2026-08-07 after baking the map — rewrite is ~40
  lines (two cc-fingerprint passes saved on device, intersect offsets)
