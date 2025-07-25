"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  ChevronRight, 
  Menu,
  Package,
  Calendar,
  AlertTriangle,
  Plus,
  Search,
  LayoutDashboard,
  Boxes,
  History,
  Settings,
  ChevronLast,
  ChevronFirst,
  LogOut,
  ArrowLeft,
  ChartBar,
  FileText,
  ClipboardCheck
} from "lucide-react"

import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export default function P3KDashboard() {
  const [collapsed, setCollapsed] = useState(false)
  const [time, setTime] = useState(new Date())
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 60000) // Update time every minute
    return () => clearInterval(interval)
  }, [])

  const formattedTime = {
    time: time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }),
    period: time.toLocaleTimeString('en-US', {
      hour12: true
    }).slice(-2)
  }

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  const navItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/user/p3k"
    },
    {
      title: "Masterlist",
      icon: FileText,
      href: "/user/p3k/masterlist"
    },
    {
      title: "Inspection",
      icon: ClipboardCheck,
      href: "/user/p3k/inspection"
    },
    {
      title: "Analyze",
      icon: ChartBar,
      href: "/user/p3k/analyze"
    }
  ]

  return (
    <div className="flex min-h-screen flex-col bg-muted/30 text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Top bar with time and user info - Made sticky */}
      <header className="sticky top-0 z-50 p-6 flex justify-between items-center border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div>
          <div className="flex items-center gap-2">
            <Link 
              href="/user/compliance"
              className="p-2 -ml-2 hover:bg-muted/50 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
<h1 className="text-lg md:text-3xl font-bold tracking-tight text-foreground">Inventory Control (P3K)</h1>
              <p className="text-muted-foreground text-xs md:text-sm">{formattedDate}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="text-right">
            <div className="flex items-center gap-1">
              <p className="text-lg md:text-2xl font-semibold text-foreground">{formattedTime.time}</p>
              <span className="text-xs md:text-sm font-medium text-muted-foreground">{formattedTime.period}</span>
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground">user</p>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push("/user")
            }}
            className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            aria-label="Logout"
            type="button"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Hidden on mobile */}
        <aside className={`hidden md:block sticky top-[88px] self-start h-[calc(100vh-144px)] ${collapsed ? "w-20" : "w-64"} border-r bg-background transition-all duration-300 z-20`}>
          {/* Collapse Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-4 top-8 h-8 w-8 rounded-full bg-background hover:bg-muted/80 border border-border"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronLast className="h-4 w-4 stroke-2" /> : <ChevronFirst className="h-4 w-4 stroke-2" />}
          </Button>

          <div className="flex h-full flex-col">
            {/* Navigation */}
            <div className="flex-1 px-3 pt-8">
              <nav>
                <ul className="space-y-1">
                  {navItems.map((item, index) => (
                    <li key={index}>
                      <Link href={item.href}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start ${
                            collapsed ? "px-2" : "px-3"
                          } hover:bg-muted`}
                        >
                          <item.icon className={`h-5 w-5 ${!collapsed && "mr-2"}`} />
                          {!collapsed && <span>{item.title}</span>}
                        </Button>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-144px)] overflow-y-auto relative pb-[76px] md:pb-0">
          <div className="container px-4 py-6 lg:px-8 mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-3xl font-bold tracking-tight">Dashboard</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </div>

            {/* Search */}
            <div className="mt-6">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search inventory..." className="pl-8" />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">123</div>
                  <p className="text-xs text-muted-foreground">items in inventory</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7</div>
                  <p className="text-xs text-muted-foreground">items expiring in 30 days</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">items need restock</p>
                </CardContent>
              </Card>
            </div>

            {/* Inventory Table */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory List</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[1, 2, 3].map((item) => (
                        <TableRow key={item}>
                          <TableCell>Bandage</TableCell>
                          <TableCell>50</TableCell>
                          <TableCell>2024-12-31</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-green-600 mr-2" />
                              Good
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="flex justify-around items-center p-2 px-1">
          {navItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <Button
                variant="ghost"
                size="icon"
                className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-muted rounded-lg transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.title}</span>
              </Button>
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer - Hidden on mobile due to bottom nav */}
      <footer className="hidden md:block mt-auto p-6 text-center text-xs text-muted-foreground border-t border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative z-10">
        <p>© 2025 PT.YONGJIN JAVASUKA GARMENT. All rights reserved.</p>
        <p>⚡ Powered & Created By Garyudo</p>
      </footer>
    </div>
  )
}
