import type { AreaCode } from "./types"

// Utility functions for data export functionality

export interface ExportOptions {
  format: "csv" | "excel"
  includeHeaders: boolean
  selectedFields: (keyof AreaCode)[]
  dateRange?: {
    start: Date
    end: Date
  }
  factory?: string
  floor?: string
}

export const defaultExportFields: (keyof AreaCode)[] = [
  "codearea",
  "factory",
  "area",
  "location",
  "floor",
  "code",
  "created_at",
]

export const fieldLabels: Record<keyof AreaCode, string> = {
  id: "ID",
  factory: "Factory",
  area: "Area",
  location: "Location",
  floor: "Floor",
  code: "Code",
  codearea: "Code Area",
  created_at: "Created Date",
  updated_at: "Updated Date",
}

// Filter data based on export options
export function filterDataForExport(data: AreaCode[], options: ExportOptions): AreaCode[] {
  let filtered = [...data]

  // Filter by factory
  if (options.factory && options.factory !== "all") {
    filtered = filtered.filter((item) => item.factory === options.factory)
  }

  // Filter by floor
  if (options.floor && options.floor !== "all") {
    filtered = filtered.filter((item) => item.floor === options.floor)
  }

  // Filter by date range
  if (options.dateRange) {
    filtered = filtered.filter((item) => {
      if (!item.created_at) return false
      const itemDate = new Date(item.created_at)
      return itemDate >= options.dateRange!.start && itemDate <= options.dateRange!.end
    })
  }

  return filtered
}

// Convert data to CSV format
export function convertToCSV(data: AreaCode[], options: ExportOptions): string {
  const filtered = filterDataForExport(data, options)

  if (filtered.length === 0) {
    return options.includeHeaders ? Object.values(fieldLabels).join(",") + "\n" : ""
  }

  const headers = options.selectedFields.map((field) => fieldLabels[field])
  const rows = filtered.map((item) =>
    options.selectedFields
      .map((field) => {
        const value = item[field]
        // Handle dates
        if (field === "created_at" || field === "updated_at") {
          return value ? new Date(value).toLocaleDateString() : ""
        }
        // Escape commas and quotes in CSV
        if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value || ""
      })
      .join(","),
  )

  const csvContent = options.includeHeaders ? [headers.join(","), ...rows].join("\n") : rows.join("\n")

  return csvContent
}

// Download file utility
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Generate filename with timestamp
export function generateFilename(prefix: string, format: "csv" | "excel"): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, "-")
  const extension = format === "excel" ? "xlsx" : "csv"
  return `${prefix}_${timestamp}.${extension}`
}

// Convert data to Excel format (using a simple XML structure)
export function convertToExcel(data: AreaCode[], options: ExportOptions): string {
  const filtered = filterDataForExport(data, options)

  const headers = options.selectedFields.map((field) => fieldLabels[field])
  const rows = filtered.map((item) =>
    options.selectedFields.map((field) => {
      const value = item[field]
      if (field === "created_at" || field === "updated_at") {
        return value ? new Date(value).toLocaleDateString() : ""
      }
      return value || ""
    }),
  )

  // Simple Excel XML structure
  let xml = `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
<Worksheet ss:Name="Area Codes">
<Table>`

  // Add headers if requested
  if (options.includeHeaders) {
    xml += "<Row>"
    headers.forEach((header) => {
      xml += `<Cell><Data ss:Type="String">${header}</Data></Cell>`
    })
    xml += "</Row>"
  }

  // Add data rows
  rows.forEach((row) => {
    xml += "<Row>"
    row.forEach((cell) => {
      const cellType = typeof cell === "number" ? "Number" : "String"
      xml += `<Cell><Data ss:Type="${cellType}">${cell}</Data></Cell>`
    })
    xml += "</Row>"
  })

  xml += "</Table></Worksheet></Workbook>"
  return xml
}

// Get export statistics
export function getExportStats(data: AreaCode[], options: ExportOptions) {
  const filtered = filterDataForExport(data, options)
  const totalRecords = data.length
  const exportedRecords = filtered.length
  const fieldsCount = options.selectedFields.length

  return {
    totalRecords,
    exportedRecords,
    fieldsCount,
    filterApplied: exportedRecords !== totalRecords,
  }
}
