"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Home,
  Calendar,
  Briefcase,
  Mail,
  Plus,
  Edit,
  Trash2,
  Save,
  Users,
  BarChart3,
  Settings,
  CheckCircle2,
} from "lucide-react"
import { motion } from "framer-motion"

// Mock data for content management
const initialHomeContent = {
  heroTitle: "PT.YONGJIN JAVASUKA GARMENT",
  heroSubtitle: "Improve quality of life by manufacturing premium quality products.",
  aboutTitle: "Premium Garment Manufacturing",
  aboutDescription:
    "PT.YONGJIN JAVASUKA GARMENT is a leading manufacturer of premium quality garments, committed to excellence in every aspect of our operations.",
  stats: {
    experience: "35+",
    employees: "10,000+",
    facilities: "3",
    partners: "10+",
  },
}

const initialEvents = [
  {
    id: 1,
    title: "Annual Fire Safety Training",
    date: "2025-03-15",
    time: "09:00 AM - 12:00 PM",
    description: "Comprehensive fire safety training for all employees to ensure workplace safety.",
    category: "Training",
    attendees: 150,
    location: "Main Conference Hall",
    status: "upcoming",
  },
  {
    id: 2,
    title: "Environmental Sustainability Workshop",
    date: "2025-04-10",
    time: "02:00 PM - 04:00 PM",
    description: "Workshop on sustainable manufacturing practices and reducing environmental impact.",
    category: "Workshop",
    attendees: 80,
    location: "Training Center",
    status: "upcoming",
  },
]

const initialJobs = [
  {
    id: 1,
    title: "Production Supervisor",
    department: "Manufacturing",
    location: "Yongjin 1, Sukabumi",
    type: "Full-time",
    description: "Supervise production activities and ensure quality standards are met.",
    salary: "IDR 12,000,000 - 15,000,000",
    experience: "3+ years",
    status: "active",
  },
  {
    id: 2,
    title: "Quality Control Inspector",
    department: "Quality Assurance",
    location: "Yongjin 2 Unit 1, Sukabumi",
    type: "Full-time",
    description: "Inspect garments to ensure they meet quality standards and specifications.",
    salary: "IDR 8,000,000 - 10,000,000",
    experience: "2+ years",
    status: "active",
  },
]

const initialContactInfo = {
  address: "Jl. Raya Siliwangi Pajagan No Km.35, Sukabumi, Cicurug 43359, Indonesia",
  phone: "+62 812-8927-5271",
  email: "info@yongjin.co.id",
  website: "www.yongjin.co.id",
  businessHours: {
    weekdays: "8:00 AM - 5:00 PM",
    saturday: "8:00 AM - 12:00 PM",
    sunday: "Closed",
  },
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [homeContent, setHomeContent] = useState(initialHomeContent)
  const [events, setEvents] = useState(initialEvents)
  const [jobs, setJobs] = useState(initialJobs)
  const [contactInfo, setContactInfo] = useState(initialContactInfo)
  const [isEditingHome, setIsEditingHome] = useState(false)
  const [isEditingContact, setIsEditingContact] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    category: "",
    location: "",
    attendees: 0,
  })
  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    description: "",
    salary: "",
    experience: "",
  })
  const [editingEvent, setEditingEvent] = useState(null)
  const [editingJob, setEditingJob] = useState(null)
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [showJobDialog, setShowJobDialog] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  const showSaveMessage = (message: string) => {
    setSaveMessage(message)
    setTimeout(() => setSaveMessage(""), 3000)
  }

  const handleSaveHome = () => {
    setIsEditingHome(false)
    showSaveMessage("Home content updated successfully!")
  }

  const handleSaveContact = () => {
    setIsEditingContact(false)
    showSaveMessage("Contact information updated successfully!")
  }

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.time) {
      const event = {
        ...newEvent,
        id: events.length + 1,
        status: "upcoming",
      }
      setEvents([...events, event])
      setNewEvent({
        title: "",
        date: "",
        time: "",
        description: "",
        category: "",
        location: "",
        attendees: 0,
      })
      setShowEventDialog(false)
      showSaveMessage("Event added successfully!")
    }
  }

  const handleEditEvent = (event: any) => {
    setEditingEvent(event)
    setNewEvent(event)
    setShowEventDialog(true)
  }

  const handleUpdateEvent = () => {
    if (editingEvent) {
      setEvents(events.map((e) => (e.id === editingEvent.id ? { ...newEvent, id: editingEvent.id } : e)))
      setEditingEvent(null)
      setNewEvent({
        title: "",
        date: "",
        time: "",
        description: "",
        category: "",
        location: "",
        attendees: 0,
      })
      setShowEventDialog(false)
      showSaveMessage("Event updated successfully!")
    }
  }

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter((e) => e.id !== id))
    showSaveMessage("Event deleted successfully!")
  }

  const handleAddJob = () => {
    if (newJob.title && newJob.department && newJob.location) {
      const job = {
        ...newJob,
        id: jobs.length + 1,
        status: "active",
      }
      setJobs([...jobs, job])
      setNewJob({
        title: "",
        department: "",
        location: "",
        type: "Full-time",
        description: "",
        salary: "",
        experience: "",
      })
      setShowJobDialog(false)
      showSaveMessage("Job posting added successfully!")
    }
  }

  const handleEditJob = (job: any) => {
    setEditingJob(job)
    setNewJob(job)
    setShowJobDialog(true)
  }

  const handleUpdateJob = () => {
    if (editingJob) {
      setJobs(jobs.map((j) => (j.id === editingJob.id ? { ...newJob, id: editingJob.id } : j)))
      setEditingJob(null)
      setNewJob({
        title: "",
        department: "",
        location: "",
        type: "Full-time",
        description: "",
        salary: "",
        experience: "",
      })
      setShowJobDialog(false)
      showSaveMessage("Job posting updated successfully!")
    }
  }

  const handleDeleteJob = (id: number) => {
    setJobs(jobs.filter((j) => j.id !== id))
    showSaveMessage("Job posting deleted successfully!")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your website content</p>
            </div>
            <div className="flex items-center gap-4">
              {saveMessage && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <Alert className="border-green-200 bg-green-50 text-green-800">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription>{saveMessage}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
              <Badge variant="secondary">Admin</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="careers" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Careers
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contact
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{events.length}</div>
                  <p className="text-xs text-muted-foreground">Active events</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Job Openings</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{jobs.length}</div>
                  <p className="text-xs text-muted-foreground">Active positions</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{events.reduce((sum, event) => sum + event.attendees, 0)}</div>
                  <p className="text-xs text-muted-foreground">Expected attendees</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Content Sections</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">Manageable sections</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates to your website content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Home page content updated</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">New event added</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Job posting updated</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Home Page Content</CardTitle>
                <CardDescription>Manage the content displayed on your homepage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="heroTitle">Hero Title</Label>
                      <Input
                        id="heroTitle"
                        value={homeContent.heroTitle}
                        onChange={(e) => setHomeContent({ ...homeContent, heroTitle: e.target.value })}
                        disabled={!isEditingHome}
                      />
                    </div>
                    <div>
                      <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                      <Textarea
                        id="heroSubtitle"
                        value={homeContent.heroSubtitle}
                        onChange={(e) => setHomeContent({ ...homeContent, heroSubtitle: e.target.value })}
                        disabled={!isEditingHome}
                      />
                    </div>
                    <div>
                      <Label htmlFor="aboutTitle">About Title</Label>
                      <Input
                        id="aboutTitle"
                        value={homeContent.aboutTitle}
                        onChange={(e) => setHomeContent({ ...homeContent, aboutTitle: e.target.value })}
                        disabled={!isEditingHome}
                      />
                    </div>
                    <div>
                      <Label htmlFor="aboutDescription">About Description</Label>
                      <Textarea
                        id="aboutDescription"
                        value={homeContent.aboutDescription}
                        onChange={(e) => setHomeContent({ ...homeContent, aboutDescription: e.target.value })}
                        disabled={!isEditingHome}
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="experience">Years of Experience</Label>
                        <Input
                          id="experience"
                          value={homeContent.stats.experience}
                          onChange={(e) =>
                            setHomeContent({
                              ...homeContent,
                              stats: { ...homeContent.stats, experience: e.target.value },
                            })
                          }
                          disabled={!isEditingHome}
                        />
                      </div>
                      <div>
                        <Label htmlFor="employees">Employees</Label>
                        <Input
                          id="employees"
                          value={homeContent.stats.employees}
                          onChange={(e) =>
                            setHomeContent({
                              ...homeContent,
                              stats: { ...homeContent.stats, employees: e.target.value },
                            })
                          }
                          disabled={!isEditingHome}
                        />
                      </div>
                      <div>
                        <Label htmlFor="facilities">Facilities</Label>
                        <Input
                          id="facilities"
                          value={homeContent.stats.facilities}
                          onChange={(e) =>
                            setHomeContent({
                              ...homeContent,
                              stats: { ...homeContent.stats, facilities: e.target.value },
                            })
                          }
                          disabled={!isEditingHome}
                        />
                      </div>
                      <div>
                        <Label htmlFor="partners">Partners</Label>
                        <Input
                          id="partners"
                          value={homeContent.stats.partners}
                          onChange={(e) =>
                            setHomeContent({
                              ...homeContent,
                              stats: { ...homeContent.stats, partners: e.target.value },
                            })
                          }
                          disabled={!isEditingHome}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  {isEditingHome ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditingHome(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveHome}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditingHome(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Content
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Events Management</CardTitle>
                    <CardDescription>Manage events displayed on your events page</CardDescription>
                  </div>
                  <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          setEditingEvent(null)
                          setNewEvent({
                            title: "",
                            date: "",
                            time: "",
                            description: "",
                            category: "",
                            location: "",
                            attendees: 0,
                          })
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Event
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{editingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
                        <DialogDescription>
                          {editingEvent ? "Update the event details" : "Create a new event for your events page"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="eventTitle">Title</Label>
                          <Input
                            id="eventTitle"
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="eventCategory">Category</Label>
                          <Input
                            id="eventCategory"
                            value={newEvent.category}
                            onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="eventDate">Date</Label>
                          <Input
                            id="eventDate"
                            type="date"
                            value={newEvent.date}
                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="eventTime">Time</Label>
                          <Input
                            id="eventTime"
                            value={newEvent.time}
                            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                            placeholder="e.g., 09:00 AM - 12:00 PM"
                          />
                        </div>
                        <div>
                          <Label htmlFor="eventLocation">Location</Label>
                          <Input
                            id="eventLocation"
                            value={newEvent.location}
                            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="eventAttendees">Expected Attendees</Label>
                          <Input
                            id="eventAttendees"
                            type="number"
                            value={newEvent.attendees}
                            onChange={(e) =>
                              setNewEvent({ ...newEvent, attendees: Number.parseInt(e.target.value) || 0 })
                            }
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="eventDescription">Description</Label>
                          <Textarea
                            id="eventDescription"
                            value={newEvent.description}
                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEventDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={editingEvent ? handleUpdateEvent : handleAddEvent}>
                          {editingEvent ? "Update Event" : "Add Event"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Attendees</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{event.category}</Badge>
                        </TableCell>
                        <TableCell>{event.attendees}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{event.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Careers Tab */}
          <TabsContent value="careers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Job Postings Management</CardTitle>
                    <CardDescription>Manage job postings displayed on your careers page</CardDescription>
                  </div>
                  <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          setEditingJob(null)
                          setNewJob({
                            title: "",
                            department: "",
                            location: "",
                            type: "Full-time",
                            description: "",
                            salary: "",
                            experience: "",
                          })
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Job
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{editingJob ? "Edit Job Posting" : "Add New Job Posting"}</DialogTitle>
                        <DialogDescription>
                          {editingJob
                            ? "Update the job posting details"
                            : "Create a new job posting for your careers page"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="jobTitle">Job Title</Label>
                          <Input
                            id="jobTitle"
                            value={newJob.title}
                            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="jobDepartment">Department</Label>
                          <Input
                            id="jobDepartment"
                            value={newJob.department}
                            onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="jobLocation">Location</Label>
                          <Input
                            id="jobLocation"
                            value={newJob.location}
                            onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="jobType">Job Type</Label>
                          <Input
                            id="jobType"
                            value={newJob.type}
                            onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="jobSalary">Salary Range</Label>
                          <Input
                            id="jobSalary"
                            value={newJob.salary}
                            onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                            placeholder="e.g., IDR 10,000,000 - 15,000,000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="jobExperience">Experience Required</Label>
                          <Input
                            id="jobExperience"
                            value={newJob.experience}
                            onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })}
                            placeholder="e.g., 2-3 years"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="jobDescription">Job Description</Label>
                          <Textarea
                            id="jobDescription"
                            value={newJob.description}
                            onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                            rows={4}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowJobDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={editingJob ? handleUpdateJob : handleAddJob}>
                          {editingJob ? "Update Job" : "Add Job"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>{job.department}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{job.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{job.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditJob(job)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteJob(job.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Manage the contact information displayed on your contact page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={contactInfo.address}
                        onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                        disabled={!isEditingContact}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                        disabled={!isEditingContact}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                        disabled={!isEditingContact}
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={contactInfo.website}
                        onChange={(e) => setContactInfo({ ...contactInfo, website: e.target.value })}
                        disabled={!isEditingContact}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Business Hours</h3>
                    <div>
                      <Label htmlFor="weekdays">Monday - Friday</Label>
                      <Input
                        id="weekdays"
                        value={contactInfo.businessHours.weekdays}
                        onChange={(e) =>
                          setContactInfo({
                            ...contactInfo,
                            businessHours: { ...contactInfo.businessHours, weekdays: e.target.value },
                          })
                        }
                        disabled={!isEditingContact}
                      />
                    </div>
                    <div>
                      <Label htmlFor="saturday">Saturday</Label>
                      <Input
                        id="saturday"
                        value={contactInfo.businessHours.saturday}
                        onChange={(e) =>
                          setContactInfo({
                            ...contactInfo,
                            businessHours: { ...contactInfo.businessHours, saturday: e.target.value },
                          })
                        }
                        disabled={!isEditingContact}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sunday">Sunday & Public Holidays</Label>
                      <Input
                        id="sunday"
                        value={contactInfo.businessHours.sunday}
                        onChange={(e) =>
                          setContactInfo({
                            ...contactInfo,
                            businessHours: { ...contactInfo.businessHours, sunday: e.target.value },
                          })
                        }
                        disabled={!isEditingContact}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  {isEditingContact ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditingContact(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveContact}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditingContact(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Contact Info
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
