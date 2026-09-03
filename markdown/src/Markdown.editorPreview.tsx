import { ReactElement } from "react";
import { MarkdownPreviewProps } from "../typings/MarkdownProps";
import { MarkdownRenderer } from "./components/MarkdownRenderer";
import { MarkdownEditor } from "./components/MarkdownEditor";

const SAMPLE = [
    "# Markdown",
    "",
    "Renders **bold**, _italic_, [links](https://mendix.com), `code` and lists:",
    "",
    "- Item one",
    "- Item two"
].join("\n");

export function preview(props: MarkdownPreviewProps): ReactElement {
    const rendererProps = {
        gfm: props.gfm,
        skipHtml: props.htmlHandling === "skip",
        openLinksInNewTab: false
    };

    if (props.mode === "edit") {
        const attribute = (props.markdownAttribute ?? "").trim();
        return (
            <div className={`widget-markdown-container ${props.class ?? ""}`} style={props.styleObject}>
                <MarkdownEditor
                    value={SAMPLE}
                    onChange={() => undefined}
                    readOnly
                    rows={props.editorRows && props.editorRows > 0 ? props.editorRows : 12}
                    placeholder={props.placeholder || (attribute ? `[${attribute}]` : "Markdown attribute")}
                    layout={props.editorLayout}
                    showToolbar={props.showToolbar}
                    showPreviewTitle={props.showPreviewTitle}
                    previewTitle={props.previewTitle?.trim() || "Preview"}
                    {...rendererProps}
                />
            </div>
        );
    }

    const expression = (props.content ?? "").trim();
    // A quoted string literal in the expression can be previewed as-is; anything else shows the sample.
    const literal = /^'([\s\S]*)'$/.exec(expression);
    const source = literal ? literal[1].replace(/''/g, "'") : SAMPLE;

    return (
        <div className={`widget-markdown ${props.class ?? ""}`} style={props.styleObject}>
            {!literal && expression ? <p className="widget-markdown-placeholder">Markdown from: {expression}</p> : null}
            <MarkdownRenderer source={source} {...rendererProps} />
        </div>
    );
}

export function getPreviewCss(): string {
    return require("./ui/Markdown.css");
}
