"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
    MoreHorizontal,
    Edit,
    Trash2,
    Plus,
    Search,
    Loader2,
    AlertCircle,
    Briefcase,
    Mail,
    Phone,
    User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Tipos
interface EmpleadoAPI {
    id: number;
    nombre: string;
    email: string | null;
    telefono: string | null;
    rol: string;
    especialidad: string | null;
    avatar_url: string | null;
    direccion: string | null;
    fecha_ingreso: string | null;
    salario: number | null;
    numero_empleado: string | null;
    activo: boolean;
    notas: string | null;
    created_at: string | null;
    updated_at: string | null;
}

interface FormData {
    nombre: string;
    email: string;
    telefono: string;
    rol: string;
    especialidad: string;
    direccion: string;
    fecha_ingreso: string;
    notas: string;
    activo: boolean;
}

const initialFormData: FormData = {
    nombre: "",
    email: "",
    telefono: "",
    rol: "Abogado",
    especialidad: "",
    direccion: "",
    fecha_ingreso: new Date().toISOString().split('T')[0],
    notas: "",
    activo: true,
};

const roles = ["Socio", "Abogado Senior", "Abogado", "Paralegal", "Asistente"];
const especialidades = ["Civil", "Penal", "Laboral", "Mercantil", "Administrativo", "Familiar", "Fiscal"];

export default function TeamListPage() {
    // Estados principales
    const [empleados, setEmpleados] = useState<EmpleadoAPI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Estados de UI
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRol, setFilterRol] = useState<string>("todos");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedEmpleado, setSelectedEmpleado] = useState<EmpleadoAPI | null>(null);
    const [formData, setFormData] = useState<FormData>(initialFormData);

    // Cargar empleados
    const fetchEmpleados = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/empleados");
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Error al cargar empleados");
            }

            setEmpleados(result.data || []);
        } catch (err) {
            console.error("Error fetching empleados:", err);
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmpleados();
    }, []);

    // Filtrar empleados
    const filteredMembers = empleados.filter((member) => {
        const matchSearch = member.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
        const matchRol = filterRol === "todos" || member.rol === filterRol;
        return matchSearch && matchRol;
    });

    // Formatear fecha
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Sin fecha";
        // Agregar T12:00:00 si es solo fecha para evitar problemas de timezone
        const date = dateString.includes("T")
            ? new Date(dateString)
            : new Date(dateString + "T12:00:00");
        return date.toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // Abrir modal de agregar
    const handleOpenAddDialog = () => {
        setFormData(initialFormData);
        setIsAddDialogOpen(true);
    };

    // Abrir modal de editar
    const handleOpenEditDialog = (empleado: EmpleadoAPI) => {
        setSelectedEmpleado(empleado);
        setFormData({
            nombre: empleado.nombre,
            email: empleado.email || "",
            telefono: empleado.telefono || "",
            rol: empleado.rol,
            especialidad: empleado.especialidad || "",
            direccion: empleado.direccion || "",
            fecha_ingreso: empleado.fecha_ingreso || "",
            notas: empleado.notas || "",
            activo: empleado.activo,
        });
        setIsEditDialogOpen(true);
    };

    // Abrir modal de eliminar
    const handleOpenDeleteDialog = (empleado: EmpleadoAPI) => {
        setSelectedEmpleado(empleado);
        setIsDeleteDialogOpen(true);
    };

    // Agregar empleado
    const handleAddEmpleado = async () => {
        if (!formData.nombre) {
            alert("El nombre es obligatorio");
            return;
        }

        setActionLoading(true);
        try {
            const response = await fetch("/api/empleados", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Error al crear el empleado");
            }

            await fetchEmpleados();
            setIsAddDialogOpen(false);
            setFormData(initialFormData);
        } catch (err) {
            console.error("Error creating empleado:", err);
            alert(err instanceof Error ? err.message : "Error al crear el empleado");
        } finally {
            setActionLoading(false);
        }
    };

    // Editar empleado
    const handleEditEmpleado = async () => {
        if (!selectedEmpleado) return;

        setActionLoading(true);
        try {
            const response = await fetch(`/api/empleados/${selectedEmpleado.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Error al actualizar el empleado");
            }

            await fetchEmpleados();
            setIsEditDialogOpen(false);
            setSelectedEmpleado(null);
        } catch (err) {
            console.error("Error updating empleado:", err);
            alert(err instanceof Error ? err.message : "Error al actualizar el empleado");
        } finally {
            setActionLoading(false);
        }
    };

    // Eliminar empleado
    const handleDeleteEmpleado = async () => {
        if (!selectedEmpleado) return;

        setActionLoading(true);
        try {
            const response = await fetch(`/api/empleados/${selectedEmpleado.id}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Error al eliminar el empleado");
            }

            await fetchEmpleados();
            setIsDeleteDialogOpen(false);
            setSelectedEmpleado(null);
        } catch (err) {
            console.error("Error deleting empleado:", err);
            alert(err instanceof Error ? err.message : "Error al eliminar el empleado");
        } finally {
            setActionLoading(false);
        }
    };

    // Vista de carga
    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                    <p className="text-gray-500">Cargando equipo...</p>
                </div>
            </div>
        );
    }

    // Vista de error
    if (error) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4 text-center">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <h2 className="text-xl font-semibold text-gray-900">Error al cargar equipo</h2>
                    <p className="text-gray-500">{error}</p>
                    <Button variant="outline" onClick={fetchEmpleados}>
                        Reintentar
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <Card className="border-gray-200">
                <div className="space-y-6 m-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Equipo</h1>
                            <p className="text-gray-600 mt-1">Gestiona los miembros del despacho</p>
                        </div>
                        <Button className="bg-purple-600 hover:bg-purple-700 gap-2" onClick={handleOpenAddDialog}>
                            <Plus className="w-4 h-4" />
                            Nuevo Miembro
                        </Button>
                    </div>

                    {/* Filtros */}
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Buscar miembro..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={filterRol} onValueChange={setFilterRol}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos los roles</SelectItem>
                                {roles.map((rol) => (
                                    <SelectItem key={rol} value={rol}>{rol}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>{empleados.filter((e) => e.activo).length} Activos</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                <span>{empleados.filter((e) => !e.activo).length} Inactivos</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabla */}
                    <Card className="border-gray-200">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50">
                                        <TableHead className="font-medium text-gray-700">Miembro</TableHead>
                                        <TableHead className="font-medium text-gray-700">Contacto</TableHead>
                                        <TableHead className="font-medium text-gray-700">Rol</TableHead>
                                        <TableHead className="font-medium text-gray-700">Especialidad</TableHead>
                                        <TableHead className="font-medium text-gray-700">Estado</TableHead>
                                        <TableHead className="font-medium text-gray-700">Ingreso</TableHead>
                                        <TableHead className="text-right font-medium text-gray-700 w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredMembers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                                {searchTerm || filterRol !== "todos"
                                                    ? "No se encontraron miembros con esos filtros"
                                                    : "No hay miembros registrados. ¡Agrega el primero!"}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredMembers.map((member) => (
                                            <TableRow key={member.id} className="hover:bg-gray-50">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                            <User className="w-5 h-5 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">{member.nombre}</div>
                                                            <div className="text-sm text-gray-500">#{member.id}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        {member.email && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Mail className="w-3 h-3" />
                                                                {member.email}
                                                            </div>
                                                        )}
                                                        {member.telefono && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Phone className="w-3 h-3" />
                                                                {member.telefono}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                                        {member.rol}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {member.especialidad ? (
                                                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                                            <Briefcase className="w-3 h-3 mr-1" />
                                                            {member.especialidad}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="secondary"
                                                        className={member.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}
                                                    >
                                                        {member.activo ? "Activo" : "Inactivo"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-gray-600">{formatDate(member.fecha_ingreso)}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/equipo/${member.id}`}>Ver Perfil</Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleOpenEditDialog(member)}>
                                                                <Edit className="w-4 h-4 mr-2" />
                                                                Editar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() => handleOpenDeleteDialog(member)}
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
                        </CardContent>
                    </Card>
                </div>
            </Card>

            {/* Modal Agregar Empleado */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Agregar Nuevo Miembro</DialogTitle>
                        <DialogDescription>Ingresa la información del nuevo miembro del equipo</DialogDescription>
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
                                <Label htmlFor="rol">Rol *</Label>
                                <Select
                                    value={formData.rol}
                                    onValueChange={(value) => setFormData({ ...formData, rol: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((rol) => (
                                            <SelectItem key={rol} value={rol}>{rol}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="email@lawfirm.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="telefono">Teléfono</Label>
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
                                <Label htmlFor="especialidad">Especialidad</Label>
                                <Select
                                    value={formData.especialidad || "none"}
                                    onValueChange={(value) => setFormData({ ...formData, especialidad: value === "none" ? "" : value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Sin especialidad</SelectItem>
                                        {especialidades.map((esp) => (
                                            <SelectItem key={esp} value={esp}>{esp}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fecha_ingreso">Fecha de Ingreso</Label>
                                <Input
                                    id="fecha_ingreso"
                                    type="date"
                                    value={formData.fecha_ingreso}
                                    onChange={(e) => setFormData({ ...formData, fecha_ingreso: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notas">Notas</Label>
                            <Textarea
                                id="notas"
                                value={formData.notas}
                                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                                placeholder="Información adicional..."
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={actionLoading}>
                            Cancelar
                        </Button>
                        <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleAddEmpleado} disabled={actionLoading}>
                            {actionLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creando...
                                </>
                            ) : (
                                "Agregar Miembro"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Editar Empleado */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Editar Miembro</DialogTitle>
                        <DialogDescription>Actualiza la información del miembro</DialogDescription>
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
                                <Label htmlFor="edit-rol">Rol *</Label>
                                <Select
                                    value={formData.rol}
                                    onValueChange={(value) => setFormData({ ...formData, rol: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((rol) => (
                                            <SelectItem key={rol} value={rol}>{rol}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-email">Email</Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-telefono">Teléfono</Label>
                                <Input
                                    id="edit-telefono"
                                    value={formData.telefono}
                                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-especialidad">Especialidad</Label>
                                <Select
                                    value={formData.especialidad || "none"}
                                    onValueChange={(value) => setFormData({ ...formData, especialidad: value === "none" ? "" : value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Sin especialidad</SelectItem>
                                        {especialidades.map((esp) => (
                                            <SelectItem key={esp} value={esp}>{esp}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-estado">Estado</Label>
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
                        <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleEditEmpleado} disabled={actionLoading}>
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

            {/* Modal Eliminar Empleado */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente a{" "}
                            <strong>{selectedEmpleado?.nombre}</strong> del equipo y sus asignaciones a casos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={actionLoading}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleDeleteEmpleado}
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
    );
}
