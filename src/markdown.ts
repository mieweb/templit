import { marked } from "marked"

/**
 * Convert a markdown string to HTML.
 *
 * Lives in its own entry point (`@mieweb/templit/markdown`) so consumers who
 * only need `RenderResult.raw` never bundle `marked`.
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  marked.setOptions({ breaks: true, gfm: true })
  return marked(markdown)
}
