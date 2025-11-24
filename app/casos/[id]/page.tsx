"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, FileText, Scale, Users, AlertCircle, DollarSign, Clock } from "lucide-react"

export default function CaseDetailsPage() {
    const params = useParams()
    const router = useRouter()
    // Ensure id is a string
    const id = Array.isArray(params.id) ? params.id[0] : params.id
    const [activeTab, setActiveTab] = useState("procedural")

    // Mock data for the case details
    const caseData = {
        id: id,
        title: "Revisión de Contratos Comerciales",
        client: "Grupo Financiero XYZ",
        status: "En Proceso",
        type: "Mercantil",
        court: "Juzgado 5to de lo Civil",
        fileNumber: "1234/2024",
        startDate: "22 Jun 2025",
        description: "Revisión exhaustiva de contratos marco para proveedores internacionales, asegurando cumplimiento con normativas locales y cláusulas de arbitraje.",
        amount: "$ 1,500,000.00 MXN",
        responsible: "Clara Blackwood",
        nextHearing: "15 Jul 2025",
        opponent: "Proveedores Unidos S.A.",
        strategy: "Centrarse en la nulidad de cláusulas abusivas y renegociar términos de pago.",
    }

    return (
        <div className="p-8 space-y-8">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{caseData.title}</h1>
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                        <span className="font-mono text-sm">#{caseData.id}</span>
                        <span>•</span>
                        <span>{caseData.client}</span>
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-3">
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 text-sm">
                        {caseData.status}
                    </Badge>
                    <Button variant="outline">Editar Caso</Button>
                    <Button className="bg-purple-600 hover:bg-purple-700">Nueva Actuación</Button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-3 gap-8">

                {/* Left Column - Main Info */}
                <div className="col-span-2 space-y-6">

                    {/* Summary Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Resumen del Caso</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-gray-700 leading-relaxed">
                                {caseData.description}
                            </p>
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="flex items-start gap-3">
                                    <Scale className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Materia</p>
                                        <p className="text-sm text-gray-600">{caseData.type}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Expediente</p>
                                        <p className="text-sm text-gray-600">{caseData.fileNumber}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Contraparte</p>
                                        <p className="text-sm text-gray-600">{caseData.opponent}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Fecha Inicio</p>
                                        <p className="text-sm text-gray-600">{caseData.startDate}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detailed Tabs */}
                    <Tabs defaultValue="procedural" value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-gray-100/50 p-1">
                            <TabsTrigger
                                value="procedural"
                                className="relative data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-none"
                            >
                                <span className="relative z-10">Información Procesal</span>
                                {activeTab === "procedural" && (
                                    <motion.div
                                        layoutId="active-tab"
                                        className="absolute inset-0 bg-white rounded-md shadow-sm"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </TabsTrigger>
                            <TabsTrigger
                                value="strategy"
                                className="relative data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-none"
                            >
                                <span className="relative z-10">Estrategia</span>
                                {activeTab === "strategy" && (
                                    <motion.div
                                        layoutId="active-tab"
                                        className="absolute inset-0 bg-white rounded-md shadow-sm"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </TabsTrigger>
                            <TabsTrigger
                                value="documents"
                                className="relative data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-none"
                            >
                                <span className="relative z-10">Documentos</span>
                                {activeTab === "documents" && (
                                    <motion.div
                                        layoutId="active-tab"
                                        className="absolute inset-0 bg-white rounded-md shadow-sm"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="procedural" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Estado Procesal</CardTitle>
                                    <CardDescription>Detalles del juzgado y seguimiento</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Juzgado / Autoridad</p>
                                            <p className="text-base text-gray-900 mt-1">{caseData.court}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Próxima Audiencia</p>
                                            <div className="flex items-center gap-2 mt-1 text-amber-600 font-medium">
                                                <Clock className="w-4 h-4" />
                                                {caseData.nextHearing}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="strategy" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Estrategia y Riesgos</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                                        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" />
                                            Estrategia Actual
                                        </h4>
                                        <p className="text-blue-800 text-sm">{caseData.strategy}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="documents" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Documentación del Caso</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8 text-gray-500">
                                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>No hay documentos adjuntos recientemente</p>
                                        <Button variant="link" className="mt-2">Subir documento</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                </div>

                {/* Right Column - Sidebar Info */}
                <div className="space-y-6">

                    {/* Financial Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Aspectos Económicos</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <DollarSign className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Cuantía</p>
                                        <p className="font-semibold text-gray-900">{caseData.amount}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Team Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Equipo Asignado</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold">
                                    CB
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{caseData.responsible}</p>
                                    <p className="text-xs text-gray-500">Abogado Responsable</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    )
}
