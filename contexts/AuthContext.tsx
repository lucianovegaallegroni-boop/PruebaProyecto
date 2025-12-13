"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

// Tipos
interface Rol {
    id: number;
    nombre: string;
    permisos?: Record<string, boolean>;
}

interface Usuario {
    id: number;
    username: string;
    email: string;
    nombre_completo: string | null;
    verificado: boolean;
    rol: Rol;
    cliente_id?: number | null;
    empleado_id?: number | null;
}

interface AuthContextType {
    usuario: Usuario | null;
    loading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    isCliente: boolean;
    isAdmin: boolean;
    isEmpleado: boolean;
}

// Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Rutas públicas que no requieren autenticación
const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];

// Rutas permitidas para clientes (solo el portal)
const CLIENT_ROUTES = ["/portal"];

// Rutas del sistema (para admin y empleados)
const SYSTEM_ROUTES = ["/", "/casos", "/clientes", "/equipo", "/documentos", "/calendario", "/settings"];

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    // Helpers para verificar rol
    const isCliente = usuario?.rol?.nombre === "cliente";
    const isAdmin = usuario?.rol?.nombre === "administrador";
    const isEmpleado = usuario?.rol?.nombre === "empleado";

    // Verificar si hay una sesión guardada al cargar
    useEffect(() => {
        const checkSession = () => {
            try {
                const savedUser = localStorage.getItem("usuario");
                if (savedUser) {
                    const parsed = JSON.parse(savedUser);
                    setUsuario(parsed);
                }
            } catch (err) {
                console.error("Error loading session:", err);
                localStorage.removeItem("usuario");
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    // Redirigir según el rol del usuario
    useEffect(() => {
        if (!loading && pathname) {
            const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
            const isClientRoute = CLIENT_ROUTES.some(route => pathname.startsWith(route));
            const isSystemRoute = SYSTEM_ROUTES.some(route =>
                pathname === route || pathname.startsWith(route + "/")
            );

            // Si no está autenticado
            if (!usuario) {
                if (!isPublicRoute) {
                    router.push("/login");
                }
                return;
            }

            // Si está autenticado
            const userRol = usuario.rol?.nombre;

            // Cliente intentando acceder a rutas del sistema -> redirigir al portal
            if (userRol === "cliente") {
                if (!isClientRoute && !isPublicRoute) {
                    router.push("/portal");
                }
            }
            // Admin o Empleado intentando acceder al portal de cliente -> redirigir al dashboard
            else if (userRol === "administrador" || userRol === "empleado") {
                if (isClientRoute) {
                    router.push("/");
                }
                // Si está en login, redirigir al dashboard
                if (pathname === "/login") {
                    router.push("/");
                }
            }
        }
    }, [usuario, loading, pathname, router]);

    // Función de login
    const login = async (username: string, password: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || "Error al iniciar sesión");
                setLoading(false);
                return false;
            }

            // Guardar usuario en estado y localStorage
            setUsuario(result.data);
            localStorage.setItem("usuario", JSON.stringify(result.data));
            setLoading(false);

            return true;
        } catch (err) {
            console.error("Login error:", err);
            setError("Error de conexión. Intente nuevamente.");
            setLoading(false);
            return false;
        }
    };

    // Función de logout
    const logout = () => {
        setUsuario(null);
        localStorage.removeItem("usuario");
        router.push("/login");
    };

    const value: AuthContextType = {
        usuario,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!usuario,
        isCliente,
        isAdmin,
        isEmpleado,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook para usar el contexto
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
}
