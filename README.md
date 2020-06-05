# Rehype Template

Rehype plugin to wrap contents with [htm](https://github.com/developit/htm) template

## Installation

    npm install remark-frontmatter remark-extract-frontmatter rehype-template

## Usage

Say `example.md` looks as follows;

```markdown
---
title: Example
---
# Example
This is example
```

...and `example.js` like this:

```javascript
const vfile = require("to-vfile")
const report = require("vfile-report")
const unified = require("unified")
const remark = require("remark-parse")
const remark2rehype = require("remark-rehype")
const frontmatter = require("remark-frontmatter")
const extract = require("remark-extract-frontmatter")
const stringify = require("rehype-stringify")
const { parse } = require("yaml")
const { html, template, doctype } = require("rehype-template")

const t = (node, frontmatter) => html`
    ${doctype}
    ${comment("example")}
    <html>
        <head>
            <title>${frontmatter.title}</title>
        </head>
        <body>${node}</body>
    </html>
`

unified()
    .use(remark)
    .use(frontmatter)
    .use(extract, {yaml: parse})
    .use(remark2rehype)
    .use(template, {template: t})
    .use(stringify)
    .process(vfile.readSync("example.md"), (err, file) => {
        console.error(report(err || file))
        console.log(String(file))
    })
```

Now, running `node example` yields:

```html
<!doctype html><!--example--><html><head><title>Example</title></head><body><h1>Example</h1>
<p>This is example</p></body></html>
```

## API

### `rehype().use(template[, options])`

Wrap the content with `options.template`, which uses *template literal*.

- `options.template(node, frontmatter)`
    - `node` Syntax tree
    - `frontmatter` Object as frontmatter parsed by `remark-frontmatter` and `remark-extract-frontmatter`.
    - This function returns new syntax tree.

### `doctype`
Insert a doctype element into a template like the above.

### `comment(value)`
Insert a comment element into a template like the above.

### `html`

Template literal function defined as `htm.bind(h)` where `h` is [hastscript](https://github.com/syntax-tree/hastscript).

```javascript
> const name = "world"
> html`<p>hello, ${name}</p>`
```

The above code yields:

```javascript
{
  type: 'element',
  tagName: 'p',
  properties: {},
  children: [
    { type: 'text', value: 'hello, ' },
    { type: 'text', value: 'world' }
  ]
}
```

## Security

Use of `rehype-template` should be safe to use as `htm` should be safe to use. When in doubt, use `rehype-sanitize`.

## License

MIT &copy; TANIGUCHI Masaya