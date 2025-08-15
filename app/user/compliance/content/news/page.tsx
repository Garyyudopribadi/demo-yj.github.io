"use client"

import { useState, useEffect, useRef } from "react"
import TiptapEditor from "@/components/TiptapEditor"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from "@/components/ui/table"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ChevronRight, ChevronLeft, ChevronLast, ChevronFirst, LogOut, ArrowLeft, X, FileText, Plus, Calendar, MapPin, User2, Info, LayoutDashboard, Contact } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import type { RichTextEditorHandle } from "@/components/quill/RichTextEditor";
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { MoreVerticalIcon } from "lucide-react"
// Enhanced menu config: can rename menu/submenu without affecting animation
const menuConfig = [
	{
		key: "dashboard",
		title: "Dashboard",
		icon: LayoutDashboard,
		href: "/user/compliance/"
	},
	{
		key: "Content",
		title: "Content",
		icon: FileText,
		href: "/user/compliance/content/#",
		submenu: [
			{ key: "news", title: "news content", href: "/user/compliance/content/news/" },
			{ key: "careers", title: "careers content", href: "/user/compliance/content/careers/" },
		]
	},
	{
		key: "contactus",
		title: "Contact Us",
		icon: Contact,
		href: "/user/compliance/content/contactus",
	}
]

export default function ComplianceContent() {
	const [collapsed, setCollapsed] = useState(false)
	const [openMenus, setOpenMenus] = useState<{[key:string]:boolean}>({})
	const [mobileOpenMenus, setMobileOpenMenus] = useState<{[key:string]:boolean}>({})
	const [time, setTime] = useState(new Date())
	const [nickname, setNickname] = useState<string>("user")
	const router = useRouter()
	const supabase = createClient()

	// News dashboard state and handlers
	type NewsItem = {
		id: number;
		title: string;
		date: string;
		time: string;
		category: string;
		location: string;
		attendees: number;
		organizer: string;
		description: string;
	};

	// Helper untuk generate public URL gambar dari bucket 'news-images'
	function getNewsImageUrl(id: number, index: number) {
		const supabase = createClient();
		const { data } = supabase.storage.from("news-images").getPublicUrl(`news_${id}_${index}.png`);
		// Tambahkan timestamp untuk cache busting
		return data.publicUrl ? `${data.publicUrl}?t=${Date.now()}` : "";
	}


	const [news, setNews] = useState<NewsItem[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const rowsPerPage = 10;
	const [searchTerm, setSearchTerm] = useState("");
	const [filterCategory, setFilterCategory] = useState("all");
	const [selected, setSelected] = useState<NewsItem | null>(null);
	const [openDialog, setOpenDialog] = useState(false);
	const [editMode, setEditMode] = useState(false);
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [deletingId, setDeletingId] = useState<number | null>(null);
const [isDeleting, setIsDeleting] = useState(false);
const { toast } = useToast();
	const [richTextOpen, setRichTextOpen] = useState(false);
	const [richDescription, setRichDescription] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);
const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
const [submitDialogSuccess, setSubmitDialogSuccess] = useState(true);
const [submitDialogMessage, setSubmitDialogMessage] = useState("");
	const [openDetail, setOpenDetail] = useState(false);
	const [detailItem, setDetailItem] = useState<NewsItem | null>(null);
	const [slideIdx, setSlideIdx] = useState(0);
function handleViewDetail(item: NewsItem) {
	setDetailItem(item);
	setSlideIdx(0);
	setOpenDetail(true);
}

	function handleAdd() {
		setSelected(null);
		setEditMode(false);
		setRichDescription("");
		setOpenDialog(true);
		// Optionally reset other form fields if needed
	}

	function handleEdit(item: NewsItem) {
		setSelected(item);
		setEditMode(true);
		setRichDescription(item.description || "");
		setOpenDialog(true);
	}

	async function handleDelete(id: number) {
	setIsDeleting(true);
	toast({ title: "Waiting in process...", description: "Deleting news and images.", variant: "default" });
	const { error } = await supabase.from('news').delete().eq('id', id);
	if (!error) {
		// Hapus gambar terkait dari storage bucket 'news-images'
		const deletePromises = [];
		for (let i = 1; i <= 4; i++) {
			const filePath = `news_${id}_${i}.png`;
			deletePromises.push(
				supabase.storage.from('news-images').remove([filePath])
			);
		}
		const deleteResults = await Promise.all(deletePromises);
		const failedDeletes = deleteResults.filter(r => r.error);
		if (failedDeletes.length > 0) {
			console.warn('Beberapa gambar gagal dihapus:', failedDeletes.map(r => r.error ? r.error.message : '').join(', '));
		}
		setNews(news.filter(n => n.id !== id));
		toast({ title: "Data has been deleted", description: "News and images deleted successfully.", variant: "default" });
	} else {
		toast({ title: "Failed to delete", description: error.message || "Failed to delete news item from database.", variant: "destructive" });
	}
	setIsDeleting(false);
	setDeleteDialogOpen(false);
	setDeletingId(null);
	}

	// Get unique categories for filter dropdown
	const categories = Array.from(new Set(news.map(n => n.category))).filter(Boolean);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsSubmitting(true);
		const form = e.currentTarget;
		const formData = new FormData(form);
		const newItem: any = {
			title: String(formData.get("title") ?? ""),
			date: String(formData.get("date") ?? ""),
			time: String(formData.get("time") ?? ""),
			category: String(formData.get("category") ?? ""),
			location: String(formData.get("location") ?? ""),
			attendees: Number(formData.get("attendees") ?? 0),
			organizer: String(formData.get("organizer") ?? ""),
			description: richDescription || ""
		};
		let insertedId: number | null = null;
		let uploadErrors: string[] = [];
		let success = false;
		try {
			if (editMode && selected) {
				const { data, error } = await supabase.from('news').update(newItem).eq('id', selected.id).select('id');
				if (!error) {
					insertedId = selected.id;
					setNews(news.map(n => n.id === selected.id ? { ...n, ...newItem } : n));
					setSubmitDialogSuccess(true);
					setSubmitDialogMessage('News updated successfully!');
					setSubmitDialogOpen(true);
					success = true;
				} else {
					setSubmitDialogSuccess(false);
					setSubmitDialogMessage('Failed to update news item in database. ' + (error?.message || ''));
					setSubmitDialogOpen(true);
				}
			} else {
				const { data, error } = await supabase.from('news').insert([newItem]).select('id');
				if (!error && data && data[0]?.id) {
					insertedId = data[0].id;
					setNews([...news, { ...newItem, id: insertedId }]);
					setSubmitDialogSuccess(true);
					setSubmitDialogMessage('News added successfully!');
					setSubmitDialogOpen(true);
					success = true;
				} else {
					setSubmitDialogSuccess(false);
					setSubmitDialogMessage('Failed to add news item to database. ' + (error?.message || ''));
					setSubmitDialogOpen(true);
				}
			}
			// Upload images async, tidak blocking UI
			if (insertedId) {
				setTimeout(() => {
					const uploadPromises = [];
					for (let i = 1; i <= 4; i++) {
						const file = formData.get(`image_${i}`);
						if (file && file instanceof File && file.size > 0) {
							const filePath = `news_${insertedId}_${i}.png`;
							uploadPromises.push(
								supabase.storage.from('news-images').upload(filePath, file, {
									cacheControl: '3600',
									upsert: true
								}).then(({ error }) => {
									if (error) uploadErrors.push(`Image ${i}: ${error.message}`);
								})
							);
						}
					}
					Promise.all(uploadPromises).then(() => {
						if (uploadErrors.length > 0) {
							setSubmitDialogSuccess(false);
							setSubmitDialogMessage('News saved, but some images failed to upload: ' + uploadErrors.join(', '));
							setSubmitDialogOpen(true);
						}
					});
				}, 100);
			}
		} catch (err) {
			const errorMessage = typeof err === "object" && err !== null && "message" in err ? (err as any).message : String(err);
			setSubmitDialogSuccess(false);
			setSubmitDialogMessage('Unexpected error: ' + errorMessage);
			setSubmitDialogOpen(true);
		} finally {
			setIsSubmitting(false);
			setOpenDialog(false);
			setRichDescription("");
			// Jika sukses, tutup dialog submit otomatis setelah 1.5 detik
			if (success) {
				setTimeout(() => setSubmitDialogOpen(false), 1500);
			}
		}
{/* Dialog hasil submit add/edit */}
<Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>{submitDialogSuccess ? "Success" : "Failed"}</DialogTitle>
		</DialogHeader>
		<div className={submitDialogSuccess ? "text-green-600 py-2" : "text-red-600 py-2"}>{submitDialogMessage}</div>
		<DialogFooter>
			<Button variant="default" onClick={() => setSubmitDialogOpen(false)}>OK</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
	}
	useEffect(() => {
		const interval = setInterval(() => setTime(new Date()), 60000)
		return () => clearInterval(interval)
	}, [])

	useEffect(() => {
		async function fetchUserNickname() {
			const { data: { user } } = await supabase.auth.getUser();
			if (user && user.id) {
				const { data: profile } = await supabase.from('profiles').select('nickname').eq('id', user.id).single();
				setNickname(profile?.nickname || user.email || "user")
			}
		}
		fetchUserNickname();

		// Fetch news from Supabase
		async function fetchNews() {
			const { data, error } = await supabase.from('news').select('*');
			if (!error && Array.isArray(data)) {
				setNews(data as NewsItem[]);
			}
		}
		fetchNews();
	}, [supabase]);

	const formattedTime = {
		time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
		period: time.toLocaleTimeString('en-US', { hour12: true }).slice(-2)
	}
	const formattedDate = time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

	// Sidebar submenu animation state
	const handleMenuToggle = (key: string) => setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }))
	// Mobile submenu animation state
	const handleMobileMenuToggle = (key: string) => setMobileOpenMenus(prev => ({ ...prev, [key]: !prev[key] }))

	return (
		<div className="flex min-h-screen flex-col bg-muted/30 text-foreground selection:bg-primary selection:text-primary-foreground">
			{/* Header */}
			<header className="sticky top-0 z-50 p-6 flex justify-between items-center border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="flex items-center gap-2">
					<Link href="/user/compliance" className="p-2 -ml-2 hover:bg-muted/50 rounded-lg transition-colors">
						<ArrowLeft className="h-5 w-5" />
					</Link>
					<div>
						<h1 className="text-lg md:text-3xl font-bold tracking-tight text-foreground">Yongjin News</h1>
						<p className="text-muted-foreground text-xs md:text-sm">{formattedDate}</p>
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
						onClick={async () => { await supabase.auth.signOut(); router.push("/user") }}
						className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
						aria-label="Logout"
						type="button"
					>
						<LogOut className="h-5 w-5" />
					</button>
				</div>
			</header>
			<div className="flex flex-1">
				{/* Sidebar (desktop) */}
				<aside className={`hidden md:block sticky top-[88px] self-start h-[calc(100vh-144px)] ${collapsed ? "w-20" : "w-64"} border-r bg-background transition-all duration-300 z-20`}>
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
						<div className="flex-1 px-3 pt-8">
							<nav>
								<ul className="space-y-1">
									{menuConfig.map(item => (
										<li key={item.key} className="flex flex-col">
											<div className="flex items-center">
												<Link href={item.href} className="flex-1">
													<Button variant="ghost" className={`w-full justify-start ${collapsed ? "px-2" : "px-3"} hover:bg-muted`}>
														<item.icon className={`h-5 w-5 ${!collapsed && "mr-2"}`} />
														{!collapsed && <span>{item.title}</span>}
													</Button>
												</Link>
												{item.submenu && !collapsed && (
													<button
														type="button"
														aria-label={`Toggle ${item.title} submenu`}
														onClick={() => handleMenuToggle(item.key)}
														className="ml-2 p-1 rounded hover:bg-muted transition-colors flex items-center"
													>
														<ChevronRight className={`h-4 w-4 transition-transform duration-300 ${openMenus[item.key] ? 'rotate-90' : ''}`} />
													</button>
												)}
											</div>
											{/* Submenu animation */}
																						<div
																							className={`overflow-hidden transition-all duration-300 ${collapsed || !openMenus[item.key] ? 'max-h-0 opacity-0 translate-x-[-16px]' : 'max-h-40 opacity-100 translate-x-0'}`}
																							style={{ pointerEvents: collapsed || !openMenus[item.key] ? 'none' : 'auto' }}
																						>
																							{item.submenu && (
																								<ul className="ml-8 mt-1 space-y-1">
																									{item.submenu.map(sub => (
																										<li key={sub.key} className="flex items-center">
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
									{/* News Dashboard UI - Responsive & Professional */}


									<div className="mb-4 flex flex-col gap-2 items-start md:items-start">
										<div className="flex items-center gap-3 mb-2">
											<h3 className="text-lg font-semibold text-foreground">Manage News</h3>
											<span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-bold border border-blue-300 shadow-sm">{news.length} Data</span>
										</div>
										<div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full">
											<Input
												type="text"
												placeholder="Search title..."
												value={searchTerm}
												onChange={e => setSearchTerm(e.target.value)}
												className="w-full md:flex-1 min-w-0 md:min-w-[320px] max-w-full md:max-w-[600px] border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-lg bg-background text-foreground shadow-sm"
											/>
											<Select value={filterCategory} onValueChange={setFilterCategory}>
												<SelectTrigger className="w-full md:min-w-[180px] md:max-w-[260px] border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-lg bg-background text-foreground shadow-sm">
													<SelectValue placeholder="All Categories" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="all">All Categories</SelectItem>
													{categories.map(cat => (
														<SelectItem key={cat} value={cat}>{cat}</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>

									{/* Floating Add News Button */}
									<button
										type="button"
										onClick={handleAdd}
										className="fixed right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-background"
										aria-label="Add News"
										style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)', bottom: '88px' }}
									>
										<Plus className="w-7 h-7" />
									</button>

									{/* Desktop Table */}

									<div className="hidden md:block">
										<div className="overflow-hidden rounded-lg border">
											<Table>
												<TableHeader className="sticky top-0 z-10 bg-muted">
													<TableRow>
														<TableHead>Title</TableHead>
														<TableHead>Date</TableHead>
														<TableHead>Category</TableHead>
														<TableHead>Location</TableHead>
														<TableHead>Attendees</TableHead>
														<TableHead>Actions</TableHead>
													</TableRow>
												</TableHeader>

												<TableBody>
													{(() => {
														const filtered = news.filter(item => {
															const matchTitle = item.title.toLowerCase().includes(searchTerm.toLowerCase());
															const matchCategory = filterCategory === "all" ? true : item.category === filterCategory;
															return matchTitle && matchCategory;
														});
														const totalPages = Math.ceil(filtered.length / rowsPerPage);
														const startIdx = (currentPage - 1) * rowsPerPage;
														const pageData = filtered.slice(startIdx, startIdx + rowsPerPage);
														if (filtered.length === 0) {
															return (
																<TableRow>
																	<TableCell colSpan={6} className="h-24 text-center">No results.</TableCell>
																</TableRow>
															);
														}
														return pageData.map((item, idx) => (
															<TableRow key={item.id ?? `row-${idx}`}> 
																<TableCell className="font-medium">{item.title}</TableCell>
																<TableCell>{item.date}</TableCell>
																<TableCell><Badge>{item.category}</Badge></TableCell>
																<TableCell>{item.location}</TableCell>
																<TableCell>{item.attendees}</TableCell>
																<TableCell>
																	<DropdownMenu>
																		<DropdownMenuTrigger asChild>
																			<Button variant="ghost" size="icon" className="size-8 text-muted-foreground data-[state=open]:bg-muted">
																				<MoreVerticalIcon />
																				<span className="sr-only">Open menu</span>
																			</Button>
																		</DropdownMenuTrigger>
																		<DropdownMenuContent align="end" className="w-40">
																			<DropdownMenuItem onClick={() => handleViewDetail(item)}>View Detail</DropdownMenuItem>
																			<DropdownMenuItem onClick={() => handleEdit(item)}>Edit</DropdownMenuItem>
																			<DropdownMenuItem onClick={() => { setDeletingId(item.id); setDeleteDialogOpen(true); }}>Delete</DropdownMenuItem>
																		</DropdownMenuContent>
																	</DropdownMenu>
																</TableCell>
															</TableRow>
														));
													})()}
												</TableBody>
											</Table>
											{/* Pagination Controls */}
											{(() => {
												const filtered = news.filter(item => {
													const matchTitle = item.title.toLowerCase().includes(searchTerm.toLowerCase());
													const matchCategory = filterCategory === "all" ? true : item.category === filterCategory;
													return matchTitle && matchCategory;
												});
												const totalPages = Math.ceil(filtered.length / rowsPerPage);
												if (totalPages <= 1) return null;
												return (
													<div className="flex justify-center items-center gap-2 py-4">
														<Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
															<ChevronLeft className="w-4 h-4" />
														</Button>
														{[...Array(totalPages)].map((_, i) => (
															<Button
																key={i}
																variant={currentPage === i + 1 ? "default" : "outline"}
																size="sm"
																onClick={() => setCurrentPage(i + 1)}
															>
																{i + 1}
															</Button>
														))}
														<Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
															<ChevronRight className="w-4 h-4" />
														</Button>
													</div>
												);
											})()}
										</div>
									</div>

									{/* Mobile Card List */}


									<div className="md:hidden grid gap-4">
										{news.filter(item => {
											const matchTitle = item.title.toLowerCase().includes(searchTerm.toLowerCase());
											const matchCategory = filterCategory === "all" ? true : item.category === filterCategory;
											return matchTitle && matchCategory;
										}).map((item, idx) => (
											<div key={item.id ?? `card-${idx}`} className="relative rounded-lg border bg-background shadow-sm p-4 flex flex-row gap-3">
												{/* Left column: image */}
												<div className="flex-shrink-0 flex items-center justify-center w-20 h-20">
													<img src={getNewsImageUrl(item.id, 1) || '/placeholder.svg'} alt={item.title} className="w-16 h-16 object-cover rounded-md border" onError={e => { e.currentTarget.src = '/placeholder.svg'; }} />
												</div>
												{/* Right column: details and actions */}
												<div className="flex flex-col flex-1 justify-between">
													<div>
														<div className="flex items-center gap-2 mb-1">
															<Info className="w-4 h-4 text-blue-400" strokeWidth={1.5} />
															<h4 className="font-bold text-base">{item.title}</h4>
															<Badge className="ml-2 whitespace-nowrap">{item.category}</Badge>
														</div>
														<div className="flex items-center gap-2 text-xs text-muted-foreground">
															<Calendar className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
															<span>{item.date}</span>
															<span className="mx-1">•</span>
														</div>
														<div className="text-sm mt-2 flex flex-col gap-1">
															<span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" strokeWidth={1.5} /> {item.location}</span>
															<span className="flex items-center gap-2"><User2 className="w-4 h-4 text-gray-400" strokeWidth={1.5} /> {item.attendees}</span>
														</div>
													</div>
													<div className="flex gap-2 mt-3">
														<Button variant="secondary" size="sm" className="flex-1" onClick={() => handleViewDetail(item)}>View</Button>
														<Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(item)}>Edit</Button>
														<Button variant="destructive" size="sm" className="flex-1" onClick={() => { setDeletingId(item.id); setDeleteDialogOpen(true); }}>Delete</Button>
{/* Dialog Konfirmasi Delete */}
<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Delete News</DialogTitle>
		</DialogHeader>
		<div className="py-2">Are you sure you want to delete this news item? This action cannot be undone.</div>
		<DialogFooter>
			<Button variant="outline" onClick={() => { setDeleteDialogOpen(false); setDeletingId(null); }} disabled={isDeleting}>Cancel</Button>
			<Button variant="destructive" onClick={() => deletingId !== null && handleDelete(deletingId)} disabled={isDeleting}>
				{isDeleting ? "Deleting..." : "Yes, Delete"}
			</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
													</div>
												</div>
											</div>
										))}
									</div>
{/* Dialog for View Detail News */}


<Dialog open={openDetail} onOpenChange={setOpenDetail}>
	<DialogContent className="max-w-2xl w-full p-8 md:p-10 bg-background/90 rounded-xl shadow-xl overflow-y-auto" style={{ maxHeight: 'calc(100vh - 64px)' }}>
		<DialogHeader>
			<div className="flex items-center gap-3 mb-2">
				<FileText className="w-7 h-7 text-blue-600" />
				<DialogTitle className="text-2xl font-extrabold text-blue-700 tracking-tight">News Detail</DialogTitle>
			</div>
		</DialogHeader>
		{detailItem && (
			<div className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div className="space-y-2">
						<div><span className="font-semibold">Title:</span> {detailItem.title}</div>
						<div><span className="font-semibold">Date:</span> {detailItem.date}</div>
						<div><span className="font-semibold">Time:</span> {detailItem.time}</div>
						<div><span className="font-semibold">Category:</span> {detailItem.category}</div>
						<div><span className="font-semibold">Location:</span> {detailItem.location}</div>
						<div><span className="font-semibold">Attendees:</span> {detailItem.attendees}</div>
						<div><span className="font-semibold">Organizer:</span> {detailItem.organizer}</div>
					</div>
					<div className="space-y-2">
						{/* Slideshow for images */}
						{(() => {
							const images = [1,2,3,4]
								.map(idx => getNewsImageUrl(detailItem.id, idx))
								.filter(Boolean);
							return (
								<div className="relative w-full h-56 flex flex-col items-center justify-center">
									<div className="w-full h-56 flex items-center justify-center rounded-xl border-4 border-primary/40 bg-background shadow-lg overflow-hidden">
										{images.length > 0 ? (
											<img src={images[slideIdx]} alt={`news-image-${slideIdx+1}`} className="max-h-full max-w-full object-contain" />
										) : (
											<span className="text-muted-foreground text-lg font-semibold">No Images</span>
										)}
									</div>
									{images.length > 0 && (
										<div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
											{images.map((_, idx) => (
												<button
													key={idx}
													className={`w-3 h-3 rounded-full border ${slideIdx === idx ? 'bg-blue-500' : 'bg-muted'}`}
													style={{ outline: 'none' }}
													onClick={() => setSlideIdx(idx)}
													aria-label={`Go to image ${idx+1}`}
												/>
											))}
										</div>
									)}
									{images.length > 1 && (
										<>
											<button
												className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full p-1 border shadow"
												onClick={() => setSlideIdx((slideIdx - 1 + images.length) % images.length)}
												aria-label="Previous image"
											>
												<ChevronLeft className="w-5 h-5" />
											</button>
											<button
												className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full p-1 border shadow"
												onClick={() => setSlideIdx((slideIdx + 1) % images.length)}
												aria-label="Next image"
											>
												<ChevronRight className="w-5 h-5" />
											</button>
										</>
									)}
								</div>
							);
						})()}
					</div>
				</div>
				<div className="space-y-2">
					<div className="font-semibold">Description:</div>
					<div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: detailItem.description }} />
				</div>
			</div>
		)}
	</DialogContent>
</Dialog>

									{/* Dialog for Add/Edit News - Improved Design */}
									<Dialog open={openDialog} onOpenChange={setOpenDialog}>
										<DialogContent className="max-w-2xl w-full p-8 md:p-10 bg-background/90 rounded-xl shadow-xl overflow-y-auto" style={{ maxHeight: 'calc(100vh - 64px)' }}>
											<DialogHeader>
												<div className="flex items-center gap-3 mb-2">
													<FileText className="w-7 h-7 text-blue-600" />
													<DialogTitle className="text-2xl font-extrabold text-blue-700 tracking-tight">{editMode ? "Edit News" : "Add News"}</DialogTitle>
												</div>
											</DialogHeader>
											<form onSubmit={handleSubmit} className="space-y-8">
												<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
													<div className="space-y-6">
														<div className="space-y-2">
															<label className="block text-base font-semibold text-foreground">Title</label>
															<Input name="title" placeholder="Title" defaultValue={selected?.title || ""} required className="w-full" />
														</div>
														<div className="flex gap-4">
															<div className="flex-1 space-y-2">
																<label className="block text-base font-semibold text-foreground">Date</label>
																<Input name="date" type="date" placeholder="Date" defaultValue={selected?.date || ""} required className="w-full" />
															</div>
															<div className="flex-1 space-y-2">
																<label className="block text-base font-semibold text-foreground">Time</label>
																<Input name="time" placeholder="Time" defaultValue={selected?.time || ""} required className="w-full" />
															</div>
														</div>
														<div className="space-y-2">
															<label className="block text-base font-semibold text-foreground">Category</label>
															<Input name="category" placeholder="Category" defaultValue={selected?.category || ""} required className="w-full" />
														</div>
														<div className="space-y-2">
															<label className="block text-base font-semibold text-foreground">Location</label>
															<Input name="location" placeholder="Location" defaultValue={selected?.location || ""} required className="w-full" />
														</div>
														<div className="space-y-2">
															<label className="block text-base font-semibold text-foreground">Organizer</label>
															<Input name="organizer" placeholder="Organizer" defaultValue={selected?.organizer || ""} required className="w-full" />
														</div>
														<div className="space-y-2">
															<label className="block text-base font-semibold text-foreground">Attendees</label>
															<Input name="attendees" type="number" min="1" placeholder="Attendees" defaultValue={selected?.attendees || ""} required className="w-full" />
														</div>
													</div>
													<div className="space-y-6">
														<div className="grid grid-cols-1 gap-4 p-4 bg-muted/40 rounded-lg border">
															<label className="block text-sm font-medium text-muted-foreground">Image 1</label>
															<Input name="image_1" type="file" accept="image/*" className="w-full" />
															<label className="block text-sm font-medium text-muted-foreground">Image 2</label>
															<Input name="image_2" type="file" accept="image/*" className="w-full" />
															<label className="block text-sm font-medium text-muted-foreground">Image 3</label>
															<Input name="image_3" type="file" accept="image/*" className="w-full" />
															<label className="block text-sm font-medium text-muted-foreground">Image 4</label>
															<Input name="image_4" type="file" accept="image/*" className="w-full" />
														</div>
													</div>
												</div>
												<div className="col-span-1 md:col-span-2 space-y-2">
													<label className="block text-base font-semibold text-foreground">Description</label>
													<div className="w-full">
														<TiptapEditor value={richDescription} onChange={setRichDescription} />
													</div>
												</div>
												<DialogFooter>
													<Button type="submit" className="w-full text-base font-semibold py-3" disabled={isSubmitting}>
														{isSubmitting ? "In Process, Waiting ..." : (editMode ? "Update" : "Add")}
													</Button>
												</DialogFooter>
											</form>
										</DialogContent>
									</Dialog>
					</div>
				</main>
			</div>
			{/* Mobile Navigation */}
			<nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
				<div className="flex justify-around items-center p-2 px-1">
					{menuConfig.map(item => (
						<div key={item.key} className="relative flex flex-col items-center">
							<Button
								variant="ghost"
								size="icon"
								className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-muted rounded-lg transition-colors"
								onClick={() => {
									if (item.submenu) {
										handleMobileMenuToggle(item.key)
									} else {
										window.location.href = item.href
									}
								}}
							>
								<item.icon className="h-5 w-5" />
								<span className="text-xs flex items-center">{item.title}</span>
							</Button>
							{/* Mobile Submenu animation */}
							{item.submenu && mobileOpenMenus[item.key] && (
								<div
									className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 transition-all duration-300 ${mobileOpenMenus[item.key] ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
									style={{background: 'none'}}
								>
									{item.submenu.map(sub => (
										<button
											key={sub.key}
											className="bg-background border border-border rounded-full px-5 py-2 shadow-md text-sm flex items-center gap-2 mb-1 active:bg-muted hover:bg-muted transition-colors"
											onClick={() => {
												setMobileOpenMenus(prev => ({ ...prev, [item.key]: false }))
												window.location.href = sub.href
											}}
										>
											{sub.title}
										</button>
									))}
									<button
										className="mt-2 bg-background border border-border rounded-full p-2 shadow-sm flex items-center justify-center"
										style={{width: 36, height: 36}}
										onClick={() => setMobileOpenMenus(prev => ({ ...prev, [item.key]: false }))}
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
			{/* Footer */}
			<footer className="hidden md:block mt-auto p-6 text-center text-xs text-muted-foreground border-t border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative z-10">
				<p>© 2025 PT.YONGJIN JAVASUKA GARMENT. All rights reserved.</p>
				<p>⚡ Powered & Created By Garyudo</p>
			</footer>
		</div>
	);
}