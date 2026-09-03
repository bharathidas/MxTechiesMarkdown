# Markdown widget for Mendix

A pluggable web widget for Mendix 11 that renders Markdown with
[react-markdown](https://www.npmjs.com/package/react-markdown) and, in edit
mode, provides a Markdown editor with a formatting toolbar and a live preview
next to the editor, below it, or in a popup.

- Widget source and documentation: [`markdown/`](markdown/README.md)
- Prebuilt package: `widgets/mxtechies.Markdown.mpk` and the
  [GitHub releases](../../releases)
- This repository is also the Mendix test app (`PlugableWidget_Markdown.mpr`)
  used to develop and try the widget.

## Quick start

1. Download `mxtechies.Markdown.mpk` from the latest release.
2. Copy it into your app's `widgets` folder and press **F4** in Studio Pro.
3. Drag **Markdown** onto a page inside a data view.
   - View mode: set **Markdown** to an expression such as `$currentObject/Body`.
   - Edit mode: pick a String attribute; the toolbar and Preview button appear.

## Building from source

```bash
cd markdown
npm install
npm run build      # dev build into ../widgets
npm run release    # minified build into markdown/dist/<version>
```

Requires Node.js 22 and npm. See [`markdown/README.md`](markdown/README.md)
for all properties and details.

## License

Apache License 2.0. See [LICENSE](LICENSE).
