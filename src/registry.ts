import type { Engine, MarkdownRenderer, TemplateEngineName } from "./types"

const engines = new Map<string, Engine>()

/** Make an engine available to templates that select it by name in frontmatter. */
export function registerEngine(engine: Engine): void {
  engines.set(engine.name, engine)
}

export function hasEngine(name: string): boolean {
  return engines.has(name)
}

export function listEngines(): string[] {
  return [...engines.keys()]
}

/**
 * Resolve an engine reference — either an already-imported `Engine` or the
 * name of a registered one. Throws with install/registration guidance rather
 * than silently falling back, so a missing import is never a silent no-op.
 */
export function resolveEngine(engine: TemplateEngineName | Engine): Engine {
  if (typeof engine !== "string") return engine
  const found = engines.get(engine)
  if (found) return found
  throw new Error(
    `Unknown template engine "${engine}". Register it first:\n` +
      `  import { registerEngine } from "@mieweb/templit"\n` +
      `  import { ${engine} } from "@mieweb/templit/${engine}"\n` +
      `  registerEngine(${engine})\n` +
      `Or import "@mieweb/templit/all" for all engines. ` +
      `Currently registered: ${listEngines().join(", ") || "none"}.`,
  )
}

let markdownRenderer: MarkdownRenderer | undefined

/** Set the markdown→HTML renderer used to populate `RenderResult.html`. */
export function registerMarkdown(renderer: MarkdownRenderer): void {
  markdownRenderer = renderer
}

export function getMarkdown(): MarkdownRenderer | undefined {
  return markdownRenderer
}
