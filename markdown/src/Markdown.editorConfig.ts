import { MarkdownPreviewProps } from "../typings/MarkdownProps";

export type Properties = PropertyGroup[];

type PropertyGroup = {
    caption: string;
    propertyGroups?: PropertyGroup[];
    properties?: Property[];
};

type Property = {
    key: string;
    caption: string;
    description?: string;
    objectHeaders?: string[];
    objects?: ObjectProperties[];
    properties?: Properties[];
};

type ObjectProperties = {
    properties: PropertyGroup[];
    captions?: string[];
};

export type Problem = {
    property?: string;
    severity?: "error" | "warning" | "deprecation";
    message: string;
    studioMessage?: string;
    url?: string;
    studioUrl?: string;
};

type BaseProps = {
    type: "Image" | "Container" | "RowLayout" | "Text" | "DropZone" | "Selectable" | "Datasource";
    grow?: number;
};

type ImageProps = BaseProps & {
    type: "Image";
    document?: string;
    data?: string;
    property?: object;
    width?: number;
    height?: number;
};

type ContainerProps = BaseProps & {
    type: "Container" | "RowLayout";
    children: PreviewProps[];
    borders?: boolean;
    borderRadius?: number;
    backgroundColor?: string;
    borderWidth?: number;
    padding?: number;
};

type RowLayoutProps = ContainerProps & {
    type: "RowLayout";
    columnSize?: "fixed" | "grow";
};

type TextProps = BaseProps & {
    type: "Text";
    content: string;
    fontSize?: number;
    fontColor?: string;
    bold?: boolean;
    italic?: boolean;
};

type DropZoneProps = BaseProps & {
    type: "DropZone";
    property: object;
    placeholder: string;
    showDataSourceHeader?: boolean;
};

type SelectableProps = BaseProps & {
    type: "Selectable";
    object: object;
    child: PreviewProps;
};

type DatasourceProps = BaseProps & {
    type: "Datasource";
    property: object | null;
    child?: PreviewProps;
};

export type PreviewProps =
    | ImageProps
    | ContainerProps
    | RowLayoutProps
    | TextProps
    | DropZoneProps
    | SelectableProps
    | DatasourceProps;

function hideProperties(groups: PropertyGroup[], keys: string[]): void {
    for (const group of groups) {
        if (group.properties) {
            group.properties = group.properties.filter(property => !keys.includes(property.key));
        }
        if (group.propertyGroups) {
            hideProperties(group.propertyGroups, keys);
        }
    }
}

function hideGroups(groups: PropertyGroup[], captions: string[]): PropertyGroup[] {
    return groups.filter(group => !captions.includes(group.caption));
}

export function getProperties(values: MarkdownPreviewProps, defaultProperties: Properties): Properties {
    if (values.mode === "edit") {
        const hidden = ["content"];
        if (values.editorLayout === "hidden") {
            hidden.push("showPreviewTitle", "previewTitle");
        } else if (values.editorLayout === "popup") {
            hidden.push("showPreviewTitle");
        } else if (!values.showPreviewTitle) {
            hidden.push("previewTitle");
        }
        hideProperties(defaultProperties, hidden);
        return defaultProperties;
    }
    hideProperties(defaultProperties, ["markdownAttribute"]);
    return hideGroups(defaultProperties, ["Editor"]);
}

export function check(values: MarkdownPreviewProps): Problem[] {
    const problems: Problem[] = [];
    if (values.mode === "edit") {
        if (!values.markdownAttribute) {
            problems.push({
                property: "markdownAttribute",
                severity: "error",
                message: "Select the String attribute that holds the Markdown source to edit."
            });
        }
        if ((values.editorRows ?? 0) < 1) {
            problems.push({
                property: "editorRows",
                severity: "error",
                message: "Editor rows must be at least 1."
            });
        }
    } else if (!values.content || values.content.trim().length === 0) {
        problems.push({
            property: "content",
            severity: "warning",
            message: "No Markdown content is configured; the widget will render nothing."
        });
    }
    return problems;
}

export function getPreview(values: MarkdownPreviewProps, isDarkMode: boolean): PreviewProps {
    const edit = values.mode === "edit";
    const detail = edit ? values.markdownAttribute || "(no attribute)" : values.content?.trim() || "(no content)";
    const title = isDarkMode ? "#DEDEDE" : "#2F3646";
    const muted = isDarkMode ? "#A4A4A4" : "#6B707B";
    const background = isDarkMode ? "#3B3B3B" : "#F8F8F8";

    const label = (text: string): PreviewProps => ({
        type: "Text",
        content: text,
        bold: true,
        fontSize: 12,
        fontColor: title
    });
    const note = (text: string): PreviewProps => ({ type: "Text", content: text, fontSize: 10, fontColor: muted });

    if (!edit) {
        return {
            type: "Container",
            borders: true,
            borderRadius: 4,
            padding: 8,
            backgroundColor: background,
            children: [label("Markdown"), note(detail)]
        };
    }

    const editorPane: PreviewProps = {
        type: "Container",
        grow: 1,
        borders: true,
        borderRadius: 4,
        padding: 8,
        backgroundColor: isDarkMode ? "#2B2B2B" : "#FFFFFF",
        children: [label("Markdown editor"), note(detail)]
    };
    const previewPane: PreviewProps = {
        type: "Container",
        grow: 1,
        borders: true,
        borderRadius: 4,
        padding: 8,
        backgroundColor: background,
        children: [
            label(values.showPreviewTitle ? values.previewTitle?.trim() || "Preview" : "Preview"),
            note("Live rendered Markdown")
        ]
    };

    if (values.editorLayout === "hidden") {
        return editorPane;
    }
    if (values.editorLayout === "popup") {
        return {
            type: "Container",
            grow: 1,
            borders: true,
            borderRadius: 4,
            padding: 8,
            backgroundColor: isDarkMode ? "#2B2B2B" : "#FFFFFF",
            children: [label("Markdown editor"), note(detail), note("Preview opens in a popup from the toolbar")]
        };
    }
    if (values.editorLayout === "stacked") {
        return { type: "Container", children: [editorPane, previewPane] };
    }
    return { type: "RowLayout", columnSize: "grow", children: [editorPane, previewPane] };
}

export function getCustomCaption(values: MarkdownPreviewProps): string {
    if (values.mode === "edit") {
        return values.markdownAttribute ? `Markdown editor: ${values.markdownAttribute}` : "Markdown editor";
    }
    const expression = (values.content ?? "").trim();
    return expression ? `Markdown: ${expression}` : "Markdown";
}
