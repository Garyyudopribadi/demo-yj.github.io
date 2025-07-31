"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CodeAreaTable from "@/components/areacode/CodeAreaTable"
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
import AddEditCodeAreaDialog from "@/components/areacode/AddEditCodeAreaDialog"
import DeleteCodeAreaDialog from "@/components/areacode/DeleteCodeAreaDialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import FactoryLayoutDialog from "@/components/areacode/FactoryLayoutDialog"
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
    factory: '',
    area: '',
    floor: '',
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

  // Fetch code areas when page, search, or filter changes
  useEffect(() => {
    fetchCodeAreas(currentPage, itemsPerPage);
  }, [currentPage, searchTerm, searchField, factoryFilter]);

  // Fetch total items when search/filter changes
  useEffect(() => {
    fetchTotalItems();
    setCurrentPage(1); // Reset to first page when filter/search changes
  }, [searchTerm, searchField, factoryFilter]);

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
    let query = supabase
      .from('table-codearea')
      .select('id', { count: 'exact', head: true });

    // Apply factory filter if selected
    if (factoryFilter) {
      query = query.eq('factory', parseInt(factoryFilter));
    }

    // Apply search filter if present
    if (searchTerm.trim()) {
      if (searchField === "all") {
        const filters = [];
        filters.push(`code.ilike.%${searchTerm.trim()}%`);
        filters.push(`codearea.ilike.%${searchTerm.trim()}%`);
        filters.push(`area.ilike.%${searchTerm.trim()}%`);
        const numValue = Number(searchTerm.trim());
        if (!isNaN(numValue)) {
          filters.push(`factory.eq.${numValue}`);
          filters.push(`floor.eq.${numValue}`);
        }
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

    const { count, error } = await query;
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

  const handleAddCodeArea = async (imageFile?: File | null) => {
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

    // 1. Insert code area first
    const { data, error } = await supabase
      .from('table-codearea')
      .insert([
        { code, codearea: generatedCodeArea, factory, area, floor }
      ])
      .select();

    if (error) {
      let errorMsg = typeof error === 'object' && Object.keys(error).length === 0 ? 'Unknown error. Please check Supabase configuration and table permissions.' : JSON.stringify(error);
      console.error('Error adding code area:', errorMsg);
      toast({
        title: "Error",
        description: `Failed to add code area. ${errorMsg}`,
        variant: "destructive",
      })
    } else {
      // 2. If image file provided, upload it to storage as {codearea}.png
      if (imageFile) {
        const filePath = `${generatedCodeArea}.png`;
        await supabase.storage.from("layout").remove([filePath]);
        const { error: uploadError } = await supabase.storage.from("layout").upload(filePath, imageFile, {
          upsert: true,
          cacheControl: "3600",
          contentType: imageFile.type,
        });
        if (uploadError) {
          toast({
            title: "Warning",
            description: "Code area added, but failed to upload layout image.",
            variant: "destructive",
          });
        }
      }
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

    // 1. Get the codearea string for the row to delete
    const { data: codeAreaData, error: fetchError } = await supabase
      .from('table-codearea')
      .select('codearea')
      .eq('id', deletingCodeAreaId)
      .single();

    let layoutDeleteError = null;
    if (codeAreaData && codeAreaData.codearea) {
      // 2. Remove the layout image from storage
      const { error: storageError } = await supabase.storage.from('layout').remove([`${codeAreaData.codearea}.png`]);
      layoutDeleteError = storageError;
    }

    // 3. Delete the code area row
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
      if (layoutDeleteError) {
        toast({
          title: "Warning",
          description: "Code area deleted, but failed to delete layout image.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Code area and layout image deleted successfully.",
        });
      }
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
            {/* Header - Responsive for mobile */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl md:text-3xl font-bold tracking-tight text-center md:text-left">Factory Code Areas</h2>
              <div className="flex flex-col gap-2 w-full md:w-auto md:flex-row md:gap-2 md:justify-end">
                <Button onClick={() => setIsLayoutModalOpen(true)} variant="outline" className="w-full md:w-auto">
                  View Factory Layout
                </Button>
                <Button onClick={() => setIsAddModalOpen(true)} className="w-full md:w-auto">
                  <Plus className="mr-2 h-4 w-4" /> Add Code Area
                </Button>
              </div>
            </div>
      {/* Factory Layout Modal (with upload) */}
      <FactoryLayoutDialog
        open={isLayoutModalOpen}
        onOpenChange={setIsLayoutModalOpen}
        factoryFilter={factoryFilter}
      />

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
              <Select value={factoryFilter || 'all'} onValueChange={value => {
                setFactoryFilter(value === 'all' ? '' : value);
              }}>
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
                  <CodeAreaTable
                    codeAreas={codeAreas || []}
                    loading={loading}
                    error={error}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Pagination Controls - Responsive for mobile */}
            {codeAreas && codeAreas.length > 0 && totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent className="flex flex-wrap justify-center gap-1 md:gap-2">
                  <PaginationItem>
                    <PaginationPrevious href="#" onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }} className="min-w-[36px]" />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink href="#" isActive={currentPage === index + 1} onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(index + 1);
                      }} className="min-w-[36px] text-center">
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext href="#" onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }} className="min-w-[36px]" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}

          </div>
        </main>
      </div>

      {/* Add/Edit Code Area Dialogs */}
      <AddEditCodeAreaDialog
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        isEdit={false}
        codeArea={newCodeArea}
        formErrors={formErrors}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onSubmit={handleAddCodeArea}
      />
      <AddEditCodeAreaDialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        isEdit={true}
        codeArea={editingCodeArea || { code: '', factory: '', area: '', floor: '' }}
        formErrors={formErrors}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onSubmit={handleEditCodeArea}
      />
      <DeleteCodeAreaDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onDelete={handleDeleteCodeArea}
      />

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
