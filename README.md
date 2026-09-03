# Markdown widget for Mendix

![Markdown widget for Mendix](markdown/screenshots/cover.jpg)

A pluggable web widget for Mendix 11 that renders Markdown with
[react-markdown](https://www.npmjs.com/package/react-markdown) and, in edit
mode, provides a Markdown editor with a formatting toolbar and a live preview
next to the editor, below it, or in a popup.

## Screenshots

| | |
|---|---|
| ![View mode](markdown/screenshots/Screenshot_1.png) View mode renders a Markdown attribute | ![Edit mode side by side](markdown/screenshots/Screenshot_2.png) Edit mode with toolbar and live preview next to the editor |
| ![Popup preview](markdown/screenshots/Screenshot_3.png) Preview button opens the rendered Markdown in a popup | ![Stacked preview](markdown/screenshots/Screenshot_4.png) Preview below the editor with a custom title |
| ![Safe by default](markdown/screenshots/Screenshot_5.png) HTML is never executed, unsafe links are stripped | ![General properties](markdown/screenshots/Screenshot_6.png) Studio Pro properties, General tab |
| ![Editor properties](markdown/screenshots/Screenshot_7.png) Studio Pro properties, Editor tab | |

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
