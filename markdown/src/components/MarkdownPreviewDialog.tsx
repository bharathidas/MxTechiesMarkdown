import { KeyboardEvent, ReactElement, ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export interface MarkdownPreviewDialogProps {
    title: string;
    onClose: () => void;
    children: ReactNode;
}

/** Modal dialog rendered into document.body so the editor's container cannot clip it. */
export function MarkdownPreviewDialog({ title, onClose, children }: MarkdownPreviewDialogProps): ReactElement {
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const previouslyFocused = document.activeElement as HTMLElement | null;
        closeButtonRef.current?.focus();
        const { overflow } = document.body.style;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = overflow;
            previouslyFocused?.focus?.();
        };
    }, []);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
        if (event.key === "Escape") {
            event.stopPropagation();
            onClose();
        }
    };

    const dialog = (
        <div className="widget-markdown-dialog-backdrop" onMouseDown={onClose}>
            <div
                className="widget-markdown-dialog"
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onMouseDown={event => event.stopPropagation()}
                onKeyDown={handleKeyDown}
            >
                <div className="widget-markdown-dialog-header">
                    <span className="widget-markdown-dialog-title">{title}</span>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        className="widget-markdown-dialog-close"
                        aria-label="Close preview"
                        title="Close (Esc)"
                        onClick={onClose}
                    >
                        <svg
                            viewBox="0 0 16 16"
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            aria-hidden="true"
                        >
                            <path d="M4 4l8 8M12 4l-8 8" />
                        </svg>
                    </button>
                </div>
                <div className="widget-markdown-dialog-body widget-markdown">{children}</div>
            </div>
        </div>
    );

    return createPortal(dialog, document.body);
}
