import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Internal Access Portal - PT.YONGJIN JAVASUKA GARMENT",
  description: "Secure internal access portal for PT.YONGJIN JAVASUKA GARMENT management system",
  robots: "noindex, nofollow",
}

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="internal-layout">{children}</div>
}
