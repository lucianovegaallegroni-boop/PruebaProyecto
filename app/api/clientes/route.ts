import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export interface ClienteData {
    nombre: string;
    tipo_cliente?: string;
    cedula?: string;
    email?: string;
    telefono?: string;
    direccion?: string;
    ciudad?: string;
    estado?: string;
    codigo_postal?: string;
    pais?: string;
    persona_contacto?: string;
    cargo_contacto?: string;
    notas?: string;
    activo?: boolean;
}

// GET - Obtener todos los clientes
export async function GET(request: NextRequest) {
    try {
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        // Verificar si hay filtro por email
        const { searchParams } = new URL(request.url);
        const emailFilter = searchParams.get("email");

        let query = supabase
            .from("Clientes")
            .select("*")
            .order("created_at", { ascending: false });

        if (emailFilter) {
            query = query.eq("email", emailFilter);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching clientes:", error);
            return NextResponse.json(
                { error: "Error al obtener los clientes", details: error.message },
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

// POST - Crear un nuevo cliente Y su usuario automáticamente
export async function POST(request: NextRequest) {
    try {
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const body: ClienteData = await request.json();

        // Validaciones
        if (!body.nombre) {
            return NextResponse.json(
                { error: "El nombre del cliente es obligatorio" },
                { status: 400 }
            );
        }

        if (!body.email) {
            return NextResponse.json(
                { error: "El correo electrónico es obligatorio" },
                { status: 400 }
            );
        }

        if (!body.cedula) {
            return NextResponse.json(
                { error: "La cédula es obligatoria" },
                { status: 400 }
            );
        }

        // Preparar los datos del cliente
        const clienteData = {
            nombre: body.nombre,
            tipo_cliente: body.tipo_cliente || "empresa",
            cedula: body.cedula,
            email: body.email,
            telefono: body.telefono || null,
            direccion: body.direccion || null,
            ciudad: body.ciudad || null,
            estado: body.estado || null,
            codigo_postal: body.codigo_postal || null,
            pais: body.pais || "Ecuador",
            persona_contacto: body.persona_contacto || null,
            cargo_contacto: body.cargo_contacto || null,
            notas: body.notas || null,
            activo: body.activo !== undefined ? body.activo : true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        // 1. Crear el cliente
        const { data: clienteCreado, error: clienteError } = await supabase
            .from("Clientes")
            .insert([clienteData])
            .select()
            .single();

        if (clienteError) {
            console.error("Error creating cliente:", clienteError);
            return NextResponse.json(
                { error: "Error al crear el cliente", details: clienteError.message },
                { status: 500 }
            );
        }

        // 2. Crear el usuario automáticamente
        // Username: email del cliente
        // Password: cédula del cliente
        // Rol: cliente (id = 3)

        // Verificar si ya existe un usuario con ese email
        const { data: existingUser } = await supabase
            .from("Usuarios")
            .select("id")
            .eq("email", body.email)
            .single();

        let usuarioCreado = null;
        let usuarioError = null;

        if (!existingUser) {
            // Hashear la contraseña (la cédula)
            const { data: hashedPassword, error: hashError } = await supabase
                .rpc("hash_password", { password: body.cedula });

            if (hashError) {
                console.error("Error hashing password:", hashError);
                // Continuamos aunque falle el hash, el cliente ya está creado
            } else {
                // Crear el usuario
                const usuarioData = {
                    username: body.email,
                    email: body.email,
                    password_hash: hashedPassword,
                    rol_id: 3, // Rol: cliente
                    nombre_completo: body.nombre,
                    telefono: body.telefono || null,
                    activo: true,
                    verificado: false,
                    cliente_id: clienteCreado.id, // Vincular con el cliente
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };

                const { data: newUser, error: userError } = await supabase
                    .from("Usuarios")
                    .insert([usuarioData])
                    .select(`
                        id,
                        username,
                        email,
                        nombre_completo,
                        rol:Roles (nombre)
                    `)
                    .single();

                usuarioCreado = newUser;
                usuarioError = userError;

                if (userError) {
                    console.error("Error creating usuario for cliente:", userError);
                    // No retornamos error, el cliente ya fue creado exitosamente
                }
            }
        } else {
            // Si ya existe el usuario, vincularlo al cliente
            await supabase
                .from("Usuarios")
                .update({ cliente_id: clienteCreado.id })
                .eq("id", existingUser.id);
        }

        return NextResponse.json(
            {
                message: "Cliente creado exitosamente",
                data: clienteCreado,
                usuario: usuarioCreado ? {
                    creado: true,
                    username: usuarioCreado.username,
                    mensaje: "Usuario creado. Contraseña: la cédula del cliente"
                } : existingUser ? {
                    creado: false,
                    mensaje: "Ya existía un usuario con este email, se vinculó al cliente"
                } : {
                    creado: false,
                    mensaje: usuarioError ? "Error al crear usuario" : "No se pudo crear el usuario"
                }
            },
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
