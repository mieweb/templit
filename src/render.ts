import { parseTemplate, parseVariables, mergeVariables } from "./parse"
import { decorateFieldLinks } from "./field-links"
import { getMarkdown, resolveEngine } from "./registry"
import type {
  Engine,
  RenderOptions,
  RenderResult,
  TemplateEngineName,
} from "./types"

/**
 * Render a template string with the given engine — either an imported `Engine`
 * or the name of one registered via `registerEngine`.
 * Does NOT process frontmatter or markdown — use `render()` for the full pipeline.
 */
export async function renderWithEngine(
  content: string,
  variables: Record<string, unknown>,
  engine: TemplateEngineName | Engine,
): Promise<string> {
  return resolveEngine(engine).render(content, variables)
}

/**
 * Full rendering pipeline:
 * 1. Parse frontmatter (extract engine + frontmatter variables)
 * 2. Parse YAML variables string
 * 3. Merge variables (frontmatter defaults, explicit overrides)
 * 4. Render through the detected template engine
 * 5. Convert markdown output to HTML (when a markdown renderer is available)
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
  const engine = resolveEngine(options.engine || parsed.engine)

  const explicitVars =
    typeof variables === "string" ? parseVariables(variables) : variables

  const merged = mergeVariables(parsed.frontmatterVars, explicitVars)
  // Clone before decorating so the toString/toHTML overrides never leak into a
  // caller's variables object across render calls.
  const vars =
    options.fieldLinks !== false
      ? decorateFieldLinks(structuredClone(merged))
      : merged
  const raw = await engine.render(parsed.content, vars)

  const markdown = options.markdown ?? getMarkdown()
  const html = markdown ? await markdown(raw) : undefined

  return { raw, html, engine: engine.name }
}
