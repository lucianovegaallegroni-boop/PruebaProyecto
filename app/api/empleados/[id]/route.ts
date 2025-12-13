import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Obtener un empleado específico por ID (incluye sus casos asignados)
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        // Obtener empleado
        const { data: empleado, error: empleadoError } = await supabase
            .from("Empleados")
            .select("*")
            .eq("id", id)
            .single();

        if (empleadoError) {
            console.error("Error fetching empleado:", empleadoError);
            return NextResponse.json(
                { error: "Error al obtener el empleado", details: empleadoError.message },
                { status: 500 }
            );
        }

        if (!empleado) {
            return NextResponse.json(
                { error: "Empleado no encontrado" },
                { status: 404 }
            );
        }

        // Obtener casos asignados al empleado
        const { data: casosAsignados, error: casosError } = await supabase
            .from("EmpleadosCasos")
            .select(`
                id,
                rol_en_caso,
                fecha_asignacion,
                caso:Casos (
                    id,
                    title,
                    client_name,
                    status,
                    practice_area
                )
            `)
            .eq("empleado_id", id);

        if (casosError) {
            console.error("Error fetching casos asignados:", casosError);
        }

        return NextResponse.json({
            data: {
                ...empleado,
                casos_asignados: casosAsignados || []
            }
        }, { status: 200 });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}

// PUT - Actualizar un empleado existente
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const body = await request.json();

        // Preparar los datos para actualizar
        const updateData = {
            ...body,
            updated_at: new Date().toISOString(),
        };

        // Eliminar campos que no deberían actualizarse
        delete updateData.id;
        delete updateData.created_at;
        delete updateData.casos_asignados;

        const { data, error } = await supabase
            .from("Empleados")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Error updating empleado:", error);
            return NextResponse.json(
                { error: "Error al actualizar el empleado", details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Empleado actualizado exitosamente", data },
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

// DELETE - Eliminar un empleado
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const { error } = await supabase
            .from("Empleados")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error deleting empleado:", error);
            return NextResponse.json(
                { error: "Error al eliminar el empleado", details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Empleado eliminado exitosamente" },
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
