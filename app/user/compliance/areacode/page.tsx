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
  ClipboardCheck,
  Trash2,
  Edit,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination"

import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

interface CodeArea {
  id: number;
  code: string;
  codearea: string;
  factory: number;
  area: string;
  floor: number;
}


export default function FactoryCodeAreaManagement() {
  const [collapsed, setCollapsed] = useState(false)
  const [time, setTime] = useState(new Date())
  const [codeAreas, setCodeAreas] = useState<CodeArea[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isLayoutModalOpen, setIsLayoutModalOpen] = useState(false)
  const [newCodeArea, setNewCodeArea] = useState({
    code: '',
    factory: '', // Use string for select value initially
    area: '',
    floor: '', // Use string for select value initially
  })
  const [editingCodeArea, setEditingCodeArea] = useState<CodeArea | null>(null)
  const [deletingCodeAreaId, setDeletingCodeAreaId] = useState<number | null>(null)

  const [formErrors, setFormErrors] = useState({
    code: '',
    factory: '',
    area: '',
    floor: '',
  })

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Display 6 rows per page
  const [totalItems, setTotalItems] = useState(0);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [factoryFilter, setFactoryFilter] = useState("");

  const [nickname, setNickname] = useState<string>("");

  const router = useRouter()
  const supabase = createClient()

  // Fetch user nickname/profile
  useEffect(() => {
    async function fetchUserNickname() {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();
      if (user && user.id) {
        // Assuming you have a 'profiles' table with 'nickname' field
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

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetchCodeAreas(currentPage, itemsPerPage)
  }, [currentPage, searchTerm, searchField, factoryFilter]) // Refetch when currentPage, searchTerm, searchField, or factoryFilter changes

   useEffect(() => {
    fetchTotalItems();
  }, []) // Fetch total items on initial load

  const fetchCodeAreas = async (page: number, itemsPerPage: number) => {
    setLoading(true)
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage - 1;

    let query = supabase
      .from('table-codearea')
      .select('*')
      .order('id', { ascending: true })
      .range(startIndex, endIndex);

    // Apply factory filter if selected
    if (factoryFilter) {
      query = query.eq('factory', parseInt(factoryFilter));
    }

    if (searchTerm.trim()) {
      if (searchField === "all") {
        // Build OR filter for all fields
        const filters = [];
        filters.push(`code.ilike.%${searchTerm.trim()}%`);
        filters.push(`codearea.ilike.%${searchTerm.trim()}%`);
        filters.push(`area.ilike.%${searchTerm.trim()}%`);
        // For factory and floor, try eq if number
        const numValue = Number(searchTerm.trim());
        if (!isNaN(numValue)) {
          filters.push(`factory.eq.${numValue}`);
          filters.push(`floor.eq.${numValue}`);
        }
        // Supabase JS: use .or() for OR logic
        query = query.or(filters.join(","));
      } else if (["factory", "floor"].includes(searchField)) {
        const numValue = Number(searchTerm.trim());
        if (!isNaN(numValue)) {
          query = query.eq(searchField, numValue);
        }
      } else {
        query = query.ilike(searchField, `%${searchTerm.trim()}%`);
      }
    }

    const { data, error } = await query;

    if (error) {
      // Log error as string for better debugging
      console.error('Error fetching code areas:', typeof error === 'object' ? JSON.stringify(error) : error)
      setError('Failed to fetch code areas. Please try again.')
      setCodeAreas([])
      toast({
        title: "Error",
        description: "Failed to fetch code areas.",
        variant: "destructive",
      })
    } else {
      setCodeAreas(data)
    }
    setLoading(false)
  }

   const fetchTotalItems = async () => {
    const { count, error } = await supabase
      .from('table-codearea')
      .select('count', { head: true, count: 'exact' });

    if (error) {
      console.error('Error fetching total count:', error);
    } else {
      setTotalItems(count || 0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if(editingCodeArea) {
      setEditingCodeArea({ ...editingCodeArea, [name]: value });
    } else {
      setNewCodeArea({ ...newCodeArea, [name]: value });
    }
    setFormErrors({ ...formErrors, [name]: '' });
  };

  const handleSelectChange = (name: string, value: string) => {
     if(editingCodeArea) {
      setEditingCodeArea({ ...editingCodeArea, [name]: parseInt(value) }); // Convert to number for editing
    } else {
      setNewCodeArea({ ...newCodeArea, [name]: value });
    }
    setFormErrors({ ...formErrors, [name]: '' });
  };

  const validateForm = (data: { code: string; factory: string | number; area: string; floor: string | number }) => {
    let valid = true;
    const errors: typeof formErrors = { code: '', factory: '', area: '', floor: '' };

    if (!data.code.trim()) {
      errors.code = 'Code is required.';
      valid = false;
    }
    if (!data.factory) {
      errors.factory = 'Factory is required.';
      valid = false;
    }
    if (!data.area.trim()) {
      errors.area = 'Area is required.';
      valid = false;
    }
    if (!data.floor) {
      errors.floor = 'Floor is required.';
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleAddCodeArea = async () => {
    if (!validateForm(newCodeArea)) {
      return;
    }

    // Defensive: Ensure all required fields are present and valid
    const code = newCodeArea.code.trim();
    const factory = parseInt(newCodeArea.factory);
    const area = newCodeArea.area.trim();
    const floor = parseInt(newCodeArea.floor);
    if (!code || isNaN(factory) || !area || isNaN(floor)) {
      toast({
        title: "Error",
        description: "All fields are required and must be valid.",
        variant: "destructive",
      });
      return;
    }

    // Generate codearea in requested format: F{factory}-{code}{floor}
    const generatedCodeArea = `F${factory}-${code}${floor}`;

    const { data, error } = await supabase
      .from('table-codearea')
      .insert([
        { code, codearea: generatedCodeArea, factory, area, floor }
      ])
      .select(); // Select the inserted data to get the generated id and codearea

    if (error) {
      // Show more details if error is empty object
      let errorMsg = typeof error === 'object' && Object.keys(error).length === 0 ? 'Unknown error. Please check Supabase configuration and table permissions.' : JSON.stringify(error);
      console.error('Error adding code area:', errorMsg);
      toast({
        title: "Error",
        description: `Failed to add code area. ${errorMsg}`,
        variant: "destructive",
      })
    } else {
      console.log('Code area added successfully:', data);
      toast({
        title: "Success",
        description: "Code area added successfully.",
      })
      setIsAddModalOpen(false);
      setNewCodeArea({ code: '', factory: '', area: '', floor: '' }); // Reset form
      fetchCodeAreas(currentPage, itemsPerPage); // Refresh the current page
      fetchTotalItems(); // Update total items count
    }
  };

   const handleEditClick = (codeArea: CodeArea) => {
    setEditingCodeArea(codeArea);
    setIsEditModalOpen(true);
  };

  const handleEditCodeArea = async () => {
    if (!editingCodeArea || !validateForm(editingCodeArea)) {
      return;
    }

    // Generate codearea in requested format: F{factory}-{code}{floor}
    const generatedCodeArea = `F${editingCodeArea.factory}-${editingCodeArea.code.trim()}${editingCodeArea.floor}`;

    const { data, error } = await supabase
      .from('table-codearea')
      .update({
        code: editingCodeArea.code.trim(),
        codearea: generatedCodeArea,
        factory: editingCodeArea.factory,
        area: editingCodeArea.area.trim(),
        floor: editingCodeArea.floor,
      })
      .eq('id', editingCodeArea.id)
       .select(); // Select the updated data

    if (error) {
      console.error('Error updating code area:', error);
       toast({
        title: "Error",
        description: "Failed to update code area.",
        variant: "destructive",
      })
    } else {
      console.log('Code area updated successfully:', data);
       toast({
        title: "Success",
        description: "Code area updated successfully.",
      })
      setIsEditModalOpen(false);
      setEditingCodeArea(null); // Reset editing state
      fetchCodeAreas(currentPage, itemsPerPage); // Refresh the current page
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeletingCodeAreaId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCodeArea = async () => {
    if (deletingCodeAreaId === null) return;

    const { error } = await supabase
      .from('table-codearea')
      .delete()
      .eq('id', deletingCodeAreaId);

    if (error) {
      console.error('Error deleting code area:', error);
       toast({
        title: "Error",
        description: "Failed to delete code area.",
        variant: "destructive",
      })
    } else {
      console.log('Code area deleted successfully');
       toast({
        title: "Success",
        description: "Code area deleted successfully.",
      })
      setIsDeleteModalOpen(false);
      setDeletingCodeAreaId(null);
      // Determine if the current page is now empty after deletion
      const newTotalItems = totalItems - 1;
      const lastPage = Math.max(1, Math.ceil(newTotalItems / itemsPerPage));
      const newPage = currentPage > lastPage ? lastPage : currentPage;
      setCurrentPage(newPage);
      fetchTotalItems(); // Update total items count
      if (newPage === currentPage) { // Only refetch if the page didn't change
        fetchCodeAreas(newPage, itemsPerPage);
      }
    }
  };

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
      href: "/user/compliance"
    },
    {
      title: "Factory Code Area",
      icon: Boxes,
      href: "/user/compliance/areacode"
    },
    // Add other relevant compliance navigation items here
  ]

   const totalPages = Math.ceil(totalItems / itemsPerPage);

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
<h1 className="text-lg md:text-3xl font-bold tracking-tight text-foreground">Code Area</h1>
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
              <h2 className="text-xl md:text-3xl font-bold tracking-tight">Factory Code Areas</h2>
              <div className="flex gap-2">
                <Button onClick={() => setIsLayoutModalOpen(true)} variant="outline">
                  View Factory Layout
                </Button>
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Code Area
                </Button>
              </div>
            </div>
      {/* Factory Layout Modal */}
      <Dialog open={isLayoutModalOpen} onOpenChange={setIsLayoutModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Factory Layout - {factoryFilter === '1' ? 'Factory 1' : factoryFilter === '2' ? 'Factory 2' : factoryFilter === '3' ? 'Factory 3' : 'Select Factory'}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center min-h-[300px]">
            {factoryFilter === '1' && (
              <img src="/icons/factory1-layout.png" alt="Factory 1 Layout" className="max-w-full max-h-[400px] rounded shadow" />
            )}
            {factoryFilter === '2' && (
              <img src="/icons/factory2-layout.png" alt="Factory 2 Layout" className="max-w-full max-h-[400px] rounded shadow" />
            )}
            {factoryFilter === '3' && (
              <img src="/icons/factory3-layout.png" alt="Factory 3 Layout" className="max-w-full max-h-[400px] rounded shadow" />
            )}
            {!['1','2','3'].includes(factoryFilter) && (
              <div className="text-center text-muted-foreground">Please select a factory to view its layout.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

            {/* Search and Filter */}
            <div className="mt-6 flex gap-2 items-center">
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search by ${searchField}...`}
                  className="pl-8"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={searchField} onValueChange={setSearchField}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="code">Code</SelectItem>
                  <SelectItem value="codearea">Code Area</SelectItem>
                  <SelectItem value="factory">Factory</SelectItem>
                  <SelectItem value="area">Area</SelectItem>
                  <SelectItem value="floor">Floor</SelectItem>
                </SelectContent>
              </Select>
              {/* Factory Filter Dropdown */}
              <Select value={factoryFilter || 'all'} onValueChange={value => setFactoryFilter(value === 'all' ? '' : value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter Factory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Factories</SelectItem>
                  <SelectItem value="1">Factory 1</SelectItem>
                  <SelectItem value="2">Factory 2</SelectItem>
                  <SelectItem value="3">Factory 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Inventory Table - Modified to display code areas */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Code Area List</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div>Loading...</div>
                  ) : error ? (
                    <div className="text-red-500">{error}</div>
                  ) : codeAreas && codeAreas.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Code Area</TableHead>
                          <TableHead>Factory</TableHead>
                          <TableHead>Area</TableHead>
                          <TableHead>Floor</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {codeAreas.map((codeArea) => (
                          <TableRow key={codeArea.id}>
                            <TableCell>{codeArea.code}</TableCell>
                            <TableCell>{codeArea.codearea}</TableCell>
                            <TableCell>{codeArea.factory}</TableCell>
                            <TableCell>{codeArea.area}</TableCell>
                            <TableCell>{codeArea.floor}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditClick(codeArea)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteClick(codeArea.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div>No code areas found.</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Pagination Controls */}
            {codeAreas && codeAreas.length > 0 && totalPages > 1 && (
               <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }} />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink href="#" isActive={currentPage === index + 1} onClick={(e) => {
                         e.preventDefault();
                        setCurrentPage(index + 1);
                      }}>
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext href="#" onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}

          </div>
        </main>
      </div>

      {/* Add Code Area Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Code Area</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Code
              </Label>
              <Input
                id="code"
                name="code"
                value={newCodeArea.code}
                onChange={handleInputChange}
                className="col-span-3"
              />
               {formErrors.code && <p className="col-span-4 text-right text-red-500 text-sm">{formErrors.code}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="factory" className="text-right">
                Factory
              </Label>
              <Select onValueChange={(value) => handleSelectChange('factory', value)} value={newCodeArea.factory}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Factory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">F1</SelectItem>
                  <SelectItem value="2">F2</SelectItem>
                  <SelectItem value="3">F3</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.factory && <p className="col-span-4 text-right text-red-500 text-sm">{formErrors.factory}</p>}
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="area" className="text-right">
                Area
              </Label>
              <Input
                id="area"
                name="area"
                value={newCodeArea.area}
                onChange={handleInputChange}
                className="col-span-3"
              />
               {formErrors.area && <p className="col-span-4 text-right text-red-500 text-sm">{formErrors.area}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="floor" className="text-right">
                Floor
              </Label>
               <Select onValueChange={(value) => handleSelectChange('floor', value)} value={newCodeArea.floor}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Floor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.floor && <p className="col-span-4 text-right text-red-500 text-sm">{formErrors.floor}</p>}
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="codearea" className="text-right">
                Code Area
              </Label>
              <Input
                id="codearea"
                name="codearea"
                value={newCodeArea.code && newCodeArea.factory && newCodeArea.floor ? `F${newCodeArea.factory}-${newCodeArea.code}${newCodeArea.floor}` : ''}
                className="col-span-3"
                disabled // Auto-generated
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddCodeArea}>Add Code Area</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

       {/* Edit Code Area Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Code Area</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-code" className="text-right">
                Code
              </Label>
              <Input
                id="edit-code"
                name="code"
                value={editingCodeArea?.code || ''}
                onChange={handleInputChange}
                className="col-span-3"
              />
               {formErrors.code && <p className="col-span-4 text-right text-red-500 text-sm">{formErrors.code}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-factory" className="text-right">
                Factory
              </Label>
              <Select onValueChange={(value) => handleSelectChange('factory', value)} value={editingCodeArea?.factory?.toString() || ''}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Factory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">F1</SelectItem>
                  <SelectItem value="2">F2</SelectItem>
                  <SelectItem value="3">F3</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.factory && <p className="col-span-4 text-right text-red-500 text-sm">{formErrors.factory}</p>}
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-area" className="text-right">
                Area
              </Label>
              <Input
                id="edit-area"
                name="area"
                value={editingCodeArea?.area || ''}
                onChange={handleInputChange}
                className="col-span-3"
              />
               {formErrors.area && <p className="col-span-4 text-right text-red-500 text-sm">{formErrors.area}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-floor" className="text-right">
                Floor
              </Label>
               <Select onValueChange={(value) => handleSelectChange('floor', value)} value={editingCodeArea?.floor?.toString() || ''}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Floor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.floor && <p className="col-span-4 text-right text-red-500 text-sm">{formErrors.floor}</p>}
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-codearea" className="text-right">
                Code Area
              </Label>
              <Input
                id="edit-codearea"
                name="codearea"
                value={editingCodeArea?.code && editingCodeArea?.factory && editingCodeArea?.floor ? `F${editingCodeArea.factory}-${editingCodeArea.code}${editingCodeArea.floor}` : ''}
                className="col-span-3"
                disabled // Auto-generated
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditCodeArea}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Code Area Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Code Area</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p>Are you sure you want to delete this code area?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCodeArea}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="flex justify-around items-center p-2 px-1">
          {navItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <Button
                variant="ghost"
                size="icon"
                className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-muted rounded-lg transition-colors" disabled={true}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.title}</span>
              </Button>
            </Link>
          ))
}
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
