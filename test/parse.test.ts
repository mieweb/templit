import { describe, it, expect } from "vitest"
import { parseTemplate, parseVariables, mergeVariables } from "../src/parse"

describe("parseTemplate", () => {
  it("detects handlebars engine from frontmatter", () => {
    const template = [
      "---",
      "engine: handlebars",
      "---",
      "Hello {{name}}",
    ].join("\n")

    const result = parseTemplate(template)
    expect(result.engine).toBe("handlebars")
    expect(result.content.trim()).toBe("Hello {{name}}")
    expect(result.frontmatterVars).toEqual({})
  })

  it("detects liquid engine from frontmatter", () => {
    const template = [
      "---",
      "engine: liquid",
      "---",
      "Hello {{ name }}",
    ].join("\n")

    const result = parseTemplate(template)
    expect(result.engine).toBe("liquid")
  })

  it("detects mustache engine from frontmatter", () => {
    const template = [
      "---",
      "engine: mustache",
      "---",
      "Hello {{name}}",
    ].join("\n")

    const result = parseTemplate(template)
    expect(result.engine).toBe("mustache")
  })

  it("defaults to handlebars when no engine specified", () => {
    const template = [
      "---",
      "title: My Doc",
      "---",
      "Hello {{name}}",
    ].join("\n")

    const result = parseTemplate(template)
    expect(result.engine).toBe("handlebars")
  })

  it("defaults to handlebars for invalid engine value", () => {
    const template = [
      "---",
      "engine: jinja2",
      "---",
      "Hello {{name}}",
    ].join("\n")

    const result = parseTemplate(template)
    expect(result.engine).toBe("handlebars")
  })

  it("extracts frontmatter variables excluding engine", () => {
    const template = [
      "---",
      "engine: handlebars",
      'effectiveDate: "2025-02-10"',
      "noticePeriod: 30",
      "---",
      "Date: {{effectiveDate}}",
    ].join("\n")

    const result = parseTemplate(template)
    expect(result.frontmatterVars).toEqual({
      effectiveDate: "2025-02-10",
      noticePeriod: 30,
    })
    expect(result.frontmatterVars).not.toHaveProperty("engine")
  })

  it("handles template with no frontmatter", () => {
    const template = "Hello {{name}}"

    const result = parseTemplate(template)
    expect(result.engine).toBe("handlebars")
    expect(result.content.trim()).toBe("Hello {{name}}")
    expect(result.frontmatterVars).toEqual({})
  })
})

describe("parseVariables", () => {
  it("parses simple YAML variables", () => {
    const yaml = [
      'effectiveDate: "2025-02-10"',
      "noticePeriod: 30",
    ].join("\n")

    const result = parseVariables(yaml)
    expect(result).toEqual({
      effectiveDate: "2025-02-10",
      noticePeriod: 30,
    })
  })

  it("parses nested YAML objects", () => {
    const yaml = [
      "provider:",
      '  name: "Acme Solutions Inc."',
      '  address: "123 Tech Street"',
    ].join("\n")

    const result = parseVariables(yaml)
    expect(result).toEqual({
      provider: {
        name: "Acme Solutions Inc.",
        address: "123 Tech Street",
      },
    })
  })

  it("parses YAML arrays", () => {
    const yaml = [
      "services:",
      '  - "Software Development"',
      '  - "Technical Consulting"',
    ].join("\n")

    const result = parseVariables(yaml)
    expect(result).toEqual({
      services: ["Software Development", "Technical Consulting"],
    })
  })

  it("returns empty object for empty string", () => {
    expect(parseVariables("")).toEqual({})
  })

  it("returns empty object for whitespace-only string", () => {
    expect(parseVariables("   \n  ")).toEqual({})
  })
})

describe("mergeVariables", () => {
  it("merges frontmatter and explicit variables", () => {
    const frontmatter = { a: 1, b: 2 }
    const explicit = { c: 3 }

    expect(mergeVariables(frontmatter, explicit)).toEqual({ a: 1, b: 2, c: 3 })
  })

  it("explicit variables override frontmatter", () => {
    const frontmatter = { name: "default", value: 10 }
    const explicit = { name: "override" }

    const result = mergeVariables(frontmatter, explicit)
    expect(result.name).toBe("override")
    expect(result.value).toBe(10)
  })

  it("handles empty frontmatter", () => {
    const result = mergeVariables({}, { name: "test" })
    expect(result).toEqual({ name: "test" })
  })

  it("handles empty explicit vars", () => {
    const result = mergeVariables({ name: "test" }, {})
    expect(result).toEqual({ name: "test" })
  })
})
