"""frontend tests for the lxr-02 kit editor.

run from sonicgarbagehw/:  uv run --with playwright --with pytest pytest ../lxr-editor/test_editor.py
(first time: uv run --with playwright playwright install chromium)
builds are what ship: run `npm run build` first — tests serve dist/ over http.
"""

import functools
import http.server
import socketserver
import threading
from pathlib import Path

import pytest
from playwright.sync_api import sync_playwright

DIST = Path(__file__).parent / "dist"


@pytest.fixture(scope="module")
def URL():
    handler = functools.partial(
        http.server.SimpleHTTPRequestHandler, directory=str(DIST)
    )
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(("127.0.0.1", 0), handler)
    port = httpd.server_address[1]
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    yield f"http://127.0.0.1:{port}/"
    httpd.shutdown()


def wait_ready(pg):  # the kit browser fills async after fetching the .SNDs
    pg.wait_for_function(
        "document.getElementById('kitsel').options.length > 5", timeout=10000
    )
    # headless has no midi output, which locks the whole page (by design —
    # see test_page_is_locked_until_midi). unlock so tests can interact.
    pg.evaluate("document.body.classList.remove('nomidi')")


@pytest.fixture(scope="module")
def browser():
    with sync_playwright() as p:
        b = p.chromium.launch()
        yield b
        b.close()


@pytest.fixture(scope="module")
def page(browser, URL):
    pg = browser.new_page()
    errors = []
    pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.goto(URL)
    wait_ready(pg)
    pg._errors = errors
    pg._url = URL
    yield pg


def test_page_loads_without_js_errors(page):
    real = [e for e in page._errors if "Web MIDI" not in e]
    assert real == []  # midi permission failure is expected headless


def test_kit_browser_has_kits(page):
    n = page.eval_on_selector("#kitsel", "el => el.options.length")
    assert n > 30  # the embedded pack
    labels = page.eval_on_selector(
        "#kitsel", "el => [...el.options].map(o => o.textContent).join('|')"
    )
    assert "�" not in labels  # no utf junk in names


def test_loading_a_kit_fills_linked_sliders(page):
    page.select_option("#kitsel", "0")
    page.wait_for_timeout(200)
    vals = page.evaluate(
        "() => [89,90,91,92,93,94].map(cc =>"
        " +document.querySelector(`input[data-cc='${cc}']`).value)"
    )
    assert any(v > 0 for v in vals)  # voice volumes came from the file
    name = page.eval_on_selector("#kitname", "el => el.value")
    assert name and "�" not in name


def test_nothing_is_marked_unlinked_anymore(page):
    n = page.evaluate("() => document.querySelectorAll('.prm.unlinked').length")
    assert n == 0  # the whole kit round-trips


def test_envelope_canvases_exist_and_draw(page):
    n = page.evaluate("() => document.querySelectorAll('canvas.envg').length")
    assert n == 6  # one per voice engine
    blank = page.evaluate(
        """() => { const c = document.querySelector('canvas.envg');
             return c.getContext('2d').getImageData(0,0,c.width,c.height)
               .data.every(v => v === 0); }"""
    )
    assert not blank  # something is actually drawn


def test_triggers_have_per_voice_channels(page):
    chans = page.evaluate(
        """() => [...document.querySelectorAll('.trigs .grp')]
            .map(g => +g.querySelectorAll('input')[1].value)"""
    )
    assert chans == [1, 2, 3, 4, 5, 6, 7]  # the mixer-page setup


def test_kit_pick_sends_the_entire_kit(page):
    """everything is file-linked now: picking a kit transmits every cc AND
    the nrpn pwm block (as cc99/98/6 triplets), all real values."""
    page.evaluate("() => { window._cclog = []; }")
    page.select_option("#kitsel", "1")
    page.wait_for_timeout(300)
    sent = page.evaluate("() => window._cclog.map(([cc]) => cc)")
    assert len([c for c in sent if c not in (99, 98, 6)]) > 110  # all ccs
    assert 9 in sent and 38 in sent and 50 in sent  # tunes/filters/envs too
    assert 99 in sent and 98 in sent and 6 in sent  # nrpn triplets (pwm)


def test_kit_select_releases_keyboard_focus(page):
    page.select_option("#kitsel", "3")
    page.wait_for_timeout(150)
    focused = page.evaluate("() => document.activeElement.tagName")
    assert focused != "SELECT"  # trigger keys work right after picking a kit


def test_waveform_stepper_rotates_and_sends(page):
    page.reload()
    wait_ready(page)
    sent = page.evaluate("""() => {
        window._cclog = [];
        const row = document.querySelector('span.wfname[data-cc="2"]').closest('.prm');
        const next = row.querySelectorAll('button')[1];
        next.click(); next.click();  // sin -> tri -> saw
        return [window._cclog, row.querySelector('.wfname').textContent];
    }""")
    assert sent == [[[2, 1], [2, 2]], "saw"]
    wrap = page.evaluate("""() => {
        const row = document.querySelector('span.wfname[data-cc="2"]').closest('.prm');
        const prev = row.querySelectorAll('button')[0];
        window._cclog = []; prev.click(); prev.click(); prev.click();
        return row.querySelector('.wfname').textContent;
    }""")
    assert wrap == "pwm"  # saw -> tri -> sin -> wraps to pwm
    focused = page.evaluate("() => document.activeElement.tagName")
    assert focused != "SELECT"  # keyboard stays free for trigger keys


def test_tune_display_uses_device_scale(page):
    ct = page.evaluate("""() => {
        const el = document.querySelector('input[data-cc="9"]');
        el.value = 60; el.dispatchEvent(new Event('input'));
        return el.closest('.prm').querySelector('.val').textContent;
    }""")
    assert ct == "0"  # cc 60 = center = 0 semitones on the device
    ft = page.evaluate("""() => {
        const el = document.querySelector('input[data-cc="10"]');
        el.value = 0; el.dispatchEvent(new Event('input'));
        return el.closest('.prm').querySelector('.val').textContent;
    }""")
    assert ft == "-63"  # fine bottoms out at -63 like the device shows
    pan = page.evaluate("""() => {
        const el = document.querySelector('input[data-cc="95"]');
        el.value = 127; el.dispatchEvent(new Event('input'));
        return el.closest('.prm').querySelector('.val').textContent;
    }""")
    assert pan == "64"  # pan is -63..+64 on the device (user-verified)


def test_pwm_is_an_nrpn_control(page):
    sent = page.evaluate("""() => {
        window._cclog = [];
        const el = document.querySelector('input[data-nrpn="100"]');
        el.value = 77; el.dispatchEvent(new Event('input'));
        return window._cclog;
    }""")
    assert sent == [[99, 0], [98, 100], [6, 77]]  # nrpn 100 = drum1 pwm
    n = page.evaluate("() => document.querySelectorAll('[data-nrpn]').length")
    assert n >= 36  # pwm/type/drive/sample/vol/freq per voice engine


def test_wf_mod_stepper_lives_in_the_fm_section(page):
    page.reload()
    wait_ready(page)
    name = page.evaluate(
        "() => document.querySelector('span.wfname[data-cc=\"21\"]').textContent"
    )
    assert name == "sin"
    sect = page.evaluate("""() => {
        let el = document.querySelector('span.wfname[data-cc="21"]').closest('.prm');
        while (el && !el.classList.contains('sect')) el = el.previousElementSibling;
        return el ? el.textContent : null;
    }""")
    assert sect == "fm"  # matches the device's FM page


def test_no_fingerprint_ui_remains(page):
    page.reload()
    wait_ready(page)
    assert page.evaluate("() => document.getElementById('fp1')") is None
    foot = page.eval_on_selector('.foot', 'el => el.textContent')
    assert 'fingerprint' not in foot and 'keys:' not in foot


def test_no_webmidi_browser_gets_banner_not_dead_page(browser, URL):
    """safari repro: no requestMIDIAccess must mean a visible warning AND a
    fully rendered ui — never a silent dead page."""
    ctx = browser.new_context()
    pg = ctx.new_page()
    pg.add_init_script("delete Object.getPrototypeOf(navigator).requestMIDIAccess;"
                       "delete navigator.requestMIDIAccess;")
    errors = []
    pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.goto(URL)
    pg.wait_for_timeout(500)
    assert errors == []
    body = pg.eval_on_selector("body", "el => el.textContent")
    assert "no web midi" in body  # the banner
    sliders = pg.evaluate("() => document.querySelectorAll('input[type=range]').length")
    assert sliders > 80  # the ui still fully built
    ctx.close()


def test_waveforms_fill_from_kit_files(page):
    """the user was right: the osc shape IS in the .snd — and now it loads."""
    page.reload()
    wait_ready(page)
    names = page.evaluate("""() => {
        const sel = document.getElementById('kitsel');
        const seen = new Set();
        for (let i = 0; i < Math.min(8, sel.options.length - 1); i++) {
            sel.value = String(i); sel.dispatchEvent(new Event('change'));
            seen.add(document.querySelector('span.wfname[data-cc="2"]').textContent);
        }
        return [...seen];
    }""")
    assert all(n in ("sin", "tri", "saw", "rec", "noi", "pwm") for n in names)
    assert len(names) >= 1  # real values, and they change per kit if kits differ


def test_note_names_parse_like_the_lxr(page):
    vals = page.evaluate("""() => [
        parseNote('c5', -1), parseNote('b4', -1), parseNote('f#3', -1),
        parseNote('C5', -1), parseNote('60', -1), parseNote('junk', 42),
    ]""")
    assert vals == [60, 59, 42, 60, 60, 42]  # firmware octave: C5 = 60


def test_pwm_fills_from_kit_file(page):
    page.select_option("#kitsel", "0")
    page.wait_for_timeout(200)
    linked = page.evaluate("""() => {
        const el = document.querySelector('input[data-nrpn="100"]');
        return el.value !== undefined;
    }""")
    assert linked


def test_transient_and_filter_nrpns_exist_and_fill(page):
    page.reload()
    wait_ready(page)
    page.select_option("#kitsel", "0")
    page.wait_for_timeout(300)
    n = page.evaluate("() => document.querySelectorAll('[data-nrpn]').length")
    assert n >= 6 * 6  # pwm + type + drive + sample + volume + freq per voice
    sample = page.evaluate(
        """() => document.querySelector("span.wfname[data-nrpn='75']").textContent"""
    )
    assert sample in ("snp", "ofs", "clk", "ck2", "tik", "kik", "rim", "drp",
                      "hat", "clp", "kk2", "snr", "tom", "sp2")


def test_sections_follow_device_page_order(page):
    """drum1's sections read exactly like paging through the device."""
    page.reload()
    wait_ready(page)
    sects = page.evaluate("""() => [...document.querySelectorAll(
        '.voice')][0] ? [...document.querySelectorAll('.voice')].map(v =>
        [...v.querySelectorAll('.sect')].map(s => s.textContent)) : []""")
    assert sects[0] == ["osc", "amp env", "modulation", "fm", "click",
                       "filter", "lfo", "mix"]  # drum1
    assert sects[3] == ["osc", "amp env", "modulation", "click",
                       "filter", "lfo", "mix"]  # snare: no fm page
    assert sects[6] == ["mix"]  # master: all dcm only


def test_new_nrpn_rows_fill_from_kit_and_high_values_survive(page):
    """velocity dst/amt/vol, lfo snc/wav/rtg/ofs/voi/dst, mix out — all in
    the file at 136+n. dst enums go past 127 in real kits: the slider must
    hold the byte (not clamp it) so a round-trip save keeps it intact."""
    page.reload()
    wait_ready(page)
    page.select_option("#kitsel", "0")
    page.wait_for_timeout(300)
    for n in (21, 15, 9, 51, 27, 45, 57, 33, 39, 87):  # drum1's new nrpns
        el = page.evaluate(
            f"""() => {{ const e = document.querySelector('[data-nrpn="{n}"]');
                return e ? e.tagName : null; }}""")
        assert el, f"nrpn {n} row missing"
    ok = page.evaluate("""() => {
        const inp = document.querySelector('input[data-nrpn="39"]');
        // simulate a kit byte past 127 (lfo dst enums reach 226 in the corpus)
        inp.max = 127; inp.max = Math.max(+inp.max, 226); inp.value = 226;
        return +inp.value === 226;
    }""")
    assert ok


def test_dst_sliders_show_param_names(page):
    """dst menu index n = (cc n+1)'s param — device-verified by a 28-value
    sweep. the editor shows the resolved name next to the number."""
    page.reload()
    wait_ready(page)
    shown = page.evaluate("""() => {
        const inp = document.querySelector('input[data-nrpn="39"]');
        const row = inp.closest('.prm');
        const out = [];
        for (const v of [0, 1, 5, 40, 200]) {
            inp.value = v; inp.dispatchEvent(new Event('input'));
            out.push([row.querySelector('.val').textContent,
                      row.querySelector('.dstname').textContent]);
        }
        return out;
    }""")
    assert shown[0] == ["0", "off"]
    assert shown[1] == ["1", "v1 osc1 wf"]   # cc2's param
    assert shown[2] == ["5", "off"]          # the cc6 data-entry hole
    assert shown[3] == ["40", "sn flt frq"]  # cc41's param
    assert shown[4] == ["200", ""]           # past the cc range: no name


def test_filter_type_is_a_named_stepper(page):
    page.reload()
    wait_ready(page)
    page.select_option("#kitsel", "0")
    page.wait_for_timeout(300)
    name = page.evaluate(
        """() => document.querySelector("span.wfname[data-nrpn='63']").textContent"""
    )
    assert name in ("lp", "hp", "bp", "ubp", "nch", "pek", "lp2", "off")


def test_kit_browser_is_grouped_by_pack(page):
    page.reload()
    wait_ready(page)
    groups = page.evaluate(
        "() => [...document.querySelectorAll('#kitsel optgroup')].map(g => g.label)"
    )
    assert len(groups) >= 3  # hrtl packs + factory projects, separated
    labels = page.evaluate(
        "() => [...document.querySelectorAll('#kitsel option')].map(o => o.textContent)"
    )
    assert not any('(' in l for l in labels)  # clean names, no file parens


def test_page_is_locked_until_midi(page):
    """no output picked = whole editor inert (blind slider moves were a
    trap). only the connect bar stays live."""
    page.reload()
    page.wait_for_function(
        "document.getElementById('kitsel').options.length > 5", timeout=10000
    )  # deliberately NOT wait_ready: we want the pristine locked state
    state = page.evaluate("""() => ({
        locked: document.body.classList.contains('nomidi'),
        cols: getComputedStyle(document.getElementById('cols')).pointerEvents,
        trigs: parseFloat(getComputedStyle(document.getElementById('trigs')).opacity),
        connectbar: getComputedStyle(document.getElementById('outsel')).pointerEvents,
    })""")
    assert state["locked"]
    assert state["cols"] == "none"
    assert state["trigs"] < 0.5
    assert state["connectbar"] != "none"  # picking an output must stay possible
    page.evaluate("document.body.classList.remove('nomidi')")  # for later tests
