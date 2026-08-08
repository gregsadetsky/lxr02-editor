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

### a2. THE big one — full-map a/b test (proves every cc+nrpn in one shot)
- editor: pick a dense kit, e.g. "zubat" (factory · proj00)
- device: save it to an empty TMP slot (no knob touching in between!)
- later: mount the SD card, tell claude → diff device-save vs editor bytes.
  every matching byte = that param's mapping proven end-to-end.
  known exception: dst values >127 can't be sent (7-bit nrpn), will differ
- also grab 20-ZZZZZ.SND / 21-FINGB.SND off TMP while the card is mounted

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
### b2. snare osc page: where do nse frq / mix osc nse sit? is pwm shown?
### b3. clp/cym + hh osc pages: order of wf mod o1/o2, ct mod o1/o2,
       gain mod o1/o2 vs the editor
### b4. hh amp env: atk, ch dec, oh dec, slp — this order?
### b5. snare/clp amp env: where does rpt (eg repeat) appear?
### b6. clp/cym + hh modulation page: really just dst amt vol?
       (they have no mod envelope ccs)
### b7. signed/scaled displays — compare NUMBERS, not just order:
- pan: DONE — device shows -63..+64, editor now matches
- lfo frq, fm frq, click frq: scaled or verbatim?
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

### c2. fm page "mod" (mix/mod select): which is 0?
- editor guesses 0=mix, 1=mod
- kits: "lambo" drum1 = 0, "necro" drum1 = 1 — what does the screen say?

### c3. lfo wav names (values 0-7)
- editor lfo wav slider on drum1: sweep 0→7, write the 8 names
  (kits if preferred: malware=0, autobot=1, mist=2, lambo=3)

### c4. lfo snc names (values 0-11) — sweep, write all 12
### c5. lfo rtg names (values 0-6) — sweep, write all 7
### c6. lfo voi display (1-6) — voice names or numbers?
### c7. mix out routing names (values 0-6)
- sweep, write them (kits: lambo=0, faders=6)

### c8. dst name table (vel dst + lfo dst) — the parameter-table enum
- you saw: off coa fin wav pwm atk dec slp dec slp mod dst amt vol amt
  frq wav mod ... drv p1 p2 p3 p4
- editor lfo dst slider on drum1: sweep 0..30ish, write index→name pairs
  (device shows the name, editor shows the number — perfect pairs)
- known file bytes to cross-check: malware=0 (off?), dropbar=2, kronky=3,
  robowasp=5, shortcir vel dst=22
- 3+ verified pairs = claude encodes names into the editor

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
