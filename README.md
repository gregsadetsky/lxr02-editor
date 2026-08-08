# lxr-02 kit editor

edit kits on the erica synths / sonic potions lxr-02 drum synth from
your browser. live at https://lxr02.greg.technology (chrome — web midi).

- every slider sends cc/nrpn to the device as you move it
- browse 117 kits (hrtl packs + factory), picking one loads it instantly
- load / save .snd files for the sd card
- the whole midi map is device-verified byte-for-byte (see CHECKS.md)

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
