"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ClipboardList, Search, Users, FileCheck, Award } from "lucide-react"

const steps = [
  {
    title: "Apply Online",
    description: "Submit your application through our online portal with your resume and cover letter.",
    icon: ClipboardList,
  },
  {
    title: "Initial Screening",
    description: "Our HR team will review your application and assess your qualifications for the role.",
    icon: Search,
  },
  {
    title: "Interview Process",
    description: "Selected candidates will be invited for interviews with the hiring team and department managers.",
    icon: Users,
  },
  {
    title: "Assessment",
    description: "Depending on the role, you may be asked to complete a skills assessment or practical test.",
    icon: FileCheck,
  },
  {
    title: "Offer & Onboarding",
    description: "Successful candidates will receive a job offer and begin the onboarding process.",
    icon: Award,
  },
]

const ApplicationProcess = () => {
  return (
    <div className="relative max-w-5xl mx-auto py-16" suppressHydrationWarning={true}>
      {/* Vertical line with gradient - Improved centering */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/10 via-primary/50 to-primary/10 -translate-x-1/2 hidden md:block z-0" />

      <div className="space-y-20 relative">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <div
              key={index}
              className={`flex flex-col md:flex-row ${index % 2 === 0 ? "md:flex-row-reverse" : ""} items-center gap-8 relative`}
              suppressHydrationWarning={true}
            >
              <motion.div
                className="md:w-1/2 flex justify-center md:justify-end"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: index * 0.15, type: "spring", stiffness: 50 }}
              >
                <Card
                  className={`w-full max-w-md ${
                    index % 2 === 0 ? "md:ml-12" : "md:mr-12"
                  } hover:shadow-xl transition-all duration-500 group backdrop-blur-sm bg-background/80 border-primary/20 hover:border-primary`}
                  suppressHydrationWarning={true}
                >
                  <CardHeader className="pb-2" suppressHydrationWarning={true}>
                    <CardTitle className="flex items-center gap-3 text-xl" suppressHydrationWarning={true}>
                      <span className="text-primary font-bold text-2xl group-hover:text-primary/90 transition-colors">
                        Step {index + 1}
                      </span>
                      <span className="text-sm font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {step.title}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent suppressHydrationWarning={true}>
                    <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Animated circle marker - Improved centering */}
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 items-center justify-center">
                <motion.div 
                  className="w-8 h-8 rounded-full bg-primary border-4 border-background flex items-center justify-center"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                  whileHover={{ scale: 1.2 }}
                  suppressHydrationWarning={true}
                >
                  <Icon className="h-3 w-3 text-background" />
                </motion.div>
              </div>

              {/* Empty div for layout on alternate sides */}
              <div className="md:w-1/2" />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ApplicationProcess
