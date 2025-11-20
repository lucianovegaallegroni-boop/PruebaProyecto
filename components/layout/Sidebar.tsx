"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Search,
    ArrowRight,
    Home,
    Workflow,
    BarChart3,
    Database,
    Users,
    Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const sidebarItems = [
    { href: "/", label: "Resumen", icon: Home },
    { href: "/workflows", label: "Casos", icon: Workflow },
    { href: "/analytics", label: "Análisis", icon: BarChart3 },
    { href: "/templates", label: "Plantillas", icon: Database },
    { href: "/team", label: "Equipo", icon: Users },
    { href: "/settings", label: "Configuración", icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-60 border-r border-gray-200 bg-white h-[calc(100vh-4rem)] overflow-y-auto sticky top-16">
            <div className="p-4">
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
                                className={cn(
                                    "flex items-center w-full justify-start px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-purple-50 text-purple-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
    )
}
