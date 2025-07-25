export interface AreaCode {
  id: number
  factory: "Factory 1" | "Factory 2" | "Factory 3"
  area: string
  location: string
  floor: "Floor 1" | "Floor 2" | "Floor 3" | "Floor 4"
  code: string
  codearea: string
  created_at?: string
  updated_at?: string
}

export interface CreateAreaCodeData {
  factory: "Factory 1" | "Factory 2" | "Factory 3"
  area: string
  location: string
  floor: "Floor 1" | "Floor 2" | "Floor 3" | "Floor 4"
  code: string
}

export interface UpdateAreaCodeData extends CreateAreaCodeData {
  id: number
}

// Export Types
export interface ExportOptions {
  format: "csv" | "excel"
  fields: string[]
  includeHeaders: boolean
  filters: {
    factory?: string[]
    floor?: string[]
    dateRange?: {
      from?: Date
      to?: Date
    }
  }
}

// Mock data for development
export const mockAreaCodes: AreaCode[] = [
  {
    id: 1,
    factory: "Factory 1",
    area: "Production Line A",
    location: "North Wing",
    floor: "Floor 1",
    code: "PLA",
    codearea: "PLA1",
    created_at: "2024-01-15T08:30:00Z",
    updated_at: "2024-01-15T08:30:00Z",
  },
  {
    id: 2,
    factory: "Factory 2",
    area: "Quality Control",
    location: "South Wing",
    floor: "Floor 2",
    code: "QC",
    codearea: "QC2",
    created_at: "2024-01-16T09:15:00Z",
    updated_at: "2024-01-16T09:15:00Z",
  },
  {
    id: 3,
    factory: "Factory 3",
    area: "Storage Area",
    location: "East Wing",
    floor: "Floor 3",
    code: "STG",
    codearea: "STG3",
    created_at: "2024-01-17T10:45:00Z",
    updated_at: "2024-01-17T10:45:00Z",
  },
]
