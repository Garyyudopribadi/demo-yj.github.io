"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { motion } from "framer-motion"
import { Users, Shield, Award, Leaf } from "lucide-react"

const programs = [
  {
    title: "Rise Gap Inc",
    description:
      "Participating in Gap Inc's Responsible Investment and Sourcing for Equality program to promote gender equality and women's empowerment.",
    image: "/rise.png?height=200&width=300",
    icon: Users,
  },
  {
    title: "Vendor Code Of Ethics",
    description:
      "Adhering to strict ethical standards in all our business operations and relationships with partners and suppliers.",
    image: "/codeofethic.png?height=200&width=300",
    icon: Award,
  },
  {
    title: "Gender Based Violence Prevention",
    description: "Implementing comprehensive policies and training to prevent gender-based violence in the workplace.",
    image: "/gbv.png?height=200&width=300",
    icon: Shield,
  },
  {
    title: "HIGG Index",
    description:
      "Using the HIGG Index to measure and improve our environmental and social impacts across the value chain.",
    image: "/higg.png?height=200&width=300",
    icon: Leaf,
  },
]

const ParticipatePrograms = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {programs.map((program, index) => {
        const Icon = program.icon
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden h-full group hover:shadow-lg transition-all duration-300">
              <div className="relative h-48 w-full overflow-hidden">
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center z-10">
                  <Icon className="h-16 w-16 text-primary/70" />
                </div>
                <Image
                  src={program.image || "/placeholder.svg"}
                  alt={program.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">{program.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{program.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

export default ParticipatePrograms
