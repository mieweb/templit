/** Built-in engine names — any registered custom name is accepted too. */
export type TemplateEngineName =
  | "handlebars"
  | "mustache"
  | "liquid"
  | (string & {})

/** @deprecated Use {@link TemplateEngineName}. */
export type TemplateEngine = TemplateEngineName

/** A template engine implementation, as exported by `@mieweb/templit/<name>`. */
export interface Engine {
  /** Name matched against the frontmatter `engine:` key */
  name: string
  render(
    content: string,
    variables: Record<string, unknown>,
  ): string | Promise<string>
}

export type MarkdownRenderer = (markdown: string) => string | Promise<string>

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
  engine: TemplateEngineName
  /** Variables extracted from frontmatter (excluding engine) */
  frontmatterVars: Record<string, unknown>
}

export interface RenderOptions {
  /** Override the engine detected from frontmatter — a registered name or an imported engine */
  engine?: TemplateEngineName | Engine
  /**
   * Markdown→HTML renderer for `RenderResult.html`. Defaults to the one
   * registered via `registerMarkdown`; pass `false` to skip HTML conversion.
   */
  markdown?: MarkdownRenderer | false
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
  /** HTML output — undefined when no markdown renderer is registered or provided */
  html?: string
  /** The engine that was used */
  engine: TemplateEngineName
}
