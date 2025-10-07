import { expect, test, describe, beforeEach, beforeAll } from "bun:test";
import { Work } from "../src/work";

const url = "https://archiveofourown.org/works/51759202/chapters/130853899";
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

describe("work loading tests", () => {
    beforeAll( async () => {
        await work.load()
    })

    test("work is able to load the title", async () => {
        const actual = work.title;
        expect(actual).toBe("you have already left kudos here")
    })

    test("work is able to load the az3 link", async () => {
        const actual = work.azw3Link
        expect(actual).toBe("/downloads/51759202/you_have_already_left.azw3?updated_at=1746316851")
    })
})