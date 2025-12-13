"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Scale, Eye, EyeOff, Loader2, AlertCircle, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const { login, error: authError, isAuthenticated, loading, usuario } = useAuth();
    const router = useRouter();

    // Redirigir si ya está autenticado
    useEffect(() => {
        if (isAuthenticated && !loading && usuario) {
            // Redirigir según el rol
            if (usuario.rol?.nombre === "cliente") {
                router.push("/portal");
            } else {
                router.push("/");
            }
        }
    }, [isAuthenticated, loading, router, usuario]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        // Validaciones
        if (!username.trim()) {
            setLocalError("El nombre de usuario es obligatorio");
            return;
        }

        if (!password) {
            setLocalError("La contraseña es obligatoria");
            return;
        }

        setIsSubmitting(true);

        const success = await login(username, password);

        if (success) {
            // La redirección se maneja en el useEffect cuando cambia isAuthenticated
        }

        setIsSubmitting(false);
    };

    // Si está cargando la sesión inicial, mostrar loading
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
                    <p className="text-gray-500">Verificando sesión...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <Card className="border-gray-200 shadow-xl">
                    <CardHeader className="text-center space-y-4 pb-2">
                        {/* Logo */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="mx-auto"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center shadow-lg">
                                <Scale className="w-8 h-8 text-white" />
                            </div>
                        </motion.div>

                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-900">
                                Bienvenido
                            </CardTitle>
                            <CardDescription className="text-gray-600 mt-2">
                                Ingresa tus credenciales para acceder al sistema
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Mostrar errores */}
                            {(localError || authError) && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-3"
                                >
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                    <p className="text-sm text-red-600">{localError || authError}</p>
                                </motion.div>
                            )}

                            {/* Username */}
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-gray-700">
                                    Usuario
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="Ingresa tu usuario"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="pl-11 h-12"
                                        disabled={isSubmitting}
                                        autoComplete="username"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-gray-700">
                                        Contraseña
                                    </Label>
                                    <button
                                        type="button"
                                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </button>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Ingresa tu contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-11 pr-11 h-12"
                                        disabled={isSubmitting}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium text-base"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Iniciando sesión...
                                    </>
                                ) : (
                                    "Iniciar Sesión"
                                )}
                            </Button>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <p className="text-center text-sm text-gray-500">
                                Sistema de Gestión Legal
                            </p>
                            <p className="text-center text-xs text-gray-400 mt-1">
                                © 2025 LawFirm. Todos los derechos reservados.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Demo credentials hint */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm"
                >
                    <p className="text-xs text-gray-500 text-center">
                        <span className="font-medium">Credenciales de prueba:</span>
                        <br />
                        Usuario: <code className="bg-gray-100 px-1.5 py-0.5 rounded">admin</code>
                        {" | "}
                        Contraseña: <code className="bg-gray-100 px-1.5 py-0.5 rounded">admin123</code>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
