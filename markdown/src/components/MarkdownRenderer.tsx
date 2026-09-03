import { ReactElement, useMemo } from "react";
import ReactMarkdown, { Components, Options } from "react-markdown";
import remarkGfm from "remark-gfm";

export interface MarkdownRendererProps {
    source: string;
    gfm: boolean;
    skipHtml: boolean;
    openLinksInNewTab: boolean;
}

export function MarkdownRenderer({ source, gfm, skipHtml, openLinksInNewTab }: MarkdownRendererProps): ReactElement {
    const remarkPlugins = useMemo<Options["remarkPlugins"]>(() => (gfm ? [remarkGfm] : []), [gfm]);

    const components = useMemo<Components>(
        () => ({
            a: ({ node: _node, ...props }) =>
                openLinksInNewTab ? <a {...props} target="_blank" rel="noopener noreferrer" /> : <a {...props} />
        }),
        [openLinksInNewTab]
    );

    return (
        <ReactMarkdown remarkPlugins={remarkPlugins} skipHtml={skipHtml} components={components}>
            {source}
        </ReactMarkdown>
    );
}
