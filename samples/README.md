# MDY Samples

Working examples for the [MDY specification](../doc/mdy-specification.md)
(Markdown + YAML linked documents).

## The three file types

| Extension | Tier | What it shows |
|---|---|---|
| `.mdyt` | Template | templit placeholders (`{{…}}`) inside field links; renders after applying data |
| `.mdy` | Document | Flattened output — front matter is canonical data, body links to it by id |
| `.md` | Document | The same `.mdy` content shipped as plain markdown — renders anywhere |

## Sample sets

| Set | Resolver | Files | Demonstrates |
|---|---|---|---|
| **simple** | generic YAML | [simple.mdyt](simple.mdyt) · [simple.mdy](simple.mdy) · [simple.md](simple.md) | Minimal template → document pipeline: patient, visit date, two vitals |
| **esheet** | eSheet `fields:` map | [esheet.mdyt](esheet.mdyt) · [esheet.mdy](esheet.mdy) · [esheet.md](esheet.md) | eSheet `FieldDefinition`-shaped fields (text, number + unit, boolean); question and answer both interpolated |
| **back-pain-encounter** | FHIR R4 | [back-pain-encounter.md](back-pain-encounter.md) | Full clinical encounter: FHIR `Bundle` front matter (Patient, allergy, problem list, coded vitals, controlled Rx, dose adjustment, work restriction, follow-up) with a portable narrative |

Each `.mdyt`/`.mdy` pair is the *same document* before and after flattening —
diff them to see exactly what the render step does. The `.md` twin proves the
"degrade gracefully" goal: open it in any markdown viewer.
