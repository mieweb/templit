import { describe, expect, it } from "vitest"
import { render, renderWithEngine, registerEngine } from "../src/index"
import { mustache } from "../src/engines/mustache"
import { markdownToHtml } from "../src/markdown"

describe("engine registry", () => {
  it("renders with an engine object without registering it", async () => {
    const out = await renderWithEngine("Hi {{name}}", { name: "Ada" }, mustache)
    expect(out).toBe("Hi Ada")
  })

  it("throws an actionable error for an unregistered engine", async () => {
    await expect(
      renderWithEngine("Hi", {}, "jinja2"),
    ).rejects.toThrow(/Unknown template engine "jinja2"/)
  })

  it("resolves a custom registered engine named in frontmatter", async () => {
    registerEngine({ name: "shout", render: (content) => content.toUpperCase() })
    const result = await render("---\nengine: shout\n---\nhello")
    expect(result.raw).toBe("HELLO")
    expect(result.engine).toBe("shout")
  })

  it("omits html when no markdown renderer is available", async () => {
    const result = await render("# Hi", {}, { engine: mustache })
    expect(result.raw).toBe("# Hi")
    expect(result.html).toBeUndefined()
  })

  it("uses a per-call markdown renderer", async () => {
    const result = await render("# Hi", {}, { engine: mustache, markdown: markdownToHtml })
    expect(result.html).toBe("<h1>Hi</h1>\n")
  })
})
