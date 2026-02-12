type TemplateEngine = "handlebars" | "mustache" | "liquid";
interface ParsedTemplate {
    /** Template content with frontmatter stripped */
    content: string;
    /** Detected engine from frontmatter (defaults to "handlebars") */
    engine: TemplateEngine;
    /** Variables extracted from frontmatter (excluding engine) */
    frontmatterVars: Record<string, unknown>;
}
interface RenderOptions {
    /** Override the engine detected from frontmatter */
    engine?: TemplateEngine;
}
interface RenderResult {
    /** Raw rendered output (before markdown conversion) */
    raw: string;
    /** HTML output (after markdown conversion) */
    html: string;
    /** The engine that was used */
    engine: TemplateEngine;
}

/**
 * Render a template string with the specified engine.
 * Does NOT process frontmatter or markdown — use `render()` for the full pipeline.
 */
declare function renderWithEngine(content: string, variables: Record<string, unknown>, engine: TemplateEngine): Promise<string>;
/**
 * Convert a markdown string to HTML.
 */
declare function markdownToHtml(markdown: string): Promise<string>;
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
declare function render(templateStr: string, variables?: string | Record<string, unknown>, options?: RenderOptions): Promise<RenderResult>;

/**
 * Parse a template string, extracting frontmatter metadata and variables.
 * The `engine` key in frontmatter controls which rendering engine is used.
 * All other frontmatter keys are treated as template variables.
 */
declare function parseTemplate(templateStr: string): ParsedTemplate;
/**
 * Parse a YAML string into a variables object.
 * Returns an empty object for falsy/empty input.
 */
declare function parseVariables(yamlStr: string): Record<string, unknown>;
/**
 * Merge frontmatter variables with explicit variables.
 * Explicit variables (from the variables bucket) take precedence.
 */
declare function mergeVariables(frontmatterVars: Record<string, unknown>, explicitVars: Record<string, unknown>): Record<string, unknown>;

export { type ParsedTemplate, type RenderOptions, type RenderResult, type TemplateEngine, markdownToHtml, mergeVariables, parseTemplate, parseVariables, render, renderWithEngine };
