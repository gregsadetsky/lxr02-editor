# device checks — work top to bottom, cross off as you go

everything open between the editor and the real lxr-02, as concrete steps.
"editor" = https://lxr02.greg.technology with the device picked as midi out.
most enum checks are just: move a slider in the editor, read the device
screen — no file juggling needed. file checks need the SD card afterwards.

## a. protocol sanity

### a1. global midi channel: DONE (mostly)
- CONFIRMED 2026-08-08: global ch filters to that one channel — device set
  to 6, editor cc ch 6 works, other channels don't
- editor default cc ch = 1, matches
- leftover oddity, still open: some projects SHOW global ch 0 (seen again
  2026-08-08 after loading another project) and with 0 displayed, ch-10
  ccs worked. but the knob can't DIAL to 0 in the project where it was
  set to 6. observations so far: (1) global ch is stored per project,
  (2) 0 exists as a stored value, (3) a nonzero value filters to exactly
  that channel. whether 0 = omni: not proven yet
- next test, in a project showing 0: send ccs from the editor on ch 1,
  then 5, then 10 — if ALL move the device, 0 behaves as omni (and is
  probably only reachable as the never-touched default: once you dial
  the knob you land in 1-16 with no way back to 0)

### a2. full-map a/b test — RESULT (zubtest diff, 2026-08-08)
- 206 of 215 sent params came back BYTE-PERFECT. the cc+nrpn map is
  verified end-to-end for everything the editor sends.
- the 9 mismatches cluster:
  - flt frq v1-v4 (cc 38-41), vol dec sn (cc 57), flt drive v1+sn
    (nrpn 0, 3): hypothesis = zubat's lfos (all 6 running) and mod envs
    write INTO their target params and save captures the modulated
    instant. not proven yet -> a2b below decides it
  - lfo dst (nrpn 39-44): sent 40 saved 135, sent 22 saved 93, unsent
    v1 saved 10. unexplained. (ties into the c8 dst-table sweep)
- unmapped-but-differing bytes, all expected: name, the cc 1/6/98 gap
  slots (offsets 8/13/105 — hold something, unexplained), unsendable
  >127 dst bytes, and the FX block (nrpn 106-117) which the editor has
  NO controls for yet

### a2b. modulation-writeback probe — CONFIRMED (zubflaaa, 2026-08-08)
- with lfo amt + env mod amt zeroed, ALL 7 previous suspects round-trip
  byte-perfect. running lfos/mod envs write into their target params and
  the device saves the modulated instant. THE MAP IS FULLY VERIFIED:
  215/215 addressable params byte-perfect
- bonus reproducible pairs for the dst mystery: lfo dst nrpn send 40 ->
  file 135 (twice), 22 -> 93 (twice), unsent slots kept 10/0/0/0. still
  unexplained, but stable — c8 sweep will crack it

### a2c. fx section — DONE (built + device-enumerated 2026-08-09)
- the device fx pane is DYNAMIC per type. common: typ (off drv rng cmp
  del), out (st1 st2 l1 r1 l2 r2), d/w (0-100). per type:
  drv: typ (tub fld clp, nrpn 109) + drv col ton vol (p1-p4)
  rng: wav (sin..pwm, nrpn 115) + frq (p1?)
  cmp: rat (1:1 2:1 3:1 4:1 6:1 8:1, nrpn 114) + atk dec tre gai (p1-p4)
  del: typ (del pp, nrpn 117) + tim rng ton fbk (p1-p4)
- editor: master column fx section with named steppers for all enums;
  p1-p4 stay generic sliders (their meaning follows the type)
- assumption to spot-check someday: p1-p4 nrpn order matches each mode's
  menu order (e.g. delay tim=p1 ... fbk=p4)

### a3. DONE (2026-08-09): the NN- prefix is MANDATORY
- unprefixed GARBAGE.SND invisible in the kit list; 10-GARBAGE.SND shows
  as [10]. editor now saves NN-NAME.SND with a slot input (0-63)

### a4. DONE (2026-08-09): round trip is BYTE-PERFECT
- zubat through the real editor (headless load + save): 0 param bytes
  changed; only the name's case differs (editor uppercases)

## b. page walks — load one kit both sides, page through, compare numbers

use "zubat" or any dense kit. editor column vs device screens, top to
bottom per voice. the screen is truth; note EVERY mismatch (order, name,
number).

### b1. drum1: all 8 pages vs the editor column (baseline walk)
- 2026-08-09 partial result: mix page is vol pan srt drv — manual's
  "distortion" (cc 103-108) displays as DRV, "decimation" (cc 109-114)
  displays as SRT, and srt comes BEFORE drv. editor fixed
### b2. snare osc page: DONE (2026-08-09) — coa fin NOI MIX wav pwm,
       device names noi/mix; editor matches
### b3. hats: DONE (2026-08-09) — clp/cym still to confirm
- hats are TWO voices on the device: editor now has separate cl hh and
  op hh lanes. osc pane = coa fin wav; pwm on CL HH ONLY. decays are
  named d1 (cl, cc61) and d2 (op, cc62)
- hats fm pane = f1 f2 g1 g2 wav wav (f1/f2 = ct mods, -60..+67;
  g1/g2 = gain mods 0-127; wavs = sin tri saw rec noi pwm). the o1/o2
  mod params were never on the osc pane — editor moved them to fm
- editor keeps the SHARED engine params on the cl hh lane (op hh lane =
  d2 only) — the device shows them on both hats but they're one cc
- clp/cym: editor assumes the same fm pane (f1 f2 g1 g2 wav wav) —
  CONFIRM on the device, plus where eg rpt sits on its amp pane
### b4. hh amp env: atk, ch dec, oh dec, slp — this order?
### b5. snare/clp amp env: where does rpt (eg repeat) appear?
### b6. clp/cym + hh modulation page: DONE — dst amt vol confirmed via
       both voices' dst-menu enumerations (2026-08-09)
### b7. signed/scaled displays — compare NUMBERS, not just order:
- pan: DONE — device shows -63..+64, editor matches
- fm frq: DONE — -60..+67 like coarse tune (2026-08-09), editor matches
- lfo frq, click frq: scaled or verbatim? still unchecked
- vol slp / mod slp: verbatim? (63 = linear per the manual)
- anything else where device shows negative or unit-ish numbers

## c. enums — read names off the screen while sweeping editor sliders

### c1. click wav: DONE — 14 entries CONFIRMED (probe 2026-08-08)
- CLKTEST.SND probe: bytes 9-13 read clp kk2 snr tom sp2 on the device,
  exactly the 14-list. byte 14 (hh) showed a BLANK wav = past the end.
- so: snp ofs clk ck2 tik kik rim drp hat clp kk2 snr tom sp2 is the true
  lxr-02 list; the manual's 15-entry list (tk2, ki2, sna names) is lxr-1
  leftover. editor already correct. out-of-range bytes display blank on
  the device (no clamp, no wrap)
- probe 2 (2026-08-08): mid-list 4-8 read tik kik rim drp hat, and the
  HIHAT voice showed sp2 at byte 13 — all voices share the same list,
  every index 0-13 now covered. this check is CLOSED

### c2. fm page "mod" — DONE (device check 2026-08-08)
- 0 = "FM", 1 = "Mix". the editor's mix/mod guess was wrong both ways;
  stepper now shows fm/mix

### c3. lfo wav names — DONE (sweep 2026-08-08)
- sin tri sup sdn sqr rnd xup xdn. now a named stepper in the editor.
  not documented in the manual at all

### c4. lfo snc names — DONE (sweep 2026-08-08)
- off 4/1 2/1 1/1 1/2 1/3 1/4 1/6 1/8 12 16 32. named stepper in editor.
- confirmed: the screen literally shows "12 16 32" (almost certainly
  meaning 1/12 1/16 1/32). editor mirrors the screen exactly
### c5. lfo rtg names — DONE (sweep 2026-08-08)
- off v1 v2 v3 v4 v5 v6 (retrigger on that voice's hit). named stepper
### c6. lfo voi display (1-6) — voice names or numbers?
### c7. mix out routing names — DONE (sweep 2026-08-08)
- st1 st2 l1 r1 l2 r2 fx. named stepper in editor. (so lambo routes
  drum1 to st1, faders to the fx bus)

### c8b. vel dst — SOLVED (2026-08-09)
- the device MENU is per-voice (the voice's own params in pane order;
  cl hh enumerated complete) but the sent VALUE is a GLOBAL param id,
  same table as lfo dst: sending 18 made cl hh's dst read coa (= cc19's
  param), 19 read fin (= cc20). click frq / filter frq confirmed
  separate params (set to different values on the device)
- editor: vel dst is now a STEPPER cycling the voice's own cc-backed
  destinations by global id. nrpn-backed dests (pwm, click, flt typ/drv,
  lfo snc/wav/rtg/ofs, fx p1-p4) have ids past 127: unreachable over
  7-bit nrpn, device-knob only
- FILE byte encoding CRACKED (calibration saves 0-9NITK, 2026-08-09):
  one concatenated table — 0 = off, then each voice's menu params:
  bases v1=1 v2=39 v3=77 sn=115 cp=152 hats=189 (drums 38 dests, snare
  37, hats 36). for LFO dst the voice is whatever VOI targets (init
  kits have voi=v1 — that's why untouched lfo dsts read tiny numbers).
  retro-explains zubat's 135 = snare flt frq (snare local pos 20, which
  also implies nse/mix sit on snare's osc pane and rpt in its amp menu)
- editor now writes/reads the table index in .snd dst bytes and
  live-sends the global id — vel dst round-trips device-correct
- clp/cym dst menu enumerated COMPLETE (2026-08-09): 36 entries, no
  missing slot — the "37 slots" was an arithmetic slip. block sizes
  38/38/38/37/36/36 tile with no gaps; bases refined to 1/40/78/116/
  153/190 (every measured fin = base+1). cp amp order = atk dec RPT slp
  (rpt between dec and slp; snare assumed same, unverified)
- REMAINING: lfo dst file bytes untranslated (voi-dependent; live sends
  correct); byte 8 flips 0/1 between saves sometimes, unexplained

### c8. lfo dst name table — CRACKED (28-value sweep, 2026-08-08)
- dst menu index n = internal param enum n = (cc n+1)'s parameter for the
  whole cc range. verified 28/28 consecutive readings incl. the cc6 hole
  showing "off". the editor now displays resolved names on dst sliders
  ("40 sn flt frq"); indices past the cc range remain numbers (unknown)
- STILL OPEN: what the dst FILE bytes mean. sent 40 -> saved 135, 22 ->
  93 (reproduced twice), so file byte != menu index. next card session:
  leave drum1 lfo dst on a known small value (say 27), save on device,
  mount card -> find where 27 landed in the file. that locates the true
  dst file offset (the 136+39..44 slots may belong to something else)
- optional later: continue the sweep past 126 with the DEVICE knob to
  name the nrpn-side tail (fx params etc. live up there, files reach 226)

## d. leftovers / unexplained

### d1. DONE (2026-08-09): "len" = sequencer track length, 1-64 steps
- manual: "the length of the sequencer track". set to 3 -> plays 3 steps
  and loops. it's sequencer data (lives with patterns, not kit sound) —
  which is why it's absent from the cc/nrpn tables
### d2. DONE (2026-08-09): ch is NOT in the kit file
- ch-3 vs ch-7 saves byte-identical — voice channel (and presumably nte)
  live in project data (TMP.PAT next door is the likely home), not kits
### d3. dst FILE-byte calibration (the third-numbering mystery)
- what we know: the dst byte in .SND files is neither the menu position
  nor the sent global id — zubat sends put id 40 into drum2's lfo dst
  and the device SAVED 135; id 22 into clp's saved 93 (both reproduced
  twice). applies to (at least) lfo dst; vel dst presumably same
- THE TEST (device + one card mount, ~10 saves):
  1. pick drum1. set its LFO dst on the DEVICE KNOB to a known entry
     (start: off). ALSO set cl hh's VEL dst to a known entry (off)
  2. save to a TMP slot. name the save after the settings (eg OF-OF)
  3. repeat, stepping both dsts one menu entry per save: coa/coa,
     fin/fin, wav/wav, pwm/pwm ... ~8-10 saves, WRITE DOWN the pair of
     names for each save
  4. mount the card, tell claude: each consecutive diff isolates the two
     dst bytes -> name->file-byte pairs for two voices at once. with
     8+ pairs either the mapping reproduces (rule: must predict 3+
     unseen values) or it stays honestly unexplained
- bonus from the same saves: pwm/click entries give the file ids of
  NRPN-backed params (>127 territory), mapping the table's tail
### d4. dst values past 127 over midi: probably impossible (7-bit data
  entry) — confirmed unreachable unless a 14-bit CC6+CC38 path exists

## already verified — do not re-check
- cc block verbatim at 7+cc, nrpn at 136+n (zubat/jurapark blind predict)
- coarse = byte-60, fine = byte-63; note names C5=60
- filter types: lp hp bp ubp nch pek lp2 off
- waveforms 0-5: sin tri saw rec noi pwm
- pacing: 2ms gaps, no floods
