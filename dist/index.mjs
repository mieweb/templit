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

// src/field-links.ts
function isFieldObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value) && ("display" in value || "value" in value);
}
function fieldDisplay(field) {
  if (field.display != null) return String(field.display);
  const value = field.value != null ? String(field.value) : "";
  const unit = field.unit != null ? ` ${String(field.unit)}` : "";
  return `${value}${unit}`;
}
function decorateFieldLinks(variables) {
  const walk = (obj) => {
    for (const [key, value] of Object.entries(obj)) {
      if (!value || typeof value !== "object" || Array.isArray(value)) continue;
      const child = value;
      if (isFieldObject(child)) {
        const link = () => `[${fieldDisplay(child)}](#${key})`;
        for (const method of ["toString", "toHTML"]) {
          Object.defineProperty(child, method, {
            value: link,
            enumerable: false,
            writable: true,
            configurable: true
          });
        }
      }
      walk(child);
    }
  };
  walk(variables);
  return variables;
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
  if (options.fieldLinks !== false) decorateFieldLinks(merged);
  const raw = await renderWithEngine(parsed.content, merged, engine);
  const html = await markdownToHtml(raw);
  return { raw, html, engine };
}
export {
  decorateFieldLinks,
  fieldDisplay,
  isFieldObject,
  markdownToHtml,
  mergeVariables,
  parseTemplate,
  parseVariables,
  render,
  renderWithEngine
};
//# sourceMappingURL=index.mjs.map