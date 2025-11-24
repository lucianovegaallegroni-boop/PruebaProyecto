"use client"

import Link from "next/link"

import { useState } from "react"
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

// Tipos
interface Cliente {
    id: number
    nombre: string
    email: string
    telefono: string
    cedula: string
    empresa: string
    tipo: "Persona Natural" | "Persona Jurídica"
    estado: "Activo" | "Inactivo"
    fechaRegistro: string
    notas: string
}

// Datos de ejemplo
const clientesIniciales: Cliente[] = [
    {
        id: 1,
        nombre: "Juan Pérez García",
        email: "juan.perez@email.com",
        telefono: "+52 55 1234 5678",
        cedula: "V-12345678",
        empresa: "",
        tipo: "Persona Natural",
        estado: "Activo",
        fechaRegistro: "15 Ene 2025",
        notas: "Cliente preferencial, requiere atención prioritaria",
    },
    {
        id: 2,
        nombre: "María González López",
        email: "maria.gonzalez@techcorp.com",
        telefono: "+52 55 8765 4321",
        cedula: "J-87654321",
        empresa: "TechCorp S.A.",
        tipo: "Persona Jurídica",
        estado: "Activo",
        fechaRegistro: "20 Ene 2025",
        notas: "Contrato anual de servicios legales",
    },
    {
        id: 3,
        nombre: "Carlos Ramírez",
        email: "carlos.ramirez@email.com",
        telefono: "+52 55 2468 1357",
        cedula: "V-24681357",
        empresa: "",
        tipo: "Persona Natural",
        estado: "Inactivo",
        fechaRegistro: "10 Dic 2024",
        notas: "Caso cerrado en enero 2025",
    },
    {
        id: 4,
        nombre: "Ana Martínez Silva",
        email: "ana.martinez@inmobiliaria.com",
        telefono: "+52 55 9876 5432",
        cedula: "J-98765432",
        empresa: "Inmobiliaria del Centro",
        tipo: "Persona Jurídica",
        estado: "Activo",
        fechaRegistro: "05 Feb 2025",
        notas: "Especialización en bienes raíces",
    },
    {
        id: 5,
        nombre: "Roberto Sánchez",
        email: "roberto.sanchez@email.com",
        telefono: "+52 55 3691 2580",
        cedula: "J-36912580",
        empresa: "Grupo Financiero XYZ",
        tipo: "Persona Jurídica",
        estado: "Activo",
        fechaRegistro: "12 Feb 2025",
        notas: "Requiere reportes mensuales",
    },
]

export default function ClientesPage() {
    const [clientes, setClientes] = useState<Cliente[]>(clientesIniciales)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterEstado, setFilterEstado] = useState<string>("todos")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const [formData, setFormData] = useState<Partial<Cliente>>({
        nombre: "",
        email: "",
        telefono: "",
        cedula: "",
        empresa: "",
        tipo: "Persona Natural",
        estado: "Activo",
        notas: "",
    })

    // Filtrar clientes
    const clientesFiltrados = clientes.filter((cliente) => {
        const matchSearch =
            cliente.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cliente.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cliente.empresa.toLowerCase().includes(searchQuery.toLowerCase())
        const matchEstado = filterEstado === "todos" || cliente.estado === filterEstado
        return matchSearch && matchEstado
    })

    // Paginación
    const totalPages = Math.ceil(clientesFiltrados.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const clientesPaginados = clientesFiltrados.slice(startIndex, endIndex)

    // Abrir modal de agregar
    const handleOpenAddDialog = () => {
        setFormData({
            nombre: "",
            email: "",
            telefono: "",
            cedula: "",
            empresa: "",
            tipo: "Persona Natural",
            estado: "Activo",
            notas: "",
        })
        setIsAddDialogOpen(true)
    }

    // Abrir modal de editar
    const handleOpenEditDialog = (cliente: Cliente) => {
        setSelectedCliente(cliente)
        setFormData(cliente)
        setIsEditDialogOpen(true)
    }

    // Abrir modal de eliminar
    const handleOpenDeleteDialog = (cliente: Cliente) => {
        setSelectedCliente(cliente)
        setIsDeleteDialogOpen(true)
    }

    // Agregar cliente
    const handleAddCliente = () => {
        const nuevoCliente: Cliente = {
            id: Math.max(...clientes.map((c) => c.id)) + 1,
            nombre: formData.nombre || "",
            email: formData.email || "",
            telefono: formData.telefono || "",
            cedula: formData.cedula || "",
            empresa: formData.empresa || "",
            tipo: formData.tipo || "Persona Natural",
            estado: "Activo",
            fechaRegistro: new Date().toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }),
            notas: formData.notas || "",
        }
        setClientes([...clientes, nuevoCliente])
        setIsAddDialogOpen(false)
    }

    // Editar cliente
    const handleEditCliente = () => {
        if (selectedCliente) {
            setClientes(
                clientes.map((c) =>
                    c.id === selectedCliente.id ? { ...c, ...formData } : c
                )
            )
            setIsEditDialogOpen(false)
            setSelectedCliente(null)
        }
    }

    // Eliminar cliente
    const handleDeleteCliente = () => {
        if (selectedCliente) {
            setClientes(clientes.filter((c) => c.id !== selectedCliente.id))
            setIsDeleteDialogOpen(false)
            setSelectedCliente(null)
        }
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
                                <span>{clientes.filter((c) => c.estado === "Activo").length} Activos</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                <span>{clientes.filter((c) => c.estado === "Inactivo").length} Inactivos</span>
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
                                    {clientesPaginados.map((cliente) => (
                                        <TableRow key={cliente.id} className="hover:bg-gray-50">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                        {cliente.tipo === "Persona Jurídica" ? (
                                                            <Building2 className="w-5 h-5 text-purple-600" />
                                                        ) : (
                                                            <User className="w-5 h-5 text-purple-600" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{cliente.nombre}</div>
                                                        <div className="text-sm text-gray-600">{cliente.cedula}</div>
                                                        {cliente.tipo === "Persona Jurídica" && cliente.empresa && (
                                                            <div className="text-sm text-gray-500 italic">{cliente.empresa}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Mail className="w-3 h-3" />
                                                        {cliente.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Phone className="w-3 h-3" />
                                                        {cliente.telefono}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                                    {cliente.tipo}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className={
                                                        cliente.estado === "Activo"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-100 text-gray-700"
                                                    }
                                                >
                                                    {cliente.estado}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-gray-600">{cliente.fechaRegistro}</TableCell>
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
                                    ))}
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
                                <Label htmlFor="nombre">Nombre Completo *</Label>
                                <Input
                                    id="nombre"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    placeholder="Ej: Juan Pérez García"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cedula">Cédula *</Label>
                                <Input
                                    id="cedula"
                                    value={formData.cedula}
                                    onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                                    placeholder="V-12345678 o J-12345678"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="ejemplo@email.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="telefono">Teléfono *</Label>
                                <Input
                                    id="telefono"
                                    value={formData.telefono}
                                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                    placeholder="+52 55 1234 5678"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="tipo">Tipo de Cliente *</Label>
                                <Select
                                    value={formData.tipo}
                                    onValueChange={(value: "Persona Natural" | "Persona Jurídica") =>
                                        setFormData({ ...formData, tipo: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Persona Natural">Persona Natural</SelectItem>
                                        <SelectItem value="Persona Jurídica">Persona Jurídica</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {formData.tipo === "Persona Jurídica" && (
                                <div className="space-y-2">
                                    <Label htmlFor="empresa">Empresa/Organización *</Label>
                                    <Input
                                        id="empresa"
                                        value={formData.empresa}
                                        onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                                        placeholder="Nombre de la empresa"
                                    />
                                </div>
                            )}
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
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleAddCliente}>
                            Agregar Cliente
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
                                <Label htmlFor="edit-nombre">Nombre Completo *</Label>
                                <Input
                                    id="edit-nombre"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-cedula">Cédula *</Label>
                                <Input
                                    id="edit-cedula"
                                    value={formData.cedula}
                                    onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-email">Email *</Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-telefono">Teléfono *</Label>
                                <Input
                                    id="edit-telefono"
                                    value={formData.telefono}
                                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-tipo">Tipo de Cliente *</Label>
                                <Select
                                    value={formData.tipo}
                                    onValueChange={(value: "Persona Natural" | "Persona Jurídica") =>
                                        setFormData({ ...formData, tipo: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Persona Natural">Persona Natural</SelectItem>
                                        <SelectItem value="Persona Jurídica">Persona Jurídica</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {formData.tipo === "Persona Jurídica" && (
                                <div className="space-y-2">
                                    <Label htmlFor="edit-empresa">Empresa/Organización *</Label>
                                    <Input
                                        id="edit-empresa"
                                        value={formData.empresa}
                                        onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-estado">Estado *</Label>
                                <Select
                                    value={formData.estado}
                                    onValueChange={(value: "Activo" | "Inactivo") =>
                                        setFormData({ ...formData, estado: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Activo">Activo</SelectItem>
                                        <SelectItem value="Inactivo">Inactivo</SelectItem>
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
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleEditCliente}>
                            Guardar Cambios
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
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleDeleteCliente}
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
