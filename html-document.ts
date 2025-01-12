import { JSDOM } from "jsdom";

type AnotherProps = {
    size: string;
};
type CSSDeclarations = Partial<CSSStyleDeclaration> | AnotherProps;
type CustomClasses = Partial<Record<string, CSSDeclarations>>;
type HTMLElementNames = Partial<Record<keyof HTMLElementTagNameMap, CSSDeclarations>>;
export type StyleSheet = CustomClasses & HTMLElementNames;

class HTMLDocument {
    private htmlTemplate: string = "<!DOCTYPE html><html><head><style></style></head><body></body></html>";
    private styleSheet: StyleSheet;
    document: Document;

    constructor(htmlTemplate?: string) {
        this.htmlTemplate = htmlTemplate || this.htmlTemplate;

        this.document = new JSDOM(this.htmlTemplate).window.document;
        this.styleSheet = {};
    }

    appendStyles(styles: StyleSheet) {
        this.styleSheet = {
            ...this.styleSheet,
            ...styles,
        };
        const headStyle = this.document.querySelector("style");
        if (headStyle) headStyle.innerHTML = this.convertToHTMLHeadStyle(this.styleSheet);
    }

    removeStyle(styles: string | string[]) {
        if (typeof styles === "string") {
            delete this.styleSheet[styles as string];
        } else if (styles instanceof Array) {
            styles.map((style) => {
                delete this.styleSheet[style];
            });
        }
        const headStyle = this.document.querySelector("style");
        if (headStyle) headStyle.innerHTML = this.convertToHTMLHeadStyle(this.styleSheet);
    }

    appendElement<T extends keyof HTMLElementTagNameMap>(appendTo: keyof HTMLElementTagNameMap | (string & Object), htmlElement: T, createdElement: (htmlElement: HTMLElementTagNameMap[T]) => void) {
        let query: HTMLElement | Element | null;

        if (appendTo.startsWith("#")) query = this.document.getElementById(appendTo.slice(1));
        else if (appendTo.startsWith(".")) query = this.document.getElementsByClassName(appendTo)[0];
        else query = this.document.querySelector(appendTo);

        const newElement = this.document.createElement(htmlElement);

        query?.appendChild(newElement);

        createdElement(newElement);
    }

    get documentElement(): HTMLElement {
        return this.document.documentElement;
    }

    private convertToHTMLHeadStyle = (style: StyleSheet): string => {
        return JSON.stringify(style)
            .replace(/:{/g, "{")
            .replace(/},/g, "}")
            .replace(/"([a-zA-Z0-9.@()%_/\-'*:,\s]+)"/g, "$1")
            .replace(/([a-z]):([a-zA-Z0-9()./\-:'%*\s]+),/g, "$1:$2;")
            .replace(/([A-Z])/g, "-$1")
            .toLocaleLowerCase()
            .slice(1, -1);
    };

    convertToElementStyleAttribute = (style: Partial<CSSStyleDeclaration>): string => {
        return JSON.stringify(style)
            .replace(/"([a-zA-Z0-9()*]+)"/g, "$1")
            .replace(/([a-z]):([a-zA-Z0-9()%*]+),/g, "$1:$2;")
            .replace(/([A-Z])/g, "-$1")
            .toLocaleLowerCase()
            .slice(1, -1);
    };
}

export default HTMLDocument;
