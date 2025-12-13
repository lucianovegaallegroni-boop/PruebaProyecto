"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import {
    Search,
    Plus,
    Filter,
    MoreHorizontal,
    Edit,
    Trash2,
    Building2,
    User,
    Mail,
    Phone,
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Tipos para la API
interface ClienteAPI {
    id: number
    nombre: string
    tipo_cliente: string | null
    cedula: string | null
    email: string | null
    telefono: string | null
    direccion: string | null
    ciudad: string | null
    estado: string | null
    codigo_postal: string | null
    pais: string | null
    persona_contacto: string | null
    cargo_contacto: string | null
    notas: string | null
    activo: boolean
    created_at: string | null
    updated_at: string | null
}

// Datos del formulario
interface FormData {
    nombre: string
    tipo_cliente: string
    cedula: string
    email: string
    telefono: string
    direccion: string
    ciudad: string
    estado: string
    persona_contacto: string
    cargo_contacto: string
    notas: string
    activo: boolean
}

const initialFormData: FormData = {
    nombre: "",
    tipo_cliente: "empresa",
    cedula: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    estado: "",
    persona_contacto: "",
    cargo_contacto: "",
    notas: "",
    activo: true,
}

export default function ClientesPage() {
    // Estados principales
    const [clientes, setClientes] = useState<ClienteAPI[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [actionLoading, setActionLoading] = useState(false)

    // Estados de UI
    const [searchQuery, setSearchQuery] = useState("")
    const [filterEstado, setFilterEstado] = useState<string>("todos")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedCliente, setSelectedCliente] = useState<ClienteAPI | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const [formData, setFormData] = useState<FormData>(initialFormData)

    // Cargar clientes desde la API
    const fetchClientes = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch("/api/clientes")
            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Error al cargar los clientes")
            }

            setClientes(result.data || [])
        } catch (err) {
            console.error("Error fetching clientes:", err)
            setError(err instanceof Error ? err.message : "Error desconocido")
        } finally {
            setLoading(false)
        }
    }

    // Cargar al montar
    useEffect(() => {
        fetchClientes()
    }, [])

    // Formatear fecha
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Sin fecha"
        // Agregar T12:00:00 si es solo fecha para evitar problemas de timezone
        const date = dateString.includes("T")
            ? new Date(dateString)
            : new Date(dateString + "T12:00:00")
        return date.toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
    }

    // Filtrar clientes
    const clientesFiltrados = clientes.filter((cliente) => {
        const matchSearch =
            cliente.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (cliente.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
            (cliente.persona_contacto?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
        const matchEstado =
            filterEstado === "todos" ||
            (filterEstado === "Activo" && cliente.activo) ||
            (filterEstado === "Inactivo" && !cliente.activo)
        return matchSearch && matchEstado
    })

    // Paginación
    const totalPages = Math.ceil(clientesFiltrados.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const clientesPaginados = clientesFiltrados.slice(startIndex, endIndex)

    // Abrir modal de agregar
    const handleOpenAddDialog = () => {
        setFormData(initialFormData)
        setIsAddDialogOpen(true)
    }

    // Abrir modal de editar
    const handleOpenEditDialog = (cliente: ClienteAPI) => {
        setSelectedCliente(cliente)
        setFormData({
            nombre: cliente.nombre,
            tipo_cliente: cliente.tipo_cliente || "empresa",
            cedula: cliente.cedula || "",
            email: cliente.email || "",
            telefono: cliente.telefono || "",
            direccion: cliente.direccion || "",
            ciudad: cliente.ciudad || "",
            estado: cliente.estado || "",
            persona_contacto: cliente.persona_contacto || "",
            cargo_contacto: cliente.cargo_contacto || "",
            notas: cliente.notas || "",
            activo: cliente.activo,
        })
        setIsEditDialogOpen(true)
    }

    // Abrir modal de eliminar
    const handleOpenDeleteDialog = (cliente: ClienteAPI) => {
        setSelectedCliente(cliente)
        setIsDeleteDialogOpen(true)
    }

    // Agregar cliente - API
    const handleAddCliente = async () => {
        if (!formData.nombre) {
            alert("El nombre es obligatorio")
            return
        }

        setActionLoading(true)
        try {
            const response = await fetch("/api/clientes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Error al crear el cliente")
            }

            await fetchClientes()
            setIsAddDialogOpen(false)
            setFormData(initialFormData)
        } catch (err) {
            console.error("Error creating cliente:", err)
            alert(err instanceof Error ? err.message : "Error al crear el cliente")
        } finally {
            setActionLoading(false)
        }
    }

    // Editar cliente - API
    const handleEditCliente = async () => {
        if (!selectedCliente) return

        setActionLoading(true)
        try {
            const response = await fetch(`/api/clientes/${selectedCliente.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Error al actualizar el cliente")
            }

            await fetchClientes()
            setIsEditDialogOpen(false)
            setSelectedCliente(null)
        } catch (err) {
            console.error("Error updating cliente:", err)
            alert(err instanceof Error ? err.message : "Error al actualizar el cliente")
        } finally {
            setActionLoading(false)
        }
    }

    // Eliminar cliente - API
    const handleDeleteCliente = async () => {
        if (!selectedCliente) return

        setActionLoading(true)
        try {
            const response = await fetch(`/api/clientes/${selectedCliente.id}`, {
                method: "DELETE",
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Error al eliminar el cliente")
            }

            await fetchClientes()
            setIsDeleteDialogOpen(false)
            setSelectedCliente(null)
        } catch (err) {
            console.error("Error deleting cliente:", err)
            alert(err instanceof Error ? err.message : "Error al eliminar el cliente")
        } finally {
            setActionLoading(false)
        }
    }

    // Vista de carga
    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                    <p className="text-gray-500">Cargando clientes...</p>
                </div>
            </div>
        )
    }

    // Vista de error
    if (error) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4 text-center">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <h2 className="text-xl font-semibold text-gray-900">Error al cargar clientes</h2>
                    <p className="text-gray-500">{error}</p>
                    <Button variant="outline" onClick={fetchClientes}>
                        Reintentar
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8">
            <Card className="border-gray-200">
                <div className="space-y-8 m-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
                            <p className="text-gray-600 mt-1">Gestiona tu cartera de clientes</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="gap-2 bg-transparent">
                                <Filter className="w-4 h-4" />
                                Filtrar
                            </Button>
                            <Button className="bg-purple-600 hover:bg-purple-700 gap-2" onClick={handleOpenAddDialog}>
                                <Plus className="w-4 h-4" />
                                Nuevo Cliente
                            </Button>
                        </div>
                    </div>

                    {/* Search and Stats */}
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Buscar clientes..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="pl-10"
                            />
                        </div>
                        <Select value={filterEstado} onValueChange={(value) => {
                            setFilterEstado(value)
                            setCurrentPage(1)
                        }}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos</SelectItem>
                                <SelectItem value="Activo">Activos</SelectItem>
                                <SelectItem value="Inactivo">Inactivos</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>{clientes.filter((c) => c.activo).length} Activos</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                <span>{clientes.filter((c) => !c.activo).length} Inactivos</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de Clientes */}
                    <Card className="border-gray-200">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50">
                                        <TableHead className="font-medium text-gray-700">Cliente</TableHead>
                                        <TableHead className="font-medium text-gray-700">Contacto</TableHead>
                                        <TableHead className="font-medium text-gray-700">Tipo</TableHead>
                                        <TableHead className="font-medium text-gray-700">Estado</TableHead>
                                        <TableHead className="font-medium text-gray-700">Registro</TableHead>
                                        <TableHead className="font-medium text-gray-700 w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {clientesPaginados.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                {searchQuery || filterEstado !== "todos"
                                                    ? "No se encontraron clientes con esos filtros"
                                                    : "No hay clientes registrados. ¡Agrega tu primer cliente!"}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        clientesPaginados.map((cliente) => (
                                            <TableRow key={cliente.id} className="hover:bg-gray-50">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                            {cliente.tipo_cliente === "empresa" ? (
                                                                <Building2 className="w-5 h-5 text-purple-600" />
                                                            ) : (
                                                                <User className="w-5 h-5 text-purple-600" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">{cliente.nombre}</div>
                                                            {cliente.cedula && (
                                                                <div className="text-sm text-gray-600">{cliente.cedula}</div>
                                                            )}
                                                            {cliente.persona_contacto && (
                                                                <div className="text-sm text-gray-500 italic">{cliente.persona_contacto}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        {cliente.email && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Mail className="w-3 h-3" />
                                                                {cliente.email}
                                                            </div>
                                                        )}
                                                        {cliente.telefono && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Phone className="w-3 h-3" />
                                                                {cliente.telefono}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 capitalize">
                                                        {cliente.tipo_cliente === "empresa" ? "Empresa" : "Persona"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="secondary"
                                                        className={
                                                            cliente.activo
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-gray-100 text-gray-700"
                                                        }
                                                    >
                                                        {cliente.activo ? "Activo" : "Inactivo"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-gray-600">{formatDate(cliente.created_at)}</TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="w-8 h-8">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleOpenEditDialog(cliente)}>
                                                                <Edit className="w-4 h-4 mr-2" />
                                                                Editar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/clientes/${cliente.id}`}>Ver Perfil</Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>Ver Casos</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() => handleOpenDeleteDialog(cliente)}
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                Eliminar
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>

                            {/* Paginación */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                                    <div className="text-sm text-gray-600">
                                        Mostrando {startIndex + 1} a {Math.min(endIndex, clientesFiltrados.length)} de {clientesFiltrados.length} clientes
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Anterior
                                        </Button>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <Button
                                                    key={page}
                                                    variant={currentPage === page ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setCurrentPage(page)}
                                                    className={currentPage === page ? "bg-purple-600 hover:bg-purple-700" : ""}
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            Siguiente
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </Card>

            {/* Modal Agregar Cliente */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
                        <DialogDescription>Completa la información del nuevo cliente</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nombre">Nombre / Empresa *</Label>
                                <Input
                                    id="nombre"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    placeholder="Ej: TechCorp S.A."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tipo_cliente">Tipo de Cliente *</Label>
                                <Select
                                    value={formData.tipo_cliente}
                                    onValueChange={(value) => setFormData({ ...formData, tipo_cliente: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="empresa">Empresa</SelectItem>
                                        <SelectItem value="persona">Persona Física</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cedula">Cédula *</Label>
                                <Input
                                    id="cedula"
                                    value={formData.cedula}
                                    onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                                    placeholder="1234567890"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="contacto@empresa.com"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="telefono">Teléfono</Label>
                                <Input
                                    id="telefono"
                                    value={formData.telefono}
                                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                    placeholder="+52 55 1234 5678"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="persona_contacto">Persona de Contacto</Label>
                                <Input
                                    id="persona_contacto"
                                    value={formData.persona_contacto}
                                    onChange={(e) => setFormData({ ...formData, persona_contacto: e.target.value })}
                                    placeholder="Juan Pérez"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="ciudad">Ciudad</Label>
                                <Input
                                    id="ciudad"
                                    value={formData.ciudad}
                                    onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                                    placeholder="Ciudad de México"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="estado">Estado</Label>
                                <Input
                                    id="estado"
                                    value={formData.estado}
                                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                    placeholder="CDMX"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="direccion">Dirección</Label>
                            <Input
                                id="direccion"
                                value={formData.direccion}
                                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                                placeholder="Av. Reforma 500, Col. Centro"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notas">Notas</Label>
                            <Textarea
                                id="notas"
                                value={formData.notas}
                                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                                placeholder="Información adicional sobre el cliente..."
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={actionLoading}>
                            Cancelar
                        </Button>
                        <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleAddCliente} disabled={actionLoading}>
                            {actionLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creando...
                                </>
                            ) : (
                                "Agregar Cliente"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Editar Cliente */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Editar Cliente</DialogTitle>
                        <DialogDescription>Actualiza la información del cliente</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-nombre">Nombre / Empresa *</Label>
                                <Input
                                    id="edit-nombre"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-tipo_cliente">Tipo de Cliente *</Label>
                                <Select
                                    value={formData.tipo_cliente}
                                    onValueChange={(value) => setFormData({ ...formData, tipo_cliente: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="empresa">Empresa</SelectItem>
                                        <SelectItem value="persona">Persona Física</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-cedula">Cédula</Label>
                                <Input
                                    id="edit-cedula"
                                    value={formData.cedula}
                                    onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-email">Email</Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-telefono">Teléfono</Label>
                                <Input
                                    id="edit-telefono"
                                    value={formData.telefono}
                                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-persona_contacto">Persona de Contacto</Label>
                                <Input
                                    id="edit-persona_contacto"
                                    value={formData.persona_contacto}
                                    onChange={(e) => setFormData({ ...formData, persona_contacto: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-ciudad">Ciudad</Label>
                                <Input
                                    id="edit-ciudad"
                                    value={formData.ciudad}
                                    onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-estado">Estado</Label>
                                <Input
                                    id="edit-estado"
                                    value={formData.estado}
                                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-direccion">Dirección</Label>
                            <Input
                                id="edit-direccion"
                                value={formData.direccion}
                                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-activo">Estado del Cliente</Label>
                                <Select
                                    value={formData.activo ? "true" : "false"}
                                    onValueChange={(value) => setFormData({ ...formData, activo: value === "true" })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">Activo</SelectItem>
                                        <SelectItem value="false">Inactivo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-notas">Notas</Label>
                            <Textarea
                                id="edit-notas"
                                value={formData.notas}
                                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={actionLoading}>
                            Cancelar
                        </Button>
                        <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleEditCliente} disabled={actionLoading}>
                            {actionLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                "Guardar Cambios"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Eliminar Cliente */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente el cliente{" "}
                            <strong>{selectedCliente?.nombre}</strong> de la base de datos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={actionLoading}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleDeleteCliente}
                            disabled={actionLoading}
                        >
                            {actionLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Eliminando...
                                </>
                            ) : (
                                "Eliminar"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
