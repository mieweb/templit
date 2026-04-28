# templit

**templit** is a TypeScript template rendering engine that turns markdown templates into HTML — with built-in support for **Handlebars**, **Mustache**, and **Liquid** syntax, YAML frontmatter, and YAML-driven variables.

Write a document once as a reusable template. Fill it with data. Get back clean, rendered HTML. It's perfect for generating contracts, agreements, reports, emails, and any other document you need to produce programmatically.

## Why It's Cool

- **Three engines, one API** — use Handlebars, Mustache, or Liquid interchangeably. Pick the syntax you know best, or switch per-template.
- **Frontmatter-first** — declare the engine and default variable values right in the template using YAML frontmatter. No configuration files needed.
- **YAML variables** — supply data as a YAML string or a plain JavaScript object. Frontmatter defaults are automatically merged with any overrides you pass in.
- **Markdown → HTML pipeline** — rendered output is automatically converted to HTML via `marked`, so your templates can use headings, bold, lists, tables, and more.
- **TypeScript-native** — ships with full type definitions. Works with ESM and CommonJS.
- **Tiny surface area** — three core functions cover the full workflow: `render`, `renderWithEngine`, and `markdownToHtml`.
- **Interactive playground** — includes a live web UI (powered by Next.js + Monaco Editor) with real-world examples like MSAs, Software License Agreements, and HIPAA BAAs.

## Installation

```bash
npm install templit
```

## Quick Start

```ts
import { render } from "templit"

const template = `
---
engine: handlebars
---
# {{title}}

Hello, **{{name}}**! Your order #{{orderId}} is confirmed.
`

const variables = `
title: Order Confirmation
name: Alice
orderId: 98765
`

const result = await render(template, variables)

console.log(result.raw)   // rendered markdown string
console.log(result.html)  // rendered HTML string
console.log(result.engine) // "handlebars"
```

## Template Engines

Choose your engine in frontmatter:

```yaml
---
engine: handlebars  # default
---
```

```yaml
---
engine: mustache
---
```

```yaml
---
engine: liquid
---
```

If no `engine` key is present (or the value is unrecognized), **Handlebars** is used by default.

## Frontmatter Variables

Variables can be declared directly in frontmatter as defaults:

```markdown
---
engine: handlebars
greeting: Hello
company: Acme Corp
---
**{{greeting}}** from **{{company}}**!
```

Explicit variables passed to `render()` override frontmatter values.

## API

### `render(templateStr, variables?, options?)`

Full pipeline: parse frontmatter → merge variables → render → convert to HTML.

```ts
const result = await render(templateStr, variables, options)
// result.raw    — rendered markdown
// result.html   — rendered HTML
// result.engine — engine used
```

- `variables` — YAML string or plain object (optional)
- `options.engine` — override the engine detected from frontmatter

### `renderWithEngine(content, variables, engine)`

Render a template string directly with a specific engine, skipping frontmatter parsing and markdown conversion.

```ts
const output = await renderWithEngine("Hello {{name}}", { name: "World" }, "handlebars")
```

### `markdownToHtml(markdown)`

Convert a markdown string to HTML.

```ts
const html = await markdownToHtml("# Hello\n\n**Bold** text.")
```

### Parse utilities

```ts
import { parseTemplate, parseVariables, mergeVariables } from "templit"

// Parse frontmatter from a template string
const { content, engine, frontmatterVars } = parseTemplate(templateStr)

// Parse a YAML string into an object
const vars = parseVariables(yamlStr)

// Merge frontmatter defaults with explicit overrides
const merged = mergeVariables(frontmatterVars, explicitVars)
```

## Real-World Example: Contract Template

```markdown
---
engine: handlebars
---
# MASTER SERVICE AGREEMENT

**Effective Date:** {{effectiveDate}}

**Provider:** {{provider.name}} — {{provider.email}}

**Client:** {{client.name}}

## Services

{{#each services}}
- {{this}}
{{/each}}

Either party may terminate with {{noticePeriod}} days written notice.
```

```yaml
effectiveDate: "2025-02-10"
noticePeriod: 30
provider:
  name: "Acme Solutions Inc."
  email: "contracts@acme.com"
client:
  name: "Global Enterprises LLC"
services:
  - "Software Development"
  - "Technical Consulting"
```

```ts
const result = await render(template, variables)
// result.html contains fully rendered, HTML-formatted contract
```

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test

# Watch mode for tests
npm run test:watch

# Run the web playground
npm run dev
```

## Project Structure

```
src/           # Library source (TypeScript)
  index.ts     # Public exports
  parse.ts     # Frontmatter and YAML parsing
  render.ts    # Template rendering and markdown conversion
  types.ts     # TypeScript types
test/          # Unit tests (Vitest)
web/           # Interactive playground (Next.js)
dist/          # Compiled output (ESM + CJS)
```

## License

MIT
