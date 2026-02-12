import Mustache from "mustache"
import { Liquid } from "liquidjs"
import Handlebars from "handlebars"
import { marked } from "marked"
import { parseTemplate, parseVariables, mergeVariables } from "./parse"
import type { RenderOptions, RenderResult, TemplateEngine } from "./types"

/**
 * Render a template string with the specified engine.
 * Does NOT process frontmatter or markdown — use `render()` for the full pipeline.
 */
export async function renderWithEngine(
  content: string,
  variables: Record<string, unknown>,
  engine: TemplateEngine,
): Promise<string> {
  switch (engine) {
    case "liquid": {
      const liquid = new Liquid()
      return liquid.parseAndRender(content, variables)
    }
    case "mustache":
      return Mustache.render(content, variables)
    case "handlebars":
    default: {
      const compiled = Handlebars.compile(content)
      return compiled(variables)
    }
  }
}

/**
 * Convert a markdown string to HTML.
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  marked.setOptions({ breaks: true, gfm: true })
  return marked(markdown)
}

/**
 * Full rendering pipeline:
 * 1. Parse frontmatter (extract engine + frontmatter variables)
 * 2. Parse YAML variables string
 * 3. Merge variables (frontmatter defaults, explicit overrides)
 * 4. Render through the detected template engine
 * 5. Convert markdown output to HTML
 *
 * @param templateStr - Template string with optional frontmatter
 * @param variables   - YAML string or pre-parsed variables object
 * @param options     - Optional overrides (e.g., force a specific engine)
 */
export async function render(
  templateStr: string,
  variables: string | Record<string, unknown> = {},
  options: RenderOptions = {},
): Promise<RenderResult> {
  const parsed = parseTemplate(templateStr)
  const engine = options.engine || parsed.engine

  const explicitVars =
    typeof variables === "string" ? parseVariables(variables) : variables

  const merged = mergeVariables(parsed.frontmatterVars, explicitVars)
  const raw = await renderWithEngine(parsed.content, merged, engine)
  const html = await markdownToHtml(raw)

  return { raw, html, engine }
}
