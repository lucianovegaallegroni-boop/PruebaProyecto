"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import {
    ArrowLeft,
    FileText,
    Upload,
    Download,
    CheckCircle,
    Clock,
    AlertCircle,
    Calendar,
    User,
    Briefcase,
    TrendingUp
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock data - en producción vendría de una API
const mockClientData = {
    client: {
        fullName: "María Fernanda González Rodríguez",
        idNumber: "1.234.567-8",
        email: "maria.gonzalez@email.com",
        phone: "+57 300 123 4567"
    },
    case: {
        id: "CASE-2024-001",
        name: "Revisión de Contrato Comercial Internacional",
        type: "Derecho de Familia",
        startDate: "15 Ene 2024",
        expectedEndDate: "15 Jun 2024",
        assignedAttorney: "Dr. Carlos Mendoza",
        progress: 65,
        currentStage: "Audiencia de Conciliación"
    },
    stages: [
        { name: "Radicación de Demanda", status: "completed" as const, completedDate: "15 Ene 2024" },
        { name: "Admisión de Demanda", status: "completed" as const, completedDate: "22 Ene 2024" },
        { name: "Notificación", status: "completed" as const, completedDate: "05 Feb 2024" },
        { name: "Audiencia de Conciliación", status: "in-progress" as const },
        { name: "Práctica de Pruebas", status: "pending" as const },
        { name: "Alegatos de Conclusión", status: "pending" as const },
        { name: "Sentencia", status: "pending" as const }
    ],
    documents: {
        submitted: [
            { id: "1", name: "Cédula de Ciudadanía", uploadDate: "10 Ene 2024", status: "approved" as const, url: "#" },
            { id: "2", name: "Registro Civil de Matrimonio", uploadDate: "10 Ene 2024", status: "approved" as const, url: "#" },
            { id: "3", name: "Certificado de Ingresos", uploadDate: "12 Ene 2024", status: "approved" as const, url: "#" },
            { id: "4", name: "Declaración de Bienes", uploadDate: "20 Feb 2024", status: "pending-review" as const, url: "#" }
        ],
        pending: [
            { id: "5", name: "Certificado de Tradición y Libertad", priority: "urgent" as const, dueDate: "10 Dic 2024", description: "Certificado actualizado del inmueble ubicado en Bogotá" },
            { id: "6", name: "Estados Financieros", priority: "normal" as const, dueDate: "20 Dic 2024", description: "Estados financieros de los últimos 6 meses" }
        ]
    },
    nextAppointment: {
        date: "15 Dic 2024",
        time: "10:00 AM",
        type: "Audiencia de Conciliación",
        location: "Juzgado 5to de Familia - Sala 302"
    }
}

export default function ClientPortalPage() {
    const params = useParams()
    const router = useRouter()
    const [data] = useState(mockClientData)

    const getProgressColor = (progress: number) => {
        if (progress < 30) return "bg-red-500"
        if (progress < 70) return "bg-yellow-500"
        return "bg-green-500"
    }

    const getStatusBadge = (status: string) => {
        const variants = {
            "approved": { label: "Aprobado", className: "bg-green-100 text-green-700" },
            "pending-review": { label: "En Revisión", className: "bg-yellow-100 text-yellow-700" },
            "rejected": { label: "Rechazado", className: "bg-red-100 text-red-700" }
        }
        const variant = variants[status as keyof typeof variants] || variants["pending-review"]
        return <Badge className={variant.className}>{variant.label}</Badge>
    }

    const getStageIcon = (status: string) => {
        if (status === "completed") return <CheckCircle className="w-5 h-5 text-green-500" />
        if (status === "in-progress") return <Clock className="w-5 h-5 text-blue-500" />
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="text-white hover:bg-white/20 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Button>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-white/30">
                            <AvatarFallback className="bg-white/20 text-white text-2xl">
                                {data.client.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                                {data.client.fullName}
                            </h1>
                            <p className="text-purple-100 text-sm sm:text-base mb-1">
                                Cédula: {data.client.idNumber}
                            </p>
                            <p className="text-white/90 text-base sm:text-lg font-medium">
                                {data.case.name}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Progress Section */}
                <Card className="mb-6 border-2 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                            Progreso del Caso
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-2xl sm:text-3xl font-bold text-purple-600">
                                    {data.case.progress}%
                                </span>
                                <Badge className="bg-blue-100 text-blue-700 text-sm">
                                    {data.case.currentStage}
                                </Badge>
                            </div>
                            <Progress value={data.case.progress} className="h-3 sm:h-4" />
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <div>
                                        <p className="text-gray-500 text-xs">Inicio</p>
                                        <p className="font-medium">{data.case.startDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <div>
                                        <p className="text-gray-500 text-xs">Finalización Est.</p>
                                        <p className="font-medium">{data.case.expectedEndDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <div>
                                        <p className="text-gray-500 text-xs">Abogado</p>
                                        <p className="font-medium">{data.case.assignedAttorney}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Current Process Timeline */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                                Etapas del Proceso
                            </CardTitle>
                            <CardDescription>Estado actual de su caso</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.stages.map((stage, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="mt-1">{getStageIcon(stage.status)}</div>
                                        <div className="flex-1">
                                            <p className={`font-medium text-sm sm:text-base ${stage.status === "in-progress" ? "text-blue-600" :
                                                stage.status === "completed" ? "text-gray-700" : "text-gray-400"
                                                }`}>
                                                {stage.name}
                                            </p>
                                            {stage.completedDate && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Completado: {stage.completedDate}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Next Appointment */}
                    {data.nextAppointment && (
                        <Card className="shadow-lg border-2 border-purple-200 bg-purple-50/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-purple-700">
                                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                                    Próxima Cita
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">Tipo</p>
                                    <p className="font-semibold text-base sm:text-lg">{data.nextAppointment.type}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-sm text-gray-600">Fecha</p>
                                        <p className="font-medium">{data.nextAppointment.date}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Hora</p>
                                        <p className="font-medium">{data.nextAppointment.time}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Ubicación</p>
                                    <p className="font-medium text-sm">{data.nextAppointment.location}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Documents Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Submitted Documents */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                Documentos Entregados
                            </CardTitle>
                            <CardDescription>
                                {data.documents.submitted.length} documentos en el sistema
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {data.documents.submitted.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm sm:text-base truncate">{doc.name}</p>
                                                <p className="text-xs text-gray-500">{doc.uploadDate}</p>
                                                <div className="mt-1">{getStatusBadge(doc.status)}</div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="flex-shrink-0 ml-2">
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pending Documents */}
                    <Card className="shadow-lg border-2 border-orange-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-orange-700">
                                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                                Documentos Pendientes
                            </CardTitle>
                            <CardDescription>
                                {data.documents.pending.length} documentos por entregar
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {data.documents.pending.map((doc) => (
                                    <div key={doc.id} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm sm:text-base">{doc.name}</p>
                                                <p className="text-xs sm:text-sm text-gray-600 mt-1">{doc.description}</p>
                                            </div>
                                            <Badge className={doc.priority === "urgent" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}>
                                                {doc.priority === "urgent" ? "Urgente" : "Normal"}
                                            </Badge>
                                        </div>
                                        {doc.dueDate && (
                                            <p className="text-xs text-gray-500 mb-3">
                                                Fecha límite: {doc.dueDate}
                                            </p>
                                        )}
                                        <Button size="sm" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
                                            <Upload className="w-4 h-4 mr-2" />
                                            Subir Documento
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
