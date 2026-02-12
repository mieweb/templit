"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  markdownToHtml: () => markdownToHtml,
  mergeVariables: () => mergeVariables,
  parseTemplate: () => parseTemplate,
  parseVariables: () => parseVariables,
  render: () => render,
  renderWithEngine: () => renderWithEngine
});
module.exports = __toCommonJS(index_exports);

// src/render.ts
var import_mustache = __toESM(require("mustache"));
var import_liquidjs = require("liquidjs");
var import_handlebars = __toESM(require("handlebars"));
var import_marked = require("marked");

// src/parse.ts
var import_gray_matter = __toESM(require("gray-matter"));
var import_js_yaml = __toESM(require("js-yaml"));
var VALID_ENGINES = ["handlebars", "mustache", "liquid"];
function parseTemplate(templateStr) {
  const { data: frontmatter, content } = (0, import_gray_matter.default)(templateStr);
  const detectedEngine = VALID_ENGINES.includes(frontmatter.engine) ? frontmatter.engine : "handlebars";
  const { engine: _engine, ...frontmatterVars } = frontmatter;
  return { content, engine: detectedEngine, frontmatterVars };
}
function parseVariables(yamlStr) {
  if (!yamlStr?.trim()) return {};
  return import_js_yaml.default.load(yamlStr) || {};
}
function mergeVariables(frontmatterVars, explicitVars) {
  return { ...frontmatterVars, ...explicitVars };
}

// src/render.ts
async function renderWithEngine(content, variables, engine) {
  switch (engine) {
    case "liquid": {
      const liquid = new import_liquidjs.Liquid();
      return liquid.parseAndRender(content, variables);
    }
    case "mustache":
      return import_mustache.default.render(content, variables);
    case "handlebars":
    default: {
      const compiled = import_handlebars.default.compile(content);
      return compiled(variables);
    }
  }
}
async function markdownToHtml(markdown) {
  import_marked.marked.setOptions({ breaks: true, gfm: true });
  return (0, import_marked.marked)(markdown);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  markdownToHtml,
  mergeVariables,
  parseTemplate,
  parseVariables,
  render,
  renderWithEngine
});
//# sourceMappingURL=index.js.map