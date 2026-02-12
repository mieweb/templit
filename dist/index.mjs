// src/render.ts
import Mustache from "mustache";
import { Liquid } from "liquidjs";
import Handlebars from "handlebars";
import { marked } from "marked";

// src/parse.ts
import matter from "gray-matter";
import yaml from "js-yaml";
var VALID_ENGINES = ["handlebars", "mustache", "liquid"];
function parseTemplate(templateStr) {
  const { data: frontmatter, content } = matter(templateStr);
  const detectedEngine = VALID_ENGINES.includes(frontmatter.engine) ? frontmatter.engine : "handlebars";
  const { engine: _engine, ...frontmatterVars } = frontmatter;
  return { content, engine: detectedEngine, frontmatterVars };
}
function parseVariables(yamlStr) {
  if (!yamlStr?.trim()) return {};
  return yaml.load(yamlStr) || {};
}
function mergeVariables(frontmatterVars, explicitVars) {
  return { ...frontmatterVars, ...explicitVars };
}

// src/render.ts
async function renderWithEngine(content, variables, engine) {
  switch (engine) {
    case "liquid": {
      const liquid = new Liquid();
      return liquid.parseAndRender(content, variables);
    }
    case "mustache":
      return Mustache.render(content, variables);
    case "handlebars":
    default: {
      const compiled = Handlebars.compile(content);
      return compiled(variables);
    }
  }
}
async function markdownToHtml(markdown) {
  marked.setOptions({ breaks: true, gfm: true });
  return marked(markdown);
}
async function render(templateStr, variables = {}, options = {}) {
  const parsed = parseTemplate(templateStr);
  const engine = options.engine || parsed.engine;
  const explicitVars = typeof variables === "string" ? parseVariables(variables) : variables;
  const merged = mergeVariables(parsed.frontmatterVars, explicitVars);
  const raw = await renderWithEngine(parsed.content, merged, engine);
  const html = await markdownToHtml(raw);
  return { raw, html, engine };
}
export {
  markdownToHtml,
  mergeVariables,
  parseTemplate,
  parseVariables,
  render,
  renderWithEngine
};
//# sourceMappingURL=index.mjs.map