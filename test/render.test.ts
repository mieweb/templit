import { describe, it, expect } from "vitest"
import { render, renderWithEngine, markdownToHtml } from "../src/render"

describe("renderWithEngine", () => {
  const vars = {
    effectiveDate: "2025-02-10",
    provider: { name: "Acme Solutions Inc.", email: "contracts@acme.com" },
    services: ["Software Development", "Technical Consulting"],
  }

  it("renders handlebars template with simple variables", async () => {
    const content = "**Effective Date:** {{effectiveDate}}"
    const result = await renderWithEngine(content, vars, "handlebars")
    expect(result).toBe("**Effective Date:** 2025-02-10")
  })

  it("renders handlebars template with nested variables", async () => {
    const content = "**Provider:** {{provider.name}}"
    const result = await renderWithEngine(content, vars, "handlebars")
    expect(result).toBe("**Provider:** Acme Solutions Inc.")
  })

  it("renders handlebars template with #each loops", async () => {
    const content = "{{#each services}}\n- {{this}}\n{{/each}}"
    const result = await renderWithEngine(content, vars, "handlebars")
    expect(result).toContain("- Software Development")
    expect(result).toContain("- Technical Consulting")
  })

  it("renders liquid template with simple variables", async () => {
    const content = "**License Date:** {{ effectiveDate }}"
    const result = await renderWithEngine(content, vars, "liquid")
    expect(result).toBe("**License Date:** 2025-02-10")
  })

  it("renders liquid template with for loops", async () => {
    const content = "{% for s in services %}\n- {{ s }}\n{% endfor %}"
    const result = await renderWithEngine(content, vars, "liquid")
    expect(result).toContain("- Software Development")
    expect(result).toContain("- Technical Consulting")
  })

  it("renders liquid template with nested objects", async () => {
    const vars = {
      licensor: { name: "TechSoft Corporation", email: "licensing@techsoft.com" },
      fees: [
        { description: "Annual License Fee", amount: 50000 },
        { description: "Implementation Fee", amount: 10000 },
      ],
      totalFee: 65000,
    }
    const content = [
      "**Company:** {{ licensor.name }}",
      "{% for fee in fees %}",
      "- {{ fee.description }}: ${{ fee.amount }}",
      "{% endfor %}",
      "**Total:** ${{ totalFee }}",
    ].join("\n")

    const result = await renderWithEngine(content, vars, "liquid")
    expect(result).toContain("**Company:** TechSoft Corporation")
    expect(result).toContain("- Annual License Fee: $50000")
    expect(result).toContain("- Implementation Fee: $10000")
    expect(result).toContain("**Total:** $65000")
  })

  it("renders mustache template with simple variables", async () => {
    const content = "**Date:** {{effectiveDate}}"
    const result = await renderWithEngine(content, vars, "mustache")
    expect(result).toBe("**Date:** 2025-02-10")
  })

  it("renders mustache template with sections", async () => {
    const content = "{{#services}}\n- {{.}}\n{{/services}}"
    const result = await renderWithEngine(content, vars, "mustache")
    expect(result).toContain("- Software Development")
    expect(result).toContain("- Technical Consulting")
  })
})

describe("markdownToHtml", () => {
  it("converts markdown headings to HTML", async () => {
    const html = await markdownToHtml("# MASTER SERVICE AGREEMENT")
    expect(html).toContain("<h1")
    expect(html).toContain("MASTER SERVICE AGREEMENT")
  })

  it("converts bold text", async () => {
    const html = await markdownToHtml("**Provider:** Acme Inc.")
    expect(html).toContain("<strong>Provider:</strong>")
    expect(html).toContain("Acme Inc.")
  })

  it("converts markdown lists", async () => {
    const html = await markdownToHtml("- Item A\n- Item B")
    expect(html).toContain("<li>Item A</li>")
    expect(html).toContain("<li>Item B</li>")
  })

  it("converts horizontal rules", async () => {
    const html = await markdownToHtml("Above\n\n---\n\nBelow")
    expect(html).toContain("<hr")
  })

  it("converts markdown tables", async () => {
    const md = [
      "| Part | Qty |",
      "|------|-----|",
      "| Bolt | 100 |",
    ].join("\n")
    const html = await markdownToHtml(md)
    expect(html).toContain("<table")
    expect(html).toContain("Bolt")
  })
})

describe("render (full pipeline)", () => {
  it("renders MSA example with handlebars", async () => {
    const template = [
      "---",
      "engine: handlebars",
      "---",
      "# MASTER SERVICE AGREEMENT",
      "",
      "**Effective Date:** {{effectiveDate}}",
      "",
      "**Provider:** {{provider.name}}",
      "**Contact:** {{provider.email}}",
      "",
      "**Client:** {{client.name}}",
      "",
      "## 1. Services",
      "",
      "{{#each services}}",
      "- {{this}}",
      "{{/each}}",
      "",
      "Either party may terminate with {{noticePeriod}} days written notice.",
    ].join("\n")

    const variables = [
      'effectiveDate: "2025-02-10"',
      "noticePeriod: 30",
      "provider:",
      '  name: "Acme Solutions Inc."',
      '  email: "contracts@acme.com"',
      "client:",
      '  name: "Global Enterprises LLC"',
      "services:",
      '  - "Software Development"',
      '  - "Technical Consulting"',
    ].join("\n")

    const result = await render(template, variables)

    expect(result.engine).toBe("handlebars")
    expect(result.raw).toContain("Acme Solutions Inc.")
    expect(result.raw).toContain("Global Enterprises LLC")
    expect(result.raw).toContain("- Software Development")
    expect(result.raw).toContain("30 days written notice")
    expect(result.html).toContain("<h1")
    expect(result.html).toContain("<h2")
    expect(result.html).toContain("<li>Software Development</li>")
  })

  it("renders Software License example with liquid", async () => {
    const template = [
      "---",
      "engine: liquid",
      "---",
      "# SOFTWARE LICENSE AGREEMENT",
      "",
      "**License Date:** {{ licenseDate }}",
      "**License Number:** {{ licenseNumber }}",
      "",
      "**Company:** {{ licensor.name }}",
      "",
      "{% for fee in fees %}",
      "- {{ fee.description }}: ${{ fee.amount }}",
      "{% endfor %}",
      "",
      "**Total License Fee:** ${{ totalFee }}",
    ].join("\n")

    const variables = [
      'licenseDate: "2025-02-10"',
      'licenseNumber: "SL-2025-001234"',
      "licensor:",
      '  name: "TechSoft Corporation"',
      "fees:",
      '  - description: "Annual License Fee"',
      "    amount: 50000",
      '  - description: "Implementation Fee"',
      "    amount: 10000",
      "totalFee: 65000",
    ].join("\n")

    const result = await render(template, variables)

    expect(result.engine).toBe("liquid")
    expect(result.raw).toContain("TechSoft Corporation")
    expect(result.raw).toContain("SL-2025-001234")
    expect(result.raw).toContain("Annual License Fee: $50000")
    expect(result.raw).toContain("$65000")
    expect(result.html).toContain("<h1")
  })

  it("renders HIPAA BAA example with handlebars", async () => {
    const template = [
      "---",
      "engine: handlebars",
      "---",
      "# BUSINESS ASSOCIATE AGREEMENT",
      "",
      "**Effective Date:** {{effectiveDate}}",
      "",
      "**Name:** {{coveredEntity.name}}",
      "**Contact:** {{coveredEntity.contact}}",
      "",
      "**Name:** {{businessAssociate.name}}",
      "",
      "{{#each services}}",
      "- {{this}}",
      "{{/each}}",
      "",
      "Notify within {{breachNotificationPeriod}} hours of discovery.",
    ].join("\n")

    const variables = [
      'effectiveDate: "2025-02-10"',
      "breachNotificationPeriod: 24",
      "coveredEntity:",
      '  name: "HealthCare Medical Group"',
      '  contact: "privacy@healthcaregroup.com"',
      "businessAssociate:",
      '  name: "CloudHealth IT Services"',
      "services:",
      '  - "EHR hosting and maintenance"',
      '  - "Data backup and disaster recovery"',
    ].join("\n")

    const result = await render(template, variables)

    expect(result.engine).toBe("handlebars")
    expect(result.raw).toContain("HealthCare Medical Group")
    expect(result.raw).toContain("CloudHealth IT Services")
    expect(result.raw).toContain("- EHR hosting and maintenance")
    expect(result.raw).toContain("24 hours of discovery")
  })

  it("supports variables as a pre-parsed object", async () => {
    const template = [
      "---",
      "engine: handlebars",
      "---",
      "Hello {{name}}, you have {{count}} items.",
    ].join("\n")

    const result = await render(template, { name: "Alice", count: 5 })

    expect(result.raw.trim()).toBe("Hello Alice, you have 5 items.")
  })

  it("merges frontmatter variables with explicit variables", async () => {
    const template = [
      "---",
      "engine: handlebars",
      "greeting: Hello",
      "name: Default",
      "---",
      "{{greeting}} {{name}}!",
    ].join("\n")

    // Explicit variables override frontmatter
    const result = await render(template, { name: "Alice" })

    expect(result.raw.trim()).toBe("Hello Alice!")
  })

  it("uses frontmatter variables as defaults", async () => {
    const template = [
      "---",
      "engine: handlebars",
      "greeting: Hello",
      "name: World",
      "---",
      "{{greeting}} {{name}}!",
    ].join("\n")

    // No explicit variables — frontmatter values used
    const result = await render(template, {})

    expect(result.raw.trim()).toBe("Hello World!")
  })

  it("allows engine override via options", async () => {
    const template = [
      "---",
      "engine: handlebars",
      "---",
      "Hello {{name}}",
    ].join("\n")

    const result = await render(template, { name: "Alice" }, { engine: "mustache" })

    expect(result.engine).toBe("mustache")
    expect(result.raw.trim()).toBe("Hello Alice")
  })

  it("handles template with no frontmatter", async () => {
    const template = "Hello {{name}}"
    const result = await render(template, { name: "World" })

    expect(result.engine).toBe("handlebars")
    expect(result.raw.trim()).toBe("Hello World")
  })

  it("returns both raw and html output", async () => {
    const template = [
      "---",
      "engine: handlebars",
      "---",
      "# Title",
      "",
      "**Bold:** {{value}}",
    ].join("\n")

    const result = await render(template, { value: "test" })

    expect(result.raw).toContain("# Title")
    expect(result.raw).toContain("**Bold:** test")
    expect(result.html).toContain("<h1")
    expect(result.html).toContain("<strong>Bold:</strong>")
    expect(result.html).toContain("test")
  })
})
