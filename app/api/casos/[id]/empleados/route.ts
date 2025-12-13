import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Obtener todos los empleados asignados a un caso
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const { data, error } = await supabase
            .from("EmpleadosCasos")
            .select(`
                id,
                rol_en_caso,
                fecha_asignacion,
                notas,
                empleado:Empleados (
                    id,
                    nombre,
                    email,
                    telefono,
                    rol,
                    especialidad,
                    avatar_url,
                    activo
                )
            `)
            .eq("caso_id", id);

        if (error) {
            console.error("Error fetching empleados del caso:", error);
            return NextResponse.json(
                { error: "Error al obtener los empleados del caso", details: error.message },
                { status: 500 }
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

// POST - Asignar un empleado a un caso
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const { id: caso_id } = await params;
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const body = await request.json();

        if (!body.empleado_id) {
            return NextResponse.json(
                { error: "El ID del empleado es obligatorio" },
                { status: 400 }
            );
        }

        const asignacionData = {
            empleado_id: body.empleado_id,
            caso_id: parseInt(caso_id),
            rol_en_caso: body.rol_en_caso || "Asignado",
            notas: body.notas || null,
            fecha_asignacion: new Date().toISOString(),
            created_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from("EmpleadosCasos")
            .insert([asignacionData])
            .select(`
                id,
                rol_en_caso,
                fecha_asignacion,
                empleado:Empleados (
                    id,
                    nombre,
                    email,
                    rol
                )
            `)
            .single();

        if (error) {
            console.error("Error asignando empleado:", error);
            // Verificar si es error de duplicado
            if (error.code === '23505') {
                return NextResponse.json(
                    { error: "Este empleado ya está asignado a este caso" },
                    { status: 409 }
                );
            }
            return NextResponse.json(
                { error: "Error al asignar el empleado", details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Empleado asignado exitosamente", data },
            { status: 201 }
        );
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}

// DELETE - Desasignar un empleado de un caso
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id: caso_id } = await params;
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const { searchParams } = new URL(request.url);
        const empleado_id = searchParams.get("empleado_id");

        if (!empleado_id) {
            return NextResponse.json(
                { error: "El ID del empleado es obligatorio" },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from("EmpleadosCasos")
            .delete()
            .eq("caso_id", caso_id)
            .eq("empleado_id", empleado_id);

        if (error) {
            console.error("Error desasignando empleado:", error);
            return NextResponse.json(
                { error: "Error al desasignar el empleado", details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Empleado desasignado exitosamente" },
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
