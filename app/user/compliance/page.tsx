"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { 
  Flame, 
  Zap, 
  FlaskConical, 
  Building as BuildingIcon, 
  Leaf, 
  ClipboardCheck, 
  FilePieChart, 
  FileText, 
  LogOut,
  ChevronRight,
  MapPin, // New: For Factory Area Code
  BriefcaseMedical // New: For First Aid Kit
} from "lucide-react"
import React from "react" // Import React for React.cloneElement
import { createClient } from "@/utils/supabase/client"

const menuItems = [
  {
    id: "fire",
    title: "Fire Safety",
    description: "Manage fire safety protocols and equipment",
    icon: <Flame className="h-8 w-8" />,
    href: "/user/compliance/fire"
  },
  {
    id: "electrical",
    title: "Electrical",
    description: "Manage electrical safety protocols and equipment",
    icon: <Zap className="h-8 w-8" />,
    href: "/user/compliance/electrical"
  },
  {
    id: "chemical",
    title: "Chemical",
    description: "Track and manage chemical inventory and safety",
    icon: <FlaskConical className="h-8 w-8" />,
    href: "/user/compliance/chemical"
  },
  {
    id: "first-aid-kit",
    title: "First Aid Kit",
    description: "Manage first aid kit inventory and checks",
    icon: <BriefcaseMedical className="h-8 w-8" />,
    href: "/user/compliance/p3k"
  },
  {
    id: "building",
    title: "Building Maintenance",
    description: "Manage building safety protocols",
    icon: <BuildingIcon className="h-8 w-8" />,
    href: "/user/compliance/building"
  },
  {
    id: "environment",
    title: "Environmental",
    description: "Manage building safety protocols",
    icon: <Leaf className="h-8 w-8" />,
    href: "/user/compliance/environment"
  },
  {
    id: "cap",
    title: "Corrective Action Progress",
    description: "Track progress of corrective and preventive actions",
    icon: <ClipboardCheck className="h-8 w-8" />,
    href: "/user/compliance/cap"
  },
  {
    id: "document",
    title: "Document Control",
    description: "Access and manage official documents",
    icon: <FileText className="h-8 w-8" />,
    href: "/user/compliance/document"
  },
  {
    id: "reporting",
    title: "Analytics and Reporting",
    description: "Generate and view compliance reports",
    icon: <FilePieChart className="h-8 w-8" />,
    href: "/user/compliance/reporting"
  },
  {
    id: "factory-area-code",
    title: "Factory Area Code",
    description: "Manage and view factory area codes",
    icon: <MapPin className="h-8 w-8" />,
    href: "/user/compliance/areacode"
  },
  {
    id: "Events Articles",
    title: "Events Articles",
    description: "Manage and view Content Events Page",
    icon: <FilePieChart className="h-8 w-8" />,
    href: "/user/compliance/events"
  }
]

export default function ComplianceDashboard() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [time, setTime] = useState(new Date())
  const [nickname, setNickname] = useState("")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUserRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/user")
        return
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role, nickname")
        .eq("id", user.id)
        .single()

      if (profileError || !profileData || profileData.role !== "compliance") {
        await supabase.auth.signOut()
        router.push("/user")
        return
      }

      setNickname(profileData.nickname || "")
    }

    checkUserRole()

    const interval = setInterval(() => {
      setTime(new Date())
    }, 60000) // Update time every minute
    return () => clearInterval(interval)
  }, [router, supabase])

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-muted/30 text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Top bar with time and user info - Made sticky */}
      <header className="sticky top-0 z-50 p-6 flex justify-between items-center border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Compliance Dashboard</h1>
          <p className="text-muted-foreground text-sm">{formattedDate}</p>
        </div>
        <div className="flex items-center gap-5">
          <div className="text-right">
            <p className="text-2xl font-semibold text-foreground">{formattedTime}</p>
            <p className="text-xs text-muted-foreground">Welcome, {nickname}</p>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push("/user")
            }}
            className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main menu grid - Added padding top to prevent content from hiding under sticky header */}
      <main className="px-6 py-10 sm:px-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {menuItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -5, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onHoverStart={() => setSelectedItem(item.id)}
              onHoverEnd={() => setSelectedItem(null)}
              className="group" // Added group here for card children hover states
            >
              <Link href={item.href} className="block h-full">
                <Card
                  className={`h-full overflow-hidden relative cursor-pointer border-primary/20 shadow-lg hover:shadow-xl 
                                 transition-all duration-300 ease-in-out backdrop-blur-sm bg-background/95
                                 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-xl`}
                >
                  {/* Background gradient removed */}

                  {/* Content */}
                  <div className="relative p-5 sm:p-6 h-full flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start">
                      <div className="bg-primary/10 p-3 sm:p-4 rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300">
                        {React.cloneElement(item.icon, { className: `${item.icon.props.className} text-primary` })}
                      </div>
                      <ChevronRight
                        className={`h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100 transform transition-all duration-300 group-hover:translate-x-0 -translate-x-3 group-hover:text-primary`}
                      />
                    </div>

                    <div className="mt-6">
                      <h2 className="text-xl sm:text-2xl font-semibold mb-1 tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </h2>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-muted-foreground border-t border-primary/20 mt-8 bg-muted/10">
        <p>© 2025 PT.YONGJIN JAVASUKA GARMENT. All rights reserved.</p>
        <p>⚡ Powered & Created By Garyudo</p>
      </footer>
    </div>
  )
}
