---
# Same content as esheet.mdy, shipped with a plain .md extension — renders in
# any markdown viewer; eSheet-aware systems ingest the legal form/response
# front matter (https://esheet.mieweb.org/docs/schema-format).
mdy:
  kind: document
  template: { name: Vitals intake, version: 1.0.0 }
  renderedAt: 2026-07-26T15:00:00Z
form:
  id: vitals-intake
  title: Vitals Intake
  pages:
    - id: page_1
      fields:
        - id: patient_name
          fieldType: text
          question: Full Name
          required: true
        - id: body_height
          fieldType: text
          question: Height
          inputType: number
          unit: cm
        - id: body_weight
          fieldType: text
          question: Weight
          inputType: number
          unit: kg
        - id: smoker
          fieldType: boolean
          question: Tobacco use?
response:
  patient_name:
    answer: Jordan Rivera
  body_height:
    answer: "180"
  body_weight:
    answer: "89.8"
  smoker:
    selected: { id: "no", value: "No" }
---
# Vitals Intake

**Full Name:** [Jordan Rivera](#patient_name)

## Vitals

- Height: [180](#body_height) cm
- Weight: [89.8](#body_weight) kg
- Tobacco use? [No](#smoker)
