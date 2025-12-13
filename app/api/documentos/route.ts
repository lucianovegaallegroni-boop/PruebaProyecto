import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// GET - Obtener todos los documentos
export async function GET(request: NextRequest) {
    try {
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const { searchParams } = new URL(request.url);
        const caso_id = searchParams.get("caso_id");
        const cliente_id = searchParams.get("cliente_id");

        let query = supabase
            .from("Documentos")
            .select(`
                *,
                caso:Casos (
                    id,
                    title
                ),
                cliente:Clientes (
                    id,
                    nombre
                ),
                subido_por:Usuarios (
                    id,
                    username,
                    nombre_completo
                )
            `)
            .order("created_at", { ascending: false });

        // Filtrar por caso si se proporciona
        if (caso_id) {
            query = query.eq("caso_id", caso_id);
        }

        // Filtrar por cliente si se proporciona
        if (cliente_id) {
            query = query.eq("cliente_id", cliente_id);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching documentos:", error);
            return NextResponse.json(
                { error: "Error al obtener los documentos", details: error.message },
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

// POST - Subir un nuevo documento
export async function POST(request: NextRequest) {
    try {
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        // Obtener el form data
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const nombre = formData.get("nombre") as string;
        const tipo_documento = formData.get("tipo_documento") as string;
        const descripcion = formData.get("descripcion") as string;
        const caso_id = formData.get("caso_id") as string;
        const cliente_id = formData.get("cliente_id") as string;
        const subido_por = formData.get("subido_por") as string;
        const es_confidencial = formData.get("es_confidencial") === "true";
        const fecha_documento = formData.get("fecha_documento") as string;

        // Validaciones
        if (!file) {
            return NextResponse.json(
                { error: "No se proporcionó ningún archivo" },
                { status: 400 }
            );
        }

        if (!nombre) {
            return NextResponse.json(
                { error: "El nombre del documento es obligatorio" },
                { status: 400 }
            );
        }

        // Generar nombre único para el archivo
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const sanitizedName = nombre.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const storagePath = `${caso_id || 'general'}/${timestamp}_${sanitizedName}.${fileExtension}`;

        // Subir el archivo al bucket
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("documentos")
            .upload(storagePath, file, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            console.error("Error uploading file:", uploadError);
            return NextResponse.json(
                { error: "Error al subir el archivo", details: uploadError.message },
                { status: 500 }
            );
        }

        // Guardar metadatos en la tabla
        const documentoData = {
            nombre: nombre,
            nombre_archivo: file.name,
            tipo_documento: tipo_documento || "general",
            mime_type: file.type,
            tamano_bytes: file.size,
            storage_path: uploadData.path,
            descripcion: descripcion || null,
            caso_id: caso_id ? parseInt(caso_id) : null,
            cliente_id: cliente_id ? parseInt(cliente_id) : null,
            subido_por: subido_por ? parseInt(subido_por) : null,
            es_confidencial: es_confidencial,
            fecha_documento: fecha_documento || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        const { data: documento, error: insertError } = await supabase
            .from("Documentos")
            .insert([documentoData])
            .select()
            .single();

        if (insertError) {
            console.error("Error inserting documento metadata:", insertError);
            // Intentar eliminar el archivo si falla el insert
            await supabase.storage.from("documentos").remove([storagePath]);
            return NextResponse.json(
                { error: "Error al guardar el documento", details: insertError.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Documento subido exitosamente", data: documento },
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
