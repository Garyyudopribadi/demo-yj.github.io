"use client"

import Link from "next/link"
import { HardHat, Wrench, ArrowLeft } from "lucide-react" // Using HardHat or Wrench as a maintenance icon
import { Button } from "@/components/ui/button" // Assuming you have a Button component

export default function UnderMaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-6 text-center text-foreground">
      <div className="max-w-md">
        <div className="mb-8 flex justify-center">
          {/* You can choose one icon or alternate them */}
          <HardHat className="h-24 w-24 text-primary sm:h-28 sm:w-28" />
          {/* <Wrench className="h-24 w-24 text-primary sm:h-28 sm:w-28" /> */}
        </div>

        <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Under Maintenance
        </h1>

        <p className="mb-8 text-base text-muted-foreground sm:text-lg">
          We're currently performing scheduled maintenance on this section to improve your experience.
          We expect to be back shortly. Thank you for your patience!
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button asChild variant="outline">
            <Link href="/user/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
          {/* Optional: Add a contact link if needed */}
          {/* <Button asChild variant="ghost">
            <Link href="/contact-support">
              Contact Support
            </Link>
          </Button> */}
        </div>

        <p className="mt-12 text-xs text-muted-foreground">
          © {new Date().getFullYear()} PT.YONGJIN JAVASUKA GARMENT. All rights reserved.
        </p>
      </div>
    </div>
  )
}