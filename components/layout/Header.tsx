"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Search,
    Bell,
    Workflow,
    LogOut,
    User,
    Settings,
    HelpCircle,
    Menu,
    X,
    Home,
    Users,
    UserCircle,
    CheckSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"

const sidebarItems = [
    { href: "/", label: "Casos", icon: Home },
    { href: "/todos", label: "Tareas", icon: CheckSquare },
    { href: "/clientes", label: "Clientes", icon: UserCircle },
    { href: "/equipo", label: "Equipo", icon: Users },
    { href: "/settings", label: "Configuración", icon: Settings },
]

export function Header() {
    const { usuario, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Obtener iniciales del nombre
    const getInitials = (name: string | null) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    // Obtener color del rol
    const getRolBadge = (rolNombre: string) => {
        const colors: Record<string, string> = {
            administrador: "bg-red-100 text-red-700",
            empleado: "bg-blue-100 text-blue-700",
            cliente: "bg-green-100 text-green-700",
        };
        return colors[rolNombre] || "bg-gray-100 text-gray-700";
    };

    return (
        <header className="h-16 border-b border-gray-200 bg-white px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
            {/* Left Section - Logo + Mobile Menu */}
            <div className="flex items-center gap-3">
                {/* Mobile Menu Button */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72 p-0">
                        <SheetHeader className="p-4 border-b">
                            <SheetTitle className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                                    <Workflow className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-semibold text-gray-900">LegalTech</span>
                            </SheetTitle>
                        </SheetHeader>
                        <nav className="p-4 space-y-1">
                            {sidebarItems.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center w-full justify-start px-3 py-3 rounded-md text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-purple-50 text-purple-700"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        )}
                                    >
                                        <item.icon className="w-5 h-5 mr-3" />
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </nav>
                        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    logout();
                                }}
                            >
                                <LogOut className="w-5 h-5 mr-3" />
                                Cerrar Sesión
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                        <Workflow className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900 hidden sm:block">LegalTech</span>
                </div>
            </div>

            {/* Center Section - Search (Hidden on mobile) */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Buscar casos, documentos..."
                        className="pl-10 bg-gray-50 border-gray-200 focus:bg-white w-full"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Search button for mobile */}
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Search className="w-5 h-5" />
                </Button>

                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                                <AvatarFallback className="bg-purple-100 text-purple-700 font-medium">
                                    {getInitials(usuario?.nombre_completo || usuario?.username || null)}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                        <div className="px-2 py-3">
                            <p className="font-medium text-gray-900">
                                {usuario?.nombre_completo || usuario?.username}
                            </p>
                            <p className="text-sm text-gray-500">{usuario?.email}</p>
                            {usuario?.rol && (
                                <Badge
                                    variant="secondary"
                                    className={`mt-2 capitalize ${getRolBadge(usuario.rol.nombre)}`}
                                >
                                    {usuario.rol.nombre}
                                </Badge>
                            )}
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="w-4 h-4 mr-2" />
                            Mi Perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="w-4 h-4 mr-2" />
                            Configuración
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <HelpCircle className="w-4 h-4 mr-2" />
                            Soporte
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={logout}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Cerrar Sesión
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
