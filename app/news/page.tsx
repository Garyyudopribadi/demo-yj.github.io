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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, Search, Filter, ArrowUpRight, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

// Mock data for events with more entries for pagination testing
const events = [
  {
    id: 1,
    title: "Annual Fire Safety Training",
    date: "2025-03-15",
    time: "09:00 AM - 12:00 PM",
    description: "Comprehensive fire safety training for all employees to ensure workplace safety.",
    image: "/placeholder.svg?height=200&width=400",
    category: "Training",
    attendees: 150,
    location: "Main Conference Hall",
  },
  {
    id: 2,
    title: "Environmental Sustainability Workshop",
    date: "2025-04-10",
    time: "02:00 PM - 04:00 PM",
    description: "Workshop on sustainable manufacturing practices and reducing environmental impact.",
    image: "/placeholder.svg?height=200&width=400",
    category: "Workshop",
    attendees: 80,
    location: "Training Center",
  },
  {
    id: 3,
    title: "Employee Health and Wellness Day",
    date: "2025-05-20",
    time: "08:00 AM - 05:00 PM",
    description: "A day dedicated to employee health with free health check-ups and wellness activities.",
    image: "/placeholder.svg?height=200&width=400",
    category: "Wellness",
    attendees: 300,
    location: "Recreation Center",
  },
  {
    id: 4,
    title: "Quality Control Training",
    date: "2025-06-05",
    time: "10:00 AM - 03:00 PM",
    description: "Training session on quality control procedures and standards for production staff.",
    image: "/placeholder.svg?height=200&width=400",
    category: "Training",
    attendees: 120,
    location: "Quality Lab",
  },
  {
    id: 5,
    title: "Leadership Development Program",
    date: "2025-07-12",
    time: "09:00 AM - 04:00 PM",
    description: "Development program for team leaders and supervisors to enhance leadership skills.",
    image: "/placeholder.svg?height=200&width=400",
    category: "Development",
    attendees: 50,
    location: "Executive Conference Room",
  },
  {
    id: 6,
    title: "Annual Company Gathering",
    date: "2025-08-30",
    time: "06:00 PM - 10:00 PM",
    description: "Annual gathering for all employees with dinner, entertainment, and awards ceremony.",
    image: "/placeholder.svg?height=200&width=400",
    category: "Social",
    attendees: 500,
    location: "Grand Ballroom",
  },
  {
    id: 7,
    title: "Digital Transformation Workshop",
    date: "2025-09-15",
    time: "01:00 PM - 05:00 PM",
    description: "Learn about digital tools and technologies to improve workplace efficiency.",
    image: "/placeholder.svg?height=200&width=400",
    category: "Workshop",
    attendees: 100,
    location: "Innovation Lab",
  },
  {
    id: 8,
    title: "Team Building Activities",
    date: "2025-10-20",
    time: "09:00 AM - 03:00 PM",
    description: "Fun team building activities to strengthen collaboration and communication.",
    image: "/placeholder.svg?height=200&width=400",
    category: "Social",
    attendees: 200,
    location: "Outdoor Facility",
  },
  {
    id: 9,
    title: "Safety Equipment Training",
    date: "2025-11-10",
    time: "10:00 AM - 12:00 PM",
    description: "Training on proper use and maintenance of safety equipment.",
    image: "/placeholder.svg?height=200&width=400",
    category: "Training",
    attendees: 180,
    location: "Safety Training Room",
  },
  {
    id: 10,
    title: "Innovation Challenge",
    date: "2025-12-05",
    time: "09:00 AM - 05:00 PM",
    description: "Company-wide innovation challenge to encourage creative problem-solving.",
    image: "/placeholder.svg?height=200&width=400",
    category: "Development",
    attendees: 250,
    location: "Innovation Hub",
  },
]

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const eventsPerPage = 6

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  // Filter events based on search term and category
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage)
  const indexOfLastEvent = currentPage * eventsPerPage
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, categoryFilter])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Get unique categories for filter
  const categories = ["all", ...Array.from(new Set(events.map((event) => event.category)))]

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
          News
        </motion.h1>
        <motion.p
          className="text-muted-foreground md:text-lg max-w-[800px]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Stay updated with the latest news and activities at PT.YONGJIN JAVASUKA GARMENT.
        </motion.p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
       {/* Running text for upcoming news */}
      <style jsx>{`
        @keyframes custom-marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .custom-marquee {
          display: inline-block;
          white-space: nowrap;
          animation: custom-marquee 18s linear infinite;
        }
      `}</style>
      <div className="w-full overflow-hidden mb-4">
        <div className="text-primary font-semibold text-base md:text-lg py-2 px-2 bg-background/80 rounded">
          <span className="custom-marquee">
            📢 Upcoming News: Annual Company Gathering on August 30, 2025 • Innovation Challenge on December 5, 2025 • Stay tuned for more updates!
          </span>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {indexOfFirstEvent + 1}-{Math.min(indexOfLastEvent, filteredEvents.length)} of {filteredEvents.length}{" "}
          events
        </p>
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      {/* Events Grid */}
      {currentEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {currentEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden flex flex-col h-full group hover:shadow-lg transition-all duration-300">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                      {event.category}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{event.attendees} attendees</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
                </CardContent>
                <CardFooter>
                  <Link href={`/news/${event.id}`} className="w-full">
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                    >
                      Read More
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
          <p className="text-muted-foreground mb-4">No events found matching your search criteria.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setCategoryFilter("all")
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
            Page {currentPage} of {totalPages} • {filteredEvents.length} total events
          </p>
        </div>
      )}
    </div>
  )
}
