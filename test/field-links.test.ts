import { describe, expect, it } from "vitest"
import { render } from "../src/render"
import { decorateFieldLinks, fieldDisplay, isFieldObject } from "../src/field-links"

const vitalsTemplate = `---
engine: handlebars
height:
  value: 180
  unit: cm
  display: "5'11\\""
weight:
  value: 89.8
  unit: kg
---
- Height: {{height}}
- Weight: {{weight}}

- Raw value: {{weight.value}}
`

describe("implicit field links", () => {
  it("renders bare {{field}} as [display](#id) — handlebars", async () => {
    const { raw } = await render(vitalsTemplate)
    expect(raw).toContain(`- Height: [5'11"](#height)`)
  })

  it("falls back to value + unit when display is absent", async () => {
    const { raw } = await render(vitalsTemplate)
    expect(raw).toContain("- Weight: [89.8 kg](#weight)")
  })

  it("leaves explicit paths untouched (numbers unescaped; strings follow engine escaping)", async () => {
    const { raw } = await render(vitalsTemplate)
    expect(raw).toContain("- Raw value: 89.8")
    // Explicit string paths go through normal engine escaping; authors use
    // triple-stache for raw output:
    const tpl = vitalsTemplate.replace(
      "- Raw value: {{weight.value}}",
      "- Explicit: [{{{height.display}}}](#height)",
    )
    const { raw: raw2 } = await render(tpl)
    expect(raw2).toContain(`- Explicit: [5'11"](#height)`)
  })

  it("works with mustache", async () => {
    const { raw } = await render(vitalsTemplate, {}, { engine: "mustache" })
    // Mustache escapes double-stache output, so unit-only fields (no quote
    // chars) pass through; quote-bearing displays need triple-stache.
    expect(raw).toContain("- Weight: [89.8 kg](#weight)")
  })

  it("works with liquid", async () => {
    const { raw } = await render(vitalsTemplate, {}, { engine: "liquid" })
    expect(raw).toContain(`- Height: [5'11"](#height)`)
  })

  it("renders eSheet FieldResponse shapes (answer / selected)", async () => {
    const tpl = `---
engine: handlebars
response:
  patient_name: { answer: Jordan Rivera }
  smoker:
    selected: { id: "no", value: "No" }
  symptoms:
    selected:
      - { id: s1, value: Headache }
      - { id: s3, value: Fatigue }
---
{{response.patient_name}} / {{response.smoker}} / {{response.symptoms}}
`
    const { raw } = await render(tpl)
    expect(raw).toContain("[Jordan Rivera](#patient_name)")
    expect(raw).toContain("[No](#smoker)")
    expect(raw).toContain("[Headache, Fatigue](#symptoms)")
  })

  it("can be disabled via fieldLinks: false", async () => {
    const { raw } = await render(vitalsTemplate, {}, { fieldLinks: false })
    expect(raw).toContain("- Height: [object Object]")
    expect(raw).not.toContain("- Height: [5'11\"](#height)")
  })

  it("does not treat scalars or arrays as fields", async () => {
    const tpl = `---
title: Plain note
tags: [a, b]
---
{{title}} / {{tags}}
`
    const { raw } = await render(tpl)
    expect(raw).toContain("Plain note")
    expect(raw).not.toContain("](#title)")
  })

  it("explicit variables override frontmatter and still link", async () => {
    const { raw } = await render(vitalsTemplate, {
      height: { value: 175, unit: "cm", display: `5'9"` },
    })
    expect(raw).toContain(`- Height: [5'9"](#height)`)
  })
})

describe("field-links unit helpers", () => {
  it("isFieldObject accepts display/value shapes only", () => {
    expect(isFieldObject({ display: "x" })).toBe(true)
    expect(isFieldObject({ value: 1 })).toBe(true)
    expect(isFieldObject({ name: "no" })).toBe(false)
    expect(isFieldObject([1])).toBe(false)
    expect(isFieldObject("s")).toBe(false)
  })

  it("fieldDisplay prefers display, else value + unit", () => {
    expect(fieldDisplay({ display: "198 lb", value: 89.8, unit: "kg" })).toBe("198 lb")
    expect(fieldDisplay({ value: 89.8, unit: "kg" })).toBe("89.8 kg")
    expect(fieldDisplay({ value: 42 })).toBe("42")
  })

  it("decoration is non-enumerable (does not leak into serialization)", () => {
    const vars = { height: { value: 180 } }
    decorateFieldLinks(vars)
    expect(Object.keys(vars.height)).toEqual(["value"])
    expect(JSON.stringify(vars.height)).toBe(`{"value":180}`)
    expect(`${vars.height}`).toBe("[180](#height)")
  })
})
