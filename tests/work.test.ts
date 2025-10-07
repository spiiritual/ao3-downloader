import {expect, test, beforeEach} from "bun:test";
import {Work} from "../src/work";

const url = "https://archiveofourown.org/works/51759202/chapters/130853899";
const workTitle = "you have already left kudos here"
const azw3Link = "/downloads/51759202/you_have_already_left.azw3?updated_at=1746316851"
const epubLink = "/downloads/51759202/you_have_already_left.epub?updated_at=1746316851"
const mobiLink = "/downloads/51759202/you_have_already_left.mobi?updated_at=1746316851"
const pdfLink = "/downloads/51759202/you_have_already_left.pdf?updated_at=1746316851"
const htmlLink = "/downloads/51759202/you_have_already_left.html?updated_at=1746316851"

let work: Work;

beforeEach(() => {
    work = new Work(url);
})

test("work starts with assigned url", () => {
    const actual = work.url;
    expect(actual).toBe(url);
});

test("work starts with no title", () => {
    const actual = work.title;
    expect(actual).toBeNull();
});

test("work starts with no azw3 link", () => {
    const actual = work.azw3Link;
    expect(actual).toBeNull()
})

test("work starts with no epub link", () => {
    const actual = work.epubLink;
    expect(actual).toBeNull()
})

test("work starts with no mobi link", () => {
    const actual = work.mobiLink;
    expect(actual).toBeNull()
})

test("work starts with no PDF link", () => {
    const actual = work.pdfLink;
    expect(actual).toBeNull()
})

test("work starts with no HTML link", () => {
    const actual = work.htmlLink;
    expect(actual).toBeNull()
})

test("work is able to load the title", async() => {
    await work.load()
    const actual = work.title;
    expect(actual).toBe(workTitle)
})

test("work is able to load the az3 link", async() => {
    await work.load(["azw3"])
    const actual = work.azw3Link;
    expect(actual).toBe(azw3Link)
})

test("work is able to load the epub link", async() => {
    await work.load(["epub"])
    const actual = work.epubLink;
    expect(actual).toBe(epubLink)
})

test("work is able to load the mobi link", async() => {
    await work.load(["mobi"])
    const actual = work.mobiLink;
    expect(actual).toBe(mobiLink)
})

test("work is able to load the pdf link", async() => {
    await work.load(["pdf"])
    const actual = work.pdfLink;
    expect(actual).toBe(pdfLink)
})

test("work is able to load the html link", async() => {
    await work.load(["html"])
    const actual = work.htmlLink;
    expect(actual).toBe(htmlLink)
})

