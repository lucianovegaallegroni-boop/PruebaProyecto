import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Obtener un usuario específico por ID
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const { data, error } = await supabase
            .from("Usuarios")
            .select(`
                id,
                username,
                email,
                nombre_completo,
                telefono,
                avatar_url,
                ultimo_acceso,
                activo,
                verificado,
                created_at,
                updated_at,
                rol:Roles (
                    id,
                    nombre,
                    descripcion,
                    permisos
                ),
                cliente:Clientes (
                    id,
                    nombre,
                    email,
                    telefono
                ),
                empleado:Empleados (
                    id,
                    nombre,
                    email,
                    rol,
                    especialidad
                )
            `)
            .eq("id", id)
            .single();

        if (error) {
            console.error("Error fetching usuario:", error);
            return NextResponse.json(
                { error: "Error al obtener el usuario", details: error.message },
                { status: 500 }
            );
        }

        if (!data) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}

// PUT - Actualizar un usuario existente
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const body = await request.json();

        // Preparar los datos para actualizar
        const updateData: Record<string, unknown> = {
            updated_at: new Date().toISOString(),
        };

        // Solo actualizar campos que fueron enviados
        if (body.username !== undefined) updateData.username = body.username;
        if (body.email !== undefined) updateData.email = body.email;
        if (body.nombre_completo !== undefined) updateData.nombre_completo = body.nombre_completo;
        if (body.telefono !== undefined) updateData.telefono = body.telefono;
        if (body.avatar_url !== undefined) updateData.avatar_url = body.avatar_url;
        if (body.rol_id !== undefined) updateData.rol_id = body.rol_id;
        if (body.activo !== undefined) updateData.activo = body.activo;
        if (body.verificado !== undefined) updateData.verificado = body.verificado;
        if (body.cliente_id !== undefined) updateData.cliente_id = body.cliente_id;
        if (body.empleado_id !== undefined) updateData.empleado_id = body.empleado_id;

        // Si se envía una nueva contraseña, hashearla
        if (body.password) {
            const { data: hashedPassword, error: hashError } = await supabase
                .rpc("hash_password", { password: body.password });

            if (hashError) {
                console.error("Error hashing password:", hashError);
                return NextResponse.json(
                    { error: "Error al procesar la contraseña" },
                    { status: 500 }
                );
            }
            updateData.password_hash = hashedPassword;
        }

        const { data, error } = await supabase
            .from("Usuarios")
            .update(updateData)
            .eq("id", id)
            .select(`
                id,
                username,
                email,
                nombre_completo,
                activo,
                rol:Roles (
                    id,
                    nombre
                )
            `)
            .single();

        if (error) {
            console.error("Error updating usuario:", error);
            return NextResponse.json(
                { error: "Error al actualizar el usuario", details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Usuario actualizado exitosamente", data },
            { status: 200 }
        );
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}

// DELETE - Eliminar un usuario
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const { error } = await supabase
            .from("Usuarios")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error deleting usuario:", error);
            return NextResponse.json(
                { error: "Error al eliminar el usuario", details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Usuario eliminado exitosamente" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
