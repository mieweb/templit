/**
 * Leading `---` fenced block, per the MDY spec. Kept in-house (rather than
 * pulling in gray-matter) so the core stays dependency-light and callers can
 * tree-shake everything they don't use.
 */
const FRONTMATTER = /^\uFEFF?---[ \t]*\r?\n([\s\S]*?)\r?\n?---[ \t]*(?:\r?\n|$)/

export interface SplitTemplate {
  /** Raw YAML between the `---` fences ("" when there is no frontmatter) */
  frontmatter: string
  /** Everything after the closing fence */
  content: string
}

export function splitFrontmatter(templateStr: string): SplitTemplate {
  const match = FRONTMATTER.exec(templateStr)
  if (!match) return { frontmatter: "", content: templateStr }
  return { frontmatter: match[1], content: templateStr.slice(match[0].length) }
}
