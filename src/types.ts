export type TemplateEngine = "handlebars" | "mustache" | "liquid"

export interface ParsedTemplate {
  /** Template content with frontmatter stripped */
  content: string
  /** Detected engine from frontmatter (defaults to "handlebars") */
  engine: TemplateEngine
  /** Variables extracted from frontmatter (excluding engine) */
  frontmatterVars: Record<string, unknown>
}

export interface RenderOptions {
  /** Override the engine detected from frontmatter */
  engine?: TemplateEngine
}

export interface RenderResult {
  /** Raw rendered output (before markdown conversion) */
  raw: string
  /** HTML output (after markdown conversion) */
  html: string
  /** The engine that was used */
  engine: TemplateEngine
}
