"use client"

import { useState, useEffect, useRef } from "react"
import { Editor } from "@monaco-editor/react"
import { render, parseTemplate } from "templit"
import type { TemplateEngine } from "templit"
import { FileText, Code2, Eye, ExternalLink } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const examples = {
  msa: {
    name: "Master Service Agreement",
    template: [
      "---",
      "engine: handlebars",
      "---",
      "# MASTER SERVICE AGREEMENT",
      "",
      "**Effective Date:** {{effectiveDate}}",
      "",
      'This Master Service Agreement ("Agreement") is entered into between:',
      "",
      "**Provider:** {{provider.name}}",
      "**Address:** {{provider.address}}",
      "**Contact:** {{provider.email}}",
      "",
      "**Client:** {{client.name}}",
      "**Address:** {{client.address}}",
      "**Contact:** {{client.email}}",
      "",
      "## 1. Services",
      "",
      "Provider agrees to provide the following services to Client:",
      "",
      "{{#each services}}",
      "- {{this}}",
      "{{/each}}",
      "",
      "## 2. Term and Termination",
      "",
      "This Agreement shall commence on {{effectiveDate}} and continue for a period of {{termLength}}, unless terminated earlier in accordance with this Agreement.",
      "",
      "Either party may terminate this Agreement with {{noticePeriod}} days written notice.",
      "",
      "## 3. Payment Terms",
      "",
      "Client agrees to pay Provider according to the rates specified in individual Statements of Work. Payment is due within {{paymentTerms}} days of invoice date.",
      "",
      "## 4. Confidentiality",
      "",
      "Both parties agree to maintain confidentiality of proprietary information shared during the term of this Agreement.",
      "",
      "## 5. Limitation of Liability",
      "",
      "Provider's total liability under this Agreement shall not exceed the total amount paid by Client in the {{liabilityPeriod}} preceding the claim.",
      "",
      "---",
      "",
      "**Provider Representative:** {{provider.representative}}",
      "**Signature:** ___________________________ **Date:** ___________",
      "",
      "**Client Representative:** {{client.representative}}",
      "**Signature:** ___________________________ **Date:** ___________",
    ].join("\n"),
    variables: [
      'effectiveDate: "2025-02-10"',
      'termLength: "12 months"',
      "noticePeriod: 30",
      "paymentTerms: 30",
      'liabilityPeriod: "12 months"',
      "provider:",
      '  name: "Acme Solutions Inc."',
      '  address: "123 Tech Street, San Francisco, CA 94105"',
      '  email: "contracts@acme.com"',
      '  representative: "Jane Smith, CEO"',
      "client:",
      '  name: "Global Enterprises LLC"',
      '  address: "456 Business Ave, New York, NY 10001"',
      '  contact: "legal@globalent.com"',
      '  representative: "John Doe, CTO"',
      "services:",
      '  - "Software Development and Maintenance"',
      '  - "Technical Consulting"',
      '  - "System Integration Services"',
      '  - "Training and Support"',
    ].join("\n"),
  },
  softwareLicense: {
    name: "Software License Agreement",
    template: [
      "---",
      "engine: liquid",
      "---",
      "# SOFTWARE LICENSE AGREEMENT",
      "",
      "**License Date:** {{ licenseDate }}",
      "**License Number:** {{ licenseNumber }}",
      "",
      "## Licensor",
      "",
      "**Company:** {{ licensor.name }}",
      "**Address:** {{ licensor.address }}",
      "**Email:** {{ licensor.email }}",
      "",
      "## Licensee",
      "",
      "**Company:** {{ licensee.name }}",
      "**Address:** {{ licensee.address }}",
      "**Contact:** {{ licensee.contact }}",
      "**Email:** {{ licensee.email }}",
      "",
      "## 1. Grant of License",
      "",
      'Licensor grants Licensee a {{ licenseType }} license to use **{{ softwareName }}** ("Software") subject to the terms of this Agreement.',
      "",
      "**License Type:** {{ licenseType }}",
      "**Number of Users:** {{ numberOfUsers }}",
      "**Permitted Use:** {{ permittedUse }}",
      "",
      "## 2. License Fee",
      "",
      "{% for fee in fees %}",
      "- {{ fee.description }}: ${{ fee.amount }}",
      "{% endfor %}",
      "",
      "**Total License Fee:** ${{ totalFee }}",
      "",
      "## 3. Term",
      "",
      "This license is valid from {{ licenseDate }} for a period of {{ licenseTerm }}.",
      "",
      "## 4. Restrictions",
      "",
      "Licensee shall not:",
      "",
      "- Reverse engineer, decompile, or disassemble the Software",
      "- Rent, lease, or lend the Software to third parties",
      "- Remove or alter any proprietary notices on the Software",
      "- Use the Software beyond the scope of the granted license",
      "",
      "## 5. Support and Maintenance",
      "",
      "{{ supportLevel }} support is included for the duration of this license.",
      "",
      "## 6. Warranty Disclaimer",
      "",
      'THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND.',
      "",
      "---",
      "",
      "**Authorized by:** {{ licensor.representative }}",
    ].join("\n"),
    variables: [
      'licenseDate: "2025-02-10"',
      'licenseNumber: "SL-2025-001234"',
      'softwareName: "Enterprise Analytics Platform"',
      'licenseType: "non-exclusive, non-transferable"',
      "numberOfUsers: 50",
      'permittedUse: "Internal business operations only"',
      'licenseTerm: "12 months"',
      'supportLevel: "Standard"',
      "licensor:",
      '  name: "TechSoft Corporation"',
      '  address: "789 Software Blvd, Austin, TX 78701"',
      '  email: "licensing@techsoft.com"',
      '  representative: "Sarah Johnson, VP of Sales"',
      "licensee:",
      '  name: "DataCorp Industries"',
      '  address: "321 Data Drive, Boston, MA 02101"',
      '  contact: "Jennifer Lee"',
      '  email: "jennifer.lee@autotech.com"',
      '  representative: "Jennifer Lee, Procurement Director"',
      "fees:",
      '  - description: "Annual License Fee"',
      "    amount: 50000",
      '  - description: "Implementation Fee"',
      "    amount: 10000",
      '  - description: "Training (5 sessions)"',
      "    amount: 5000",
      "totalFee: 65000",
    ].join("\n"),
  },
  hipaa: {
    name: "HIPAA Business Associate Agreement",
    template: [
      "---",
      "engine: handlebars",
      "---",
      "# BUSINESS ASSOCIATE AGREEMENT",
      "",
      "**Effective Date:** {{effectiveDate}}",
      "",
      'This Business Associate Agreement ("BAA") is entered into pursuant to the Health Insurance Portability and Accountability Act of 1996 ("HIPAA").',
      "",
      "## Covered Entity",
      "",
      "**Name:** {{coveredEntity.name}}",
      "**Address:** {{coveredEntity.address}}",
      "**Contact:** {{coveredEntity.contact}}",
      "",
      "## Business Associate",
      "",
      "**Name:** {{businessAssociate.name}}",
      "**Address:** {{businessAssociate.address}}",
      "**Contact:** {{businessAssociate.contact}}",
      "",
      "## 1. Definitions",
      "",
      "Terms used but not otherwise defined in this BAA shall have the same meaning as those terms in HIPAA and its implementing regulations.",
      "",
      "## 2. Permitted Uses and Disclosures",
      "",
      'Business Associate may use and disclose Protected Health Information ("PHI") only as necessary to perform the following services:',
      "",
      "{{#each services}}",
      "- {{this}}",
      "{{/each}}",
      "",
      "## 3. Obligations of Business Associate",
      "",
      "Business Associate agrees to:",
      "",
      "- Not use or disclose PHI except as permitted by this BAA or as required by law",
      "- Implement appropriate safeguards to prevent unauthorized use or disclosure of PHI",
      "- Report to Covered Entity any security incident or breach of unsecured PHI",
      "- Ensure that any subcontractors agree to the same restrictions and conditions",
      "- Make PHI available to individuals as required by HIPAA",
      "- Make PHI available for amendment and incorporate amendments as directed",
      "- Maintain and make available information required for accounting of disclosures",
      "- Make internal practices, books, and records available to HHS for compliance determination",
      "",
      "## 4. Term and Termination",
      "",
      "This BAA shall be effective as of {{effectiveDate}} and shall terminate when all PHI is destroyed or returned to Covered Entity, or if infeasible, protections are extended to such information.",
      "",
      "**Termination Notice Period:** {{terminationNotice}} days",
      "",
      "## 5. Breach Notification",
      "",
      "Business Associate shall notify Covered Entity of any breach of unsecured PHI within {{breachNotificationPeriod}} hours of discovery.",
      "",
      "---",
      "",
      "**Covered Entity Representative:** {{coveredEntity.representative}}",
      "**Signature:** ___________________________ **Date:** ___________",
      "",
      "**Business Associate Representative:** {{businessAssociate.representative}}",
      "**Signature:** ___________________________ **Date:** ___________",
    ].join("\n"),
    variables: [
      'effectiveDate: "2025-02-10"',
      "terminationNotice: 30",
      "breachNotificationPeriod: 24",
      "coveredEntity:",
      '  name: "HealthCare Medical Group"',
      '  address: "555 Medical Center Dr, Chicago, IL 60611"',
      '  contact: "privacy@healthcaregroup.com"',
      '  representative: "Dr. Emily Roberts, Privacy Officer"',
      "businessAssociate:",
      '  name: "CloudHealth IT Services"',
      '  address: "888 Tech Park, Seattle, WA 98101"',
      '  contact: "compliance@cloudhealth.com"',
      '  representative: "David Martinez, Chief Compliance Officer"',
      "services:",
      '  - "Electronic Health Records (EHR) hosting and maintenance"',
      '  - "Data backup and disaster recovery services"',
      '  - "Technical support and system administration"',
      '  - "Security monitoring and incident response"',
    ].join("\n"),
  },
  sowConsulting: {
    name: "SOW - Consulting Services",
    template: [
      "---",
      "engine: handlebars",
      "---",
      "# STATEMENT OF WORK",
      "## Consulting Services",
      "",
      "**SOW Number:** {{sowNumber}}",
      "**Date:** {{date}}",
      "**Project:** {{projectName}}",
      "",
      "This Statement of Work is entered into under the Master Service Agreement dated {{msaDate}}.",
      "",
      "## Client",
      "",
      "**Name:** {{client.name}}",
      "**Contact:** {{client.contact}}",
      "**Email:** {{client.email}}",
      "",
      "## Consultant",
      "",
      "**Name:** {{consultant.name}}",
      "**Contact:** {{consultant.contact}}",
      "**Email:** {{consultant.email}}",
      "",
      "## 1. Project Scope",
      "",
      "{{projectDescription}}",
      "",
      "## 2. Deliverables",
      "",
      "{{#each deliverables}}",
      "### {{this.name}}",
      "**Description:** {{this.description}}",
      "**Due Date:** {{this.dueDate}}",
      "",
      "{{/each}}",
      "",
      "## 3. Timeline",
      "",
      "**Start Date:** {{startDate}}",
      "**End Date:** {{endDate}}",
      "**Duration:** {{duration}}",
      "",
      "## 4. Consulting Rates",
      "",
      "{{#each rates}}",
      "- {{this.role}}: ${{this.hourlyRate}}/hour",
      "{{/each}}",
      "",
      "**Estimated Hours:** {{estimatedHours}}",
      "**Estimated Total:** ${{estimatedTotal}}",
      "",
      "## 5. Payment Schedule",
      "",
      "{{#each paymentSchedule}}",
      "- {{this.milestone}}: ${{this.amount}} ({{this.percentage}}%)",
      "{{/each}}",
      "",
      "## 6. Expenses",
      "",
      "{{expensePolicy}}",
      "",
      "## 7. Acceptance Criteria",
      "",
      "{{acceptanceCriteria}}",
      "",
      "---",
      "",
      "**Client Approval:** {{client.approver}}",
      "**Signature:** ___________________________ **Date:** ___________",
      "",
      "**Consultant:** {{consultant.representative}}",
      "**Signature:** ___________________________ **Date:** ___________",
    ].join("\n"),
    variables: [
      'sowNumber: "SOW-2025-0042"',
      'date: "2025-02-10"',
      'msaDate: "2024-12-01"',
      'projectName: "Digital Transformation Strategy"',
      'projectDescription: "Comprehensive assessment and strategic planning for digital transformation initiative, including technology stack evaluation, process optimization recommendations, and implementation roadmap."',
      'startDate: "2025-03-01"',
      'endDate: "2025-06-30"',
      'duration: "4 months"',
      "estimatedHours: 480",
      "estimatedTotal: 96000",
      'expensePolicy: "Pre-approved expenses will be reimbursed at cost. Travel requires prior written approval."',
      'acceptanceCriteria: "Each deliverable must be reviewed and approved by Client within 10 business days of submission. Approval shall not be unreasonably withheld."',
      "client:",
      '  name: "Retail Innovations Inc."',
      '  contact: "Lisa Anderson"',
      '  email: "lisa.anderson@retailinnovations.com"',
      '  approver: "Lisa Anderson, VP of Operations"',
      "consultant:",
      '  name: "Strategic Advisors LLC"',
      '  contact: "Robert Kim"',
      '  email: "robert.kim@strategicadvisors.com"',
      '  representative: "Robert Kim, Managing Partner"',
      "deliverables:",
      '  - name: "Current State Assessment"',
      '    description: "Comprehensive analysis of existing systems, processes, and capabilities"',
      '    dueDate: "2025-03-31"',
      '  - name: "Technology Recommendations"',
      '    description: "Detailed evaluation of technology options with pros/cons analysis"',
      '    dueDate: "2025-04-30"',
      '  - name: "Implementation Roadmap"',
      '    description: "Phased implementation plan with timelines, resources, and budget estimates"',
      '    dueDate: "2025-05-31"',
      '  - name: "Final Presentation"',
      '    description: "Executive presentation of findings and recommendations"',
      '    dueDate: "2025-06-30"',
      "rates:",
      '  - role: "Senior Consultant"',
      "    hourlyRate: 250",
      '  - role: "Consultant"',
      "    hourlyRate: 175",
      "paymentSchedule:",
      '  - milestone: "Project Kickoff"',
      "    amount: 24000",
      '    percentage: "25"',
      '  - milestone: "Current State Assessment Complete"',
      "    amount: 24000",
      '    percentage: "25"',
      '  - milestone: "Technology Recommendations Complete"',
      "    amount: 24000",
      '    percentage: "25"',
      '  - milestone: "Final Deliverables Accepted"',
      "    amount: 24000",
      '    percentage: "25"',
    ].join("\n"),
  },
  sowParts: {
    name: "SOW - Parts and Materials",
    template: [
      "---",
      "engine: liquid",
      "---",
      "# STATEMENT OF WORK",
      "## Parts and Materials Supply",
      "",
      "**SOW Number:** {{ sowNumber }}",
      "**Date:** {{ date }}",
      "**Purchase Order:** {{ purchaseOrder }}",
      "",
      "## Supplier",
      "",
      "**Name:** {{ supplier.name }}",
      "**Address:** {{ supplier.address }}",
      "**Contact:** {{ supplier.contact }}",
      "**Email:** {{ supplier.email }}",
      "",
      "## Purchaser",
      "",
      "**Name:** {{ purchaser.name }}",
      "**Address:** {{ purchaser.address }}",
      "**Contact:** {{ purchaser.contact }}",
      "**Email:** {{ purchaser.email }}",
      "",
      "## 1. Parts List",
      "",
      "| Part Number | Description | Quantity | Unit Price | Total |",
      "|-------------|-------------|----------|------------|-------|",
      "{% for part in parts %}",
      "| {{ part.partNumber }} | {{ part.description }} | {{ part.quantity }} | ${{ part.unitPrice }} | ${{ part.total }} |",
      "{% endfor %}",
      "",
      "## 2. Pricing Summary",
      "",
      "**Subtotal:** ${{ subtotal }}",
      "**Shipping & Handling:** ${{ shipping }}",
      "**Tax ({{ taxRate }}%):** ${{ tax }}",
      "**Total Amount:** ${{ totalAmount }}",
      "",
      "## 3. Delivery Terms",
      "",
      "**Delivery Address:**",
      "{{ deliveryAddress }}",
      "",
      "**Requested Delivery Date:** {{ requestedDeliveryDate }}",
      "**Shipping Method:** {{ shippingMethod }}",
      "**Incoterms:** {{ incoterms }}",
      "",
      "## 4. Quality Standards",
      "",
      "All parts must meet or exceed the following standards:",
      "",
      "{% for standard in qualityStandards %}",
      "- {{ standard }}",
      "{% endfor %}",
      "",
      "## 5. Warranty",
      "",
      "Supplier warrants that all parts are free from defects in materials and workmanship for a period of {{ warrantyPeriod }} from the date of delivery.",
      "",
      "## 6. Payment Terms",
      "",
      "**Payment Terms:** {{ paymentTerms }}",
      "**Payment Method:** {{ paymentMethod }}",
      "",
      "## 7. Inspection and Acceptance",
      "",
      "Purchaser has {{ inspectionPeriod }} days from delivery to inspect and accept or reject the parts. Any defects must be reported within this period.",
      "",
      "---",
      "",
      "**Supplier Representative:** {{ supplier.representative }}",
      "**Signature:** ___________________________ **Date:** ___________",
      "",
      "**Purchaser Representative:** {{ purchaser.representative }}",
      "**Signature:** ___________________________ **Date:** ___________",
    ].join("\n"),
    variables: [
      'sowNumber: "SOW-PARTS-2025-0156"',
      'date: "2025-02-10"',
      'purchaseOrder: "PO-45678"',
      'requestedDeliveryDate: "2025-03-15"',
      'shippingMethod: "Ground Freight"',
      'incoterms: "FOB Destination"',
      'warrantyPeriod: "24 months"',
      'paymentTerms: "Net 30"',
      'paymentMethod: "Wire Transfer"',
      "inspectionPeriod: 10",
      "subtotal: 47500",
      "shipping: 1200",
      "taxRate: 8.5",
      "tax: 4040",
      "totalAmount: 52740",
      'deliveryAddress: "Manufacturing Facility A\\n1000 Industrial Parkway\\nDetroit, MI 48201"',
      "supplier:",
      '  name: "Precision Components Ltd."',
      '  address: "2500 Manufacturing Dr, Cleveland, OH 44101"',
      '  contact: "Tom Wilson"',
      '  email: "tom.wilson@precisioncomp.com"',
      '  representative: "Tom Wilson, Sales Manager"',
      "purchaser:",
      '  name: "AutoTech Manufacturing"',
      '  address: "1000 Industrial Parkway, Detroit, MI 48201"',
      '  contact: "Jennifer Lee"',
      '  email: "jennifer.lee@autotech.com"',
      '  representative: "Jennifer Lee, Procurement Director"',
      "parts:",
      '  - partNumber: "BRG-2045-X"',
      '    description: "High-precision ball bearing assembly"',
      "    quantity: 500",
      "    unitPrice: 45",
      "    total: 22500",
      '  - partNumber: "GSK-8830-A"',
      '    description: "Industrial gasket set (10-pack)"',
      "    quantity: 100",
      "    unitPrice: 85",
      "    total: 8500",
      '  - partNumber: "FLT-5500-B"',
      '    description: "Oil filter cartridge"',
      "    quantity: 250",
      "    unitPrice: 28",
      "    total: 7000",
      '  - partNumber: "SEN-9920-C"',
      '    description: "Temperature sensor module"',
      "    quantity: 150",
      "    unitPrice: 60",
      "    total: 9000",
      '  - partNumber: "CBL-1155-D"',
      '    description: "Shielded cable assembly (2m)"',
      "    quantity: 200",
      "    unitPrice: 2.5",
      "    total: 500",
      "qualityStandards:",
      '  - "ISO 9001:2015 certified manufacturing"',
      '  - "RoHS compliant materials"',
      '  - "100% dimensional inspection"',
      '  - "Certificate of Conformance included with shipment"',
    ].join("\n"),
  },
}

const defaultTemplate = examples.msa.template
const defaultVariables = examples.msa.variables

export default function AgreementEditor() {
  const [template, setTemplate] = useState(defaultTemplate)
  const [variables, setVariables] = useState(defaultVariables)
  const [preview, setPreview] = useState("")
  const [engine, setEngine] = useState<TemplateEngine>("handlebars")
  const [activePane, setActivePane] = useState<"editor" | "preview">("editor")
  const [selectedExample, setSelectedExample] = useState<string>("msa")
  const [previewStyle, setPreviewStyle] = useState<string>("standard")

  const [horizontalSplit, setHorizontalSplit] = useState(50)
  const [verticalSplit, setVerticalSplit] = useState(80)
  const [isDraggingHorizontal, setIsDraggingHorizontal] = useState(false)
  const [isDraggingVertical, setIsDraggingVertical] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const horizontalRafRef = useRef<number>()
  const verticalRafRef = useRef<number>()

  useEffect(() => {
    const errorHandler = (e: ErrorEvent) => {
      if (e.message.includes("ResizeObserver loop")) {
        e.stopImmediatePropagation()
        return false
      }
    }
    window.addEventListener("error", errorHandler)
    return () => window.removeEventListener("error", errorHandler)
  }, [])

  useEffect(() => {
    renderPreview()
  }, [template, variables])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingHorizontal && containerRef.current) {
        if (horizontalRafRef.current) {
          cancelAnimationFrame(horizontalRafRef.current)
        }
        horizontalRafRef.current = requestAnimationFrame(() => {
          const containerRect = containerRef.current!.getBoundingClientRect()
          const newSplit = ((e.clientX - containerRect.left) / containerRect.width) * 100
          setHorizontalSplit(Math.min(Math.max(newSplit, 20), 80))
        })
      }
    }

    const handleMouseUp = () => {
      setIsDraggingHorizontal(false)
      if (horizontalRafRef.current) {
        cancelAnimationFrame(horizontalRafRef.current)
      }
    }

    if (isDraggingHorizontal) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
      if (horizontalRafRef.current) {
        cancelAnimationFrame(horizontalRafRef.current)
      }
    }
  }, [isDraggingHorizontal])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingVertical && containerRef.current) {
        if (verticalRafRef.current) {
          cancelAnimationFrame(verticalRafRef.current)
        }
        verticalRafRef.current = requestAnimationFrame(() => {
          const leftPanel = containerRef.current!.querySelector(".left-panel") as HTMLElement
          if (leftPanel) {
            const panelRect = leftPanel.getBoundingClientRect()
            const newSplit = ((e.clientY - panelRect.top) / panelRect.height) * 100
            setVerticalSplit(Math.min(Math.max(newSplit, 20), 90))
          }
        })
      }
    }

    const handleMouseUp = () => {
      setIsDraggingVertical(false)
      if (verticalRafRef.current) {
        cancelAnimationFrame(verticalRafRef.current)
      }
    }

    if (isDraggingVertical) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "row-resize"
      document.body.style.userSelect = "none"
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
      if (verticalRafRef.current) {
        cancelAnimationFrame(verticalRafRef.current)
      }
    }
  }, [isDraggingVertical])

  const renderPreview = async () => {
    try {
      const parsed = parseTemplate(template)
      setEngine(parsed.engine)

      const result = await render(template, variables)
      setPreview(result.html)
    } catch (error) {
      console.error("[v0] Preview render error:", error)
      setPreview(`<div style="color: #ef4444; padding: 1rem;">
        <strong>Error rendering preview:</strong><br/>
        ${error instanceof Error ? error.message : "Unknown error"}
      </div>`)
    }
  }

  const handleExampleChange = (value: string) => {
    setSelectedExample(value)
    const example = examples[value as keyof typeof examples]
    if (example) {
      setTemplate(example.template)
      setVariables(example.variables)
    }
  }

  const getPreviewClasses = () => {
    const baseClasses = "prose prose-slate dark:prose-invert max-w-none"
    const commonClasses = `prose-headings:font-semibold
      prose-strong:font-semibold prose-strong:text-foreground
      prose-ul:list-disc prose-ol:list-decimal
      prose-table:border-collapse prose-table:w-full
      prose-th:border prose-th:border-border prose-th:bg-muted prose-th:p-2 prose-th:text-left
      prose-td:border prose-td:border-border prose-td:p-2
      prose-hr:border-border`

    switch (previewStyle) {
      case "compact":
        return `${baseClasses} prose-sm p-4 ${commonClasses}
          prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
          prose-p:text-sm prose-p:leading-6
          prose-li:text-sm prose-li:leading-6
          prose-hr:my-4`
      case "comfortable":
        return `${baseClasses} prose-lg p-10 ${commonClasses}
          prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
          prose-p:text-lg prose-p:leading-8
          prose-li:text-lg prose-li:leading-8
          prose-hr:my-10`
      case "large":
        return `${baseClasses} prose-xl p-12 ${commonClasses}
          prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl
          prose-p:text-xl prose-p:leading-9
          prose-li:text-xl prose-li:leading-9
          prose-hr:my-12`
      default: // standard
        return `${baseClasses} p-8 ${commonClasses}
          prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
          prose-p:text-base prose-p:leading-7
          prose-li:text-base prose-li:leading-7
          prose-hr:my-8`
    }
  }

  const openPreviewInNewWindow = () => {
    const newWindow = window.open("", "_blank", "width=900,height=800")
    if (!newWindow) {
      alert("Please allow popups to open the preview in a new window")
      return
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agreement Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          typography: {
            DEFAULT: {
              css: {
                maxWidth: 'none',
              },
            },
          },
        },
      },
    }
  </script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
  </style>
</head>
<body class="bg-white">
  <div class="${getPreviewClasses()}">
    ${preview}
  </div>
</body>
</html>
    `

    newWindow.document.write(htmlContent)
    newWindow.document.close()
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="font-mono text-xl font-semibold text-foreground">Agreement Editor</h1>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedExample} onValueChange={handleExampleChange}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select an example" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="msa">{examples.msa.name}</SelectItem>
              <SelectItem value="softwareLicense">{examples.softwareLicense.name}</SelectItem>
              <SelectItem value="hipaa">{examples.hipaa.name}</SelectItem>
              <SelectItem value="sowConsulting">{examples.sowConsulting.name}</SelectItem>
              <SelectItem value="sowParts">{examples.sowParts.name}</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 rounded-lg bg-muted p-1">
            <span className="px-3 py-1 text-sm font-medium text-muted-foreground">
              Engine: <span className="text-foreground">{engine}</span>
            </span>
          </div>
        </div>
      </header>

      <div className="flex border-b border-border bg-card lg:hidden">
        <button
          onClick={() => setActivePane("editor")}
          className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
            activePane === "editor"
              ? "border-b-2 border-primary bg-accent text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Code2 className="h-4 w-4" />
          Editor
        </button>
        <button
          onClick={() => setActivePane("preview")}
          className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
            activePane === "preview"
              ? "border-b-2 border-primary bg-accent text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Eye className="h-4 w-4" />
          Preview
        </button>
      </div>

      <div ref={containerRef} className="flex flex-1 overflow-hidden">
        {/* Left Side: Template and Variables stacked */}
        <div
          className={`left-panel flex flex-col ${
            activePane === "editor" ? "flex-1" : "hidden"
          } lg:flex border-r border-border`}
          style={{ width: `${horizontalSplit}%` }}
        >
          <div className="flex flex-col border-b border-border overflow-hidden" style={{ height: `${verticalSplit}%` }}>
            <div className="border-b border-border bg-muted px-4 py-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-sm font-medium text-foreground">Template</span>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                defaultLanguage="markdown"
                value={template}
                onChange={(value) => setTemplate(value || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  fontFamily: "var(--font-geist-mono)",
                }}
              />
            </div>
          </div>

          <div
            className="group relative h-1 cursor-row-resize bg-border hover:bg-primary flex-shrink-0"
            onMouseDown={() => setIsDraggingVertical(true)}
          >
            <div className="absolute inset-x-0 -top-1 -bottom-1" />
          </div>

          <div className="flex flex-col overflow-hidden" style={{ height: `calc(${100 - verticalSplit}% - 4px)` }}>
            <div className="border-b border-border bg-muted px-4 py-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-sm font-medium text-foreground">Variables (YAML)</span>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                defaultLanguage="yaml"
                value={variables}
                onChange={(value) => setVariables(value || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  fontFamily: "var(--font-geist-mono)",
                }}
              />
            </div>
          </div>
        </div>

        <div
          className="hidden lg:block w-1 cursor-col-resize bg-border hover:bg-primary"
          onMouseDown={() => setIsDraggingHorizontal(true)}
        />

        {/* Right Side: Preview - full height */}
        <div
          className={`flex flex-col ${activePane === "preview" ? "flex-1" : "hidden"} lg:flex`}
          style={{ width: `${100 - horizontalSplit}%` }}
        >
          <div className="border-b border-border bg-muted px-4 py-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-sm font-medium text-foreground">Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openPreviewInNewWindow}
                  className="h-8 gap-2 bg-transparent"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Open</span>
                </Button>
                <Select value={previewStyle} onValueChange={setPreviewStyle}>
                  <SelectTrigger className="w-[140px] h-8">
                    <SelectValue placeholder="Style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-card">
            <div className={getPreviewClasses()} dangerouslySetInnerHTML={{ __html: preview }} />
          </div>
        </div>
      </div>
    </div>
  )
}
