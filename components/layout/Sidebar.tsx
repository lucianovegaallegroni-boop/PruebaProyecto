"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ArrowRight, Home, Workflow, BarChart3, Database, Users, Settings, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const sidebarItems = [
    { href: "/", label: "Casos", icon: Home },
    { href: "/workflows", label: "Trabajos", icon: Workflow },
    { href: "/clientes", label: "Clientes", icon: UserCircle },
    { href: "/analytics", label: "Análisis", icon: BarChart3 },
    { href: "/templates", label: "Plantillas", icon: Database },
    { href: "/equipo", label: "Equipo", icon: Users },
    { href: "/settings", label: "Configuración", icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    const toggleSidebar = () => setIsOpen(!isOpen)
    const closeSidebar = () => setIsOpen(false)

    return (
        <>
            {/* Hamburger button for mobile */}
            <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 left-4 z-50 md:hidden"
                onClick={toggleSidebar}
                aria-label="Toggle navigation"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "w-60 border-r border-gray-200 bg-white overflow-y-auto transition-transform duration-300 ease-in-out",
                    // Desktop: sticky sidebar
                    "md:h-[calc(100vh-4rem)] md:sticky md:top-16",
                    // Mobile: fixed full-screen sidebar
                    isOpen
                        ? "fixed inset-0 z-50 h-screen"
                        : "fixed inset-y-0 left-0 -translate-x-full md:relative md:translate-x-0"
                )}
            >
                <div className="p-4">
                    {/* Close button inside sidebar for mobile */}
                    <div className="flex justify-end md:hidden mb-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={closeSidebar}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input placeholder="Buscar..." className="pl-10 bg-gray-50 border-gray-200 text-sm" />
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 w-6 h-6"
                        >
                            <ArrowRight className="w-3 h-3" />
                        </Button>
                    </div>

                    <nav className="space-y-1">
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={closeSidebar}
                                    className={cn(
                                        "flex items-center w-full justify-start px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        isActive ? "bg-purple-50 text-purple-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <item.icon className="w-4 h-4 mr-3" />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            </aside>
        </>
    )
}
