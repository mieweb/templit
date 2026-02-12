import matter from "gray-matter"
import yaml from "js-yaml"
import type { ParsedTemplate, TemplateEngine } from "./types"

const VALID_ENGINES: TemplateEngine[] = ["handlebars", "mustache", "liquid"]

/**
 * Parse a template string, extracting frontmatter metadata and variables.
 * The `engine` key in frontmatter controls which rendering engine is used.
 * All other frontmatter keys are treated as template variables.
 */
export function parseTemplate(templateStr: string): ParsedTemplate {
  const { data: frontmatter, content } = matter(templateStr)

  const detectedEngine = VALID_ENGINES.includes(frontmatter.engine)
    ? (frontmatter.engine as TemplateEngine)
    : "handlebars"

  const { engine: _engine, ...frontmatterVars } = frontmatter

  return { content, engine: detectedEngine, frontmatterVars }
}

/**
 * Parse a YAML string into a variables object.
 * Returns an empty object for falsy/empty input.
 */
export function parseVariables(yamlStr: string): Record<string, unknown> {
  if (!yamlStr?.trim()) return {}
  return (yaml.load(yamlStr) as Record<string, unknown>) || {}
}

/**
 * Merge frontmatter variables with explicit variables.
 * Explicit variables (from the variables bucket) take precedence.
 */
export function mergeVariables(
  frontmatterVars: Record<string, unknown>,
  explicitVars: Record<string, unknown>,
): Record<string, unknown> {
  return { ...frontmatterVars, ...explicitVars }
}
