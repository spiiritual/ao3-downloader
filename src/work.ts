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

    private async extractTitleFromPage(pageContent: string): Promise<string> {
        const root = parse(pageContent);
        const titleElement = root.querySelector("div.preface.group > h2.title")

        if (titleElement) {
            return Promise.resolve(titleElement.textContent.trim());
        } else {
            throw new Error("unable to find title");
        }
    }

    private async extractAzw3LinkFromPage(pageContent: string): Promise<string> {
        const root = parse(pageContent);
        const azw3LinkElement = root.querySelector("li.download > ul > li:nth-child(1) > a")

        if (azw3LinkElement) {
            if (azw3LinkElement.textContent.trim() === "AZW3") {
                if (azw3LinkElement.attributes.href) {
                    return Promise.resolve(azw3LinkElement.attributes.href);
                } else {
                    throw new Error("unable to find azw3 link")
                }
            }
            throw new Error("unable to find azw3 link")
        } else {
            throw new Error("unable to find azw3 link")
        }
    }

    private async extractEpubLinkFromPage(pageContent: string): Promise<string> {
        const root = parse(pageContent);
        const epubLinkElement = root.querySelector("li.download > ul > li:nth-child(2) > a")

        if (epubLinkElement) {
            if (epubLinkElement.textContent.trim() === "EPUB") {
                if (epubLinkElement.attributes.href) {
                    return Promise.resolve(epubLinkElement.attributes.href)
                } else {
                    throw new Error("unable to find epub link")
                }
            } else {
                throw new Error("unable to find epub link")
            }
        } else {
            throw new Error("unable to find epub link")
        }
    }

    private async extractMobiLinkFromPage(pageContent: string): Promise<string> {
        const root = parse(pageContent);
        const mobiLinkElement = root.querySelector("li.download > ul > li:nth-child(3) > a")

        if (mobiLinkElement) {
            if (mobiLinkElement.textContent.trim() === "MOBI") {
                if (mobiLinkElement.attributes.href) {
                    return Promise.resolve(mobiLinkElement.attributes.href)
                } else {
                    throw new Error("unable to find mobi link")
                }
            } else {
                throw new Error("unable to find mobi link")
            }
        } else {
            throw new Error("unable to find mobi link")
        }
    }

    private async extractPdfLinkFromPage(pageContent: string): Promise<string> {
        const root = parse(pageContent);
        const pdfLinkElement = root.querySelector("li.download > ul > li:nth-child(4) > a")

        if (pdfLinkElement) {
            if (pdfLinkElement.textContent.trim() === "PDF") {
                if (pdfLinkElement.attributes.href) {
                    return Promise.resolve(pdfLinkElement.attributes.href)
                } else {
                    throw new Error("unable to find pdf link")
                }
            } else {
                throw new Error("unable to find pdf link")
            }
        } else {
            throw new Error("unable to find pdf link")
        }
    }

    private async extractHtmlLinkFromPage(pageContent: string): Promise<string> {
        const root = parse(pageContent);
        const htmlLinkElement = root.querySelector("li.download > ul > li:nth-child(5) > a")

        if (htmlLinkElement) {
            if (htmlLinkElement.textContent.trim() === "HTML") {
                if (htmlLinkElement.attributes.href) {
                    return Promise.resolve(htmlLinkElement.attributes.href)
                } else {
                    throw new Error("unable to find html link")
                }
            } else {
                throw new Error("unable to find html link")
            }
        } else {
            throw new Error("unable to find html link")
        }
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
                    fetchers.azw3 = this.extractAzw3LinkFromPage(pageContent);
                    break;
                case "epub":
                    fetchers.epub = this.extractEpubLinkFromPage(pageContent);
                    break;
                case "mobi":
                    fetchers.mobi = this.extractMobiLinkFromPage(pageContent);
                    break;
                case "pdf":
                    fetchers.pdf = this.extractPdfLinkFromPage(pageContent);
                    break;
                case "html":
                    fetchers.html = this.extractHtmlLinkFromPage(pageContent);
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
