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

### a2c. editor fx section (found gap)
- fx type/routing/amount/dist type/p1-p4/ratio/ringmod wav/delay type =
  nrpn 106-117, per-kit. add as a master-column section, then re-run a2

### a3. save filename: does the device need the "NN-" prefix?
- editor: save .snd (GARBAGE.SND), copy to a project folder on the SD
  as-is, AND a second copy named like "10-GARBAGE.SND"
- device: which of the two shows up in the kit list? does it load?

### a4. round trip (card only, no device)
- editor: load .snd → a factory kit straight off the SD card, then
  immediately save .snd without touching anything
- tell claude → byte-diff the two files. must be identical (name padding
  aside). anything else = the editor corrupts on round-trip

## b. page walks — load one kit both sides, page through, compare numbers

use "zubat" or any dense kit. editor column vs device screens, top to
bottom per voice. the screen is truth; note EVERY mismatch (order, name,
number).

### b1. drum1: all 8 pages vs the editor column (baseline walk)
- 2026-08-09 partial result: mix page is vol pan srt drv — manual's
  "distortion" (cc 103-108) displays as DRV, "decimation" (cc 109-114)
  displays as SRT, and srt comes BEFORE drv. editor fixed
### b2. snare osc page: where do nse frq / mix osc nse sit? is pwm shown?
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
### b6. clp/cym + hh modulation page: really just dst amt vol?
       (they have no mod envelope ccs)
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
- still unexplained: the FILE byte encoding for dst (135/93/157/226 in
  real kits) is a third numbering — neither menu position nor global id

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

### d1. mix page "len": what does it do? what range? (not in any midi table)
### d2. are ch/nte stored in the kit file?
- device: save the same kit twice, changing only mix-page ch (say 3 → 7)
  between saves, two different TMP slots
- tell claude → diff locates the byte, or proves they're not in the file
### d3. dst values past 127: file-only for now. is there any way to dial
  them over midi? (low priority — knob-on-device works regardless)

## already verified — do not re-check
- cc block verbatim at 7+cc, nrpn at 136+n (zubat/jurapark blind predict)
- coarse = byte-60, fine = byte-63; note names C5=60
- filter types: lp hp bp ubp nch pek lp2 off
- waveforms 0-5: sin tri saw rec noi pwm
- pacing: 2ms gaps, no floods
