"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  BarChart3,
  Calendar,
  Briefcase,
  Mail,
  Plus,
  Edit,
  Trash2,
  Search,
  Clock,
  Cpu,
  HardDrive,
  Wifi,
  Activity,
  LogOut,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// Types
interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  status: "upcoming" | "ongoing" | "completed"
}

interface Career {
  id: string
  title: string
  department: string
  location: string
  type: "full-time" | "part-time" | "contract"
  description: string
  requirements: string[]
  posted: string
  status: "active" | "closed"
}

interface Contact {
  id: string
  name: string
  email: string
  subject: string
  message: string
  date: string
  status: "new" | "replied" | "resolved"
}

interface HomeContent {
  heroTitle: string
  heroDescription: string
  aboutTitle: string
  aboutDescription: string
  servicesTitle: string
  services: Array<{
    title: string
    description: string
    icon: string
  }>
}

const CyberpunkDashboard = () => {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Sample data
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Annual Company Meeting",
      description: "Quarterly review and planning session",
      date: "2024-02-15",
      location: "Main Conference Room",
      status: "upcoming",
    },
    {
      id: "2",
      title: "Product Launch Event",
      description: "Launch of new product line",
      date: "2024-02-20",
      location: "Exhibition Center",
      status: "upcoming",
    },
  ])

  const [careers, setCareers] = useState<Career[]>([
    {
      id: "1",
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "Jakarta, Indonesia",
      type: "full-time",
      description: "We are looking for a senior software engineer...",
      requirements: ["5+ years experience", "React/Next.js", "TypeScript"],
      posted: "2024-01-15",
      status: "active",
    },
    {
      id: "2",
      title: "Marketing Manager",
      department: "Marketing",
      location: "Jakarta, Indonesia",
      type: "full-time",
      description: "Lead our marketing initiatives...",
      requirements: ["3+ years marketing experience", "Digital marketing", "Analytics"],
      posted: "2024-01-20",
      status: "active",
    },
  ])

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      subject: "Partnership Inquiry",
      message: "I would like to discuss potential partnership opportunities...",
      date: "2024-01-25",
      status: "new",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      subject: "Product Information",
      message: "Could you provide more information about your products?",
      date: "2024-01-24",
      status: "replied",
    },
  ])

  const [homeContent, setHomeContent] = useState<HomeContent>({
    heroTitle: "Welcome to YONGJIN",
    heroDescription: "Premium Quality Manufacturing Excellence",
    aboutTitle: "About Our Company",
    aboutDescription: "We are committed to improving quality of life through premium manufacturing.",
    servicesTitle: "Our Services",
    services: [
      {
        title: "Manufacturing",
        description: "High-quality garment manufacturing",
        icon: "factory",
      },
      {
        title: "Quality Control",
        description: "Rigorous quality assurance processes",
        icon: "check",
      },
      {
        title: "Export Services",
        description: "Global distribution and logistics",
        icon: "globe",
      },
    ],
  })

  // System metrics (simulated)
  const [systemMetrics] = useState({
    cpu: 45,
    memory: 62,
    storage: 78,
    network: 89,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogout = () => {
    router.push("/content/login")
  }

  const handleAddEvent = (eventData: Omit<Event, "id">) => {
    const newEvent = {
      ...eventData,
      id: Date.now().toString(),
    }
    setEvents([...events, newEvent])
    toast.success("Event added successfully!")
  }

  const handleEditEvent = (id: string, eventData: Omit<Event, "id">) => {
    setEvents(events.map((event) => (event.id === id ? { ...eventData, id } : event)))
    toast.success("Event updated successfully!")
  }

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id))
    toast.success("Event deleted successfully!")
  }

  const handleAddCareer = (careerData: Omit<Career, "id">) => {
    const newCareer = {
      ...careerData,
      id: Date.now().toString(),
    }
    setCareers([...careers, newCareer])
    toast.success("Career posting added successfully!")
  }

  const handleEditCareer = (id: string, careerData: Omit<Career, "id">) => {
    setCareers(careers.map((career) => (career.id === id ? { ...careerData, id } : career)))
    toast.success("Career posting updated successfully!")
  }

  const handleDeleteCareer = (id: string) => {
    setCareers(careers.filter((career) => career.id !== id))
    toast.success("Career posting deleted successfully!")
  }

  const handleUpdateContactStatus = (id: string, status: Contact["status"]) => {
    setContacts(contacts.map((contact) => (contact.id === id ? { ...contact, status } : contact)))
    toast.success("Contact status updated!")
  }

  const handleUpdateHomeContent = (content: HomeContent) => {
    setHomeContent(content)
    toast.success("Home content updated successfully!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Floating orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 w-24 h-24 bg-pink-500/10 rounded-full blur-xl"
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.h1
                className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                YONGJIN CMS
              </motion.h1>
              <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                Online
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                <Clock className="w-4 h-4 inline mr-2" />
                {currentTime.toLocaleTimeString()}
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-400 hover:text-red-400">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="home" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Home className="w-4 h-4 mr-2" />
              Home
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger
              value="careers"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Careers
            </TabsTrigger>
            <TabsTrigger
              value="contacts"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contacts
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* System Metrics */}
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                    <Cpu className="w-4 h-4 mr-2 text-cyan-400" />
                    CPU Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-cyan-400">{systemMetrics.cpu}%</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <motion.div
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${systemMetrics.cpu}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-purple-400" />
                    Memory
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">{systemMetrics.memory}%</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <motion.div
                      className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${systemMetrics.memory}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                    <HardDrive className="w-4 h-4 mr-2 text-orange-400" />
                    Storage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-400">{systemMetrics.storage}%</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <motion.div
                      className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${systemMetrics.storage}%` }}
                      transition={{ duration: 1, delay: 0.4 }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                    <Wifi className="w-4 h-4 mr-2 text-green-400" />
                    Network
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">{systemMetrics.network}%</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <motion.div
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${systemMetrics.network}%` }}
                      transition={{ duration: 1, delay: 0.6 }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Total Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{events.length}</div>
                  <p className="text-gray-400 text-sm">Active events in system</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-purple-400">Career Openings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{careers.filter((c) => c.status === "active").length}</div>
                  <p className="text-gray-400 text-sm">Open positions</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-pink-400">New Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{contacts.filter((c) => c.status === "new").length}</div>
                  <p className="text-gray-400 text-sm">Pending responses</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Home Content Tab */}
          <TabsContent value="home" className="space-y-6">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-cyan-400">Home Page Content</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage the content displayed on your homepage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="heroTitle" className="text-gray-300">
                      Hero Title
                    </Label>
                    <Input
                      id="heroTitle"
                      value={homeContent.heroTitle}
                      onChange={(e) => setHomeContent({ ...homeContent, heroTitle: e.target.value })}
                      className="bg-gray-700/50 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="heroDescription" className="text-gray-300">
                      Hero Description
                    </Label>
                    <Input
                      id="heroDescription"
                      value={homeContent.heroDescription}
                      onChange={(e) => setHomeContent({ ...homeContent, heroDescription: e.target.value })}
                      className="bg-gray-700/50 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="aboutTitle" className="text-gray-300">
                    About Title
                  </Label>
                  <Input
                    id="aboutTitle"
                    value={homeContent.aboutTitle}
                    onChange={(e) => setHomeContent({ ...homeContent, aboutTitle: e.target.value })}
                    className="bg-gray-700/50 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="aboutDescription" className="text-gray-300">
                    About Description
                  </Label>
                  <Textarea
                    id="aboutDescription"
                    value={homeContent.aboutDescription}
                    onChange={(e) => setHomeContent({ ...homeContent, aboutDescription: e.target.value })}
                    className="bg-gray-700/50 border-gray-600 text-white"
                    rows={3}
                  />
                </div>

                <Button
                  onClick={() => handleUpdateHomeContent(homeContent)}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                >
                  Update Home Content
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-cyan-400">Events Management</h2>
              <EventDialog onSave={handleAddEvent} />
            </div>

            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40 bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Title</TableHead>
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Location</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events
                    .filter(
                      (event) =>
                        event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                        (filterStatus === "all" || event.status === filterStatus),
                    )
                    .map((event) => (
                      <TableRow key={event.id} className="border-gray-700">
                        <TableCell className="text-white">{event.title}</TableCell>
                        <TableCell className="text-gray-300">{event.date}</TableCell>
                        <TableCell className="text-gray-300">{event.location}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              event.status === "upcoming"
                                ? "default"
                                : event.status === "ongoing"
                                  ? "secondary"
                                  : "outline"
                            }
                            className={
                              event.status === "upcoming"
                                ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
                                : event.status === "ongoing"
                                  ? "bg-orange-500/20 text-orange-400 border-orange-500/50"
                                  : "bg-green-500/20 text-green-400 border-green-500/50"
                            }
                          >
                            {event.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <EventDialog event={event} onSave={(data) => handleEditEvent(event.id, data)} />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Careers Tab */}
          <TabsContent value="careers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-purple-400">Careers Management</h2>
              <CareerDialog onSave={handleAddCareer} />
            </div>

            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Title</TableHead>
                    <TableHead className="text-gray-300">Department</TableHead>
                    <TableHead className="text-gray-300">Type</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {careers.map((career) => (
                    <TableRow key={career.id} className="border-gray-700">
                      <TableCell className="text-white">{career.title}</TableCell>
                      <TableCell className="text-gray-300">{career.department}</TableCell>
                      <TableCell className="text-gray-300">{career.type}</TableCell>
                      <TableCell>
                        <Badge
                          variant={career.status === "active" ? "default" : "outline"}
                          className={
                            career.status === "active"
                              ? "bg-green-500/20 text-green-400 border-green-500/50"
                              : "bg-gray-500/20 text-gray-400 border-gray-500/50"
                          }
                        >
                          {career.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <CareerDialog career={career} onSave={(data) => handleEditCareer(career.id, data)} />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCareer(career.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <h2 className="text-2xl font-bold text-pink-400">Contact Messages</h2>

            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Name</TableHead>
                    <TableHead className="text-gray-300">Email</TableHead>
                    <TableHead className="text-gray-300">Subject</TableHead>
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id} className="border-gray-700">
                      <TableCell className="text-white">{contact.name}</TableCell>
                      <TableCell className="text-gray-300">{contact.email}</TableCell>
                      <TableCell className="text-gray-300">{contact.subject}</TableCell>
                      <TableCell className="text-gray-300">{contact.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            contact.status === "new"
                              ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
                              : contact.status === "replied"
                                ? "bg-orange-500/20 text-orange-400 border-orange-500/50"
                                : "bg-green-500/20 text-green-400 border-green-500/50"
                          }
                        >
                          {contact.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={contact.status}
                          onValueChange={(value: Contact["status"]) => handleUpdateContactStatus(contact.id, value)}
                        >
                          <SelectTrigger className="w-32 bg-gray-700/50 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="replied">Replied</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Event Dialog Component
const EventDialog = ({ event, onSave }: { event?: Event; onSave: (data: Omit<Event, "id">) => void }) => {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    date: event?.date || "",
    location: event?.location || "",
    status: event?.status || ("upcoming" as Event["status"]),
  })

  const handleSave = () => {
    onSave(formData)
    setOpen(false)
    setFormData({
      title: "",
      description: "",
      date: "",
      location: "",
      status: "upcoming",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={event ? "ghost" : "default"}
          size="sm"
          className={
            event
              ? "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20"
              : "bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
          }
        >
          {event ? (
            <Edit className="w-4 h-4" />
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-cyan-400">{event ? "Edit Event" : "Add New Event"}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {event ? "Update event information" : "Create a new event"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-gray-300">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-gray-700/50 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-gray-700/50 border-gray-600 text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="text-gray-300">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="status" className="text-gray-300">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: Event["status"]) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="location" className="text-gray-300">
              Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="bg-gray-700/50 border-gray-600 text-white"
            />
          </div>
          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
          >
            {event ? "Update Event" : "Create Event"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Career Dialog Component
const CareerDialog = ({ career, onSave }: { career?: Career; onSave: (data: Omit<Career, "id">) => void }) => {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: career?.title || "",
    department: career?.department || "",
    location: career?.location || "",
    type: career?.type || ("full-time" as Career["type"]),
    description: career?.description || "",
    requirements: career?.requirements || [],
    posted: career?.posted || new Date().toISOString().split("T")[0],
    status: career?.status || ("active" as Career["status"]),
  })

  const handleSave = () => {
    onSave(formData)
    setOpen(false)
    setFormData({
      title: "",
      department: "",
      location: "",
      type: "full-time",
      description: "",
      requirements: [],
      posted: new Date().toISOString().split("T")[0],
      status: "active",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={career ? "ghost" : "default"}
          size="sm"
          className={
            career
              ? "text-purple-400 hover:text-purple-300 hover:bg-purple-500/20"
              : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          }
        >
          {career ? (
            <Edit className="w-4 h-4" />
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add Career
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-purple-400">{career ? "Edit Career" : "Add New Career"}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {career ? "Update career posting" : "Create a new career posting"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="text-gray-300">
                Job Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="department" className="text-gray-300">
                Department
              </Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location" className="text-gray-300">
                Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="type" className="text-gray-300">
                Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value: Career["type"]) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="description" className="text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-gray-700/50 border-gray-600 text-white"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="posted" className="text-gray-300">
                Posted Date
              </Label>
              <Input
                id="posted"
                type="date"
                value={formData.posted}
                onChange={(e) => setFormData({ ...formData, posted: e.target.value })}
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="status" className="text-gray-300">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: Career["status"]) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {career ? "Update Career" : "Create Career"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CyberpunkDashboard
