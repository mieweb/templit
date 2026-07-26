export type TemplateEngine = "handlebars" | "mustache" | "liquid"

/**
 * The MDY field shape: an object describing an answer via `display`/`value`
 * (+ optional `unit`), or an eSheet `FieldResponse` (`answer`/`selected`).
 */
export interface FieldObject {
  display?: unknown
  value?: unknown
  unit?: unknown
  /** eSheet FieldResponse: text answer */
  answer?: unknown
  /** eSheet FieldResponse: selected option(s) — { id, value } or an array of them */
  selected?: unknown
  [key: string]: unknown
}

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
  /**
   * When true (default), field-shaped variables ({ display/value, unit? })
   * interpolated whole — e.g. `{{height}}` — render as MDY field links
   * `[display](#height)`. Explicit paths like `{{height.display}}` are
   * unaffected. Set false for plain engine behavior.
   */
  fieldLinks?: boolean
}

export interface RenderResult {
  /** Raw rendered output (before markdown conversion) */
  raw: string
  /** HTML output (after markdown conversion) */
  html: string
  /** The engine that was used */
  engine: TemplateEngine
}
