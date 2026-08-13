# open device checks

everything verified lives in TODO.md "known truths" + git history. this
file only tracks what's still unresolved (2026-08-12 cleanup: the whole
a/b/c/d board from the calibration sessions is otherwise closed).

## parked / unexplained
- global ch 0: one project once showed ch 0 and accepted ccs on any
  channel; 0 can't be dialed, no project shows it anymore, and a
  firmware update happened in between. if it ever reappears: editor
  cc ch 1, 5, 10 — all three working = 0 is omni
- byte 8 (the cc-1 gap slot) flips 0/1 between device saves sometimes;
  bytes 13/105 (the cc 6/98 slots) also hold *something*. no effect on
  the editor (round-trip preserves all three)

## someday spot-checks (low value)
- fx p1-p4 nrpn order per mode assumed = menu order (delay tim=p1 ...
  fbk=p4): set one param on the device, save, find its byte
- vol slp / mod slp displays assumed verbatim 0-127 (manual: 63=linear)
- snare/clp vel dst stepper names are pattern-derived (drums + hats
  were device-verified): tap through a few entries, compare screens
