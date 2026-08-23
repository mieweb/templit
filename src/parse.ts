import yaml from "js-yaml"
import { splitFrontmatter } from "./frontmatter"
import { hasEngine } from "./registry"
import type { ParsedTemplate, TemplateEngineName } from "./types"

const BUILTIN_ENGINES = ["handlebars", "mustache", "liquid"]

/**
 * Parse a template string, extracting frontmatter metadata and variables.
 * The `engine` key in frontmatter controls which rendering engine is used.
 * All other frontmatter keys are treated as template variables.
 */
export function parseTemplate(templateStr: string): ParsedTemplate {
  const { frontmatter: yamlStr, content } = splitFrontmatter(templateStr)
  const frontmatter = parseVariables(yamlStr)

  const named = frontmatter.engine
  const detectedEngine =
    typeof named === "string" &&
    (BUILTIN_ENGINES.includes(named) || hasEngine(named))
      ? (named as TemplateEngineName)
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
