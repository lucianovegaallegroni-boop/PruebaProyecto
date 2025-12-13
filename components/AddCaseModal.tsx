"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Loader2 } from "lucide-react"

interface Cliente {
    id: number;
    nombre: string;
    email: string | null;
    telefono: string | null;
    persona_contacto: string | null;
}

interface Empleado {
    id: number;
    nombre: string;
    rol: string;
    especialidad: string | null;
}

interface CaseFormData {
    clienteId: string;
    clientName: string;
    contactPerson: string;
    email: string;
    phone: string;
    caseTitle: string;
    description: string;
    practiceArea: string;
    responsibleLawyer: string;
}

const initialFormData: CaseFormData = {
    clienteId: "",
    clientName: "",
    contactPerson: "",
    email: "",
    phone: "",
    caseTitle: "",
    description: "",
    practiceArea: "",
    responsibleLawyer: "",
};

interface AddCaseModalProps {
    onCaseCreated?: () => void;
}

export function AddCaseModal({ onCaseCreated }: AddCaseModalProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState<CaseFormData>(initialFormData)

    // Estados para clientes
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [loadingClientes, setLoadingClientes] = useState(false)

    // Estados para empleados
    const [empleados, setEmpleados] = useState<Empleado[]>([])
    const [loadingEmpleados, setLoadingEmpleados] = useState(false)

    // Cargar clientes y empleados cuando se abre el modal
    useEffect(() => {
        if (open) {
            fetchClientes();
            fetchEmpleados();
        }
    }, [open]);

    const fetchClientes = async () => {
        setLoadingClientes(true);
        try {
            const response = await fetch("/api/clientes");
            const result = await response.json();
            if (response.ok) {
                setClientes(result.data || []);
            }
        } catch (err) {
            console.error("Error fetching clientes:", err);
        } finally {
            setLoadingClientes(false);
        }
    };

    const fetchEmpleados = async () => {
        setLoadingEmpleados(true);
        try {
            const response = await fetch("/api/empleados");
            const result = await response.json();
            if (response.ok) {
                setEmpleados(result.data || []);
            }
        } catch (err) {
            console.error("Error fetching empleados:", err);
        } finally {
            setLoadingEmpleados(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (field: keyof CaseFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Manejar selección de cliente
    const handleClienteSelect = (clienteId: string) => {
        const cliente = clientes.find(c => c.id.toString() === clienteId);
        if (cliente) {
            setFormData(prev => ({
                ...prev,
                clienteId: clienteId,
                clientName: cliente.nombre,
                email: cliente.email || "",
                phone: cliente.telefono || "",
                contactPerson: cliente.persona_contacto || "",
            }));
        }
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const response = await fetch("/api/casos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: formData.caseTitle,
                    description: formData.description,
                    client_name: formData.clientName,
                    contact_person: formData.contactPerson,
                    client_email: formData.email,
                    client_phone: formData.phone,
                    practice_area: formData.practiceArea,
                    responsible_lawyer: formData.responsibleLawyer,
                    status: "inicio",
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al crear el caso");
            }

            console.log("Caso creado exitosamente:", data);
            resetForm();
            setOpen(false);

            // Callback para refrescar la lista de casos
            if (onCaseCreated) {
                onCaseCreated();
            }
        } catch (err) {
            console.error("Error:", err);
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) resetForm();
        }}>
            <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700 text-sm md:text-base">
                    <Plus className="w-4 h-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Nuevo Caso</span>
                    <span className="sm:hidden">Nuevo</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
                <DialogHeader>
                    <DialogTitle className="text-lg md:text-xl">Crear Nuevo Caso</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 py-2 md:py-4">

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 md:px-4 md:py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {/* Información del Cliente */}
                    <div className="space-y-3 md:space-y-4">
                        <h3 className="text-base md:text-lg font-semibold border-b pb-2">Información del Cliente</h3>
                        <div className="space-y-3 md:space-y-4">
                            <div className="space-y-1.5 md:space-y-2">
                                <Label htmlFor="clienteId" className="text-sm">Seleccionar Cliente *</Label>
                                <Select
                                    value={formData.clienteId}
                                    onValueChange={handleClienteSelect}
                                >
                                    <SelectTrigger className="text-sm">
                                        <SelectValue placeholder={loadingClientes ? "Cargando..." : "Seleccionar cliente"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loadingClientes ? (
                                            <div className="flex items-center justify-center py-4">
                                                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                                            </div>
                                        ) : clientes.length === 0 ? (
                                            <div className="py-4 px-2 text-center text-gray-500 text-sm">
                                                No hay clientes registrados
                                            </div>
                                        ) : (
                                            clientes.map((cliente) => (
                                                <SelectItem key={cliente.id} value={cliente.id.toString()}>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-sm">{cliente.nombre}</span>
                                                        {cliente.email && (
                                                            <span className="text-xs text-gray-500">{cliente.email}</span>
                                                        )}
                                                    </div>
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-gray-500">
                                    El cliente debe estar registrado previamente
                                </p>
                            </div>
                            {formData.clienteId && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="text-sm font-medium truncate">{formData.email || "No registrado"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Teléfono</p>
                                        <p className="text-sm font-medium">{formData.phone || "No registrado"}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Datos Fundamentales del Caso */}
                    <div className="space-y-3 md:space-y-4">
                        <h3 className="text-base md:text-lg font-semibold border-b pb-2">Datos del Caso</h3>
                        <div className="space-y-1.5 md:space-y-2">
                            <Label htmlFor="caseTitle" className="text-sm">Título del Caso *</Label>
                            <Input
                                id="caseTitle"
                                placeholder="Ej. Demanda Laboral"
                                required
                                className="text-sm"
                                value={formData.caseTitle}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-1.5 md:space-y-2">
                            <Label htmlFor="description" className="text-sm">Descripción</Label>
                            <Textarea
                                id="description"
                                placeholder="Resumen breve del caso..."
                                rows={2}
                                className="text-sm resize-none"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-1.5 md:space-y-2">
                            <Label htmlFor="practiceArea" className="text-sm">Área de Práctica</Label>
                            <Select
                                value={formData.practiceArea}
                                onValueChange={(value) => handleSelectChange("practiceArea", value)}
                            >
                                <SelectTrigger className="text-sm">
                                    <SelectValue placeholder="Seleccionar área" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="civil">Civil</SelectItem>
                                    <SelectItem value="penal">Penal</SelectItem>
                                    <SelectItem value="laboral">Laboral</SelectItem>
                                    <SelectItem value="mercantil">Mercantil</SelectItem>
                                    <SelectItem value="administrativo">Administrativo</SelectItem>
                                    <SelectItem value="familiar">Familiar</SelectItem>
                                    <SelectItem value="tributario">Tributario</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Asignación Interna */}
                    <div className="space-y-3 md:space-y-4">
                        <h3 className="text-base md:text-lg font-semibold border-b pb-2">Asignación</h3>
                        <div className="space-y-1.5 md:space-y-2">
                            <Label htmlFor="responsibleLawyer" className="text-sm">Abogado Responsable</Label>
                            <Select
                                value={formData.responsibleLawyer}
                                onValueChange={(value) => handleSelectChange("responsibleLawyer", value)}
                            >
                                <SelectTrigger className="text-sm">
                                    <SelectValue placeholder={loadingEmpleados ? "Cargando..." : "Seleccionar abogado"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {loadingEmpleados ? (
                                        <div className="flex items-center justify-center py-4">
                                            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                                        </div>
                                    ) : empleados.length === 0 ? (
                                        <div className="py-4 px-2 text-center text-gray-500 text-sm">
                                            No hay empleados registrados
                                        </div>
                                    ) : (
                                        empleados.map((empleado) => (
                                            <SelectItem key={empleado.id} value={empleado.nombre}>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{empleado.nombre}</span>
                                                    <span className="text-xs text-gray-500">{empleado.rol}</span>
                                                </div>
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t flex-col sm:flex-row gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                            className="w-full sm:w-auto order-2 sm:order-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto order-1 sm:order-2"
                            disabled={loading || !formData.clienteId || !formData.caseTitle}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creando...
                                </>
                            ) : (
                                "Crear Caso"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
