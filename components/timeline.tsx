"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

const timelineEvents = [
  {
    year: "1989",
    month: "December",
    title: "Establishment",
    description: "Established as the name of PT. HAEWAE at current Factory I",
  },
  {
    year: "2005",
    month: "October",
    title: "Ownership Change",
    description: "Ownership changed from PT. HAEWAE to HOJEON Limited",
  },
  {
    year: "2006",
    month: "January",
    title: "Name Change",
    description: "Legal company name changed to PT. YONGJIN JAVASUKA GARMENT",
  },
  {
    year: "2008",
    month: "July",
    title: "Expansion",
    description: "Construction completed for Factory II (Unit 1)",
  },
  {
    year: "2009",
    month: "November",
    title: "Further Expansion",
    description: "Construction completed for Factory II (Unit 2)",
  },
]

const Timeline = () => {
  return (
    <div className="relative max-w-5xl mx-auto py-16" suppressHydrationWarning={true}>
      {/* Vertical line with gradient - Improved centering */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/10 via-primary/50 to-primary/10 -translate-x-1/2 hidden md:block z-0" />

      <div className="space-y-20 relative">
        {timelineEvents.map((event, index) => (
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
                      {event.year}
                    </span>
                    <span className="text-sm font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {event.month}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-lg font-medium mt-2">{event.title}</CardDescription>
                </CardHeader>
                <CardContent suppressHydrationWarning={true}>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                    {event.description}
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
                <motion.div 
                  className="w-3 h-3 rounded-full bg-background"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  suppressHydrationWarning={true}
                />
              </motion.div>
            </div>

            {/* Empty div for layout on alternate sides */}
            <div className="md:w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Timeline
