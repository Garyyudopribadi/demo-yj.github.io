"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import RefillChart from "@/components/p3k/RefillChart";
import RefillLineChart from "@/components/p3k/RefillLineChart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  ChevronRight, 
  ChevronDown,
  Circle,
  X,
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
  const [masterlistOpen, setMasterlistOpen] = useState(false); // default minimized
  const [checkOpen, setCheckOpen] = useState(false); // default minimized
  const [refillPeriod, setRefillPeriod] = useState<"weekly" | "monthly">("weekly");
  const [refillMonth, setRefillMonth] = useState<string>("January");
  const [refillYear, setRefillYear] = useState<string>("2025");
  const dummyWeekly = [
    { label: "Factory 1", refill: 5 },
    { label: "Factory 2", refill: 8 },
    { label: "Factory 3", refill: 3 },
  ];
  const dummyMonthly = [
    { label: "Factory 1", refill: 18 },
    { label: "Factory 2", refill: 25 },
    { label: "Factory 3", refill: 12 },
  ];
  const refillChartData = refillPeriod === "weekly" ? dummyWeekly : dummyMonthly;
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [areaSearch, setAreaSearch] = useState("");
  const [nickname, setNickname] = useState<string>("user");

  useEffect(() => {
    async function fetchUserNickname() {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();
      if (user && user.id) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('nickname')
          .eq('id', user.id)
          .single();
        if (profile && profile.nickname) {
          setNickname(profile.nickname);
        } else {
          setNickname(user.email || "user");
        }
      } else {
        setNickname("user");
      }
    }
    fetchUserNickname();
  }, []);
  const [factories, setFactories] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [factoryFilter, setFactoryFilter] = useState<string>("");
  const [areaFilter, setAreaFilter] = useState<string>("");

  // Fetch factories and areas from table-codearea
  useEffect(() => {
    async function fetchCodeAreaOptions() {
      const { data, error } = await supabase.from('table-codearea').select('factory,area');
      if (!error && data) {
        const uniqueFactories = Array.from(new Set(data.map((row: any) => row.factory).filter(Boolean)));
        setFactories(uniqueFactories.map(String));
        const uniqueAreas = Array.from(new Set(data.map((row: any) => row.area).filter(Boolean)));
        setAreas(uniqueAreas.map(String));
      }
    }
    fetchCodeAreaOptions();
  }, []);
  type Item = {
    id?: number;
    item_name?: string;
    name?: string;
    item?: string;
    [key: string]: any;
    qty_a?: number;
    qty_b?: number;
    qty_c?: number;
    factory?: string;
    area?: string;
    status?: string;
  };
  // Monitoring items (box status, etc)
  const [items, setItems] = useState<Item[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  // Regulation items (standard regulation table)
  const [regulationItems, setRegulationItems] = useState<Item[]>([]);
  const [loadingRegulation, setLoadingRegulation] = useState(true);

  // Summary counts for dashboard (must be after items declaration)
  const totalBoxes = items.length;
  const fineBoxes = items.filter(item => item.status && ['fine', 'Fine'].includes(item.status)).length;
  const refillBoxes = items.filter(item => item.status && ['needs refill', 'Needs Refill'].includes(item.status)).length;
  const improvementBoxes = items.filter(item => item.status && ['missing', 'Missing', 'need improvement', 'Need Improvement'].includes(item.status)).length;

  // Fetch monitoring items (filtered)
  useEffect(() => {
    async function fetchItems() {
      setLoadingItems(true);
      // Replace with correct table for monitoring items if needed
      let query = supabase.from('p3k_box_item_stock').select('*');
      if (factoryFilter) query = query.eq('factory', factoryFilter);
      if (areaFilter) query = query.eq('area', areaFilter);
      const { data, error } = await query;
      if (!error && data) {
        setItems(data);
      }
      setLoadingItems(false);
    }
    fetchItems();
  }, [factoryFilter, areaFilter]);

  // Fetch regulation items (no filter)
  useEffect(() => {
    async function fetchRegulationItems() {
      setLoadingRegulation(true);
      const { data, error } = await supabase.from('p3k_item_master').select('*');
      if (!error && data) {
        setRegulationItems(data);
      }
      setLoadingRegulation(false);
    }
    fetchRegulationItems();
  }, []);
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
      href: "/user/compliance/p3k"
    },
    {
      title: "Masterlist",
      icon: FileText,
      href: "/user/compliance/p3k/masterlist",
      submenu: [
        {
          title: "Box P3K",
          href: "/user/compliance/p3k/masterlist/box"
        },
        {
          title: "PIC P3K",
          href: "/user/compliance/p3k/masterlist/pic"
        }
      ]
    },
    {
      title: "Check P3K",
      icon: ClipboardCheck,
      href: "/user/compliance/p3k/inspection",
      submenu: [
        {
          title: "Box P3K",
          href: "/user/compliance/p3k/inspection/box"
        },
        {
          title: "Inventory P3K",
          href: "/user/compliance/p3k/inspection/inventory"
        }
      ]
    },
    {
      title: "Analyze",
      icon: ChartBar,
      href: "/user/compliance/p3k/analyze",
      submenu: [
        {
          title: "Reporting",
          href: "/user/compliance/p3k/analyze/reporting"
        },
        {
          title: "Form Checklist",
          href: "/user/compliance/p3k/analyze/form-checklist"
        }
      ]
    }
  ]

  const [analyzeOpen, setAnalyzeOpen] = useState(false); // default minimized

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
<h1 className="text-lg md:text-3xl font-bold tracking-tight text-foreground">P3K / First Aid Kit</h1>
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
            <p className="text-[10px] md:text-xs text-muted-foreground">{nickname}</p>
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
                    <li key={index} className="flex flex-col">
                      <div className="flex items-center">
                        <Link href={item.href} className="flex-1">
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
                        {/* Toggle arrow for Masterlist and Check P3K and Analyze */}
                        {item.submenu && !collapsed && (
                          <button
                            type="button"
                            aria-label={`Toggle ${item.title} submenu`}
                            onClick={() => {
                              if (item.title === "Masterlist") setMasterlistOpen((open) => !open);
                              if (item.title === "Check P3K") setCheckOpen((open) => !open);
                              if (item.title === "Analyze") setAnalyzeOpen((open) => !open);
                            }}
                            className="ml-2 p-1 rounded hover:bg-muted transition-colors flex items-center"
                          >
                            <ChevronRight 
                              className={`h-4 w-4 transition-transform duration-300 ${item.title === "Masterlist" && masterlistOpen ? 'rotate-90' : ''} ${item.title === "Check P3K" && checkOpen ? 'rotate-90' : ''} ${item.title === "Analyze" && analyzeOpen ? 'rotate-90' : ''}`}
                            />
                          </button>
                        )}
                      </div>
                      {/* Submenu for Masterlist, Check P3K, and Analyze */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ${collapsed || (item.title === "Masterlist" && !masterlistOpen) || (item.title === "Check P3K" && !checkOpen) || (item.title === "Analyze" && !analyzeOpen) ? 'max-h-0 opacity-0 translate-x-[-16px]' : 'max-h-40 opacity-100 translate-x-0'}`}
                        style={{ pointerEvents: collapsed || (item.title === "Masterlist" && !masterlistOpen) || (item.title === "Check P3K" && !checkOpen) || (item.title === "Analyze" && !analyzeOpen) ? 'none' : 'auto' }}
                      >
                        {item.submenu && (
                          <ul className="ml-8 mt-1 space-y-1">
                            {item.submenu.map((sub, subIdx) => (
                              <li key={subIdx} className="flex items-center">
                                <Circle className="h-2 w-2 text-muted-foreground mr-2" />
                                <Link href={sub.href} className="flex-1">
                                  <Button variant="ghost" className="w-full justify-start px-3 text-xs hover:bg-muted">
                                    {sub.title}
                                  </Button>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
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
            <h2 className="text-xl md:text-3xl font-bold tracking-tight mb-6">Dashboard : Monitoring Box P3K</h2>
            {/* Filters */}
            <div className="flex gap-4 mb-6 flex-wrap">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Fine">Fine</SelectItem>
                    <SelectItem value="Needs Refill">Needs Refill</SelectItem>
                    <SelectItem value="Finding Issue">Finding Issue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Factory</label>
                <Select value={factoryFilter || 'all'} onValueChange={value => setFactoryFilter(value === 'all' ? '' : value)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All Factories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Factories</SelectItem>
                    {factories.map((factory, idx) => (
                      <SelectItem key={idx} value={factory}>{factory}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col">
                <label className="block text-sm font-medium mb-1">Area</label>
                <div className="flex gap-2">
                  <Select value={areaFilter || 'all'} onValueChange={value => setAreaFilter(value === 'all' ? '' : value)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="All Areas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Areas</SelectItem>
                      {areas.map((area, idx) => (
                        <SelectItem key={idx} value={area}>{area}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="text"
                    placeholder="Search area..."
                    value={areaSearch}
                    onChange={e => setAreaSearch(e.target.value)}
                    className="w-[200px]"
                  />
                </div>
              </div>
            </div>
            {/* Dashboard Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Box P3K</CardTitle>
                  <Boxes className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalBoxes}</div>
                  <p className="text-xs text-muted-foreground">All monitored boxes</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Fine</CardTitle>
                  <ClipboardCheck className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{fineBoxes}</div>
                  <p className="text-xs text-muted-foreground">Boxes in good condition</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Needs Refill</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{refillBoxes}</div>
                  <p className="text-xs text-muted-foreground">Boxes need refill</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Issue Box P3K</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{improvementBoxes}</div>
                  <p className="text-xs text-muted-foreground">Boxes need improvement</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Refill Line Chart */}
            <RefillLineChart 
              data={refillChartData} 
              period={refillPeriod} 
              onPeriodChange={setRefillPeriod}
              month={refillMonth}
              onMonthChange={setRefillMonth}
              year={refillYear}
              onYearChange={setRefillYear}
            />
            {/* Standard Regulation Table for P3K Item List */}
            <div className="mt-10">
              <Card>
                <CardHeader>
                  <CardTitle>Standard Regulation: P3K Item List & Box Type (PER.15/MEN/VIII/2008)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Qty Box A</TableHead>
                        <TableHead>Qty Box B</TableHead>
                        <TableHead>Qty Box C</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {regulationItems.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{item.item_name || item.name || item.item}</TableCell>
                          <TableCell>{item.qty_a}</TableCell>
                          <TableCell>{item.qty_b}</TableCell>
                          <TableCell>{item.qty_c}</TableCell>
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
            <div key={index} className="relative flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-muted rounded-lg transition-colors"
                onClick={() => {
                  if (item.title === "Masterlist") {
                    if (!masterlistOpen) {
                      setMasterlistOpen(true);
                    } else {
                      window.location.href = item.href;
                    }
                  } else if (item.title === "Check P3K") {
                    if (!checkOpen) {
                      setCheckOpen(true);
                    } else {
                      window.location.href = item.href;
                    }
                  } else if (item.title === "Analyze") {
                    if (!analyzeOpen) {
                      setAnalyzeOpen(true);
                    } else {
                      window.location.href = item.href;
                    }
                  } else {
                    window.location.href = item.href;
                  }
                }}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs flex items-center">
                  {item.title}
                </span>
              </Button>
              {/* Mobile Submenu for Masterlist as modal/dropdown */}
              {item.title === "Masterlist" && item.submenu && masterlistOpen && (
                <div
                  className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 transition-all duration-300 ${masterlistOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                  style={{background: 'none'}}
                >
                  {item.submenu.map((sub, subIdx) => (
                    <button
                      key={subIdx}
                      className="bg-background border border-border rounded-full px-5 py-2 shadow-md text-sm flex items-center gap-2 mb-1 active:bg-muted hover:bg-muted transition-colors"
                      onClick={() => {
                        setMasterlistOpen(false);
                        window.location.href = sub.href;
                      }}
                    >
                      <Circle className="h-2 w-2 text-muted-foreground mr-2" />
                      {sub.title}
                    </button>
                  ))}
                  <button
                    className="mt-2 bg-background border border-border rounded-full p-2 shadow-sm flex items-center justify-center"
                    style={{width: 36, height: 36}}
                    onClick={() => setMasterlistOpen(false)}
                    aria-label="Close submenu"
                  >
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
              )}
              {/* Mobile Submenu for Check P3K as modal/dropdown */}
              {item.title === "Check P3K" && item.submenu && checkOpen && (
                <div
                  className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 transition-all duration-300 ${checkOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                  style={{background: 'none'}}
                >
                  {item.submenu.map((sub, subIdx) => (
                    <button
                      key={subIdx}
                      className="bg-background border border-border rounded-full px-5 py-2 shadow-md text-sm flex items-center gap-2 mb-1 active:bg-muted hover:bg-muted transition-colors"
                      onClick={() => {
                        setCheckOpen(false);
                        window.location.href = sub.href;
                      }}
                    >
                      <Circle className="h-2 w-2 text-muted-foreground mr-2" />
                      {sub.title}
                    </button>
                  ))}
                  <button
                    className="mt-2 bg-background border border-border rounded-full p-2 shadow-sm flex items-center justify-center"
                    style={{width: 36, height: 36}}
                    onClick={() => setCheckOpen(false)}
                    aria-label="Close submenu"
                  >
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
              )}
              {/* Mobile Submenu for Analyze as modal/dropdown */}
              {item.title === "Analyze" && item.submenu && analyzeOpen && (
                <div
                  className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 transition-all duration-300 ${analyzeOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                  style={{background: 'none'}}
                >
                  {item.submenu.map((sub, subIdx) => (
                    <button
                      key={subIdx}
                      className="bg-background border border-border rounded-full px-5 py-2 shadow-md text-sm flex items-center gap-2 mb-1 active:bg-muted hover:bg-muted transition-colors"
                      onClick={() => {
                        setAnalyzeOpen(false);
                        window.location.href = sub.href;
                      }}
                    >
                      <Circle className="h-2 w-2 text-muted-foreground mr-2" />
                      {sub.title}
                    </button>
                  ))}
                  <button
                    className="mt-2 bg-background border border-border rounded-full p-2 shadow-sm flex items-center justify-center"
                    style={{width: 36, height: 36}}
                    onClick={() => setAnalyzeOpen(false)}
                    aria-label="Close submenu"
                  >
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
              )}
            </div>
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
