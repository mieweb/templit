/**
 * Batteries-included entry point: registers all three engines plus the
 * markdown renderer, then re-exports the core API.
 *
 * Import this when bundle size doesn't matter (Node scripts, CLIs, tests).
 * Import "@mieweb/templit" plus only the engines you use when it does.
 */
import { registerEngine, registerMarkdown } from "./registry"
import { handlebars } from "./engines/handlebars"
import { mustache } from "./engines/mustache"
import { liquid } from "./engines/liquid"
import { markdownToHtml } from "./markdown"

registerEngine(handlebars)
registerEngine(mustache)
registerEngine(liquid)
registerMarkdown(markdownToHtml)

export * from "./index"
export { handlebars, mustache, liquid, markdownToHtml }
