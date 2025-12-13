"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"
import {
    Scale, FileText, Calendar, Clock, User, Mail, Phone, Building,
    Loader2, AlertCircle, ChevronRight, LogOut, Briefcase
} from "lucide-react"

interface CasoCliente {
    id: number
    title: string
    description: string | null
    practice_area: string | null
    status: string | null
    next_hearing: string | null
    file_number: string | null
    responsible_lawyer: string | null
    created_at: string | null
    updated_at: string | null
}

interface ClienteInfo {
    id: number
    nombre: string
    email: string | null
    telefono: string | null
    direccion: string | null
    persona_contacto: string | null
    tipo_cliente: string | null
    activo: boolean
}

export default function PortalClientePage() {
    const { usuario, logout, loading: authLoading } = useAuth()
    const [clienteInfo, setClienteInfo] = useState<ClienteInfo | null>(null)
    const [casos, setCasos] = useState<CasoCliente[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedCaso, setSelectedCaso] = useState<CasoCliente | null>(null)

    // Cargar información del cliente y sus casos
    useEffect(() => {
        const fetchData = async () => {
            if (!usuario?.cliente_id && !usuario) return

            setLoading(true)
            setError(null)

            try {
                // Buscar cliente por el email del usuario si no hay cliente_id directo
                let clienteId = usuario?.cliente_id

                if (!clienteId && usuario?.email) {
                    // Buscar el cliente por email
                    const clienteResponse = await fetch(`/api/clientes?email=${encodeURIComponent(usuario.email)}`)
                    const clienteResult = await clienteResponse.json()

                    if (clienteResult.data && clienteResult.data.length > 0) {
                        clienteId = clienteResult.data[0].id
                        setClienteInfo(clienteResult.data[0])
                    }
                } else if (clienteId) {
                    // Cargar información del cliente directamente
                    const clienteResponse = await fetch(`/api/clientes/${clienteId}`)
                    const clienteResult = await clienteResponse.json()
                    if (clienteResult.data) {
                        setClienteInfo(clienteResult.data)
                    }
                }

                // Cargar casos del cliente (buscamos por nombre del cliente)
                if (clienteId || (usuario?.nombre_completo)) {
                    const casosResponse = await fetch("/api/casos")
                    const casosResult = await casosResponse.json()

                    if (casosResult.data) {
                        // Filtrar casos que pertenecen a este cliente
                        const clienteNombre = clienteInfo?.nombre || usuario?.nombre_completo
                        const casosFiltrados = casosResult.data.filter((caso: CasoCliente & { client_name?: string }) => {
                            // Comparar por nombre del cliente (case insensitive)
                            if (clienteNombre && caso.client_name) {
                                return caso.client_name.toLowerCase().includes(clienteNombre.toLowerCase()) ||
                                    clienteNombre.toLowerCase().includes(caso.client_name.toLowerCase())
                            }
                            return false
                        })
                        setCasos(casosFiltrados)
                    }
                }
            } catch (err) {
                console.error("Error fetching data:", err)
                setError("Error al cargar la información")
            } finally {
                setLoading(false)
            }
        }

        if (!authLoading) {
            fetchData()
        }
    }, [usuario, authLoading])

    // Formatear fecha
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Sin fecha"
        const date = dateString.includes("T")
            ? new Date(dateString)
            : new Date(dateString + "T12:00:00")
        return date.toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
    }

    // Obtener color y label del estado
    const getStatusInfo = (status: string | null) => {
        const statusMap: Record<string, { color: string; label: string }> = {
            "inicio": { color: "bg-blue-100 text-blue-700", label: "Inicio" },
            "pruebas": { color: "bg-yellow-100 text-yellow-700", label: "En Pruebas" },
            "alegatos": { color: "bg-orange-100 text-orange-700", label: "Alegatos" },
            "sentencia": { color: "bg-green-100 text-green-700", label: "Sentencia" },
            "ejecucion": { color: "bg-purple-100 text-purple-700", label: "En Ejecución" },
            "suspendido": { color: "bg-red-100 text-red-700", label: "Suspendido" },
        }
        return statusMap[status || ""] || { color: "bg-gray-100 text-gray-700", label: status || "En Proceso" }
    }

    // Obtener iniciales
    const getInitials = (name: string | null) => {
        if (!name) return "C"
        return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    }

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
                    <p className="text-gray-500">Cargando tu información...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            {/* Header del Portal */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                            <Scale className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-semibold text-gray-900">Portal del Cliente</h1>
                            <p className="text-sm text-gray-500">LegalTech</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="font-medium text-gray-900">{usuario?.nombre_completo || usuario?.username}</p>
                            <p className="text-sm text-gray-500">{usuario?.email}</p>
                        </div>
                        <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-purple-100 text-purple-700 font-medium">
                                {getInitials(usuario?.nombre_completo || usuario?.username || null)}
                            </AvatarFallback>
                        </Avatar>
                        <Button variant="ghost" size="icon" onClick={logout} className="text-gray-500 hover:text-red-600">
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Contenido Principal */}
            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Columna Izquierda - Información del Cliente */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Tarjeta de Bienvenida */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="bg-gradient-to-br from-purple-600 to-blue-600 text-white border-0">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                            <User className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">¡Bienvenido!</h2>
                                            <p className="text-white/80">{clienteInfo?.nombre || usuario?.nombre_completo}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-6">
                                        <div className="bg-white/10 rounded-lg p-3 text-center">
                                            <p className="text-3xl font-bold">{casos.length}</p>
                                            <p className="text-sm text-white/80">Casos Activos</p>
                                        </div>
                                        <div className="bg-white/10 rounded-lg p-3 text-center">
                                            <p className="text-3xl font-bold">
                                                {casos.filter(c => c.next_hearing).length}
                                            </p>
                                            <p className="text-sm text-white/80">Próximas Audiencias</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Datos de Contacto */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Mis Datos</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Correo Electrónico</p>
                                            <p className="text-sm text-gray-900">{clienteInfo?.email || usuario?.email || "No registrado"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Teléfono</p>
                                            <p className="text-sm text-gray-900">{clienteInfo?.telefono || "No registrado"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Building className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Dirección</p>
                                            <p className="text-sm text-gray-900">{clienteInfo?.direccion || "No registrada"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <User className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Contacto</p>
                                            <p className="text-sm text-gray-900">{clienteInfo?.persona_contacto || "No registrado"}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Próximas Audiencias */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-amber-500" />
                                        Próximas Audiencias
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {casos.filter(c => c.next_hearing).length === 0 ? (
                                        <p className="text-sm text-gray-500 text-center py-4">
                                            No hay audiencias programadas
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {casos
                                                .filter(c => c.next_hearing)
                                                .sort((a, b) => new Date(a.next_hearing!).getTime() - new Date(b.next_hearing!).getTime())
                                                .slice(0, 3)
                                                .map(caso => (
                                                    <div key={caso.id} className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                                                        <p className="font-medium text-amber-900 text-sm">{caso.title}</p>
                                                        <p className="text-xs text-amber-700 mt-1 flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {formatDate(caso.next_hearing)}
                                                        </p>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Columna Derecha - Lista de Casos */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                        >
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Briefcase className="w-5 h-5 text-purple-600" />
                                        Mis Casos Legales
                                    </CardTitle>
                                    <CardDescription>
                                        Consulta el estado y detalles de tus casos
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {casos.length === 0 ? (
                                        <div className="text-center py-12">
                                            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500">No tienes casos registrados</p>
                                            <p className="text-sm text-gray-400 mt-1">
                                                Contacta a tu abogado para más información
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {casos.map((caso, index) => (
                                                <motion.div
                                                    key={caso.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                                    className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedCaso?.id === caso.id
                                                            ? "border-purple-300 bg-purple-50"
                                                            : "border-gray-200 hover:border-purple-200 hover:bg-gray-50"
                                                        }`}
                                                    onClick={() => setSelectedCaso(selectedCaso?.id === caso.id ? null : caso)}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="font-medium text-gray-900">{caso.title}</h3>
                                                                <Badge className={getStatusInfo(caso.status).color}>
                                                                    {getStatusInfo(caso.status).label}
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                                <span className="flex items-center gap-1">
                                                                    <FileText className="w-4 h-4" />
                                                                    {caso.file_number || "Sin expediente"}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Scale className="w-4 h-4" />
                                                                    {caso.practice_area || "General"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${selectedCaso?.id === caso.id ? "rotate-90" : ""
                                                            }`} />
                                                    </div>

                                                    {/* Detalles expandidos */}
                                                    {selectedCaso?.id === caso.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="mt-4 pt-4 border-t border-gray-200"
                                                        >
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <p className="text-xs text-gray-500">Abogado Responsable</p>
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {caso.responsible_lawyer || "No asignado"}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-gray-500">Próxima Audiencia</p>
                                                                    <p className={`text-sm font-medium ${caso.next_hearing ? "text-amber-600" : "text-gray-400"}`}>
                                                                        {caso.next_hearing ? formatDate(caso.next_hearing) : "Sin programar"}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-gray-500">Fecha de Inicio</p>
                                                                    <p className="text-sm text-gray-900">
                                                                        {formatDate(caso.created_at)}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-gray-500">Última Actualización</p>
                                                                    <p className="text-sm text-gray-900">
                                                                        {formatDate(caso.updated_at)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            {caso.description && (
                                                                <div className="mt-4">
                                                                    <p className="text-xs text-gray-500">Descripción</p>
                                                                    <p className="text-sm text-gray-700 mt-1">{caso.description}</p>
                                                                </div>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>

                {/* Footer informativo */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>¿Tienes dudas sobre tu caso? Contacta a tu abogado asignado.</p>
                    <p className="mt-1">© 2025 LegalTech - Portal del Cliente</p>
                </div>
            </main>
        </div>
    )
}
