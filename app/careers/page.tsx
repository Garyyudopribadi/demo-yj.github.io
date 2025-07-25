"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { MapPin, Clock, Search, Filter, Briefcase, ArrowUpRight, DollarSign } from "lucide-react"
import ApplicationProcess from "@/components/application-process"
import { motion } from "framer-motion"

// Mock data for job vacancies with more entries for pagination testing
const jobs = [
  {
    id: 1,
    title: "Production Supervisor",
    department: "Manufacturing",
    location: "Yongjin 1, Sukabumi",
    type: "Full-time",
    postedDate: "2025-04-01",
    description: "Supervise production activities and ensure quality standards are met.",
    salary: "IDR 12,000,000 - 15,000,000",
    experience: "3+ years",
  },
  {
    id: 2,
    title: "Quality Control Inspector",
    department: "Quality Assurance",
    location: "Yongjin 2 Unit 1, Sukabumi",
    type: "Full-time",
    postedDate: "2025-04-05",
    description: "Inspect garments to ensure they meet quality standards and specifications.",
    salary: "IDR 8,000,000 - 10,000,000",
    experience: "2+ years",
  },
  {
    id: 3,
    title: "HR Specialist",
    department: "Human Resources",
    location: "Yongjin 1, Sukabumi",
    type: "Full-time",
    postedDate: "2025-04-10",
    description: "Handle recruitment, employee relations, and HR administrative tasks.",
    salary: "IDR 10,000,000 - 13,000,000",
    experience: "2-3 years",
  },
  {
    id: 4,
    title: "Maintenance Technician",
    department: "Maintenance",
    location: "Yongjin 2 Unit 2, Sukabumi",
    type: "Full-time",
    postedDate: "2025-04-12",
    description: "Maintain and repair machinery and equipment to ensure smooth operations.",
    salary: "IDR 7,000,000 - 9,000,000",
    experience: "2+ years",
  },
  {
    id: 5,
    title: "Logistics Coordinator",
    department: "Supply Chain",
    location: "Yongjin 1, Sukabumi",
    type: "Full-time",
    postedDate: "2025-04-15",
    description: "Coordinate logistics activities including shipping, receiving, and inventory management.",
    salary: "IDR 9,000,000 - 12,000,000",
    experience: "2-4 years",
  },
  {
    id: 6,
    title: "Pattern Maker",
    department: "Design",
    location: "Yongjin 2 Unit 1, Sukabumi",
    type: "Full-time",
    postedDate: "2025-04-20",
    description: "Create and modify patterns for garment production based on design specifications.",
    salary: "IDR 8,500,000 - 11,000,000",
    experience: "3+ years",
  },
  {
    id: 7,
    title: "Machine Operator",
    department: "Manufacturing",
    location: "Yongjin 1, Sukabumi",
    type: "Full-time",
    postedDate: "2025-04-22",
    description: "Operate sewing machines and other production equipment efficiently and safely.",
    salary: "IDR 5,500,000 - 7,000,000",
    experience: "1-2 years",
  },
  {
    id: 8,
    title: "Warehouse Supervisor",
    department: "Supply Chain",
    location: "Yongjin 2 Unit 2, Sukabumi",
    type: "Full-time",
    postedDate: "2025-04-25",
    description: "Supervise warehouse operations including inventory management and shipping.",
    salary: "IDR 10,000,000 - 13,000,000",
    experience: "3+ years",
  },
  {
    id: 9,
    title: "Safety Officer",
    department: "Health & Safety",
    location: "Yongjin 1, Sukabumi",
    type: "Full-time",
    postedDate: "2025-04-28",
    description: "Ensure workplace safety compliance and conduct safety training programs.",
    salary: "IDR 8,000,000 - 11,000,000",
    experience: "2-3 years",
  },
  {
    id: 10,
    title: "IT Support Specialist",
    department: "Information Technology",
    location: "Yongjin 1, Sukabumi",
    type: "Full-time",
    postedDate: "2025-05-01",
    description: "Provide technical support and maintain IT infrastructure across all facilities.",
    salary: "IDR 7,500,000 - 10,000,000",
    experience: "1-3 years",
  },
  {
    id: 11,
    title: "Accounting Clerk",
    department: "Finance",
    location: "Yongjin 1, Sukabumi",
    type: "Full-time",
    postedDate: "2025-05-03",
    description: "Handle accounts payable, receivable, and general accounting tasks.",
    salary: "IDR 6,500,000 - 8,500,000",
    experience: "1-2 years",
  },
  {
    id: 12,
    title: "Training Coordinator",
    department: "Human Resources",
    location: "Yongjin 2 Unit 1, Sukabumi",
    type: "Full-time",
    postedDate: "2025-05-05",
    description: "Coordinate employee training programs and professional development initiatives.",
    salary: "IDR 9,000,000 - 12,000,000",
    experience: "2-4 years",
  },
]

export default function CareersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("positions")
  const jobsPerPage = 6

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Calculate days since posting
  const getDaysSincePosting = (dateString: string) => {
    const postedDate = new Date(dateString)
    const currentDate = new Date()
    const diffTime = Math.abs(currentDate.getTime() - postedDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Filter jobs based on search term, department, and location
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || job.department === departmentFilter
    const matchesLocation = locationFilter === "all" || job.location === locationFilter
    return matchesSearch && matchesDepartment && matchesLocation
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)
  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, departmentFilter, locationFilter])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Get unique departments and locations for filters
  const departments = ["all", ...Array.from(new Set(jobs.map((job) => job.department)))]
  const locations = ["all", ...Array.from(new Set(jobs.map((job) => job.location)))]

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(i)
              }}
              isActive={i === currentPage}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      }
    } else {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(1)
            }}
            isActive={1 === currentPage}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      )

      // Show ellipsis if needed
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(i)
                }}
                isActive={i === currentPage}
              >
                {i}
              </PaginationLink>
            </PaginationItem>,
          )
        }
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }

      // Show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(totalPages)
              }}
              isActive={totalPages === currentPage}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>,
        )
      }
    }

    return items
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <motion.h1
          className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Join Our Team
        </motion.h1>
        <motion.p
          className="text-muted-foreground md:text-lg max-w-[800px]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Explore exciting career opportunities at PT.YONGJIN JAVASUKA GARMENT and be part of our growing team.
        </motion.p>
      </div>

      {/* Tabs for Open Positions and Application Process */}
      <Tabs defaultValue="positions" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="positions">Open Positions</TabsTrigger>
          <TabsTrigger value="process">Application Process</TabsTrigger>
        </TabsList>

        {/* Open Positions Tab Content */}
        <TabsContent value="positions" className="space-y-8">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department} value={department}>
                        {department === "all" ? "All Departments" : department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location === "all" ? "All Locations" : location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {indexOfFirstJob + 1}-{Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length}{" "}
              jobs
            </p>
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
          </div>

          {/* Job Vacancies Section */}
          <section>
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tighter">Open Positions</h2>
              <p className="text-muted-foreground max-w-[800px]">
                Explore our current job openings and find the right opportunity for you.
              </p>
            </div>

            {currentJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {currentJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="flex flex-col h-full group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="group-hover:text-primary transition-colors">{job.title}</CardTitle>
                          <Badge variant="outline" className="bg-primary/10">
                            {job.type}
                          </Badge>
                        </div>
                        <CardDescription>{job.department}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{job.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{getDaysSincePosting(job.postedDate)} days ago</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{job.salary}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-4">{job.description}</p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link href={`/careers/${job.id}`} className="w-full">
                          <Button className="w-full group-hover:bg-primary/90 transition-colors">
                            Apply Now
                            <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Briefcase className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No jobs found matching your search criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setDepartmentFilter("all")
                    setLocationFilter("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage > 1) handlePageChange(currentPage - 1)
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {renderPaginationItems()}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage < totalPages) handlePageChange(currentPage + 1)
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                {/* Page info */}
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages} • {filteredJobs.length} total jobs
                </p>
              </div>
            )}
          </section>
        </TabsContent>

        {/* Application Process Tab Content */}
        <TabsContent value="process">
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tighter">Our Application Process</h2>
              <p className="text-muted-foreground max-w-[800px]">
                Learn about our streamlined application process designed to find the best talent.
              </p>
            </div>
            <ApplicationProcess />
          </motion.section>
        </TabsContent>
      </Tabs>
    </div>
  )
}
