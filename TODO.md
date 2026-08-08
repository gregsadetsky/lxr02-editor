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
- bundle as a vite app: split js into modules (ccmap, snd, midi, ui),
  kits as a json asset, vite build -> still a tiny static site
- little video demo: screen capture of pick-kit -> drum on keys -> tweak
  sliders -> save .snd. the editor demos itself in ~60s
- post it where the lxr-02 people already are — the two concrete spots:
  https://gearspace.com/threads/erica-synths-lxr-02.1355285/page-13
  https://www.elektronauts.com/t/erica-synths-lxr-02-desktop-digital-drum-synthesizer/156287/61?page=48
  (also possible later: modwiggler, erica/sonic potions forums,
  r/synthesizers). angle: "the editor the lxr-02 never had, free, in
  your browser"

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
- displays: coarse tune = byte-60 (-60..+67), fine AND pan = byte-63
  (-63..+64, both user-verified),
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
- THE FULL MAP IS DEVICE-VERIFIED (zubtest/zubflaaa a-b diffs 2026-08-08):
  every cc + nrpn the editor sends round-trips byte-perfect, 215/215
- running lfos / mod envelopes WRITE INTO their target params on the
  device; saving captures the modulated instant. a-b tests must zero
  lfo amt + env mod amt first (that's what ZUBFLAT.SND is for)
- lfo dst nrpn sends: 40 -> file byte 135, 22 -> 93 (both reproduced
  twice). mechanism unexplained; dst >127 unsendable (7-bit data entry)
- click wav list = EXACTLY 14 entries (snp ofs clk ck2 tik kik rim drp hat
  clp kk2 snr tom sp2), CONFIRMED by per-voice probe kit 2026-08-08: bytes
  9-13 read back clp/kk2/snr/tom/sp2, byte 14 shows BLANK (past the end).
  manual p.32's 15-entry list is lxr-1 leftover
- nrpn map (manual 9.8, verified against kit-corpus value ranges): flt drive
  0-5, mix/mod select 6-8 (v1-3 only), vel>vol on/off 9-14, vel amt 15-20,
  vel dst 21-26, lfo wav 27-32 (0-7), lfo target voice 33-38 (1-6), lfo dst
  39-44, lfo retrig 45-50 (0-6), lfo sync 51-56 (0-11), lfo offset 57-62,
  flt type 63-68, click vol 69-74, click wav 75-80, click frq 81-86, audio
  out routing 87-92 (0-6 seen), pwm 100-105, fx 106-117
- dst enums (vel dst, lfo dst) index the machine's parameter table in page
  order (off coa fin wav pwm atk dec slp ... drv p1-p4) and go PAST 127 in
  real kit files (157 / 226 seen) — nrpn data entry is 7-bit, so values
  >127 are file-only: the editor stores but cannot send them
- "len" (mix page), and how ch/nte are byte-encoded in the file: unexplained

## open device checks
- click wav list: device shows 14 entries (snp ofs clk ck2 tik kik rim drp
  hat clp kk2 snr tom sp2); manual/lxr-1 list had 15 (tk2 between hat and
  clp). spin the wav knob through a full cycle and count — if 15, tell the
  editor which one it's missing and where
- fm page "mod" (nrpn 6-8): editor guesses 0=mix 1=mod — confirm on screen
- global midi channel: device "ch 0" accepted ccs on ch 10 AND ch 1 —
  consistent with 0 = omni/all. definitive test: set global ch to 5,
  editor cc ch 5 must work and cc ch 10 must NOT
- dst name table: to show names instead of numbers in the editor, read the
  device dst name for 3+ known file bytes (rev-eng rule: no table without
  3 reproduced observations)
