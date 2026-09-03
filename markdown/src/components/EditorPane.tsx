import { ChangeEvent, KeyboardEvent, ReactElement, useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { MarkdownRenderer, MarkdownRendererProps } from "./MarkdownRenderer";
import { MarkdownToolbar, SHORTCUTS } from "./MarkdownToolbar";
import { MarkdownPreviewDialog } from "./MarkdownPreviewDialog";
import { FormatId, Selection, applyFormat } from "./formatting";

export type EditorLayout = "sideBySide" | "stacked" | "popup" | "hidden";

export interface EditorPaneProps extends Omit<MarkdownRendererProps, "source"> {
    value: string;
    onChange: (value: string) => void;
    onCommit?: () => void;
    readOnly: boolean;
    rows: number;
    placeholder?: string;
    emptyText?: string;
    layout: EditorLayout;
    showToolbar: boolean;
    /** Header above the inline preview (side by side or stacked). */
    showPreviewTitle?: boolean;
    /** Title for the inline preview header and the popup dialog. */
    previewTitle?: string;
    validation?: string;
    id?: string;
}

export function EditorPane(props: EditorPaneProps): ReactElement {
    const {
        value,
        onChange,
        onCommit,
        readOnly,
        rows,
        placeholder,
        emptyText,
        layout,
        showToolbar,
        showPreviewTitle = true,
        previewTitle = "Preview",
        validation,
        id,
        ...renderer
    } = props;

    // Local state keeps the caret stable while typing; it re-syncs when the attribute changes elsewhere.
    const [draft, setDraft] = useState(value);
    const [syncedValue, setSyncedValue] = useState(value);
    const dirty = useRef(false);
    if (value !== syncedValue) {
        setSyncedValue(value);
        setDraft(value);
    }

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    // Selection to restore after a toolbar action has re-rendered the textarea.
    const pendingSelection = useRef<Selection | null>(null);
    useEffect(() => {
        const textarea = textareaRef.current;
        const selection = pendingSelection.current;
        if (textarea && selection) {
            pendingSelection.current = null;
            textarea.focus();
            textarea.setSelectionRange(selection.start, selection.end);
        }
    });

    const update = useCallback(
        (next: string) => {
            setDraft(next);
            dirty.current = true;
            onChange(next);
        },
        [onChange]
    );

    const handleChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => update(event.target.value), [update]);

    const handleFormat = useCallback(
        (format: FormatId) => {
            const textarea = textareaRef.current;
            if (!textarea || readOnly) {
                return;
            }
            const result = applyFormat(format, textarea.value, {
                start: textarea.selectionStart,
                end: textarea.selectionEnd
            });
            pendingSelection.current = result.selection;
            update(result.text);
        },
        [readOnly, update]
    );

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLTextAreaElement>) => {
            if (!showToolbar || !(event.ctrlKey || event.metaKey) || event.altKey) {
                return;
            }
            const format = SHORTCUTS[event.key.toLowerCase()];
            if (format) {
                event.preventDefault();
                handleFormat(format);
            }
        },
        [showToolbar, handleFormat]
    );

    const handleBlur = useCallback(() => {
        if (dirty.current) {
            dirty.current = false;
            onCommit?.();
        }
    }, [onCommit]);

    const [popupOpen, setPopupOpen] = useState(false);
    const openPopup = useCallback(() => setPopupOpen(true), []);
    const closePopup = useCallback(() => setPopupOpen(false), []);

    const isPopup = layout === "popup";
    const showInlinePreview = layout === "sideBySide" || layout === "stacked";
    const isEmpty = draft.trim().length === 0;
    const previewContent = isEmpty ? (
        emptyText ? (
            <p className="widget-markdown-placeholder">{emptyText}</p>
        ) : null
    ) : (
        <MarkdownRenderer source={draft} {...renderer} />
    );

    return (
        <div
            className={classNames("widget-markdown-editor", `widget-markdown-editor-${layout}`, {
                "has-error": !!validation
            })}
        >
            <div className="widget-markdown-editor-panes">
                <div className={classNames("widget-markdown-editor-input", { "has-toolbar": showToolbar || isPopup })}>
                    {showToolbar || isPopup ? (
                        <MarkdownToolbar
                            onFormat={handleFormat}
                            disabled={readOnly}
                            onPreview={isPopup ? openPopup : undefined}
                            formattingHidden={!showToolbar}
                        />
                    ) : null}
                    <textarea
                        id={id}
                        ref={textareaRef}
                        className="form-control widget-markdown-textarea"
                        value={draft}
                        rows={rows}
                        placeholder={placeholder}
                        readOnly={readOnly}
                        disabled={readOnly}
                        spellCheck={false}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                        aria-invalid={!!validation}
                    />
                </div>
                {showInlinePreview ? (
                    <div
                        className={classNames("widget-markdown-preview", { "has-title": showPreviewTitle })}
                        role="region"
                        aria-label={previewTitle}
                    >
                        {showPreviewTitle ? <div className="widget-markdown-preview-header">{previewTitle}</div> : null}
                        <div className="widget-markdown-preview-body widget-markdown" aria-live="polite">
                            {previewContent}
                        </div>
                    </div>
                ) : null}
            </div>
            {isPopup && popupOpen ? (
                <MarkdownPreviewDialog title={previewTitle} onClose={closePopup}>
                    {previewContent}
                </MarkdownPreviewDialog>
            ) : null}
            {validation ? (
                <div className="alert alert-danger mx-validation-message" role="alert">
                    {validation}
                </div>
            ) : null}
        </div>
    );
}
