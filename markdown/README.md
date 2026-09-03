# Markdown (Mendix pluggable widget)

Renders Markdown text as HTML inside a Mendix page using
[react-markdown](https://www.npmjs.com/package/react-markdown), and optionally
lets users edit it with a live preview. Raw HTML in the Markdown is never
executed, so untrusted content is safe to display.

## Features

- **View mode**: Markdown from any string expression, such as an attribute
  (`$currentObject/Body`), a string literal, or a combination.
- **Edit mode**: a textarea bound to a String attribute with a live rendered
  preview next to it, below it, or hidden. Changes are written straight back to
  the attribute, read-only state and validation messages are respected, and an
  optional On change action runs when the editor loses focus after a change.
- **Formatting toolbar**: bold, italic, strikethrough, heading (cycles H1 to
  H3), quote, inline code, code block, link, image, bullet, numbered and task
  lists, table and horizontal rule. Buttons wrap or toggle the current
  selection. Ctrl+B, Ctrl+I and Ctrl+K (Cmd on macOS) work in the textarea.
- GitHub Flavored Markdown (tables, task lists, strikethrough, footnotes,
  autolinks) via `remark-gfm`, switchable per widget.
- Inline HTML is shown as text or removed, never rendered.
- Links open in a new tab (with `rel="noopener noreferrer"`) or the same tab.
- Optional "empty text" placeholder when the value is empty or not yet loaded.
- Standard Mendix class and style properties; all rendered output is scoped
  under `.widget-markdown` for theming.

## Usage in Studio Pro

1. Build the widget (see below) or take the prebuilt
   `mxtechies.Markdown.mpk` from the app's `widgets` folder.
2. In Studio Pro press **F4** (Synchronize App Directory).
3. Drag **Markdown** from the toolbox (Add-ons) onto a page inside a data view.
4. For viewing, keep **Mode** on *View* and set **Markdown** to an expression
   such as `$currentObject/Body`.
5. For editing, set **Mode** to *Edit* and pick the **Markdown attribute**
   (an unlimited-length String attribute works best).

## Properties

### General

| Property                 | Description                                                        |
| ------------------------ | ------------------------------------------------------------------ |
| Mode                     | *View* renders an expression; *Edit* shows the editor.             |
| Markdown                 | String expression with the Markdown source (View mode).            |
| Markdown attribute       | String attribute the editor reads and writes (Edit mode).          |
| Empty text               | Text shown in the preview when the Markdown is empty.              |
| GitHub Flavored Markdown | Enables `remark-gfm` extensions. Default on.                       |
| Inline HTML              | *Show as text* (default) or *Remove*.                              |
| Open links in            | *New tab* (default) or *Same tab*.                                 |

### Editor (Edit mode only)

| Property         | Description                                                          |
| ---------------- | -------------------------------------------------------------------- |
| Show toolbar     | Formatting buttons above the textarea. Default on.                   |
| Preview position | *In a popup* (default; a Preview button in the toolbar opens a dialog), *Next to the editor*, *Below the editor*, or *No preview*. |
| Show preview title | Header above the inline preview pane. Default on.                  |
| Preview title    | Text for that header and for the popup dialog title. Defaults to "Preview" and is translatable. |
| Editor rows      | Initial textarea height in rows. Default 12.                         |
| Placeholder      | Hint shown in the empty textarea.                                    |
| On change        | Action run when the editor loses focus after the text changed.       |

## Development

```bash
cd markdown
npm install
npm run build     # writes ../widgets/mxtechies.Markdown.mpk (dev build)
npm run dev       # rebuild on change while the app runs locally
npm run release   # minified build in dist/<version>/, copy to ../widgets
npm run lint      # ESLint + Prettier
```

The `projectPath` in `package.json` points at the parent Mendix app folder, so
each dev build drops the `.mpk` straight into that app's `widgets` directory.

`package.json` pins `zip-a-folder` to 6.1.4 through an npm override because the
newer version needs a native LZMA binary that requires Node 22.20 or later.
Remove the override once Node is upgraded.
