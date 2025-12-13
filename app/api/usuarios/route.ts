import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export interface UsuarioData {
    username: string;
    email: string;
    password?: string;
    rol_id: number;
    nombre_completo?: string;
    telefono?: string;
    avatar_url?: string;
    activo?: boolean;
    cliente_id?: number;
    empleado_id?: number;
}

// GET - Obtener todos los usuarios (sin incluir password_hash)
export async function GET() {
    try {
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
                    descripcion
                ),
                cliente:Clientes (
                    id,
                    nombre
                ),
                empleado:Empleados (
                    id,
                    nombre,
                    rol
                )
            `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching usuarios:", error);
            return NextResponse.json(
                { error: "Error al obtener los usuarios", details: error.message },
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

// POST - Crear un nuevo usuario
export async function POST(request: NextRequest) {
    try {
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const body: UsuarioData = await request.json();

        // Validaciones
        if (!body.username) {
            return NextResponse.json(
                { error: "El nombre de usuario es obligatorio" },
                { status: 400 }
            );
        }

        if (!body.email) {
            return NextResponse.json(
                { error: "El correo electrónico es obligatorio" },
                { status: 400 }
            );
        }

        if (!body.password) {
            return NextResponse.json(
                { error: "La contraseña es obligatoria" },
                { status: 400 }
            );
        }

        if (!body.rol_id) {
            return NextResponse.json(
                { error: "El rol es obligatorio" },
                { status: 400 }
            );
        }

        // Verificar si el username ya existe
        const { data: existingUser } = await supabase
            .from("Usuarios")
            .select("id")
            .eq("username", body.username)
            .single();

        if (existingUser) {
            return NextResponse.json(
                { error: "El nombre de usuario ya está en uso" },
                { status: 409 }
            );
        }

        // Verificar si el email ya existe
        const { data: existingEmail } = await supabase
            .from("Usuarios")
            .select("id")
            .eq("email", body.email)
            .single();

        if (existingEmail) {
            return NextResponse.json(
                { error: "El correo electrónico ya está en uso" },
                { status: 409 }
            );
        }

        // Hashear la contraseña usando la función de PostgreSQL
        const { data: hashedPassword, error: hashError } = await supabase
            .rpc("hash_password", { password: body.password });

        if (hashError) {
            console.error("Error hashing password:", hashError);
            return NextResponse.json(
                { error: "Error al procesar la contraseña" },
                { status: 500 }
            );
        }

        // Preparar los datos para insertar
        const usuarioData = {
            username: body.username,
            email: body.email,
            password_hash: hashedPassword,
            rol_id: body.rol_id,
            nombre_completo: body.nombre_completo || null,
            telefono: body.telefono || null,
            avatar_url: body.avatar_url || null,
            activo: body.activo !== undefined ? body.activo : true,
            verificado: false,
            cliente_id: body.cliente_id || null,
            empleado_id: body.empleado_id || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from("Usuarios")
            .insert([usuarioData])
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
            console.error("Error creating usuario:", error);
            return NextResponse.json(
                { error: "Error al crear el usuario", details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Usuario creado exitosamente", data },
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
