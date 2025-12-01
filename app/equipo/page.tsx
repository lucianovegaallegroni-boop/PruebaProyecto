"use client";

import Link from "next/link";
import { useState } from "react";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

// Mock data for team members
const teamMembers = [
    {
        id: 1,
        nombre: "Ana Martínez",
        rol: "Abogada Senior",
        email: "ana.martinez@lawfirm.com",
        telefono: "+52 55 9876 5432",
        avatar: "/placeholder.svg",
        estado: "Activo",
        fechaRegistro: "10 Ene 2025",
    },
    {
        id: 2,
        nombre: "Luis Gómez",
        rol: "Paralegal",
        email: "luis.gomez@lawfirm.com",
        telefono: "+52 55 1234 5678",
        avatar: "/placeholder.svg",
        estado: "Activo",
        fechaRegistro: "22 Feb 2025",
    },
];

export default function TeamListPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredMembers = teamMembers.filter((member) =>
        member.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Equipo</h1>
            <div className="flex items-center gap-4 mb-4">
                <Input
                    placeholder="Buscar miembro..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                />
                <Button>
                    <MoreHorizontal className="w-4 h-4 mr-2" />
                    Acciones
                </Button>
            </div>
            <div className="table-responsive"><Table>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead>ID</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredMembers.map((member) => (
                        <TableRow key={member.id} className="hover:bg-gray-50">
                            <TableCell className="font-mono text-sm font-medium text-purple-600">{member.id}</TableCell>
                            <TableCell className="font-medium">{member.nombre}</TableCell>
                            <TableCell>{member.rol}</TableCell>
                            <TableCell>
                                {member.estado === "Activo" ? (
                                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">Activo</span>
                                ) : (
                                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">Inactivo</span>
                                )}
                            </TableCell>
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
                                        <DropdownMenuItem>
                                            <Edit className="w-4 h-4 mr-2" />
                                            Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-600">
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Eliminar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table></div>
        </div>
    );
}
