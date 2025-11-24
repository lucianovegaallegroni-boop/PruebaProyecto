"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, Building2, Calendar, FileText, Briefcase, CheckCircle, Clock, Edit, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

// Mock data for a team member (in a real app this would be fetched based on params.id)
const mockMember = {
    id: 1,
    nombre: "Ana Martínez",
    rol: "Abogada Senior",
    email: "ana.martinez@lawfirm.com",
    telefono: "+52 55 9876 5432",
    avatar: "/placeholder.svg",
    estado: "Activo",
    fechaRegistro: "10 Ene 2025",
    direccion: "Av. Reforma 123, Col. Centro, Ciudad de México",
    notas: "Especialista en derecho civil y comercial.",
    casos: [
        { id: "CAS-2025-001", nombre: "Demanda Civil vs Inmobiliaria Norte", tipo: "Litigio Civil", estado: "En Proceso", fechaInicio: "20 Ene 2025" },
        { id: "CAS-2024-089", nombre: "Revisión de Contrato de Arrendamiento", tipo: "Contractual", estado: "Completado", fechaInicio: "10 Dic 2024" },
    ],
    documentos: [
        { id: 1, nombre: "Curriculum.pdf", tipo: "PDF", tamaño: "1.2 MB", fecha: "10 Ene 2025" },
        { id: 2, nombre: "Certificado de Estudios.jpg", tipo: "Imagen", tamaño: "800 KB", fecha: "12 Ene 2025" },
    ],
};

export default function TeamMemberDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("general");

    // In a real implementation you would fetch data based on params.id
    const member = mockMember; // placeholder

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header / Back navigation */}
            <div className="mb-6">
                <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-purple-600" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver a Equipo
                </Button>
            </div>

            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="text-2xl bg-purple-100 text-purple-700">
                            {member.nombre.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{member.nombre}</h1>
                        <div className="flex items-center gap-3 mt-2">
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">{member.rol}</Badge>
                            <Badge variant="secondary" className={member.estado === "Activo" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                                {member.estado}
                            </Badge>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Miembro desde {member.fechaRegistro}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">
                        <Mail className="w-4 h-4 mr-2" />
                        Contactar
                    </Button>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Nuevo Caso
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-3 bg-gray-100/50 p-1 mb-8">
                    <TabsTrigger value="general" className="relative data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-none">
                        <span className="relative z-10">Información</span>
                        {activeTab === "general" && (
                            <motion.div layoutId="active-tab-team" className="absolute inset-0 bg-white rounded-md shadow-sm" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="casos" className="relative data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-none">
                        <span className="relative z-10">Casos</span>
                        {activeTab === "casos" && (
                            <motion.div layoutId="active-tab-team" className="absolute inset-0 bg-white rounded-md shadow-sm" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="documentos" className="relative data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-none">
                        <span className="relative z-10">Documentos</span>
                        {activeTab === "documentos" && (
                            <motion.div layoutId="active-tab-team" className="absolute inset-0 bg-white rounded-md shadow-sm" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* General Info Tab */}
                <TabsContent value="general" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-2 border-gray-200">
                            <CardHeader>
                                <CardTitle>Información de Contacto</CardTitle>
                                <CardDescription>Detalles de contacto y ubicación del miembro</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-purple-600">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Correo Electrónico</p>
                                            <p className="font-medium text-gray-900">{member.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-purple-600">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Teléfono</p>
                                            <p className="font-medium text-gray-900">{member.telefono}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-purple-600">
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Dirección</p>
                                            <p className="font-medium text-gray-900">{member.direccion}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-gray-200">
                            <CardHeader>
                                <CardTitle>Detalles Adicionales</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Notas</p>
                                    <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-md border border-yellow-100">{member.notas}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Cases Tab */}
                <TabsContent value="casos" className="space-y-6">
                    <Card className="border-gray-200">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Casos Asignados</CardTitle>
                                    <CardDescription>Casos legales gestionados por este miembro</CardDescription>
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
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Fecha Inicio</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {member.casos.map((c) => (
                                        <TableRow key={c.id} className="hover:bg-gray-50">
                                            <TableCell className="font-mono text-sm font-medium text-purple-600">{c.id}</TableCell>
                                            <TableCell className="font-medium">{c.nombre}</TableCell>
                                            <TableCell>{c.tipo}</TableCell>
                                            <TableCell className="text-gray-600">{c.fechaInicio}</TableCell>
                                            <TableCell>
                                                {c.estado === "En Proceso" ? (
                                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {c.estado}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        {c.estado}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" onClick={() => router.push(`/casos/${c.id}`)}>
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

                {/* Documents Tab */}
                <TabsContent value="documentos" className="space-y-6">
                    <Card className="border-gray-200">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Documentación</CardTitle>
                                    <CardDescription>Archivos y documentos del miembro</CardDescription>
                                </div>
                                <Button size="sm" variant="outline">
                                    <Download className="w-4 h-4 mr-2" />
                                    Descargar Todo
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {member.documentos.map((doc) => (
                                    <div key={doc.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer group">
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-white">
                                            <FileText className="w-5 h-5 text-gray-500 group-hover:text-purple-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">{doc.nombre}</p>
                                            <p className="text-xs text-gray-500">{doc.tipo} • {doc.tamaño} • {doc.fecha}</p>
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
    );
}
