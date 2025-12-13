import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface LoginData {
    username?: string;
    email?: string;
    password: string;
}

// POST - Iniciar sesión
export async function POST(request: NextRequest) {
    try {
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const body: LoginData = await request.json();

        // Validaciones
        if (!body.username && !body.email) {
            return NextResponse.json(
                { error: "Se requiere el nombre de usuario o el correo electrónico" },
                { status: 400 }
            );
        }

        if (!body.password) {
            return NextResponse.json(
                { error: "La contraseña es obligatoria" },
                { status: 400 }
            );
        }

        // Buscar usuario por username o email
        let query = supabase
            .from("Usuarios")
            .select(`
                id,
                username,
                email,
                password_hash,
                nombre_completo,
                activo,
                verificado,
                intentos_fallidos,
                bloqueado_hasta,
                rol:Roles (
                    id,
                    nombre,
                    permisos
                )
            `);

        if (body.username) {
            query = query.eq("username", body.username);
        } else if (body.email) {
            query = query.eq("email", body.email);
        }

        const { data: usuario, error: fetchError } = await query.single();

        if (fetchError || !usuario) {
            return NextResponse.json(
                { error: "Credenciales inválidas" },
                { status: 401 }
            );
        }

        // Verificar si el usuario está bloqueado
        if (usuario.bloqueado_hasta && new Date(usuario.bloqueado_hasta) > new Date()) {
            return NextResponse.json(
                { error: "Cuenta bloqueada temporalmente. Intente más tarde." },
                { status: 403 }
            );
        }

        // Verificar si el usuario está activo
        if (!usuario.activo) {
            return NextResponse.json(
                { error: "Esta cuenta está desactivada" },
                { status: 403 }
            );
        }

        // Verificar la contraseña
        const { data: passwordValid, error: verifyError } = await supabase
            .rpc("verify_password", {
                password: body.password,
                password_hash: usuario.password_hash
            });

        if (verifyError) {
            console.error("Error verifying password:", verifyError);
            return NextResponse.json(
                { error: "Error al verificar las credenciales" },
                { status: 500 }
            );
        }

        if (!passwordValid) {
            // Incrementar intentos fallidos
            const intentos = (usuario.intentos_fallidos || 0) + 1;
            const updateData: Record<string, unknown> = {
                intentos_fallidos: intentos,
                updated_at: new Date().toISOString()
            };

            // Bloquear después de 5 intentos fallidos (por 15 minutos)
            if (intentos >= 5) {
                const bloqueadoHasta = new Date();
                bloqueadoHasta.setMinutes(bloqueadoHasta.getMinutes() + 15);
                updateData.bloqueado_hasta = bloqueadoHasta.toISOString();
            }

            await supabase
                .from("Usuarios")
                .update(updateData)
                .eq("id", usuario.id);

            return NextResponse.json(
                { error: "Credenciales inválidas" },
                { status: 401 }
            );
        }

        // Login exitoso - resetear intentos y actualizar último acceso
        await supabase
            .from("Usuarios")
            .update({
                intentos_fallidos: 0,
                bloqueado_hasta: null,
                ultimo_acceso: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq("id", usuario.id);

        // Retornar datos del usuario (sin password_hash)
        const userData = {
            id: usuario.id,
            username: usuario.username,
            email: usuario.email,
            nombre_completo: usuario.nombre_completo,
            verificado: usuario.verificado,
            rol: usuario.rol
        };

        return NextResponse.json(
            {
                message: "Inicio de sesión exitoso",
                data: userData
            },
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
