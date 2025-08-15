"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLast, ChevronFirst, LogOut, ArrowLeft, X, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

// Enhanced menu config: can rename menu/submenu without affecting animation
const menuConfig = [
	{
		key: "dashboard",
		title: "Dashboard",
		icon: FileText,
		href: "/user/compliance/"
	},
	{
		key: "Content",
		title: "Content",
		icon: FileText,
		href: "/user/compliance/content/#",
		submenu: [
			{ key: "news", title: "news content", href: "/user/compliance/content/news/" },
			{ key: "careers", title: "careers content", href: "/user/compliance/content/careers/" }
		]
	},
	{
		key: "contactus",
		title: "Contact Us",
		icon: FileText,
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
	}, [])

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
						<h1 className="text-lg md:text-3xl font-bold tracking-tight text-foreground">Still on Development</h1>
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
						<h2 className="text-xl md:text-3xl font-bold tracking-tight mb-6">Still on Development</h2>
						{/* ...existing code... */}
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
	)
}
