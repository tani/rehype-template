/**
 * @license
 * Copyright (c) 2020 TANIGUCHI Masaya.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const unified = require("unified")
const remark = require("remark-parse")
const remark2rehype = require("remark-rehype")
const frontmatter = require("remark-frontmatter")
const extract = require("remark-extract-frontmatter")
const stringify = require("rehype-stringify")
const { parse } = require("yaml")
const { html, template, doctype } = require(".")

test("Template with options and doctype", () => {
    const i = `
---
title: test
---
# test
test`;

    const t = (node, frontmatter) => html`
        ${doctype}
        <html>
            <head>
                <title>${frontmatter.title}</title>
            </head>
            <body>${node}</body>
        </html>
    `;

    const o = unified()
        .use(remark)
        .use(frontmatter)
        .use(extract, {yaml: parse})
        .use(remark2rehype)
        .use(template, {template: t})
        .use(stringify)
        .processSync(i)
    expect(o.toString()).toBe("<!doctype html><html><head><title>test</title></head><body><h1>test</h1>\n<p>test</p></body></html>")
})
test("Template with options", () => {
    const i = `
---
title: test
---
# test
test`;

    const t = (node, frontmatter) => html`
        <html>
            <head>
                <title>${frontmatter.title}</title>
            </head>
            <body>${node}</body>
        </html>
    `;

    const o = unified()
        .use(remark)
        .use(frontmatter)
        .use(extract, {yaml: parse})
        .use(remark2rehype)
        .use(template, {template: t})
        .use(stringify)
        .processSync(i)
    expect(o.toString()).toBe("<html><head><title>test</title></head><body><h1>test</h1>\n<p>test</p></body></html>")
})
test("Template without options", () => {
    const i = `
---
title: test
---
# test
test`;

    const o = unified()
        .use(remark)
        .use(frontmatter)
        .use(extract, {yaml: parse})
        .use(remark2rehype)
        .use(template)
        .use(stringify)
        .processSync(i)
    expect(o.toString()).toBe("<h1>test</h1>\n<p>test</p>")
})