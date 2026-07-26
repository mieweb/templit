import type { FieldObject } from "./types"

/**
 * A variable is treated as a linkable field when it is a plain object carrying
 * a `display` or `value` key (the MDY field shape).
 */
export function isFieldObject(value: unknown): value is FieldObject {
  return (
    !!value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    ("display" in value || "value" in value)
  )
}

/**
 * Human-readable text for a field: `display` wins; otherwise `value`
 * (plus ` unit` when present). YAML timestamps (JS Date) render as ISO dates.
 */
export function fieldDisplay(field: FieldObject): string {
  const asText = (v: unknown): string =>
    v instanceof Date ? v.toISOString().slice(0, 10) : String(v)
  if (field.display != null) return asText(field.display)
  const value = field.value != null ? asText(field.value) : ""
  const unit = field.unit != null ? ` ${asText(field.unit)}` : ""
  return `${value}${unit}`
}

/**
 * Enable implicit field links: decorate every field-shaped object in the
 * variables tree with a `toString()` that renders the MDY field-link form
 * `[display](#id)`, where `id` is the object's own key.
 *
 * With this in place, a template can simply write `{{height}}` and get
 * `[5'11"](#height)` — while explicit paths (`{{height.display}}`,
 * `{{height.value}}`) keep working unchanged, because property lookups
 * bypass `toString`.
 *
 * The decoration is non-enumerable, so serializing the variables (YAML/JSON)
 * is unaffected. Mutates and returns the given object.
 */
export function decorateFieldLinks<T extends Record<string, unknown>>(
  variables: T,
): T {
  const walk = (obj: Record<string, unknown>) => {
    for (const [key, value] of Object.entries(obj)) {
      if (!value || typeof value !== "object" || Array.isArray(value)) continue
      const child = value as Record<string, unknown>
      if (isFieldObject(child)) {
        const link = () => `[${fieldDisplay(child)}](#${key})`
        // Mustache/Liquid stringify via toString; Handlebars HTML-escapes
        // unless the value exposes toHTML() (SafeString protocol), which we
        // use so displays like 5'11" aren't turned into entities.
        for (const method of ["toString", "toHTML"]) {
          Object.defineProperty(child, method, {
            value: link,
            enumerable: false,
            writable: true,
            configurable: true,
          })
        }
      }
      walk(child)
    }
  }
  walk(variables)
  return variables
}
