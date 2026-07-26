# templit

**Documents that stay connected to their data.**

**templit** is a TypeScript template engine for markdown: YAML front matter in,
clean markdown and HTML out — via **Handlebars**, **Mustache**, or **Liquid**.
Write a document once as a reusable template, fill it with data, and every
rendered value stays *linked* back to the field it came from.

It's the reference implementation of the **[MDY format](doc/mdy-specification.md)**:
a two-tier standard where `.mdyt` templates flatten into `.mdy` documents that
any markdown viewer can read — contracts, quotes, patient encounters, reports —
while editors that know the format can edit the data and the prose as one.

## Why It's Cool

- **Three engines, one API** — use Handlebars, Mustache, or Liquid interchangeably. Pick the syntax you know best, or switch per-template.
- **Implicit field links** — interpolate a whole field object and templit emits `[display](#id)` markdown that stays addressable back to the front matter (see [MDY & MDYT](#mdy--mdyt-linked-documents)).
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

## MDY & MDYT: Linked Documents

templit's biggest idea: the rendered document shouldn't forget where its data
came from. When a template interpolates a **field-shaped** variable — an object
with `display` and/or `value` (+ optional `unit`) — the output is a **field
link**, not bare text:

```markdown
---
height: { value: 180, unit: cm, display: "5'11\"" }
---
- Height: {{height}}
```

renders as

```markdown
- Height: [5'11"](#height)
```

Plain markdown viewers just see a link. MDY-aware editors see an addressable
span wired to the front matter — edit the data, and the prose updates.
Explicit paths (`{{height.value}}`) still interpolate plainly, and
`fieldLinks: false` disables the behavior.

This is the flatten step of the two-tier **MDY format**:

| Extension | Tier | Template syntax (`{{…}}`, `{{#each}}`)? | Opens in any markdown viewer? |
|---|---|---|---|
| `.mdyt` | Template | Yes | No — render it first |
| `.mdy` / `.md` | Document | Never | Yes |

- **Specification:** [doc/mdy-specification.md](doc/mdy-specification.md)
- **Runnable samples** (`.mdyt` → `.mdy` → `.md` trios, incl. a FHIR patient encounter): [samples/README.md](samples/README.md)

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
src/             # Library source (TypeScript)
  index.ts       # Public exports
  parse.ts       # Frontmatter and YAML parsing
  render.ts      # Template rendering and markdown conversion
  field-links.ts # Implicit field-link decoration (MDY)
  types.ts       # TypeScript types
doc/             # MDY/MDYT format specification
samples/         # Runnable .mdyt/.mdy/.md sample sets
test/            # Unit tests (Vitest)
web/             # Interactive playground (Next.js)
dist/            # Compiled output (ESM + CJS)
```

## License

MIT
