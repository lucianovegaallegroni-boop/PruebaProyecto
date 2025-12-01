"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Workflow, UserCircle, BarChart3, Database, Users, Settings } from "lucide-react";

const navItems = [
    { href: "/", label: "Casos", icon: Home },
    { href: "/workflows", label: "Trabajos", icon: Workflow },
    { href: "/clientes", label: "Clientes", icon: UserCircle },
    { href: "/analytics", label: "Análisis", icon: BarChart3 },
    { href: "/templates", label: "Plantillas", icon: Database },
    { href: "/equipo", label: "Equipo", icon: Users },
    { href: "/settings", label: "Configuración", icon: Settings },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed top-16 left-0 right-0 z-40 flex justify-around items-center bg-white border-b border-gray-200 px-2 py-3 md:hidden overflow-x-auto">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center justify-center min-w-[60px] text-xs transition-colors",
                            isActive
                                ? "text-purple-600 font-medium"
                                : "text-gray-600 hover:text-gray-900"
                        )}
                    >
                        <item.icon className={cn("w-5 h-5 mb-1", isActive && "text-purple-600")} />
                        <span className="text-[10px] leading-tight text-center">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
