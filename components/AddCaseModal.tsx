"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

export function AddCaseModal() {
    const [open, setOpen] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle form submission logic here
        console.log("Form submitted")
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Caso
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Caso</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-4">

                    {/* Información del Cliente */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Información del Cliente</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="clientName">Nombre del Cliente / Empresa</Label>
                                <Input id="clientName" placeholder="Ej. TechCorp S.A." required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contactPerson">Persona de Contacto</Label>
                                <Input id="contactPerson" placeholder="Nombre completo" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input id="email" type="email" placeholder="cliente@empresa.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Teléfono</Label>
                                <Input id="phone" placeholder="+52 55 1234 5678" />
                            </div>
                        </div>
                    </div>

                    {/* Datos Fundamentales del Caso */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Datos Fundamentales del Caso</h3>
                        <div className="space-y-2">
                            <Label htmlFor="caseTitle">Título del Caso</Label>
                            <Input id="caseTitle" placeholder="Ej. Demanda Laboral - Despido Injustificado" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción Detallada</Label>
                            <Textarea id="description" placeholder="Resumen de los hechos..." />
                        </div>
                    </div>

                    {/* Naturaleza Jurídica */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Naturaleza Jurídica</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="practiceArea">Área de Práctica</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar área" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="civil">Civil</SelectItem>
                                        <SelectItem value="penal">Penal</SelectItem>
                                        <SelectItem value="laboral">Laboral</SelectItem>
                                        <SelectItem value="mercantil">Mercantil</SelectItem>
                                        <SelectItem value="administrativo">Administrativo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="caseType">Tipo de Procedimiento</Label>
                                <Input id="caseType" placeholder="Ej. Ordinario Civil, Amparo..." />
                            </div>
                        </div>
                    </div>

                    {/* Partes Procesales */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Partes Procesales</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="opponent">Contraparte</Label>
                                <Input id="opponent" placeholder="Nombre de la contraparte" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="opponentLawyer">Abogado de la Contraparte</Label>
                                <Input id="opponentLawyer" placeholder="Nombre del abogado" />
                            </div>
                        </div>
                    </div>

                    {/* Información Procesal */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Información Procesal</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fileNumber">Número de Expediente</Label>
                                <Input id="fileNumber" placeholder="Ej. 1234/2024" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="court">Juzgado / Autoridad</Label>
                                <Input id="court" placeholder="Ej. Juzgado 5to de lo Civil" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="jurisdiction">Jurisdicción</Label>
                                <Input id="jurisdiction" placeholder="Ciudad de México" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="judge">Juez / Magistrado</Label>
                                <Input id="judge" placeholder="Nombre del Juez" />
                            </div>
                        </div>
                    </div>

                    {/* Estado y Seguimiento */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Estado y Seguimiento</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Estado Procesal Actual</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar estado" />
                                    </SelectTrigger>
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
                                <Label htmlFor="nextHearing">Próxima Audiencia / Vencimiento</Label>
                                <Input id="nextHearing" type="date" />
                            </div>
                        </div>
                    </div>

                    {/* Aspectos Económicos */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Aspectos Económicos</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount">Cuantía del Asunto</Label>
                                <Input id="amount" placeholder="$ 0.00" type="number" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fees">Honorarios Pactados</Label>
                                <Input id="fees" placeholder="Descripción de honorarios" />
                            </div>
                        </div>
                    </div>

                    {/* Asignación Interna */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Asignación Interna</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="responsibleLawyer">Abogado Responsable</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar abogado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="clara">Clara Blackwood</SelectItem>
                                        <SelectItem value="michael">Michael Whitmore</SelectItem>
                                        <SelectItem value="dennis">Dennis Brightwood</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="assistants">Asistentes / Paralegales</Label>
                                <Input id="assistants" placeholder="Nombres separados por comas" />
                            </div>
                        </div>
                    </div>

                    {/* Observaciones Estratégicas */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Observaciones Estratégicas</h3>
                        <div className="space-y-2">
                            <Label htmlFor="strategy">Estrategia Legal</Label>
                            <Textarea id="strategy" placeholder="Puntos clave de la estrategia..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="risks">Riesgos Detectados</Label>
                            <Textarea id="risks" placeholder="Posibles contingencias..." />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Crear Caso</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
