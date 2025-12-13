import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Obtener un cliente específico por ID
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const { data, error } = await supabase
            .from("Clientes")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            console.error("Error fetching cliente:", error);
            return NextResponse.json(
                { error: "Error al obtener el cliente", details: error.message },
                { status: 500 }
            );
        }

        if (!data) {
            return NextResponse.json(
                { error: "Cliente no encontrado" },
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

// PUT - Actualizar un cliente existente
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

        const { data, error } = await supabase
            .from("Clientes")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Error updating cliente:", error);
            return NextResponse.json(
                { error: "Error al actualizar el cliente", details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Cliente actualizado exitosamente", data },
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

// DELETE - Eliminar un cliente
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const { error } = await supabase
            .from("Clientes")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error deleting cliente:", error);
            return NextResponse.json(
                { error: "Error al eliminar el cliente", details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Cliente eliminado exitosamente" },
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
