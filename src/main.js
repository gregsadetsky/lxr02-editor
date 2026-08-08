
// ---- the cc map (midi.guide lxr-02, ~117 ccs) -------------------------------
const CCS = [
[2,"V1","osc","OSC1 WF"],[3,"V2","osc","OSC1 WF"],[4,"V3","osc","OSC1 WF"],
[5,"SN","osc","OSC1 WF"],[7,"CP","osc","OSC1 WF"],[8,"HH","osc","OSC1 WF"],
[9,"V1","osc","OSC1 CT"],[10,"V1","osc","OSC1 FT"],[11,"V2","osc","OSC1 CT"],
[12,"V2","osc","OSC1 FT"],[13,"V3","osc","OSC1 CT"],[14,"V3","osc","OSC1 FT"],
[15,"SN","osc","OSC1 CT"],[16,"SN","osc","OSC1 FT"],[17,"CP","osc","OSC1 CT"],
[18,"CP","osc","OSC1 FT"],[19,"HH","osc","OSC1 CT"],[20,"HH","osc","OSC1 FT"],
[21,"V1","fm","WF MOD"],[22,"V2","fm","WF MOD"],[23,"V3","fm","WF MOD"],
[24,"CP","osc","WF MOD O1"],[25,"CP","osc","WF MOD O2"],[26,"HH","osc","WF MOD O1"],
[27,"HH","osc","WF MOD O2"],[28,"SN","osc","NSE FRQ"],[29,"SN","osc","MIX OSC NSE"],
[30,"CP","osc","CT MOD O1"],[31,"CP","osc","CT MOD O2"],[32,"CP","osc","GAIN MOD O1"],
[33,"CP","osc","GAIN MOD O2"],[34,"HH","osc","CT MOD O1"],[35,"HH","osc","CT MOD O2"],
[36,"HH","osc","GAIN MOD O1"],[37,"HH","osc","GAIN MOD O2"],
[38,"V1","filter","FLT FRQ"],[39,"V2","filter","FLT FRQ"],[40,"V3","filter","FLT FRQ"],
[41,"SN","filter","FLT FRQ"],[42,"CP","filter","FLT FRQ"],[43,"HH","filter","FLT FRQ"],
[44,"V1","filter","FLT RES"],[45,"V2","filter","FLT RES"],[46,"V3","filter","FLT RES"],
[47,"SN","filter","FLT RES"],[48,"CP","filter","FLT RES"],[49,"HH","filter","FLT RES"],
[50,"V1","amp env","VOL ATK"],[51,"V1","amp env","VOL DEC"],[52,"V2","amp env","VOL ATK"],
[53,"V2","amp env","VOL DEC"],[54,"V3","amp env","VOL ATK"],[55,"V3","amp env","VOL DEC"],
[56,"SN","amp env","VOL ATK"],[57,"SN","amp env","VOL DEC"],[58,"CP","amp env","VOL ATK"],
[59,"CP","amp env","VOL DEC"],[60,"HH","amp env","VOL ATK"],[61,"HH","amp env","CH DEC"],
[62,"HH","amp env","OH DEC"],[63,"V1","amp env","VOL SLP"],[64,"V2","amp env","VOL SLP"],
[65,"V3","amp env","VOL SLP"],[66,"SN","amp env","VOL SLP"],[67,"CP","amp env","VOL SLP"],
[68,"HH","amp env","VOL SLP"],[69,"SN","amp env","EG RPT"],[70,"CP","amp env","EG RPT"],
[71,"V1","modulation","MOD DEC"],[72,"V2","modulation","MOD DEC"],
[73,"V3","modulation","MOD DEC"],[74,"SN","modulation","MOD DEC"],
[75,"V1","modulation","ENV MOD AMT"],[76,"V2","modulation","ENV MOD AMT"],
[77,"V3","modulation","ENV MOD AMT"],[78,"SN","modulation","ENV MOD AMT"],
[79,"V1","modulation","MOD SLP"],[80,"V2","modulation","MOD SLP"],[81,"V3","modulation","MOD SLP"],
[82,"SN","modulation","MOD SLP"],
[83,"V1","fm","FM AMT"],[84,"V1","fm","FM FRQ"],[85,"V2","fm","FM AMT"],
[86,"V2","fm","FM FRQ"],[87,"V3","fm","FM AMT"],[88,"V3","fm","FM FRQ"],
[89,"V1","mix","VOL"],[90,"V2","mix","VOL"],[91,"V3","mix","VOL"],[92,"SN","mix","VOL"],
[93,"CP","mix","VOL"],[94,"HH","mix","VOL"],[95,"V1","mix","PAN"],[96,"V2","mix","PAN"],
[97,"V3","mix","PAN"],[100,"SN","mix","PAN"],[101,"CP","mix","PAN"],[102,"HH","mix","PAN"],
[103,"V1","mix","DIST"],[104,"V2","mix","DIST"],[105,"V3","mix","DIST"],
[106,"SN","mix","DIST"],[107,"CP","mix","DIST"],[108,"HH","mix","DIST"],
[109,"V1","mix","DCM"],[110,"V2","mix","DCM"],[111,"V3","mix","DCM"],
[112,"SN","mix","DCM"],[113,"CP","mix","DCM"],[114,"HH","mix","DCM"],
[115,"ALL","mix","ALL DCM"],
[116,"V1","lfo","LFO FRQ"],[117,"V2","lfo","LFO FRQ"],[118,"V3","lfo","LFO FRQ"],
[119,"SN","lfo","LFO FRQ"],[120,"CP","lfo","LFO FRQ"],[121,"HH","lfo","LFO FRQ"],
[122,"V1","lfo","LFO AMT"],[123,"V2","lfo","LFO AMT"],[124,"V3","lfo","LFO AMT"],
[125,"SN","lfo","LFO AMT"],[126,"CP","lfo","LFO AMT"],[127,"HH","lfo","LFO AMT"],
];
// device display scales: coarse tune reads -60..+67, fine and pan -63..+64
const disp = (name, v) =>
  name.endsWith(" CT") ? v - 60
  : name.endsWith(" FT") || name === "PAN" ? v - 63 : v;
const WAVEFORMS = ["sin","tri","saw","rec","noi","pwm"];
// (cc values 6+ make the device DISPLAY "s0.." sample names, but the knob
// can't reach them — firmware leftovers from the original LXR's sample
// oscillator. not real; not offered.)
const VIDX = { V1: 0, V2: 1, V3: 2, SN: 3, CP: 4, HH: 5 };
// transient ROM list as read off the DEVICE screen (manual p.32 lists 15
// entries with different short names — the 02 firmware shows these 14)
const TRANSIENTS = ["snp","ofs","clk","ck2","tik","kik","rim","drp","hat",
                    "clp","kk2","snr","tom","sp2"];
const FILTER_TYPES = ["lp","hp","bp","ubp","nch","pek","lp2","off"];  // device order
// lfo waveforms, read off the device by slider sweep 2026-08-08 (the
// manual doesn't list them anywhere)
const LFO_WAVES = ["sin","tri","sup","sdn","sqr","rnd","xup","xdn"];
// lfo sync: off = free-running, then clock divisions (device sweep)
const LFO_SYNCS = ["off","4/1","2/1","1/1","1/2","1/3","1/4","1/6","1/8",
                   "12","16","32"];
// lfo retrigger: off, or restart on any voice's trigger (device sweep)
const LFO_RTGS = ["off","v1","v2","v3","v4","v5","v6"];
// dst menus (lfo/velocity) walk the internal parameter table, which is
// the cc map shifted by one: menu index n = (cc n+1)'s param. verified
// 2026-08-08 by 28 consecutive device-screen readings (incl. the cc6
// hole showing "off"). indices past the cc range: names unknown yet
const DST_NAMES = { 0: "off", 5: "off", 97: "off", 98: "off" };  // holes:
// enum 5/97/98 = the cc 6/98/99 gaps (data entry), device displays off
for (const [cc, v, _s, name] of CCS)
  DST_NAMES[cc - 1] = v.toLowerCase() + " " + name.toLowerCase();
const VOICES = ["V1","V2","V3","SN","CP","HH","ALL"];
const VOICE_LABEL = {V1:"drum1", V2:"drum2", V3:"drum3",
                     SN:"snare", CP:"clp/cym", HH:"cl hh · op hh", ALL:"master"};
// triggers: [label, key, note, channel] — voices live on ch 1..7 (mixer
// page setup), note is free ("any"); drum1 ch1 is chromatic-friendly
const TRIGS = [["drum1","K",60,1],["drum2","T",60,2],["drum3","G",60,3],
               ["snare","S",60,4],["clp/cym","C",60,5],
               ["cl hh","H",60,6],["op hh","O",60,7]];
// a factory init kit (erica hrtl pack) as the blank template, 255 bytes
const INIT_SND = "SW5pdGtpdAAAAAAAAQAEAB8/KT86Py1Afz8yPwAAAAAAAAB/PQAAAAA4f39/f39/f0RoAAAAAAAAABUADQADAAoAawAFES4LBAoABgAAGl0HDiwOf1EWCg4PAAAAAAAAf39/f39/Pz8/AAA/Pz8/Pz8/Pz9/f39/f39/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABZkfwUAAAAA";


let midi = null, out = null;
document.body.classList.add("nomidi");  // page unlocks when an output is picked
let raw = Uint8Array.from(atob(INIT_SND), c => c.charCodeAt(0)); // current .snd bytes
// .snd layout: 8-byte name + one byte per parameter. VERIFIED 2026-08-07:
// the whole cc block is stored VERBATIM at offset 7+cc (file byte = knob
// value) — proven by predicting factory-kit screen values from bytes alone.
// nrpn params live in a second block at offset 136+nrpn.
const builtinMap = {};
for (const [cc] of CCS) builtinMap[cc] = cc + 7;
const NRPN_OFF = n => 136 + n;
const sndMap = builtinMap;

const $ = id => document.getElementById(id);
const ccch = () => (+$("ccch").value || 1) - 1;

let sendAt = 0;  // pacing cursor: bulk sends flood the lxr's internal
// serial link (that's what corrupted the fingerprint sessions) — space them
function paced(msg) {
  const t = Math.max(performance.now(), sendAt);
  out.send(msg, t);
  sendAt = t + 2;  // 2ms per message: a full kit lands in under a second
}
function sendCC(cc, val) {
  if (out) paced([0xB0 | ccch(), cc, val & 127]);
  else (window._cclog ||= []).push([cc, val]);  // headless tests observe this
}
function sendNRPN(n, val) {  // the beyond-cc params (manual 9.8)
  sendCC(99, n >> 7); sendCC(98, n & 127); sendCC(6, val & 127);
}
function trig(note, ch) {
  if (!out) return;
  out.send([0x90 | (ch - 1), note, 127]);  // full velocity: match the device pads
  out.send([0x80 | (ch - 1), note, 0], performance.now() + 90);
}

// ---- midi ------------------------------------------------------------------
if (!navigator.requestMIDIAccess) {
  $("status").textContent = "midi: not supported in this browser";
  $("status").className = "err";
  const warn = document.createElement("div");
  warn.style.cssText = "background:#3a1f14;border:1px solid #e84;border-radius:8px;" +
    "padding:10px 14px;margin-bottom:12px;color:#fca";
  warn.innerHTML = "this browser has <b>no web midi</b> — the editor needs " +
    "<b>chrome</b> (or edge/opera) to talk to the lxr-02.";
  document.body.insertBefore(warn, document.querySelector(".bar"));
}
navigator.requestMIDIAccess && navigator.requestMIDIAccess().then(m => {
  midi = m;
  const sel = $("outsel");
  const fill = () => {
    // statechange fires not just on plug/unplug but ALSO when the first
    // send() implicitly opens the port — the rebuild must preserve the
    // user's pick or the first slider touch "unselects" the instrument
    const chosen = sel.value;
    const stillThere = chosen &&
      [...midi.outputs.values()].some(o => o.id === chosen);
    sel.innerHTML = "<option value=''>— pick midi output —</option>";
    for (const o of midi.outputs.values()) {
      const opt = document.createElement("option");
      opt.value = o.id; opt.textContent = o.name;
      if (stillThere ? o.id === chosen : /lxr/i.test(o.name))
        opt.selected = true;  // keep the pick; only the LXR auto-picks fresh
      sel.appendChild(opt);
    }
    pick();
  };
  const pick = () => {
    // NEVER fall back to "whatever output is first" — blasting a kit's ccs
    // at an unsuspecting synth is how you ruin someone's patch
    out = sel.value ? midi.outputs.get(sel.value) || null : null;
    $("status").textContent = out ? "midi: " + out.name
      : midi.outputs.size ? "midi: pick your output →" : "midi: no outputs";
    $("status").className = out ? "ok" : midi.outputs.size ? "" : "err";
    document.body.classList.toggle("nomidi", !out);
  };
  sel.onchange = () => { pick(); sel.blur(); };  // give keys back to triggers
  midi.onstatechange = fill;
  fill();
}).catch(() => {
  $("status").textContent = "midi: blocked — allow midi access + reload";
  $("status").className = "err";
});

// ---- ui build --------------------------------------------------------------
const sliders = {}; // cc -> {input, valEl}
const nrpnSliders = {}; // nrpn -> {input, valEl}
const cols = $("cols");

// each voice mirrors the device's page order (walked on the real device):
// osc, amplitude envelope, modulation, fm, click, filter, lfo, mix.
// a row is {cc:[...]} straight from CCS, or an nrpn {label, n, max?, names?}.
function voicePages(v) {
  const i = VIDX[v];  // undefined for ALL/master
  const ccs = sect => CCS.filter(c => c[1] === v && c[2] === sect).map(e => ({ cc: e }));
  const byName = name => {
    const e = CCS.find(c => c[1] === v && c[3] === name);
    return e ? [{ cc: e }] : [];
  };
  const pages = [];
  // device osc page order: coa fin wav pwm, then the voice-specific extras
  const oscMain = ["OSC1 CT", "OSC1 FT", "OSC1 WF"];
  const osc = [...oscMain.flatMap(byName),
               ...ccs("osc").filter(r => !oscMain.includes(r.cc[3]))];
  if (i !== undefined) osc.push({ label: "pwm", n: 100 + i, max: 127 });
  if (osc.length) pages.push(["osc", osc]);
  const amp = ccs("amp env");
  if (amp.length) pages.push(["amp env", amp]);
  // device modulation page: dec slp mod, then velocity dst amt vol
  const mod = [...byName("MOD DEC"), ...byName("MOD SLP"), ...byName("ENV MOD AMT")];
  if (i !== undefined)
    mod.push({ label: "vel dst", n: 21 + i, max: 255, dst: true },
             { label: "vel amt", n: 15 + i, max: 127 },
             { label: "vel>vol", n: 9 + i, names: ["off", "on"] });
  if (mod.length) pages.push(["modulation", mod]);
  // device fm page: amt frq wav mod (wav = cc "WF MOD"; mod = mix/mod select)
  const fm = [...byName("FM AMT"), ...byName("FM FRQ"), ...byName("WF MOD")];
  if (fm.length && i !== undefined && i < 3)
    fm.push({ label: "mod", n: 6 + i, names: ["mix", "mod"] });
  if (fm.length) pages.push(["fm", fm]);
  if (i !== undefined)
    pages.push(["click", [{ label: "wav", n: 75 + i, names: TRANSIENTS },
                          { label: "vol", n: 69 + i, max: 127 },
                          { label: "frq", n: 81 + i, max: 127 }]]);
  const flt = ccs("filter");
  if (i !== undefined)
    flt.push({ label: "typ", n: 63 + i, names: FILTER_TYPES },
             { label: "drv", n: 0 + i, max: 127 });
  if (flt.length) pages.push(["filter", flt]);
  // device lfo page: frq snc mod wav rtg ofs voi dst ("mod" = LFO AMT cc).
  // maxes for snc/wav/rtg/voi are the ranges observed across all 216 kits
  const lfo = [...byName("LFO FRQ")];
  if (i !== undefined) lfo.push({ label: "snc", n: 51 + i, names: LFO_SYNCS });
  lfo.push(...byName("LFO AMT"));
  if (i !== undefined)
    lfo.push({ label: "wav", n: 27 + i, names: LFO_WAVES },
             { label: "rtg", n: 45 + i, names: LFO_RTGS },
             { label: "ofs", n: 57 + i, max: 127 },
             { label: "voi", n: 33 + i, max: 6 },
             { label: "dst", n: 39 + i, max: 255, dst: true });
  if (lfo.length) pages.push(["lfo", lfo]);
  const mix = ccs("mix");
  if (i !== undefined) mix.push({ label: "out", n: 87 + i, max: 6 });
  if (mix.length) pages.push(["mix", mix]);
  return pages;
}

for (const v of VOICES) {
  const pages = voicePages(v);
  if (!pages.length) continue;
  const box = document.createElement("div");
  box.className = "voice";
  box.innerHTML = `<h2>${VOICE_LABEL[v]}</h2>`;
  const addNrpn = ({ label, n, max, names, dst }) => {
    const row = document.createElement("div");
    row.className = "prm";
    if (names) {  // stepper with device names (like waveforms)
      row.innerHTML = `<label title="nrpn ${n}">${label}</label>
        <div class="wfstep"><button type="button">‹</button
        ><span class="wfname" data-nrpn="${n}">${names[0]}</span
        ><button type="button">›</button></div><span class="val"></span>`;
      const [prevB, nextB] = row.querySelectorAll("button");
      const nameEl = row.querySelector(".wfname");
      const hid = Object.assign(document.createElement("input"),
                                { type: "hidden", value: "0" });
      row.appendChild(hid);
      const step = d => {
        const i = (+hid.value + d + names.length) % names.length;
        hid.value = i; nameEl.textContent = names[i];
        sendNRPN(n, i); raw[NRPN_OFF(n)] = i;
      };
      prevB.onclick = () => step(-1);
      nextB.onclick = () => step(1);
      nrpnSliders[n] = { input: hid, valEl: nameEl, names };
    } else {
      row.innerHTML = `<label title="nrpn ${n}">${label}</label>
        <input type="range" min="0" max="${max}" value="0" data-nrpn="${n}">
        <span class="val">0</span>`;
      const inp = row.querySelector("input"), val = row.querySelector(".val");
      let show = null;
      if (dst) {  // resolved param name on its own small line under the slider
        const nameEl = document.createElement("div");
        nameEl.className = "dstname";
        row.appendChild(nameEl);
        show = v => { val.textContent = v; nameEl.textContent = DST_NAMES[v] ?? ""; };
      }
      inp.oninput = () => { show ? show(+inp.value) : val.textContent = inp.value;
        // nrpn data entry is 7-bit: values past 127 (dst enums go there in
        // real kit files) stay file-only, the device can't be told about them
        if (+inp.value <= 127) sendNRPN(n, +inp.value);
        raw[NRPN_OFF(n)] = +inp.value; };
      nrpnSliders[n] = { input: inp, valEl: val, show };
    }
    box.appendChild(row);
  };
  const addCc = ([cc, _v, _s, name]) => {
    const row = document.createElement("div");
    row.className = "prm";
    if (name === "OSC1 WF" || name.startsWith("WF MOD")) {
      // waveforms rotate with arrows: click through with the mouse while
      // the other hand taps a trigger key — nothing steals the keyboard
      row.innerHTML = `<label title="cc ${cc}">${name.toLowerCase()}</label>
        <div class="wfstep"><button type="button">‹</button
        ><span class="wfname" data-cc="${cc}">sin</span
        ><button type="button">›</button></div><span class="val"></span>`;
      const [prevB, nextB] = row.querySelectorAll("button");
      const nameEl = row.querySelector(".wfname");
      const hid = Object.assign(document.createElement("input"),
                                { type: "hidden", value: "0" });
      hid.dataset.cc = cc;
      row.appendChild(hid);
      const step = d => {
        const i = (+hid.value + d + WAVEFORMS.length) % WAVEFORMS.length;
        hid.value = i; nameEl.textContent = WAVEFORMS[i];
        sendCC(cc, i);
      };
      prevB.onclick = () => step(-1);
      nextB.onclick = () => step(1);
      sliders[cc] = { input: hid, valEl: nameEl, voice: _v };
      box.appendChild(row);
      return;
    }
    row.innerHTML = `<label title="cc ${cc}">${name.toLowerCase()}</label>
      <input type="range" min="0" max="127" value="0" data-cc="${cc}">
      <span class="val">${disp(name, 0)}</span>`;
    const inp = row.querySelector("input"), val = row.querySelector(".val");
    inp.oninput = () => { val.textContent = disp(name, +inp.value); sendCC(cc, +inp.value);
      if (sndMap[cc] !== undefined) raw[sndMap[cc]] = +inp.value;
      drawEnv(_v); };
    sliders[cc] = { input: inp, valEl: val, voice: _v };
    box.appendChild(row);
  };
  for (const [sect, rows] of pages) {
    box.insertAdjacentHTML("beforeend", `<div class="sect">${sect}</div>`);
    for (const r of rows) r.cc ? addCc(r.cc) : addNrpn(r);
  }
  if (["V1","V2","V3","SN","CP","HH"].includes(v)) {
    const cv = document.createElement("canvas");
    cv.className = "envg"; cv.dataset.voice = v; cv.width = 260; cv.height = 44;
    box.appendChild(cv);
  }
  cols.appendChild(box);
}

// amp envelope graph: attack/decay lengths + slope curvature, straight from
// the sliders (visual aid — the numbers already went to the device live)
const ENV_CCS = { V1:[50,51,63], V2:[52,53,64], V3:[54,55,65],
                  SN:[56,57,66], CP:[58,59,67], HH:[60,61,68] };
function drawEnv(voice) {
  const spec = ENV_CCS[voice];
  const cv = document.querySelector(`canvas[data-voice="${voice}"]`);
  if (!spec || !cv) return;
  const [aCC, dCC, sCC] = spec;
  const a = +(sliders[aCC]?.input.value ?? 0), d = +(sliders[dCC]?.input.value ?? 30);
  const slope = +(sliders[sCC]?.input.value ?? 63);
  const g = cv.getContext("2d"), W = cv.width, H = cv.height - 4;
  g.clearRect(0, 0, cv.width, cv.height);
  const total = Math.max(1, a + d);
  const ax = (a / total) * W, k = Math.max(0.15, Math.min(6, slope / 63));
  g.strokeStyle = "#e84"; g.lineWidth = 1.5; g.beginPath();
  g.moveTo(0, H);
  for (let x = 0; x <= ax; x++) g.lineTo(x, H - H * Math.pow(x / Math.max(1, ax), 1 / k));
  for (let x = 0; x <= W - ax; x++)
    g.lineTo(ax + x, H - H * Math.pow(1 - x / Math.max(1, W - ax), k));
  g.stroke();
}
function drawAllEnvs() { for (const v of Object.keys(ENV_CCS)) drawEnv(v); }

// lxr note names: octave = midi/12 (no offset), so C5 = 60, b4 = 59
function parseNote(s, fallback) {
  s = s.trim().toLowerCase();
  if (/^\d+$/.test(s)) return Math.min(127, +s);
  const m = s.match(/^([a-g])(#|s)?(\d+)$/);
  if (!m) return fallback;
  const semis = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
  return Math.min(127, semis[m[1]] + (m[2] ? 1 : 0) + 12 * +m[3]);
}
const trigsEl = $("trigs"), keyMap = {};
for (const [label, key, note, ch] of TRIGS) {
  const grp = document.createElement("div");
  grp.className = "grp";
  grp.innerHTML = `<button><b>${key}</b> ${label}</button>
    <div class="tio">n <input type="text" value="c5" title="note: c5, b4, f#3 or 0-127"
      style="width:5ch"> ch <input type="number" value="${ch}" min="1" max="16"
      title="channel"></div>`;
  const b = grp.querySelector("button");
  const [noteInp, chInp] = grp.querySelectorAll("input");
  const noteVal = () => parseNote(noteInp.value, note);
  b.onclick = () => { trig(noteVal(), +chInp.value); flash(b); };
  keyMap[key] = () => { trig(noteVal(), +chInp.value); flash(b); };
  trigsEl.appendChild(grp);
}
function flash(b) { b.classList.add("hit"); setTimeout(() => b.classList.remove("hit"), 120); }
document.addEventListener("keydown", e => {
  if (e.repeat || e.target.tagName === "SELECT"
      || (e.target.tagName === "INPUT" && e.target.type !== "range")) return;
  const f = keyMap[e.key.toUpperCase()];
  if (f) { f(); e.preventDefault(); }
});

// ---- send all ---------------------------------------------------------------
$("sendall").onclick = () => {  // the whole kit, paced: ~0.9s
  for (const cc of Object.keys(sliders)) sendCC(+cc, +sliders[cc].input.value);
  for (const n of Object.keys(nrpnSliders)) {
    const val = +nrpnSliders[n].input.value;
    if (val <= 127) sendNRPN(+n, val);  // 7-bit data entry: >127 is file-only
  }
};

// ---- .snd load/save ---------------------------------------------------------
function refreshFromRaw() {
  $("kitname").value = [...raw.slice(0, 8)]
    .filter(b => b >= 32 && b < 127).map(b => String.fromCharCode(b))
    .join("").trim() || "KIT";
  let filled = 0;
  for (const [cc, off] of Object.entries(sndMap)) {
    const s = sliders[cc];
    if (!s || off >= raw.length) continue;
    const meta = CCS.find(c => c[0] === +cc);
    s.input.value = raw[off];
    s.valEl.textContent = s.input.type === "hidden"
      ? WAVEFORMS[Math.min(raw[off], WAVEFORMS.length - 1)]  // stepper: name
      : disp(meta ? meta[3] : "", raw[off]);
    filled++;
  }
  for (const [n, s] of Object.entries(nrpnSliders)) {
    const off = NRPN_OFF(+n);
    if (off >= raw.length) continue;
    // never let the input clamp a file byte (kits hold values past our
    // observed maxes) — a clamped slider would rewrite the byte on save
    if (s.input.max !== "" && raw[off] > +s.input.max) s.input.max = raw[off];
    s.input.value = raw[off];
    if (s.show) s.show(raw[off]);
    else s.valEl.textContent = s.names ? (s.names[raw[off]] ?? raw[off]) : raw[off];
  }
  drawAllEnvs();
}
$("loadsnd").onclick = () => $("sndfile").click();
$("sndfile").onchange = async e => {
  const f = e.target.files[0]; if (!f) return;
  raw = new Uint8Array(await f.arrayBuffer());
  refreshFromRaw();
  $("sendall").click();  // loading a kit = hearing it, always
};
$("savesnd").onclick = () => {
  const name = ($("kitname").value.toUpperCase() + "        ").slice(0, 8);
  for (let i = 0; i < 8; i++) raw[i] = name.charCodeAt(i);
  for (const [cc, off] of Object.entries(sndMap))
    if (sliders[cc] && off < raw.length) raw[off] = +sliders[cc].input.value;
  for (const [n, s] of Object.entries(nrpnSliders))
    if (NRPN_OFF(+n) < raw.length) raw[NRPN_OFF(+n)] = +s.input.value;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([raw], { type: "application/octet-stream" }));
  a.download = (name.trim() || "KIT") + ".SND";
  a.click();
};

// ---- embedded kit browser: pick a kit, hear it instantly -------------------
const kitsel = $("kitsel");
const KIT_BYTES = [];
// the kits are plain .SND files under src/kits/<NN-group>/ — vite bundles
// their urls; we fetch them all at startup (117 x 255 bytes: nothing) to
// read real kit names and group the browser
const kitUrls = import.meta.glob("./kits/**/*.{SND,snd}", {
  query: "?url", import: "default", eager: true,
});
(async () => {
  const entries = Object.entries(kitUrls).sort(([a], [b]) => a.localeCompare(b));
  const fetched = await Promise.all(entries.map(async ([path, url]) => {
    const m = path.match(/\.\/kits\/\d+-([^/]+)\/([^/]+)$/);
    if (!m || m[2].startsWith("._")) return null;
    const buf = new Uint8Array(await (await fetch(url)).arrayBuffer());
    return [m[1], m[2], buf];
  }));
  const seen = new Set();
  const groups = new Map();
  for (const hit of fetched) {
    if (!hit) continue;
    const [group, file, buf] = hit;
    let name = [...buf.slice(0, 8)].filter(b => b >= 32 && b < 127)
      .map(b => String.fromCharCode(b)).join("").trim().toLowerCase();
    if (name.length < 3)
      name = file.replace(/^\d+-/, "").replace(/\.snd$/i, "").toLowerCase();
    if (["initkit", "inkit", "init"].includes(name.replace(/ /g, ""))) continue;
    const key = buf.join(",");
    if (seen.has(key)) continue;  // dedupe across packs by content
    seen.add(key);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push([name, buf]);
  }
  let total = 0;
  for (const [group, items] of groups) {
    const og = document.createElement("optgroup");
    og.label = group;
    for (const [name, buf] of items) {
      const o = document.createElement("option");
      o.value = KIT_BYTES.length; o.textContent = name;
      KIT_BYTES.push(buf);
      og.appendChild(o);
      total++;
    }
    kitsel.appendChild(og);
  }
  kitsel.options[0].textContent = `— browse ${total} kits —`;
})();
kitsel.onchange = () => {
  if (kitsel.value === "") return;
  raw = new Uint8Array(KIT_BYTES[+kitsel.value]);  // copy: edits stay local
  refreshFromRaw();
  $("sendall").click();  // straight onto the device: pick = hear
  kitsel.blur();  // hand the keyboard straight back to the trigger keys
};

refreshFromRaw();

window.parseNote = parseNote;  // test hook (module scope hides it)
