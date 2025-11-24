"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    ArrowLeft,
    Mail,
    Phone,
    Building2,
    User,
    MapPin,
    Calendar,
    FileText,
    Briefcase,
    CheckCircle,
    Clock,
    AlertCircle,
    MoreHorizontal,
    Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock Data (matching the structure from the list)
const clientData = {
    id: 1,
    nombre: "Juan Pérez García",
    email: "juan.perez@email.com",
    telefono: "+52 55 1234 5678",
    cedula: "V-12345678",
    empresa: "",
    tipo: "Persona Natural",
    estado: "Activo",
    fechaRegistro: "15 Ene 2025",
    direccion: "Av. Reforma 123, Col. Centro, Ciudad de México",
    notas: "Cliente preferencial, requiere atención prioritaria",
    casos: [
        {
            id: "CAS-2025-001",
            nombre: "Demanda Civil vs Inmobiliaria Norte",
            estado: "En Proceso",
            fechaInicio: "20 Ene 2025",
            tipo: "Litigio Civil",
        },
        {
            id: "CAS-2024-089",
            nombre: "Revisión de Contrato de Arrendamiento",
            estado: "Completado",
            fechaInicio: "10 Dic 2024",
            tipo: "Contractual",
        },
    ],
    documentos: [
        {
            id: 1,
            nombre: "Identificación Oficial.pdf",
            tipo: "PDF",
            tamaño: "2.4 MB",
            fecha: "15 Ene 2025",
        },
        {
            id: 2,
            nombre: "Comprobante de Domicilio.jpg",
            tipo: "Imagen",
            tamaño: "1.8 MB",
            fecha: "15 Ene 2025",
        },
        {
            id: 3,
            nombre: "Poder Notarial.pdf",
            tipo: "PDF",
            tamaño: "3.1 MB",
            fecha: "22 Ene 2025",
        },
    ],
}

export default function ClientDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("general")

    // In a real app, we would fetch the client data based on params.id
    // const clientId = params.id

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header / Navigation */}
            <div className="mb-6">
                <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-purple-600" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver a Clientes
                </Button>
            </div>

            {/* Client Profile Header */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="text-2xl bg-purple-100 text-purple-700">
                            {clientData.nombre
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{clientData.nombre}</h1>
                        <div className="flex items-center gap-3 mt-2">
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                {clientData.tipo}
                            </Badge>
                            <Badge
                                variant="secondary"
                                className={
                                    clientData.estado === "Activo" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                }
                            >
                                {clientData.estado}
                            </Badge>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Cliente desde {clientData.fechaRegistro}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">
                        <Mail className="w-4 h-4 mr-2" />
                        Contactar
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Editar Información</DropdownMenuItem>
                            <DropdownMenuItem>Archivar Cliente</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Eliminar Cliente</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-3 bg-gray-100/50 p-1 mb-8">
                    <TabsTrigger
                        value="general"
                        className="relative data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-none"
                    >
                        <span className="relative z-10">Información</span>
                        {activeTab === "general" && (
                            <motion.div
                                layoutId="active-tab-client"
                                className="absolute inset-0 bg-white rounded-md shadow-sm"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </TabsTrigger>
                    <TabsTrigger
                        value="casos"
                        className="relative data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-none"
                    >
                        <span className="relative z-10">Casos</span>
                        {activeTab === "casos" && (
                            <motion.div
                                layoutId="active-tab-client"
                                className="absolute inset-0 bg-white rounded-md shadow-sm"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </TabsTrigger>
                    <TabsTrigger
                        value="documentos"
                        className="relative data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-none"
                    >
                        <span className="relative z-10">Documentos</span>
                        {activeTab === "documentos" && (
                            <motion.div
                                layoutId="active-tab-client"
                                className="absolute inset-0 bg-white rounded-md shadow-sm"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* Tab: Información General */}
                <TabsContent value="general" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Contact Info */}
                        <Card className="md:col-span-2 border-gray-200">
                            <CardHeader>
                                <CardTitle>Información de Contacto</CardTitle>
                                <CardDescription>Detalles de contacto y ubicación del cliente</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-purple-600">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Correo Electrónico</p>
                                            <p className="font-medium text-gray-900">{clientData.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-purple-600">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Teléfono</p>
                                            <p className="font-medium text-gray-900">{clientData.telefono}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-purple-600">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Dirección</p>
                                            <p className="font-medium text-gray-900">{clientData.direccion}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Details */}
                        <Card className="border-gray-200">
                            <CardHeader>
                                <CardTitle>Detalles Adicionales</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Cédula / ID</p>
                                    <p className="font-medium text-gray-900">{clientData.cedula}</p>
                                </div>
                                {clientData.empresa && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Empresa</p>
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-gray-400" />
                                            <p className="font-medium text-gray-900">{clientData.empresa}</p>
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Notas</p>
                                    <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-md border border-yellow-100">
                                        {clientData.notas}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Tab: Casos */}
                <TabsContent value="casos">
                    <Card className="border-gray-200">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Historial de Casos</CardTitle>
                                    <CardDescription>Casos legales asociados a este cliente</CardDescription>
                                </div>
                                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                                    <Briefcase className="w-4 h-4 mr-2" />
                                    Nuevo Caso
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50">
                                        <TableHead>ID Caso</TableHead>
                                        <TableHead>Nombre del Caso</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Fecha Inicio</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {clientData.casos.map((caso) => (
                                        <TableRow key={caso.id} className="hover:bg-gray-50">
                                            <TableCell className="font-mono text-sm font-medium text-purple-600">{caso.id}</TableCell>
                                            <TableCell className="font-medium">{caso.nombre}</TableCell>
                                            <TableCell>{caso.tipo}</TableCell>
                                            <TableCell className="text-gray-600">{caso.fechaInicio}</TableCell>
                                            <TableCell>
                                                {caso.estado === "En Proceso" && (
                                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {caso.estado}
                                                    </Badge>
                                                )}
                                                {caso.estado === "Completado" && (
                                                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        {caso.estado}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" onClick={() => router.push(`/casos/${caso.id}`)}>
                                                    Ver Detalles
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab: Documentos */}
                <TabsContent value="documentos">
                    <Card className="border-gray-200">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Documentación</CardTitle>
                                    <CardDescription>Archivos y documentos del cliente</CardDescription>
                                </div>
                                <Button size="sm" variant="outline">
                                    <Download className="w-4 h-4 mr-2" />
                                    Descargar Todo
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {clientData.documentos.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer group"
                                    >
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-white">
                                            <FileText className="w-5 h-5 text-gray-500 group-hover:text-purple-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">{doc.nombre}</p>
                                            <p className="text-xs text-gray-500">
                                                {doc.tipo} • {doc.tamaño} • {doc.fecha}
                                            </p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-purple-600">
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer">
                                    <div className="text-center">
                                        <div className="mx-auto w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                                            <Download className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">Subir Documento</p>
                                        <p className="text-xs text-gray-500">Arrastra o haz clic</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
