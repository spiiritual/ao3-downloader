export abstract class Filetype {
    static fileTypeName: string;
    static cssSelector: string;
}

export class Azw3 extends Filetype {
    static override fileTypeName = "AZW3"
    static override cssSelector = "li.download > ul > li:nth-child(1) > a"
}

export class Epub extends Filetype {
    static override fileTypeName = "EPUB"
    static override cssSelector = "li.download > ul > li:nth-child(2) > a"
}

export class Mobi extends Filetype {
    static override fileTypeName = "MOBI"
    static override cssSelector = "li.download > ul > li:nth-child(3) > a"
}
export class Pdf extends Filetype {
    static override fileTypeName = "PDF"
    static override cssSelector = "li.download > ul > li:nth-child(4) > a"
}
export class Html extends Filetype {
    static override fileTypeName = "HTML"
    static override cssSelector = "li.download > ul > li:nth-child(5) > a"
}