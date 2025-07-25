"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, ArrowLeft, Share2, Bookmark, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Mock data for events
const events = [
  {
    id: "1",
    title: "Annual Fire Safety Training",
    date: "2025-03-15",
    time: "09:00 AM - 12:00 PM",
    description: `
      <p>Comprehensive fire safety training for all employees to ensure workplace safety. This annual training is mandatory for all employees and is part of our commitment to maintaining a safe working environment.</p>
      
      <h3>Training Objectives:</h3>
      <ul>
        <li>Understanding fire hazards in the workplace</li>
        <li>Proper use of fire extinguishers</li>
        <li>Evacuation procedures and emergency exits</li>
        <li>Fire prevention strategies</li>
        <li>Reporting procedures for fire hazards</li>
      </ul>
      
      <p>The training will be conducted by certified fire safety experts and will include both theoretical and practical sessions. Participants will receive certificates upon completion of the training.</p>
      
      <h3>Schedule:</h3>
      <p>09:00 AM - 10:30 AM: Theoretical session<br/>
      10:30 AM - 11:00 AM: Break<br/>
      11:00 AM - 12:00 PM: Practical session</p>
      
      <p>Please ensure you arrive on time and wear appropriate clothing for the practical session. For any questions, please contact the HR department.</p>
    `,
    location: "Training Hall, Yongjin 1",
    organizer: "Health & Safety Department",
    category: "Training",
    images: [
      "/placeholder.svg?height=600&width=1200",
      "/placeholder.svg?height=600&width=1200&text=Fire+Safety+2",
      "/placeholder.svg?height=600&width=1200&text=Fire+Safety+3",
    ],
    relatedEvents: [2, 4],
  },
  {
    id: "2",
    title: "Environmental Sustainability Workshop",
    date: "2025-04-10",
    time: "02:00 PM - 04:00 PM",
    description: `
      <p>Workshop on sustainable manufacturing practices and reducing environmental impact. This workshop aims to educate employees on sustainable practices that can be implemented in our manufacturing processes.</p>
      
      <h3>Workshop Topics:</h3>
      <ul>
        <li>Sustainable material sourcing</li>
        <li>Energy efficiency in manufacturing</li>
        <li>Waste reduction strategies</li>
        <li>Water conservation techniques</li>
        <li>Carbon footprint reduction</li>
      </ul>
      
      <p>The workshop will be facilitated by environmental experts from the Sustainable Manufacturing Association. Participants will have the opportunity to contribute ideas for improving our sustainability practices.</p>
      
      <h3>Expected Outcomes:</h3>
      <ul>
        <li>Increased awareness of environmental issues</li>
        <li>Practical ideas for sustainable manufacturing</li>
        <li>Development of a sustainability action plan</li>
      </ul>
      
      <p>All department heads are required to attend, and other employees are encouraged to participate. Refreshments will be provided.</p>
    `,
    location: "Conference Room, Yongjin 2 Unit 1",
    organizer: "Environmental Compliance Team",
    category: "Workshop",
    images: [
      "/placeholder.svg?height=600&width=1200",
      "/placeholder.svg?height=600&width=1200&text=Sustainability+2",
      "/placeholder.svg?height=600&width=1200&text=Sustainability+3",
    ],
    relatedEvents: [3, 5],
  },
  {
    id: "3",
    title: "Employee Health and Wellness Day",
    date: "2025-05-20",
    time: "08:00 AM - 05:00 PM",
    description: `
      <p>A day dedicated to employee health with free health check-ups and wellness activities. This event is part of our commitment to promoting employee well-being and a healthy work-life balance.</p>
      
      <h3>Activities:</h3>
      <ul>
        <li>Free health check-ups (blood pressure, BMI, cholesterol)</li>
        <li>Nutrition counseling</li>
        <li>Fitness demonstrations</li>
        <li>Stress management workshops</li>
        <li>Healthy cooking demonstrations</li>
        <li>Yoga and meditation sessions</li>
      </ul>
      
      <p>Various health professionals will be available throughout the day to provide consultations and advice. Employees are encouraged to participate in as many activities as they wish.</p>
      
      <h3>Schedule:</h3>
      <p>08:00 AM - 12:00 PM: Health check-ups<br/>
      12:00 PM - 01:00 PM: Healthy lunch<br/>
      01:00 PM - 05:00 PM: Wellness activities</p>
      
      <p>No registration is required. Simply show up and participate in the activities of your choice. For more information, contact the HR department.</p>
    `,
    location: "Cafeteria and Recreation Area, Yongjin 1",
    organizer: "HR Department",
    category: "Wellness",
    images: [
      "/placeholder.svg?height=600&width=1200",
      "/placeholder.svg?height=600&width=1200&text=Health+Day+2",
      "/placeholder.svg?height=600&width=1200&text=Health+Day+3",
    ],
    relatedEvents: [1, 6],
  },
  {
    id: "4",
    title: "Quality Control Training",
    date: "2025-06-05",
    time: "10:00 AM - 03:00 PM",
    description: `
      <p>Training session on quality control procedures and standards for production staff. This training aims to enhance the skills of our quality control team and ensure consistent product quality.</p>
      
      <h3>Training Content:</h3>
      <ul>
        <li>Quality standards and specifications</li>
        <li>Inspection techniques and procedures</li>
        <li>Defect identification and classification</li>
        <li>Quality reporting and documentation</li>
        <li>Problem-solving and corrective actions</li>
      </ul>
      
      <p>The training will be conducted by our Quality Assurance Manager and will include both theoretical and practical components. Participants will have the opportunity to practice inspection techniques on actual products.</p>
      
      <h3>Target Audience:</h3>
      <ul>
        <li>Quality control inspectors</li>
        <li>Production supervisors</li>
        <li>Line leaders</li>
        <li>New employees in the quality department</li>
      </ul>
      
      <p>Lunch and refreshments will be provided. Please bring your quality control manual and any questions you may have.</p>
    `,
    location: "Training Room, Yongjin 2 Unit 2",
    organizer: "Quality Assurance Department",
    category: "Training",
    images: [
      "/placeholder.svg?height=600&width=1200",
      "/placeholder.svg?height=600&width=1200&text=QC+Training+2",
      "/placeholder.svg?height=600&width=1200&text=QC+Training+3",
    ],
    relatedEvents: [1, 5],
  },
  {
    id: "5",
    title: "Leadership Development Program",
    date: "2025-07-12",
    time: "09:00 AM - 04:00 PM",
    description: `
      <p>Development program for team leaders and supervisors to enhance leadership skills. This program is designed to equip our leaders with the skills and knowledge needed to effectively manage their teams.</p>
      
      <h3>Program Modules:</h3>
      <ul>
        <li>Effective communication</li>
        <li>Team building and motivation</li>
        <li>Conflict resolution</li>
        <li>Performance management</li>
        <li>Decision-making and problem-solving</li>
        <li>Time and priority management</li>
      </ul>
      
      <p>The program will be facilitated by professional leadership trainers and will include interactive activities, role-plays, and case studies. Participants will receive a leadership toolkit and certificate upon completion.</p>
      
      <h3>Eligibility:</h3>
      <p>This program is open to all team leaders, supervisors, and managers. Participants must have at least one year of experience in a leadership role.</p>
      
      <p>Registration is required by July 5, 2025. Please contact the HR department to register.</p>
    `,
    location: "Conference Hall, Yongjin 1",
    organizer: "HR Department",
    category: "Development",
    images: [
      "/placeholder.svg?height=600&width=1200",
      "/placeholder.svg?height=600&width=1200&text=Leadership+2",
      "/placeholder.svg?height=600&width=1200&text=Leadership+3",
    ],
    relatedEvents: [2, 4],
  },
  {
    id: "6",
    title: "Annual Company Gathering",
    date: "2025-08-30",
    time: "06:00 PM - 10:00 PM",
    description: `
      <p>Annual gathering for all employees with dinner, entertainment, and awards ceremony. This event is a celebration of our achievements and an opportunity to recognize outstanding employees.</p>
      
      <h3>Event Highlights:</h3>
      <ul>
        <li>Welcome speech by the CEO</li>
        <li>Year in review presentation</li>
        <li>Employee awards ceremony</li>
        <li>Dinner and refreshments</li>
        <li>Entertainment and performances</li>
        <li>Lucky draw with exciting prizes</li>
      </ul>
      
      <p>The gathering will be held at the Grand Ballroom of Hotel Mulia, Senayan. Transportation will be provided from the factory to the venue and back.</p>
      
      <h3>Dress Code:</h3>
      <p>Smart casual or traditional attire</p>
      
      <p>All employees are invited to attend. Please confirm your attendance with your department head by August 15, 2025.</p>
    `,
    location: "Grand Ballroom, Hotel Mulia, Senayan",
    organizer: "Event Committee",
    category: "Social",
    images: [
      "/placeholder.svg?height=600&width=1200",
      "/placeholder.svg?height=600&width=1200&text=Company+Gathering+2",
      "/placeholder.svg?height=600&width=1200&text=Company+Gathering+3",
    ],
    relatedEvents: [3],
  },
]

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string
  const [currentEvent, setCurrentEvent] = useState<any>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0)

    // Find the event with the matching ID
    const event = events.find((e) => e.id === eventId)
    if (event) {
      setCurrentEvent(event)
    } else {
      // Redirect to events page if event not found
      router.push("/events")
    }
    setIsLoading(false)
  }, [eventId, router])

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const nextImage = () => {
    if (currentEvent) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % currentEvent.images.length)
    }
  }

  const prevImage = () => {
    if (currentEvent) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + currentEvent.images.length) % currentEvent.images.length)
    }
  }

  if (isLoading) {
    return (
      <div className="container px-4 py-12 md:px-6 md:py-16 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="h-4 bg-muted rounded w-32"></div>
          <div className="h-64 bg-muted rounded w-full max-w-3xl mt-8"></div>
        </div>
      </div>
    )
  }

  if (!currentEvent) {
    return (
      <div className="container px-4 py-12 md:px-6 md:py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
        <p className="text-muted-foreground mb-6">The event you are looking for does not exist or has been removed.</p>
        <Link href="/events">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      {/* Back button */}
      <div className="mb-8">
        <Link href="/events">
          <Button variant="ghost" className="group">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Events
          </Button>
        </Link>
      </div>

      {/* Event Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">{currentEvent.title}</h1>
        <div className="flex flex-wrap gap-4 items-center text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>{formatDate(currentEvent.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>{currentEvent.time}</span>
          </div>
          <Badge variant="secondary" className="ml-auto">
            {currentEvent.category}
          </Badge>
        </div>
      </div>

      {/* Image Slideshow */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] mb-8 overflow-hidden rounded-lg">
        <div
          className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {currentEvent.images.map((image: string, index: number) => (
            <div key={index} className="min-w-full h-full relative">
              <Image
                src={image || "/placeholder.svg"}
                alt={`${currentEvent.title} - Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm z-10"
          onClick={prevImage}
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Previous image</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm z-10"
          onClick={nextImage}
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">Next image</span>
        </Button>

        {/* Dots indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {currentEvent.images.map((_: string, index: number) => (
            <button
              key={index}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all",
                currentImageIndex === index ? "bg-primary w-5" : "bg-background/80 backdrop-blur-sm",
              )}
              onClick={() => setCurrentImageIndex(index)}
            >
              <span className="sr-only">Image {index + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Event Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: currentEvent.description }}></div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Event Info */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Location</h3>
                <p className="text-muted-foreground">{currentEvent.location}</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium mb-2">Organizer</h3>
                <p className="text-muted-foreground">{currentEvent.organizer}</p>
              </div>
              <Separator />
              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Related Events */}
          {currentEvent.relatedEvents && currentEvent.relatedEvents.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Related Events</h3>
                <div className="space-y-4">
                  {currentEvent.relatedEvents.map((relatedId: number) => {
                    const relatedEvent = events.find((e) => Number(e.id) === relatedId)
                    if (!relatedEvent) return null
                    return (
                      <Link href={`/events/${relatedEvent.id}`} key={relatedEvent.id}>
                        <div className="flex items-start gap-3 p-3 rounded-md hover:bg-muted transition-colors">
                          <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={relatedEvent.images[0] || "/placeholder.svg"}
                              alt={relatedEvent.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium line-clamp-1">{relatedEvent.title}</h4>
                            <p className="text-sm text-muted-foreground">{formatDate(relatedEvent.date)}</p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
