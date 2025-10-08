import {parse} from 'node-html-parser';
import { Filetype, Azw3, Epub, Pdf, Mobi, Html } from './filetypes.ts'

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

    private async extractTitleFromPage(pageContent: string): Promise<string> {
        const root = parse(pageContent);
        const titleElement = root.querySelector("div.preface.group > h2.title")

        if (titleElement) {
            return Promise.resolve(titleElement.textContent.trim());
        } else {
            throw new Error("unable to find title");
        }
    }

    private async extractDownloadLinkFromPage<T extends typeof Filetype>(pageContent: string, fileType: T): Promise<string> {
        const root = parse(pageContent);
        const linkElement = root.querySelector(fileType.cssSelector)

        if (!linkElement) {
            throw new Error(`unable to find ${fileType.fileTypeName} link`);
        }

        if (linkElement.textContent.trim() !== fileType.fileTypeName) {
            throw new Error(`unable to find ${fileType.fileTypeName} link`);
        }

        if (!linkElement.attributes.href) {
            throw new Error(`unable to find ${fileType.fileTypeName} link`);
        }

        return Promise.resolve(linkElement.attributes.href);

    }

    async load(formats?: [string]) {
        const response = await fetch(this.url + "?" + new URLSearchParams({
            "view_adult": "true"
        }))

        const pageContent: string = await response.text()

        const fetchers: { [key: string]: Promise<string> } = {
            title: this.extractTitleFromPage(pageContent)
        };

        formats?.forEach((formatString) => {
            switch(formatString) {
                case "azw3":
                    fetchers.azw3 = this.extractDownloadLinkFromPage(pageContent, Azw3);
                    break;
                case "epub":
                    fetchers.epub = this.extractDownloadLinkFromPage(pageContent, Epub);
                    break;
                case "mobi":
                    fetchers.mobi = this.extractDownloadLinkFromPage(pageContent, Mobi);
                    break;
                case "pdf":
                    fetchers.pdf = this.extractDownloadLinkFromPage(pageContent, Pdf);
                    break;
                case "html":
                    fetchers.html = this.extractDownloadLinkFromPage(pageContent, Html);
                    break;
            }
        })

        const results = await Promise.all(Object.values(fetchers));
        const keys = Object.keys(fetchers);

        keys.forEach((key, i) => {
            switch(key) {
                case "title":
                    if (results[i]) this._title = results[i];
                    break;
                case "azw3":
                    if (results[i]) this._azw3Link = results[i];
                    break;
                case "epub":
                    if (results[i]) this._epubLink = results[i];
                    break;
                case "mobi":
                    if (results[i]) this._mobiLink = results[i];
                    break;
                case "pdf":
                    if (results[i]) this._pdfLink = results[i];
                    break;
                case "html":
                    if (results[i]) this._htmlLink = results[i];
                    break;
            }
        });
    }
}
