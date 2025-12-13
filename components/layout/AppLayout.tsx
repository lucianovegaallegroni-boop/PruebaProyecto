"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

// Rutas que no necesitan layout (sidebar/header)
const NO_LAYOUT_ROUTES = ["/login", "/register", "/forgot-password"];

// Rutas que tienen su propio layout (portal de cliente)
const CUSTOM_LAYOUT_ROUTES = ["/portal"];

function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { loading, isAuthenticated, isCliente } = useAuth();

    const isNoLayoutRoute = NO_LAYOUT_ROUTES.some(route => pathname?.startsWith(route));
    const isCustomLayoutRoute = CUSTOM_LAYOUT_ROUTES.some(route => pathname?.startsWith(route));

    // Si es una ruta sin layout (login, etc), mostrar solo el contenido
    if (isNoLayoutRoute) {
        return <>{children}</>;
    }

    // Si es el portal del cliente, mostrar solo el contenido (tiene su propio layout)
    if (isCustomLayoutRoute || isCliente) {
        if (loading) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
                        <p className="text-gray-500">Cargando...</p>
                    </div>
                </div>
            );
        }

        if (!isAuthenticated) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
                        <p className="text-gray-500">Redirigiendo...</p>
                    </div>
                </div>
            );
        }

        // El portal del cliente tiene su propio header/layout
        return <>{children}</>;
    }

    // Mostrar loading mientras verifica la sesión
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
                    <p className="text-gray-500">Cargando...</p>
                </div>
            </div>
        );
    }

    // Si no está autenticado y no es ruta pública, el AuthContext redirigirá
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
                    <p className="text-gray-500">Redirigiendo...</p>
                </div>
            </div>
        );
    }

    // Layout normal con sidebar y header (solo para admin y empleados)
    return (
        <>
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </>
    );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
    );
}
