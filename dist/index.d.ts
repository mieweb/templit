type TemplateEngine = "handlebars" | "mustache" | "liquid";
/** The MDY field shape: an object whose `display`/`value` describe an answer */
interface FieldObject {
    display?: unknown;
    value?: unknown;
    unit?: unknown;
    [key: string]: unknown;
}
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
    /**
     * When true (default), field-shaped variables ({ display/value, unit? })
     * interpolated whole — e.g. `{{height}}` — render as MDY field links
     * `[display](#height)`. Explicit paths like `{{height.display}}` are
     * unaffected. Set false for plain engine behavior.
     */
    fieldLinks?: boolean;
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

/**
 * A variable is treated as a linkable field when it is a plain object carrying
 * a `display` or `value` key (the MDY field shape).
 */
declare function isFieldObject(value: unknown): value is FieldObject;
/**
 * Human-readable text for a field: `display` wins; otherwise `value`
 * (plus ` unit` when present).
 */
declare function fieldDisplay(field: FieldObject): string;
/**
 * Enable implicit field links: decorate every field-shaped object in the
 * variables tree with a `toString()` that renders the MDY field-link form
 * `[display](#id)`, where `id` is the object's own key.
 *
 * With this in place, a template can simply write `{{height}}` and get
 * `[5'11"](#height)` — while explicit paths (`{{height.display}}`,
 * `{{height.value}}`) keep working unchanged, because property lookups
 * bypass `toString`.
 *
 * The decoration is non-enumerable, so serializing the variables (YAML/JSON)
 * is unaffected. Mutates and returns the given object.
 */
declare function decorateFieldLinks<T extends Record<string, unknown>>(variables: T): T;

export { type FieldObject, type ParsedTemplate, type RenderOptions, type RenderResult, type TemplateEngine, decorateFieldLinks, fieldDisplay, isFieldObject, markdownToHtml, mergeVariables, parseTemplate, parseVariables, render, renderWithEngine };
