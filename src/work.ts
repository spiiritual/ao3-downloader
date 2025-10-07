import * as url from "node:url";
import {parse} from 'node-html-parser';

export class Work {
    private _url: string;
    private _title: string | null;
    private _azw3Link: string | null;
    private _htmlLink: string | null;
    private _pdfLink: string | null;
    private _mobiLink: string | null;
    private _epubLink: string | null;

    constructor(url: string) {
        this._url = url;
        this._title = null;
        this._azw3Link = null;
        this._htmlLink = null;
        this._pdfLink = null;
        this._mobiLink = null;
        this._epubLink = null;
    }

    get url(): string {
        return this._url;
    }

    get title(): string {
        return <string>this._title;
    }

    get azw3Link(): string {
        return <string>this._azw3Link;
    }

    get htmlLink(): string {
        return <string>this._htmlLink;
    }

    get pdfLink(): string {
        return <string>this._pdfLink;
    }

    get mobiLink(): string {
        return <string>this._mobiLink;
    }

    get epubLink(): string {
        return <string>this._epubLink;
    }

    set title(value: string) {
        this._title = value;
    }

    set azw3Link(value: string) {
        this._azw3Link = value;
    }

    set htmlLink(value: string) {
        this._htmlLink = value;
    }

    set pdfLink(value: string) {
        this._pdfLink = value;
    }

    set mobiLink(value: string) {
        this._mobiLink = value;
    }

    set epubLink(value: string) {
        this._epubLink = value;
    }

    private extractTitleFromPage(pageContent: string): string {
        const root = parse(pageContent);
        const titleElement = root.querySelector("div.preface.group > h2.title")

        if (titleElement) {
            return titleElement.textContent.trim();
        } else {
            throw new Error("unable to find title");
        }
    }

    private extractAzw3Link(pageContent: string): string {
        const root = parse(pageContent);
        const azw3LinkElement = root.querySelector("li.download > ul > li:nth-child(1) > a")

        if (azw3LinkElement) {
            if (azw3LinkElement.textContent.trim() === "AZW3") {
                if (azw3LinkElement.attributes.href) {
                    return azw3LinkElement.attributes.href;
                } else {
                    throw new Error("unable to find azw3 link")
                }
            }
            throw new Error("unable to find azw3 link")
        } else {
            throw new Error("unable to find azw3 link")
        }
    }

    async load() {
        const response = await fetch(this.url + "?" + new URLSearchParams({
            "view_adult": "true"
        }))

        const pageContent: string = await response.text()

        this.title = this.extractTitleFromPage(pageContent);
        this.azw3Link = this.extractAzw3Link(pageContent);
        return
    }
}
