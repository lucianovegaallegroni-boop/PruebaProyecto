import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export interface EmpleadoData {
    nombre: string;
    email?: string;
    telefono?: string;
    rol?: string;
    especialidad?: string;
    avatar_url?: string;
    direccion?: string;
    fecha_ingreso?: string;
    salario?: number;
    numero_empleado?: string;
    activo?: boolean;
    notas?: string;
}

// GET - Obtener todos los empleados
export async function GET() {
    try {
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const { data, error } = await supabase
            .from("Empleados")
            .select("*")
            .order("nombre", { ascending: true });

        if (error) {
            console.error("Error fetching empleados:", error);
            return NextResponse.json(
                { error: "Error al obtener los empleados", details: error.message },
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

// POST - Crear un nuevo empleado
export async function POST(request: NextRequest) {
    try {
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const body: EmpleadoData = await request.json();

        // Validación básica
        if (!body.nombre) {
            return NextResponse.json(
                { error: "El nombre del empleado es obligatorio" },
                { status: 400 }
            );
        }

        // Preparar los datos para insertar
        const empleadoData = {
            nombre: body.nombre,
            email: body.email || null,
            telefono: body.telefono || null,
            rol: body.rol || "Abogado",
            especialidad: body.especialidad || null,
            avatar_url: body.avatar_url || null,
            direccion: body.direccion || null,
            fecha_ingreso: body.fecha_ingreso || new Date().toISOString().split('T')[0],
            salario: body.salario || null,
            numero_empleado: body.numero_empleado || null,
            activo: body.activo !== undefined ? body.activo : true,
            notas: body.notas || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from("Empleados")
            .insert([empleadoData])
            .select()
            .single();

        if (error) {
            console.error("Error creating empleado:", error);
            return NextResponse.json(
                { error: "Error al crear el empleado", details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Empleado creado exitosamente", data },
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
