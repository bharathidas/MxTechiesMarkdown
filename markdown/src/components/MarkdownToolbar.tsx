import { ReactElement, ReactNode } from "react";
import { FormatId } from "./formatting";

interface ToolbarItem {
    id: FormatId;
    label: string;
    shortcut?: string;
    icon: ReactNode;
}

interface ToolbarGroup {
    items: ToolbarItem[];
}

const svg = (children: ReactNode): ReactElement => (
    <svg
        viewBox="0 0 16 16"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        {children}
    </svg>
);

const GROUPS: ToolbarGroup[] = [
    {
        items: [
            {
                id: "bold",
                label: "Bold",
                shortcut: "Ctrl+B",
                icon: svg(<path d="M4.5 2.5h4a2.5 2.5 0 0 1 0 5h-4zM4.5 7.5h4.75a2.75 2.75 0 0 1 0 5.5H4.5z" />)
            },
            {
                id: "italic",
                label: "Italic",
                shortcut: "Ctrl+I",
                icon: svg(<path d="M6.5 2.5h5M4.5 13.5h5M9.5 2.5l-3 11" />)
            },
            {
                id: "strikethrough",
                label: "Strikethrough",
                icon: svg(
                    <path d="M2.5 8h11M11 4.5c-.4-1.3-1.6-2-3-2-1.8 0-3 1-3 2.3 0 .8.4 1.3 1 1.7M5 11.5c.5 1.2 1.6 2 3 2 1.8 0 3-1 3-2.3 0-.7-.3-1.2-.8-1.6" />
                )
            },
            {
                id: "heading",
                label: "Heading (cycles H1, H2, H3)",
                icon: svg(<path d="M3 3v10M10 3v10M3 8h7" />)
            }
        ]
    },
    {
        items: [
            {
                id: "quote",
                label: "Quote",
                icon: svg(
                    <>
                        <path d="M3 3v10" strokeWidth="2" />
                        <path d="M6.5 5h7M6.5 8h7M6.5 11h5" />
                    </>
                )
            },
            {
                id: "code",
                label: "Inline code",
                icon: svg(<path d="M6 4l-3.5 4L6 12M10 4l3.5 4L10 12" />)
            },
            {
                id: "codeBlock",
                label: "Code block",
                icon: svg(
                    <>
                        <rect x="2" y="2.5" width="12" height="11" rx="1.5" />
                        <path d="M6.5 6l-2 2 2 2M9.5 6l2 2-2 2" />
                    </>
                )
            }
        ]
    },
    {
        items: [
            {
                id: "link",
                label: "Link",
                shortcut: "Ctrl+K",
                icon: svg(
                    <path d="M6.5 9.5l3-3M7 4.5l1.2-1.2a2.5 2.5 0 0 1 3.5 3.5L10.5 8M9 11.5l-1.2 1.2a2.5 2.5 0 0 1-3.5-3.5L5.5 8" />
                )
            },
            {
                id: "image",
                label: "Image",
                icon: svg(
                    <>
                        <rect x="2" y="3" width="12" height="10" rx="1.5" />
                        <circle cx="5.5" cy="6.5" r="1" />
                        <path d="M14 10.5l-3.5-3.5-5 5" />
                    </>
                )
            }
        ]
    },
    {
        items: [
            {
                id: "bulletList",
                label: "Bullet list",
                icon: svg(<path d="M6 4h8M6 8h8M6 12h8M3 4h.01M3 8h.01M3 12h.01" strokeWidth="2" />)
            },
            {
                id: "numberedList",
                label: "Numbered list",
                icon: svg(
                    <path d="M7 4h7M7 8h7M7 12h7M2.5 3.5l1-.5v3M2.3 12.5h2.2l-2.2-2.2 0-0.3c0-.6.5-1 1.1-1s1.1.4 1.1 1" />
                )
            },
            {
                id: "taskList",
                label: "Task list",
                icon: svg(
                    <>
                        <rect x="2" y="3" width="4.5" height="4.5" rx="1" />
                        <rect x="2" y="9" width="4.5" height="4.5" rx="1" />
                        <path d="M3 5.3l1 1 1.7-1.8M9 5.25h5M9 11.25h5" />
                    </>
                )
            }
        ]
    },
    {
        items: [
            {
                id: "table",
                label: "Table",
                icon: svg(
                    <>
                        <rect x="2" y="2.5" width="12" height="11" rx="1.5" />
                        <path d="M2 6.5h12M2 10h12M6.5 6.5v7M10.5 6.5v7" />
                    </>
                )
            },
            {
                id: "rule",
                label: "Horizontal rule",
                icon: svg(<path d="M2 8h12" />)
            }
        ]
    }
];

export const SHORTCUTS: Record<string, FormatId> = { b: "bold", i: "italic", k: "link" };

export interface MarkdownToolbarProps {
    onFormat: (id: FormatId) => void;
    disabled: boolean;
    /** When set, a Preview button is shown at the right end of the toolbar. */
    onPreview?: () => void;
    /** Hides the formatting buttons and shows only the Preview button. */
    formattingHidden?: boolean;
}

const PREVIEW_ICON = svg(
    <>
        <path d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8s-2.5 4.5-6.5 4.5S1.5 8 1.5 8z" />
        <circle cx="8" cy="8" r="2" />
    </>
);

export function MarkdownToolbar({
    onFormat,
    disabled,
    onPreview,
    formattingHidden
}: MarkdownToolbarProps): ReactElement {
    return (
        <div className="widget-markdown-toolbar" role="toolbar" aria-label="Markdown formatting">
            {onPreview ? (
                <button
                    type="button"
                    className="widget-markdown-toolbar-button widget-markdown-toolbar-preview"
                    title="Preview"
                    data-action="preview"
                    onClick={onPreview}
                >
                    {PREVIEW_ICON}
                    <span>Preview</span>
                </button>
            ) : null}
            {formattingHidden
                ? null
                : GROUPS.map((group, index) => (
                      <div className="widget-markdown-toolbar-group" key={index}>
                          {group.items.map(item => {
                              const title = item.shortcut ? `${item.label} (${item.shortcut})` : item.label;
                              return (
                                  <button
                                      key={item.id}
                                      type="button"
                                      className="widget-markdown-toolbar-button"
                                      title={title}
                                      aria-label={title}
                                      disabled={disabled}
                                      data-format={item.id}
                                      // Keep focus (and the selection) in the textarea when clicking a button.
                                      onMouseDown={event => event.preventDefault()}
                                      onClick={() => onFormat(item.id)}
                                  >
                                      {item.icon}
                                  </button>
                              );
                          })}
                      </div>
                  ))}
        </div>
    );
}
