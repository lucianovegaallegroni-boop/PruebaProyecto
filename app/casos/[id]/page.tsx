"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ArrowLeft, Calendar, FileText, Scale, Users, AlertCircle, DollarSign,
    Clock, Loader2, Building, MapPin, Gavel, Phone, Mail, User,
    Pencil, Plus, Trash2, Download, Upload, X, Check, UserPlus
} from "lucide-react"

// Interfaces
interface CaseData {
    id: number
    title: string
    description: string | null
    client_name: string
    contact_person: string | null
    client_email: string | null
    client_phone: string | null
    practice_area: string | null
    case_type: string | null
    opponent: string | null
    opponent_lawyer: string | null
    file_number: string | null
    court: string | null
    jurisdiction: string | null
    judge: string | null
    status: string | null
    next_hearing: string | null
    amount: number | null
    fees: string | null
    responsible_lawyer: string | null
    assistants: string | null
    strategy: string | null
    risks: string | null
    created_at: string | null
    updated_at: string | null
    start_date: string | null
    end_date: string | null
    observaciones: string | null
}

interface Empleado {
    id: number
    nombre: string
    email: string | null
    rol: string
    especialidad: string | null
}

interface EmpleadoAsignado {
    id: number
    rol_en_caso: string
    fecha_asignacion: string
    empleado: Empleado
}

interface Documento {
    id: number
    nombre: string
    nombre_archivo: string
    tipo_documento: string
    mime_type: string | null
    tamano_bytes: number
    storage_path: string
    created_at: string
}

export default function CaseDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const id = Array.isArray(params.id) ? params.id[0] : params.id
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Estados principales
    const [activeTab, setActiveTab] = useState("procedural")
    const [caseData, setCaseData] = useState<CaseData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    // Estados para modales
    const [showResumenModal, setShowResumenModal] = useState(false)
    const [showClienteModal, setShowClienteModal] = useState(false)
    const [showProcesalModal, setShowProcesalModal] = useState(false)
    const [showEstrategiaModal, setShowEstrategiaModal] = useState(false)
    const [showEconomicoModal, setShowEconomicoModal] = useState(false)
    const [showEquipoModal, setShowEquipoModal] = useState(false)
    const [showDocumentoModal, setShowDocumentoModal] = useState(false)

    // Estados para equipo y documentos
    const [empleadosAsignados, setEmpleadosAsignados] = useState<EmpleadoAsignado[]>([])
    const [empleadosDisponibles, setEmpleadosDisponibles] = useState<Empleado[]>([])
    const [documentos, setDocumentos] = useState<Documento[]>([])
    const [loadingEmpleados, setLoadingEmpleados] = useState(false)
    const [loadingDocs, setLoadingDocs] = useState(false)
    const [uploadingDoc, setUploadingDoc] = useState(false)

    // Estados para formularios
    const [formData, setFormData] = useState<Partial<CaseData>>({})
    const [nuevoDocumento, setNuevoDocumento] = useState({
        nombre: "",
        tipo_documento: "general",
        descripcion: "",
    })
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState("")
    const [rolEnCaso, setRolEnCaso] = useState("Asignado")

    // Cargar datos del caso
    const fetchCase = async () => {
        if (!id) return
        setLoading(true)
        setError(null)
        try {
            const response = await fetch(`/api/casos/${id}`)
            const result = await response.json()
            if (!response.ok) throw new Error(result.error || "Error al cargar el caso")
            setCaseData(result.data)
        } catch (err) {
            console.error("Error fetching case:", err)
            setError(err instanceof Error ? err.message : "Error desconocido")
        } finally {
            setLoading(false)
        }
    }

    // Cargar empleados asignados
    const fetchEmpleadosAsignados = async () => {
        if (!id) return
        try {
            const response = await fetch(`/api/casos/${id}/empleados`)
            const result = await response.json()
            if (response.ok) {
                setEmpleadosAsignados(result.data || [])
            }
        } catch (err) {
            console.error("Error fetching empleados asignados:", err)
        }
    }

    // Cargar todos los empleados
    const fetchEmpleadosDisponibles = async () => {
        setLoadingEmpleados(true)
        try {
            const response = await fetch("/api/empleados")
            const result = await response.json()
            if (response.ok) {
                setEmpleadosDisponibles(result.data || [])
            }
        } catch (err) {
            console.error("Error fetching empleados:", err)
        } finally {
            setLoadingEmpleados(false)
        }
    }

    // Cargar documentos
    const fetchDocumentos = async () => {
        if (!id) return
        setLoadingDocs(true)
        try {
            const response = await fetch(`/api/documentos?caso_id=${id}`)
            const result = await response.json()
            if (response.ok) {
                setDocumentos(result.data || [])
            }
        } catch (err) {
            console.error("Error fetching documentos:", err)
        } finally {
            setLoadingDocs(false)
        }
    }

    useEffect(() => {
        fetchCase()
        fetchEmpleadosAsignados()
        fetchDocumentos()
    }, [id])

    // Guardar cambios del caso
    const saveChanges = async (updates: Partial<CaseData>) => {
        if (!id) return
        setSaving(true)
        try {
            const response = await fetch(`/api/casos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            })
            const result = await response.json()
            if (!response.ok) throw new Error(result.error || "Error al guardar")
            setCaseData(result.data)
            return true
        } catch (err) {
            console.error("Error saving:", err)
            alert(err instanceof Error ? err.message : "Error al guardar")
            return false
        } finally {
            setSaving(false)
        }
    }

    // Asignar empleado
    const asignarEmpleado = async () => {
        if (!empleadoSeleccionado || !id) return
        try {
            const response = await fetch(`/api/casos/${id}/empleados`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    empleado_id: parseInt(empleadoSeleccionado),
                    rol_en_caso: rolEnCaso,
                }),
            })
            if (response.ok) {
                await fetchEmpleadosAsignados()
                setEmpleadoSeleccionado("")
                setRolEnCaso("Asignado")
            } else {
                const result = await response.json()
                alert(result.error || "Error al asignar")
            }
        } catch (err) {
            console.error("Error asignando:", err)
        }
    }

    // Desasignar empleado
    const desasignarEmpleado = async (empleadoId: number) => {
        if (!id) return
        if (!confirm("¿Desasignar este empleado del caso?")) return
        try {
            const response = await fetch(`/api/casos/${id}/empleados?empleado_id=${empleadoId}`, {
                method: "DELETE",
            })
            if (response.ok) {
                await fetchEmpleadosAsignados()
            }
        } catch (err) {
            console.error("Error desasignando:", err)
        }
    }

    // Subir documento
    const subirDocumento = async () => {
        if (!selectedFile || !nuevoDocumento.nombre) {
            alert("Selecciona un archivo y proporciona un nombre")
            return
        }
        setUploadingDoc(true)
        try {
            const formData = new FormData()
            formData.append("file", selectedFile)
            formData.append("nombre", nuevoDocumento.nombre)
            formData.append("tipo_documento", nuevoDocumento.tipo_documento)
            formData.append("descripcion", nuevoDocumento.descripcion)
            formData.append("caso_id", id as string)

            const response = await fetch("/api/documentos", {
                method: "POST",
                body: formData,
            })

            if (response.ok) {
                await fetchDocumentos()
                setShowDocumentoModal(false)
                setSelectedFile(null)
                setNuevoDocumento({ nombre: "", tipo_documento: "general", descripcion: "" })
            } else {
                const result = await response.json()
                alert(result.error || "Error al subir")
            }
        } catch (err) {
            console.error("Error subiendo:", err)
        } finally {
            setUploadingDoc(false)
        }
    }

    // Descargar documento
    const descargarDocumento = async (docId: number) => {
        try {
            const response = await fetch(`/api/documentos/${docId}?download=true`)
            const result = await response.json()
            if (result.download_url) {
                window.open(result.download_url, "_blank")
            }
        } catch (err) {
            console.error("Error descargando:", err)
        }
    }

    // Eliminar documento
    const eliminarDocumento = async (docId: number) => {
        if (!confirm("¿Eliminar este documento permanentemente?")) return
        try {
            const response = await fetch(`/api/documentos/${docId}`, { method: "DELETE" })
            if (response.ok) {
                await fetchDocumentos()
            }
        } catch (err) {
            console.error("Error eliminando:", err)
        }
    }

    // Helpers
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Sin fecha"
        // Parsear la fecha agregando T12:00:00 para evitar problemas de timezone
        const date = dateString.includes("T")
            ? new Date(dateString)
            : new Date(dateString + "T12:00:00")
        return date.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })
    }

    const formatAmount = (amount: number | null) => {
        if (!amount) return "No especificado"
        return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount)
    }

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B"
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
        return (bytes / 1048576).toFixed(1) + " MB"
    }

    const getStatusColor = (status: string | null) => {
        const colors: Record<string, string> = {
            "inicio": "bg-blue-100 text-blue-700",
            "pruebas": "bg-yellow-100 text-yellow-700",
            "alegatos": "bg-orange-100 text-orange-700",
            "sentencia": "bg-green-100 text-green-700",
            "ejecucion": "bg-purple-100 text-purple-700",
            "suspendido": "bg-red-100 text-red-700",
        }
        return colors[status || ""] || "bg-gray-100 text-gray-700"
    }

    const getStatusLabel = (status: string | null) => {
        const labels: Record<string, string> = {
            "inicio": "Inicio / Demanda",
            "pruebas": "Etapa Probatoria",
            "alegatos": "Alegatos",
            "sentencia": "Sentencia",
            "ejecucion": "Ejecución",
            "suspendido": "Suspendido",
        }
        return labels[status || ""] || status || "Sin estado"
    }

    // Componente de botón editar
    const EditButton = ({ onClick }: { onClick: () => void }) => (
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-purple-600" onClick={onClick}>
            <Pencil className="w-4 h-4" />
        </Button>
    )

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                    <p className="text-gray-500">Cargando detalles del caso...</p>
                </div>
            </div>
        )
    }

    if (error || !caseData) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4 text-center">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <h2 className="text-xl font-semibold text-gray-900">Error al cargar el caso</h2>
                    <p className="text-gray-500">{error || "Caso no encontrado"}</p>
                    <Button variant="outline" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{caseData.title}</h1>
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                        <span className="font-mono text-sm">#{caseData.id}</span>
                        <span>•</span>
                        <span>{caseData.client_name}</span>
                    </div>
                </div>
                <div className="ml-auto">
                    <Badge className={`${getStatusColor(caseData.status)} px-3 py-1 text-sm`}>
                        {getStatusLabel(caseData.status)}
                    </Badge>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="col-span-2 space-y-6">
                    {/* Resumen Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Resumen del Caso</CardTitle>
                            <EditButton onClick={() => {
                                setFormData({
                                    title: caseData.title,
                                    description: caseData.description,
                                    practice_area: caseData.practice_area,
                                    case_type: caseData.case_type,
                                    file_number: caseData.file_number,
                                    opponent: caseData.opponent,
                                    start_date: caseData.start_date,
                                })
                                setShowResumenModal(true)
                            }} />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-gray-700 leading-relaxed">
                                {caseData.description || "Sin descripción disponible"}
                            </p>
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="flex items-start gap-3">
                                    <Scale className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Área de Práctica</p>
                                        <p className="text-sm text-gray-600 capitalize">{caseData.practice_area || "No especificada"}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Expediente</p>
                                        <p className="text-sm text-gray-600">{caseData.file_number || "Sin número"}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Contraparte</p>
                                        <p className="text-sm text-gray-600">{caseData.opponent || "No especificada"}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Fecha Inicio</p>
                                        <p className="text-sm text-gray-600">{formatDate(caseData.start_date)}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tabs */}
                    <Tabs defaultValue="procedural" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-4 bg-gray-100/50 p-1">
                            {["procedural", "client", "strategy", "documents"].map((tab) => (
                                <TabsTrigger key={tab} value={tab} className="relative data-[state=active]:bg-transparent">
                                    <span className="relative z-10">
                                        {tab === "procedural" && "Info Procesal"}
                                        {tab === "client" && "Cliente"}
                                        {tab === "strategy" && "Estrategia"}
                                        {tab === "documents" && "Documentos"}
                                    </span>
                                    {activeTab === tab && (
                                        <motion.div layoutId="active-tab" className="absolute inset-0 bg-white rounded-md shadow-sm" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                                    )}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {/* Tab Procesal */}
                        <TabsContent value="procedural" className="mt-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Estado Procesal</CardTitle>
                                        <CardDescription>Detalles del juzgado y seguimiento</CardDescription>
                                    </div>
                                    <EditButton onClick={() => {
                                        setFormData({
                                            status: caseData.status,
                                            court: caseData.court,
                                            jurisdiction: caseData.jurisdiction,
                                            judge: caseData.judge,
                                            opponent_lawyer: caseData.opponent_lawyer,
                                            next_hearing: caseData.next_hearing,
                                        })
                                        setShowProcesalModal(true)
                                    }} />
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="flex items-start gap-3">
                                            <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Juzgado</p>
                                                <p className="text-base text-gray-900 mt-1">{caseData.court || "No especificado"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Próxima Audiencia</p>
                                                <p className="text-base text-amber-600 font-medium mt-1">{formatDate(caseData.next_hearing)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Jurisdicción</p>
                                                <p className="text-base text-gray-900 mt-1">{caseData.jurisdiction || "No especificada"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Gavel className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Juez</p>
                                                <p className="text-base text-gray-900 mt-1">{caseData.judge || "No especificado"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Abogado Contraparte</p>
                                                <p className="text-base text-gray-900 mt-1">{caseData.opponent_lawyer || "No especificado"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab Cliente */}
                        <TabsContent value="client" className="mt-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Información del Cliente</CardTitle>
                                        <CardDescription>Datos de contacto</CardDescription>
                                    </div>
                                    <EditButton onClick={() => {
                                        setFormData({
                                            client_name: caseData.client_name,
                                            contact_person: caseData.contact_person,
                                            client_email: caseData.client_email,
                                            client_phone: caseData.client_phone,
                                        })
                                        setShowClienteModal(true)
                                    }} />
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="flex items-start gap-3">
                                            <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Cliente / Empresa</p>
                                                <p className="text-base text-gray-900 mt-1">{caseData.client_name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Persona de Contacto</p>
                                                <p className="text-base text-gray-900 mt-1">{caseData.contact_person || "No especificado"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Correo</p>
                                                <p className="text-base text-gray-900 mt-1">{caseData.client_email || "No especificado"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Teléfono</p>
                                                <p className="text-base text-gray-900 mt-1">{caseData.client_phone || "No especificado"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab Estrategia */}
                        <TabsContent value="strategy" className="mt-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Estrategia y Riesgos</CardTitle>
                                    <EditButton onClick={() => {
                                        setFormData({
                                            strategy: caseData.strategy,
                                            risks: caseData.risks,
                                            observaciones: caseData.observaciones,
                                        })
                                        setShowEstrategiaModal(true)
                                    }} />
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {caseData.strategy && (
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4" />
                                                Estrategia Actual
                                            </h4>
                                            <p className="text-blue-800 text-sm">{caseData.strategy}</p>
                                        </div>
                                    )}
                                    {caseData.risks && (
                                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                                            <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4" />
                                                Riesgos Detectados
                                            </h4>
                                            <p className="text-red-800 text-sm">{caseData.risks}</p>
                                        </div>
                                    )}
                                    {caseData.observaciones && (
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <h4 className="font-semibold text-gray-900 mb-2">Observaciones</h4>
                                            <p className="text-gray-700 text-sm">{caseData.observaciones}</p>
                                        </div>
                                    )}
                                    {!caseData.strategy && !caseData.risks && !caseData.observaciones && (
                                        <div className="text-center py-8 text-gray-500">
                                            <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                            <p>No hay información de estrategia registrada</p>
                                            <Button variant="link" className="mt-2" onClick={() => setShowEstrategiaModal(true)}>
                                                Agregar estrategia
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab Documentos */}
                        <TabsContent value="documents" className="mt-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Documentación del Caso</CardTitle>
                                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowDocumentoModal(true)}>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Subir Documento
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {loadingDocs ? (
                                        <div className="flex justify-center py-8">
                                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                                        </div>
                                    ) : documentos.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                            <p>No hay documentos adjuntos</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {documentos.map((doc) => (
                                                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="w-8 h-8 text-purple-600" />
                                                        <div>
                                                            <p className="font-medium text-gray-900">{doc.nombre}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {doc.nombre_archivo} • {formatFileSize(doc.tamano_bytes)} • {formatDate(doc.created_at)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="text-xs">{doc.tipo_documento}</Badge>
                                                        <Button variant="ghost" size="icon" onClick={() => descargarDocumento(doc.id)}>
                                                            <Download className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => eliminarDocumento(doc.id)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Aspectos Económicos */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">Aspectos Económicos</CardTitle>
                            <EditButton onClick={() => {
                                setFormData({ amount: caseData.amount, fees: caseData.fees })
                                setShowEconomicoModal(true)
                            }} />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <DollarSign className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Cuantía</p>
                                        <p className="font-semibold text-gray-900">{formatAmount(caseData.amount)}</p>
                                    </div>
                                </div>
                            </div>
                            {caseData.fees && (
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Honorarios</p>
                                    <p className="text-sm text-gray-900">{caseData.fees}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Equipo Asignado */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">Equipo Asignado</CardTitle>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                                fetchEmpleadosDisponibles()
                                setShowEquipoModal(true)
                            }}>
                                <UserPlus className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {empleadosAsignados.length === 0 ? (
                                <div className="text-center py-4 text-gray-500 text-sm">
                                    No hay empleados asignados
                                </div>
                            ) : (
                                empleadosAsignados.map((asig) => (
                                    <div key={asig.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold uppercase">
                                                {asig.empleado.nombre.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{asig.empleado.nombre}</p>
                                                <p className="text-xs text-gray-500">{asig.rol_en_caso}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-600" onClick={() => desasignarEmpleado(asig.empleado.id)}>
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Fechas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Fechas Importantes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Creado</span>
                                <span className="text-gray-900">{formatDate(caseData.created_at)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Última actualización</span>
                                <span className="text-gray-900">{formatDate(caseData.updated_at)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Inicio del caso</span>
                                <span className="text-gray-900">{formatDate(caseData.start_date)}</span>
                            </div>
                            {caseData.next_hearing && (
                                <div className="flex justify-between text-sm pt-2 border-t">
                                    <span className="text-amber-600 font-medium">Próxima audiencia</span>
                                    <span className="text-amber-600 font-medium">{formatDate(caseData.next_hearing)}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* MODALES */}

            {/* Modal Resumen */}
            <Dialog open={showResumenModal} onOpenChange={setShowResumenModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Editar Resumen del Caso</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Título del Caso</Label>
                            <Input value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Descripción</Label>
                            <Textarea value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Área de Práctica</Label>
                                <Select value={formData.practice_area || ""} onValueChange={(v) => setFormData({ ...formData, practice_area: v })}>
                                    <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="civil">Civil</SelectItem>
                                        <SelectItem value="penal">Penal</SelectItem>
                                        <SelectItem value="laboral">Laboral</SelectItem>
                                        <SelectItem value="mercantil">Mercantil</SelectItem>
                                        <SelectItem value="administrativo">Administrativo</SelectItem>
                                        <SelectItem value="familiar">Familiar</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Expediente</Label>
                                <Input value={formData.file_number || ""} onChange={(e) => setFormData({ ...formData, file_number: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Contraparte</Label>
                                <Input value={formData.opponent || ""} onChange={(e) => setFormData({ ...formData, opponent: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Fecha de Inicio</Label>
                                <Input type="date" value={formData.start_date?.split("T")[0] || ""} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowResumenModal(false)}>Cancelar</Button>
                        <Button className="bg-purple-600 hover:bg-purple-700" disabled={saving} onClick={async () => {
                            const success = await saveChanges(formData)
                            if (success) setShowResumenModal(false)
                        }}>
                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                            Guardar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Cliente */}
            <Dialog open={showClienteModal} onOpenChange={setShowClienteModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Información del Cliente</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Cliente / Empresa</Label>
                            <Input value={formData.client_name || ""} onChange={(e) => setFormData({ ...formData, client_name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Persona de Contacto</Label>
                            <Input value={formData.contact_person || ""} onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Correo Electrónico</Label>
                            <Input type="email" value={formData.client_email || ""} onChange={(e) => setFormData({ ...formData, client_email: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Teléfono</Label>
                            <Input value={formData.client_phone || ""} onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowClienteModal(false)}>Cancelar</Button>
                        <Button className="bg-purple-600 hover:bg-purple-700" disabled={saving} onClick={async () => {
                            const success = await saveChanges(formData)
                            if (success) setShowClienteModal(false)
                        }}>
                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Guardar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Procesal */}
            <Dialog open={showProcesalModal} onOpenChange={setShowProcesalModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Editar Estado Procesal</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Estado</Label>
                                <Select value={formData.status || ""} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                                    <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="inicio">Inicio / Demanda</SelectItem>
                                        <SelectItem value="pruebas">Etapa Probatoria</SelectItem>
                                        <SelectItem value="alegatos">Alegatos</SelectItem>
                                        <SelectItem value="sentencia">Sentencia</SelectItem>
                                        <SelectItem value="ejecucion">Ejecución</SelectItem>
                                        <SelectItem value="suspendido">Suspendido</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Próxima Audiencia</Label>
                                <Input type="date" value={formData.next_hearing?.split("T")[0] || ""} onChange={(e) => setFormData({ ...formData, next_hearing: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Juzgado / Autoridad</Label>
                            <Input value={formData.court || ""} onChange={(e) => setFormData({ ...formData, court: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Jurisdicción</Label>
                                <Input value={formData.jurisdiction || ""} onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Juez / Magistrado</Label>
                                <Input value={formData.judge || ""} onChange={(e) => setFormData({ ...formData, judge: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Abogado Contraparte</Label>
                            <Input value={formData.opponent_lawyer || ""} onChange={(e) => setFormData({ ...formData, opponent_lawyer: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowProcesalModal(false)}>Cancelar</Button>
                        <Button className="bg-purple-600 hover:bg-purple-700" disabled={saving} onClick={async () => {
                            const success = await saveChanges(formData)
                            if (success) setShowProcesalModal(false)
                        }}>
                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Guardar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Estrategia */}
            <Dialog open={showEstrategiaModal} onOpenChange={setShowEstrategiaModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Editar Estrategia y Riesgos</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Estrategia</Label>
                            <Textarea value={formData.strategy || ""} onChange={(e) => setFormData({ ...formData, strategy: e.target.value })} rows={4} placeholder="Describe la estrategia legal..." />
                        </div>
                        <div className="space-y-2">
                            <Label>Riesgos</Label>
                            <Textarea value={formData.risks || ""} onChange={(e) => setFormData({ ...formData, risks: e.target.value })} rows={3} placeholder="Identifica los riesgos del caso..." />
                        </div>
                        <div className="space-y-2">
                            <Label>Observaciones</Label>
                            <Textarea value={formData.observaciones || ""} onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })} rows={3} placeholder="Notas adicionales..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEstrategiaModal(false)}>Cancelar</Button>
                        <Button className="bg-purple-600 hover:bg-purple-700" disabled={saving} onClick={async () => {
                            const success = await saveChanges(formData)
                            if (success) setShowEstrategiaModal(false)
                        }}>
                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Guardar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Económico */}
            <Dialog open={showEconomicoModal} onOpenChange={setShowEconomicoModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Aspectos Económicos</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Cuantía (MXN)</Label>
                            <Input type="number" value={formData.amount || ""} onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || null })} placeholder="0.00" />
                        </div>
                        <div className="space-y-2">
                            <Label>Honorarios Pactados</Label>
                            <Textarea value={formData.fees || ""} onChange={(e) => setFormData({ ...formData, fees: e.target.value })} rows={3} placeholder="Describe los honorarios..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEconomicoModal(false)}>Cancelar</Button>
                        <Button className="bg-purple-600 hover:bg-purple-700" disabled={saving} onClick={async () => {
                            const success = await saveChanges(formData)
                            if (success) setShowEconomicoModal(false)
                        }}>
                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Guardar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Equipo */}
            <Dialog open={showEquipoModal} onOpenChange={setShowEquipoModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Asignar Empleado al Caso</DialogTitle>
                        <DialogDescription>Selecciona un empleado para asignar a este caso</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Empleado</Label>
                            {loadingEmpleados ? (
                                <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin" /></div>
                            ) : (
                                <Select value={empleadoSeleccionado} onValueChange={setEmpleadoSeleccionado}>
                                    <SelectTrigger><SelectValue placeholder="Seleccionar empleado..." /></SelectTrigger>
                                    <SelectContent>
                                        {empleadosDisponibles
                                            .filter(e => !empleadosAsignados.some(a => a.empleado.id === e.id))
                                            .map(emp => (
                                                <SelectItem key={emp.id} value={emp.id.toString()}>
                                                    {emp.nombre} - {emp.rol}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Rol en el Caso</Label>
                            <Select value={rolEnCaso} onValueChange={setRolEnCaso}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Responsable">Responsable</SelectItem>
                                    <SelectItem value="Asignado">Asignado</SelectItem>
                                    <SelectItem value="Colaborador">Colaborador</SelectItem>
                                    <SelectItem value="Supervisor">Supervisor</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEquipoModal(false)}>Cancelar</Button>
                        <Button className="bg-purple-600 hover:bg-purple-700" disabled={!empleadoSeleccionado} onClick={async () => {
                            await asignarEmpleado()
                            setShowEquipoModal(false)
                        }}>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Asignar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Subir Documento */}
            <Dialog open={showDocumentoModal} onOpenChange={setShowDocumentoModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Subir Documento</DialogTitle>
                        <DialogDescription>Adjunta un documento a este caso</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Archivo</Label>
                            <Input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                            {selectedFile && (
                                <p className="text-xs text-gray-500">{selectedFile.name} ({formatFileSize(selectedFile.size)})</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Nombre del Documento</Label>
                            <Input value={nuevoDocumento.nombre} onChange={(e) => setNuevoDocumento({ ...nuevoDocumento, nombre: e.target.value })} placeholder="Ej: Contrato de servicios" />
                        </div>
                        <div className="space-y-2">
                            <Label>Tipo de Documento</Label>
                            <Select value={nuevoDocumento.tipo_documento} onValueChange={(v) => setNuevoDocumento({ ...nuevoDocumento, tipo_documento: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="general">General</SelectItem>
                                    <SelectItem value="contrato">Contrato</SelectItem>
                                    <SelectItem value="demanda">Demanda</SelectItem>
                                    <SelectItem value="evidencia">Evidencia</SelectItem>
                                    <SelectItem value="sentencia">Sentencia</SelectItem>
                                    <SelectItem value="oficio">Oficio</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Descripción (opcional)</Label>
                            <Textarea value={nuevoDocumento.descripcion} onChange={(e) => setNuevoDocumento({ ...nuevoDocumento, descripcion: e.target.value })} rows={2} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDocumentoModal(false)}>Cancelar</Button>
                        <Button className="bg-purple-600 hover:bg-purple-700" disabled={uploadingDoc || !selectedFile || !nuevoDocumento.nombre} onClick={subirDocumento}>
                            {uploadingDoc ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                            Subir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
