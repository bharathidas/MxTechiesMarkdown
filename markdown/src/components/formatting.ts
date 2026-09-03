export type FormatId =
    | "bold"
    | "italic"
    | "strikethrough"
    | "heading"
    | "quote"
    | "code"
    | "codeBlock"
    | "link"
    | "image"
    | "bulletList"
    | "numberedList"
    | "taskList"
    | "table"
    | "rule";

export interface Selection {
    start: number;
    end: number;
}

export interface FormatResult {
    text: string;
    selection: Selection;
}

interface WrapSpec {
    prefix: string;
    suffix: string;
    placeholder: string;
}

const WRAPS: Partial<Record<FormatId, WrapSpec>> = {
    bold: { prefix: "**", suffix: "**", placeholder: "bold text" },
    italic: { prefix: "_", suffix: "_", placeholder: "italic text" },
    strikethrough: { prefix: "~~", suffix: "~~", placeholder: "strikethrough" },
    code: { prefix: "`", suffix: "`", placeholder: "code" }
};

const HEADING_CYCLE = ["", "# ", "## ", "### "];

/** Applies a Markdown format to `text` at `selection`, returning the new text and selection. */
export function applyFormat(id: FormatId, text: string, selection: Selection): FormatResult {
    const wrap = WRAPS[id];
    if (wrap) {
        return wrapSelection(text, selection, wrap);
    }
    switch (id) {
        case "heading":
            return cycleHeading(text, selection);
        case "quote":
            return toggleLinePrefix(text, selection, () => "> ", /^> /);
        case "bulletList":
            return toggleLinePrefix(text, selection, () => "- ", /^[-*+] (?!\[[ xX]\] )/);
        case "numberedList":
            return toggleLinePrefix(text, selection, index => `${index + 1}. `, /^\d+\. /);
        case "taskList":
            return toggleLinePrefix(text, selection, () => "- [ ] ", /^[-*+] \[[ xX]\] /);
        case "codeBlock":
            return insertBlock(text, selection, selected => "```\n" + (selected || "code") + "\n```", {
                start: 4,
                length: (text.slice(selection.start, selection.end) || "code").length
            });
        case "link":
            return insertLink(text, selection, false);
        case "image":
            return insertLink(text, selection, true);
        case "table":
            return insertBlock(
                text,
                selection,
                () => "| Column 1 | Column 2 |\n| -------- | -------- |\n| Cell     | Cell     |",
                { start: 2, length: 8 }
            );
        case "rule":
            return insertBlock(text, selection, () => "---", { start: 3, length: 0 });
        default:
            return { text, selection };
    }
}

function wrapSelection(text: string, selection: Selection, spec: WrapSpec): FormatResult {
    const { prefix, suffix } = spec;
    const before = text.slice(0, selection.start);
    const selected = text.slice(selection.start, selection.end);
    const after = text.slice(selection.end);

    // Toggle off when the selection is already wrapped.
    if (before.endsWith(prefix) && after.startsWith(suffix)) {
        return {
            text: before.slice(0, -prefix.length) + selected + after.slice(suffix.length),
            selection: { start: selection.start - prefix.length, end: selection.end - prefix.length }
        };
    }
    if (selected.startsWith(prefix) && selected.endsWith(suffix) && selected.length >= prefix.length + suffix.length) {
        const inner = selected.slice(prefix.length, selected.length - suffix.length);
        return {
            text: before + inner + after,
            selection: { start: selection.start, end: selection.start + inner.length }
        };
    }

    const content = selected || spec.placeholder;
    return {
        text: before + prefix + content + suffix + after,
        selection: { start: selection.start + prefix.length, end: selection.start + prefix.length + content.length }
    };
}

function lineRange(text: string, selection: Selection): Selection {
    const start = text.lastIndexOf("\n", selection.start - 1) + 1;
    const nextBreak = text.indexOf("\n", Math.max(selection.end, selection.start));
    const end = nextBreak === -1 ? text.length : nextBreak;
    return { start, end };
}

function toggleLinePrefix(
    text: string,
    selection: Selection,
    prefixFor: (index: number) => string,
    pattern: RegExp
): FormatResult {
    const range = lineRange(text, selection);
    const lines = text.slice(range.start, range.end).split("\n");
    const allPrefixed = lines.every(line => pattern.test(line));
    const updated = lines.map((line, index) =>
        allPrefixed ? line.replace(pattern, "") : prefixFor(index) + line.replace(pattern, "")
    );
    const block = updated.join("\n");
    return {
        text: text.slice(0, range.start) + block + text.slice(range.end),
        selection: { start: range.start, end: range.start + block.length }
    };
}

function cycleHeading(text: string, selection: Selection): FormatResult {
    const range = lineRange(text, selection);
    const line = text.slice(range.start, range.end);
    const match = /^(#{1,6}) /.exec(line);
    const current = match ? Math.min(match[1].length, HEADING_CYCLE.length - 1) : 0;
    const next = HEADING_CYCLE[(current + 1) % HEADING_CYCLE.length];
    const bare = line.replace(/^#{1,6} /, "");
    const updated = next + bare;
    return {
        text: text.slice(0, range.start) + updated + text.slice(range.end),
        selection: { start: range.start + next.length, end: range.start + updated.length }
    };
}

/** Inserts a block on its own lines, padding with blank lines so surrounding paragraphs stay intact. */
function insertBlock(
    text: string,
    selection: Selection,
    build: (selected: string) => string,
    select: { start: number; length: number }
): FormatResult {
    const before = text.slice(0, selection.start);
    const selected = text.slice(selection.start, selection.end);
    const after = text.slice(selection.end);
    const block = build(selected);

    const leading = before.length === 0 ? "" : before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
    const trailing = after.length === 0 ? "\n" : after.startsWith("\n\n") ? "" : after.startsWith("\n") ? "\n" : "\n\n";

    const insertAt = before.length + leading.length;
    return {
        text: before + leading + block + trailing + after,
        selection: { start: insertAt + select.start, end: insertAt + select.start + select.length }
    };
}

function insertLink(text: string, selection: Selection, image: boolean): FormatResult {
    const before = text.slice(0, selection.start);
    const selected = text.slice(selection.start, selection.end);
    const after = text.slice(selection.end);
    const isUrl = /^https?:\/\/\S+$/i.test(selected);

    const label = isUrl || !selected ? (image ? "alt text" : "link text") : selected;
    const url = isUrl ? selected : "https://";
    const snippet = `${image ? "!" : ""}[${label}](${url})`;
    const inserted = before + snippet + after;

    // Select whichever part the user still needs to fill in.
    const labelStart = selection.start + (image ? 2 : 1);
    const urlStart = labelStart + label.length + 2;
    const target =
        isUrl || !selected
            ? { start: labelStart, end: labelStart + label.length }
            : { start: urlStart, end: urlStart + url.length };

    return { text: inserted, selection: target };
}
