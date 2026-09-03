import { ReactElement, useCallback } from "react";
import classNames from "classnames";
import { ValueStatus } from "mendix";

import { MarkdownContainerProps } from "../typings/MarkdownProps";
import { MarkdownRenderer } from "./components/MarkdownRenderer";
import { MarkdownEditor } from "./components/MarkdownEditor";

import "./ui/Markdown.css";

function available(value: { status: ValueStatus; value?: string } | undefined): string {
    return value && value.status === ValueStatus.Available ? value.value ?? "" : "";
}

export function Markdown(props: MarkdownContainerProps): ReactElement {
    const {
        mode,
        content,
        markdownAttribute,
        emptyText,
        gfm,
        htmlHandling,
        linkTarget,
        editorLayout,
        editorRows,
        showToolbar,
        showPreviewTitle,
        previewTitle,
        placeholder,
        onChange,
        name,
        class: className,
        style,
        tabIndex
    } = props;

    const rendererProps = {
        gfm,
        skipHtml: htmlHandling === "skip",
        openLinksInNewTab: linkTarget === "blank"
    };
    const placeholderText = available(emptyText);

    const handleChange = useCallback(
        (value: string) => {
            if (markdownAttribute && !markdownAttribute.readOnly) {
                markdownAttribute.setValue(value);
            }
        },
        [markdownAttribute]
    );

    const handleCommit = useCallback(() => {
        if (onChange && onChange.canExecute && !onChange.isExecuting) {
            onChange.execute();
        }
    }, [onChange]);

    if (mode === "edit") {
        const source = available(markdownAttribute);
        const readOnly = !markdownAttribute || markdownAttribute.readOnly;
        const validation = markdownAttribute?.validation;

        return (
            <div className={classNames("widget-markdown-container", className)} style={style} tabIndex={tabIndex}>
                <MarkdownEditor
                    id={name}
                    value={source}
                    onChange={handleChange}
                    onCommit={handleCommit}
                    readOnly={readOnly}
                    rows={editorRows > 0 ? editorRows : 12}
                    placeholder={available(placeholder) || undefined}
                    emptyText={placeholderText || undefined}
                    layout={editorLayout}
                    showToolbar={showToolbar}
                    showPreviewTitle={showPreviewTitle}
                    previewTitle={available(previewTitle).trim() || "Preview"}
                    validation={validation}
                    {...rendererProps}
                />
            </div>
        );
    }

    const source = available(content);
    const isEmpty = source.trim().length === 0;

    return (
        <div
            className={classNames("widget-markdown", className, { "widget-markdown-empty": isEmpty })}
            style={style}
            tabIndex={tabIndex}
        >
            {isEmpty ? (
                placeholderText ? (
                    <p className="widget-markdown-placeholder">{placeholderText}</p>
                ) : null
            ) : (
                <MarkdownRenderer source={source} {...rendererProps} />
            )}
        </div>
    );
}
