"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Calendar, Briefcase, CheckCircle2, Upload, FileText } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

// Mock data for job vacancies
const jobs = [
  {
    id: "1",
    title: "Production Supervisor",
    department: "Manufacturing",
    location: "Yongjin 1, Sukabumi",
    type: "Full-time",
    postedDate: "2025-04-01",
    description: `
      <p>We are looking for an experienced Production Supervisor to oversee our manufacturing operations and ensure that production goals are met efficiently and safely.</p>
      
      <h3>Responsibilities:</h3>
      <ul>
        <li>Plan and organize production schedules</li>
        <li>Determine resource requirements (manpower, equipment, materials)</li>
        <li>Ensure quality standards are met</li>
        <li>Monitor production processes and adjust schedules as needed</li>
        <li>Train and supervise production workers</li>
        <li>Ensure safety guidelines are followed</li>
        <li>Identify and resolve operational issues</li>
        <li>Maintain production records and reports</li>
      </ul>
      
      <h3>Requirements:</h3>
      <ul>
        <li>Bachelor's degree in Industrial Engineering, Manufacturing, or related field</li>
        <li>3+ years of experience in a production supervisory role, preferably in the garment industry</li>
        <li>Strong knowledge of production processes and quality control</li>
        <li>Excellent leadership and team management skills</li>
        <li>Problem-solving abilities and attention to detail</li>
        <li>Good communication skills in English and Bahasa Indonesia</li>
        <li>Proficiency in MS Office and production management software</li>
      </ul>
      
      <h3>Benefits:</h3>
      <ul>
        <li>Competitive salary</li>
        <li>Health insurance</li>
        <li>Transportation allowance</li>
        <li>Annual bonus</li>
        <li>Career advancement opportunities</li>
      </ul>
    `,
    salary: "Competitive",
    experience: "3+ years",
    education: "Bachelor's degree",
    skills: ["Production Planning", "Team Management", "Quality Control", "Problem Solving", "Communication"],
  },
  {
    id: "2",
    title: "Quality Control Inspector",
    department: "Quality Assurance",
    location: "Yongjin 2 Unit 1, Sukabumi",
    type: "Full-time",
    postedDate: "2025-04-05",
    description: `
      <p>We are seeking a detail-oriented Quality Control Inspector to ensure that our garments meet quality standards and specifications before they are shipped to customers.</p>
      
      <h3>Responsibilities:</h3>
      <ul>
        <li>Inspect garments at various stages of production</li>
        <li>Identify and document defects and quality issues</li>
        <li>Ensure products meet customer specifications</li>
        <li>Conduct regular quality audits</li>
        <li>Maintain quality control records</li>
        <li>Collaborate with production team to resolve quality issues</li>
        <li>Train production workers on quality standards</li>
      </ul>
      
      <h3>Requirements:</h3>
      <ul>
        <li>High school diploma or equivalent (Diploma or Bachelor's degree preferred)</li>
        <li>2+ years of experience in quality control, preferably in the garment industry</li>
        <li>Knowledge of quality control procedures and standards</li>
        <li>Attention to detail and good eyesight</li>
        <li>Basic computer skills</li>
        <li>Good communication skills in Bahasa Indonesia (English is a plus)</li>
        <li>Ability to stand for long periods and handle physical tasks</li>
      </ul>
      
      <h3>Benefits:</h3>
      <ul>
        <li>Competitive salary</li>
        <li>Health insurance</li>
        <li>Transportation allowance</li>
        <li>Meal allowance</li>
        <li>Training and development opportunities</li>
      </ul>
    `,
    salary: "Competitive",
    experience: "2+ years",
    education: "High School Diploma (Diploma or Bachelor's preferred)",
    skills: ["Quality Inspection", "Attention to Detail", "Documentation", "Problem Solving"],
  },
  {
    id: "3",
    title: "HR Specialist",
    department: "Human Resources",
    location: "Yongjin 1, Sukabumi",
    type: "Full-time",
    postedDate: "2025-04-10",
    description: `
      <p>We are looking for an HR Specialist to join our Human Resources team and support various HR functions including recruitment, employee relations, and HR administration.</p>
      
      <h3>Responsibilities:</h3>
      <ul>
        <li>Assist in the recruitment and selection process</li>
        <li>Conduct initial interviews and coordinate with department managers</li>
        <li>Manage employee onboarding and orientation</li>
        <li>Handle employee relations issues and concerns</li>
        <li>Maintain employee records and HR database</li>
        <li>Process payroll and benefits administration</li>
        <li>Support training and development initiatives</li>
        <li>Assist in HR policy development and implementation</li>
      </ul>
      
      <h3>Requirements:</h3>
      <ul>
        <li>Bachelor's degree in Human Resources, Business Administration, or related field</li>
        <li>2+ years of experience in HR, preferably in a manufacturing environment</li>
        <li>Knowledge of HR practices, labor laws, and regulations</li>
        <li>Excellent interpersonal and communication skills</li>
        <li>Strong organizational and multitasking abilities</li>
        <li>Proficiency in MS Office and HRIS</li>
        <li>Fluency in English and Bahasa Indonesia</li>
      </ul>
      
      <h3>Benefits:</h3>
      <ul>
        <li>Competitive salary</li>
        <li>Health insurance</li>
        <li>Transportation allowance</li>
        <li>Professional development opportunities</li>
        <li>Collaborative work environment</li>
      </ul>
    `,
    salary: "Competitive",
    experience: "2+ years",
    education: "Bachelor's degree",
    skills: ["Recruitment", "Employee Relations", "HR Administration", "Communication", "HRIS"],
  },
  {
    id: "4",
    title: "Maintenance Technician",
    department: "Maintenance",
    location: "Yongjin 2 Unit 2, Sukabumi",
    type: "Full-time",
    postedDate: "2025-04-12",
    description: `
      <p>We are seeking a skilled Maintenance Technician to maintain and repair machinery and equipment in our manufacturing facility to ensure smooth operations.</p>
      
      <h3>Responsibilities:</h3>
      <ul>
        <li>Perform preventive maintenance on machinery and equipment</li>
        <li>Diagnose and repair mechanical, electrical, and pneumatic systems</li>
        <li>Respond to emergency maintenance requests</li>
        <li>Install and set up new equipment</li>
        <li>Maintain inventory of spare parts and supplies</li>
        <li>Document maintenance activities and repairs</li>
        <li>Ensure compliance with safety standards</li>
        <li>Train operators on proper equipment use</li>
      </ul>
      
      <h3>Requirements:</h3>
      <ul>
        <li>Diploma or certification in Mechanical, Electrical, or Industrial Maintenance</li>
        <li>3+ years of experience in industrial maintenance, preferably in textile or garment manufacturing</li>
        <li>Knowledge of mechanical, electrical, and pneumatic systems</li>
        <li>Experience with sewing machines and garment manufacturing equipment is a plus</li>
        <li>Troubleshooting and problem-solving skills</li>
        <li>Ability to read technical manuals and schematics</li>
        <li>Basic computer skills</li>
        <li>Good communication skills in Bahasa Indonesia (English is a plus)</li>
      </ul>
      
      <h3>Benefits:</h3>
      <ul>
        <li>Competitive salary</li>
        <li>Health insurance</li>
        <li>Transportation allowance</li>
        <li>Meal allowance</li>
        <li>Technical training opportunities</li>
      </ul>
    `,
    salary: "Competitive",
    experience: "3+ years",
    education: "Diploma or Certification",
    skills: ["Mechanical Repair", "Electrical Systems", "Preventive Maintenance", "Troubleshooting"],
  },
  {
    id: "5",
    title: "Logistics Coordinator",
    department: "Supply Chain",
    location: "Yongjin 1, Sukabumi",
    type: "Full-time",
    postedDate: "2025-04-15",
    description: `
      <p>We are looking for a Logistics Coordinator to manage our logistics operations including shipping, receiving, and inventory management to ensure efficient supply chain operations.</p>
      
      <h3>Responsibilities:</h3>
      <ul>
        <li>Coordinate shipping and receiving activities</li>
        <li>Manage inventory levels and warehouse organization</li>
        <li>Process import and export documentation</li>
        <li>Liaise with freight forwarders, customs brokers, and carriers</li>
        <li>Track shipments and ensure timely delivery</li>
        <li>Maintain accurate records and reports</li>
        <li>Identify and implement process improvements</li>
        <li>Ensure compliance with customs regulations</li>
      </ul>
      
      <h3>Requirements:</h3>
      <ul>
        <li>Bachelor's degree in Supply Chain, Logistics, or related field</li>
        <li>2+ years of experience in logistics or supply chain management</li>
        <li>Knowledge of import/export procedures and documentation</li>
        <li>Experience with inventory management systems</li>
        <li>Strong organizational and multitasking abilities</li>
        <li>Excellent communication skills in English and Bahasa Indonesia</li>
        <li>Proficiency in MS Office and logistics software</li>
        <li>Attention to detail and problem-solving skills</li>
      </ul>
      
      <h3>Benefits:</h3>
      <ul>
        <li>Competitive salary</li>
        <li>Health insurance</li>
        <li>Transportation allowance</li>
        <li>Performance bonuses</li>
        <li>Professional development opportunities</li>
      </ul>
    `,
    salary: "Competitive",
    experience: "2+ years",
    education: "Bachelor's degree",
    skills: ["Inventory Management", "Shipping & Receiving", "Documentation", "Supply Chain"],
  },
  {
    id: "6",
    title: "Pattern Maker",
    department: "Design",
    location: "Yongjin 2 Unit 1, Sukabumi",
    type: "Full-time",
    postedDate: "2025-04-20",
    description: `
      <p>We are seeking a skilled Pattern Maker to create and modify patterns for garment production based on design specifications and ensure proper fit and construction.</p>
      
      <h3>Responsibilities:</h3>
      <ul>
        <li>Create and modify patterns based on design specifications</li>
        <li>Develop sample patterns and prototypes</li>
        <li>Make pattern adjustments based on fit tests</li>
        <li>Create pattern cards with construction details</li>
        <li>Collaborate with designers and production team</li>
        <li>Ensure patterns meet quality and production standards</li>
        <li>Maintain pattern library and documentation</li>
        <li>Stay updated on industry trends and techniques</li>
      </ul>
      
      <h3>Requirements:</h3>
      <ul>
        <li>Diploma or degree in Fashion Design, Pattern Making, or related field</li>
        <li>3+ years of experience in pattern making, preferably in sportswear or technical apparel</li>
        <li>Proficiency in manual pattern making techniques</li>
        <li>Experience with CAD pattern making software (e.g., Gerber, Lectra)</li>
        <li>Knowledge of garment construction and production processes</li>
        <li>Attention to detail and precision</li>
        <li>Problem-solving skills and creativity</li>
        <li>Good communication skills in English and Bahasa Indonesia</li>
      </ul>
      
      <h3>Benefits:</h3>
      <ul>
        <li>Competitive salary</li>
        <li>Health insurance</li>
        <li>Transportation allowance</li>
        <li>Creative work environment</li>
        <li>Professional development opportunities</li>
      </ul>
    `,
    salary: "Competitive",
    experience: "3+ years",
    education: "Diploma or Degree",
    skills: ["Pattern Making", "Garment Construction", "CAD Software", "Technical Drawing"],
  },
]

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const jobId = params.id as string
  const [currentJob, setCurrentJob] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("details")

  // Application form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    experience: "",
    education: "",
    coverLetter: "",
    resume: null as File | null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Find the job with the matching ID
    const job = jobs.find((j) => j.id === jobId)
    if (job) {
      setCurrentJob(job)
    } else {
      // Redirect to careers page if job not found
      router.push("/careers")
    }
    setIsLoading(false)
  }, [jobId, router])

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  // Calculate days since posting
  const getDaysSincePosting = (dateString: string) => {
    const postedDate = new Date(dateString)
    const currentDate = new Date()
    const diffTime = Math.abs(currentDate.getTime() - postedDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, resume: e.target.files![0] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone || !formData.resume) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and upload your resume.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Application Submitted",
      description: "Thank you for your application. We will review it and contact you soon.",
    })

    // Reset form
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      experience: "",
      education: "",
      coverLetter: "",
      resume: null,
    })

    setIsSubmitting(false)
    setActiveTab("details")
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

  if (!currentJob) {
    return (
      <div className="container px-4 py-12 md:px-6 md:py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
        <p className="text-muted-foreground mb-6">The job you are looking for does not exist or has been removed.</p>
        <Link href="/careers">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Careers
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      {/* Back button */}
      <div className="mb-8">
        <Link href="/careers">
          <Button variant="ghost" className="group">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Careers
          </Button>
        </Link>
      </div>

      {/* Job Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{currentJob.title}</h1>
            <p className="text-xl text-muted-foreground mt-2">{currentJob.department}</p>
          </div>
          <Button size="lg" className="animate-pulse" onClick={() => setActiveTab("apply")}>
            Apply Now
          </Button>
        </div>
        <div className="flex flex-wrap gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span>{currentJob.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            <span>{currentJob.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>Posted {getDaysSincePosting(currentJob.postedDate)} days ago</span>
          </div>
        </div>
      </div>

      {/* Job Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Job Details</TabsTrigger>
          <TabsTrigger value="apply">Apply Now</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Experience</h3>
                  <p className="font-medium">{currentJob.experience}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Education</h3>
                  <p className="font-medium">{currentJob.education}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Salary</h3>
                  <p className="font-medium">{currentJob.salary}</p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h2 className="text-xl font-bold">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {currentJob.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: currentJob.description }}></div>

              <div className="mt-8 flex justify-center">
                <Button size="lg" onClick={() => setActiveTab("apply")}>
                  Apply for this Position
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apply">
          <Card>
            <CardHeader>
              <CardTitle>Apply for {currentJob.title}</CardTitle>
              <CardDescription>
                Please fill out the form below to apply for this position. Fields marked with * are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Enter your address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Work Experience</Label>
                    <Input
                      id="experience"
                      name="experience"
                      placeholder="Briefly describe your relevant experience"
                      value={formData.experience}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="education">Education</Label>
                    <Input
                      id="education"
                      name="education"
                      placeholder="Enter your highest education level"
                      value={formData.education}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Cover Letter</Label>
                  <Textarea
                    id="coverLetter"
                    name="coverLetter"
                    placeholder="Tell us why you're interested in this position and why you'd be a good fit"
                    rows={5}
                    value={formData.coverLetter}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resume">
                    Resume/CV <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex items-center gap-4">
                    <Button type="button" variant="outline" onClick={() => document.getElementById("resume")?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Resume
                    </Button>
                    <Input
                      id="resume"
                      name="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    {formData.resume && (
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{formData.resume.name}</span>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Accepted formats: PDF, DOC, DOCX. Maximum file size: 5MB
                  </p>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("details")}>
                Back to Details
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
