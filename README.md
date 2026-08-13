# LXR-02 kit editor

![lxr-02 kit editor](public/og.png)

edit kits on the Erica Synths / Sonic Potions LXR-02 drum synth from
your browser. live at https://lxr02.greg.technology (chrome only).

- every slider sends cc/nrpn to the device as you move it
- browse 117 kits (hrtl packs + factory)
- load / save .snd files for the sd card

## dev

```
npm install
npm run dev
```

tests (playwright against the built site):

```
npm run build
uv run --with playwright --with pytest pytest test_editor.py
```
