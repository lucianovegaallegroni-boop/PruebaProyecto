import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Obtener un documento específico o generar URL de descarga
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const { searchParams } = new URL(request.url);
        const download = searchParams.get("download") === "true";

        // Obtener metadatos del documento
        const { data: documento, error: docError } = await supabase
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
            .eq("id", id)
            .single();

        if (docError || !documento) {
            return NextResponse.json(
                { error: "Documento no encontrado" },
                { status: 404 }
            );
        }

        // Si se solicita descarga, generar URL firmada
        if (download) {
            const { data: signedUrl, error: urlError } = await supabase.storage
                .from("documentos")
                .createSignedUrl(documento.storage_path, 3600); // 1 hora de validez

            if (urlError) {
                console.error("Error creating signed URL:", urlError);
                return NextResponse.json(
                    { error: "Error al generar URL de descarga" },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                data: documento,
                download_url: signedUrl.signedUrl,
            }, { status: 200 });
        }

        return NextResponse.json({ data: documento }, { status: 200 });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}

// PUT - Actualizar metadatos del documento
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const body = await request.json();

        const updateData = {
            ...body,
            updated_at: new Date().toISOString(),
        };

        // No permitir actualizar ciertos campos
        delete updateData.id;
        delete updateData.created_at;
        delete updateData.storage_path;
        delete updateData.nombre_archivo;
        delete updateData.mime_type;
        delete updateData.tamano_bytes;

        const { data, error } = await supabase
            .from("Documentos")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Error updating documento:", error);
            return NextResponse.json(
                { error: "Error al actualizar el documento", details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Documento actualizado exitosamente", data },
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

// DELETE - Eliminar un documento
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        // Primero obtener el documento para saber la ruta de storage
        const { data: documento, error: fetchError } = await supabase
            .from("Documentos")
            .select("storage_path")
            .eq("id", id)
            .single();

        if (fetchError || !documento) {
            return NextResponse.json(
                { error: "Documento no encontrado" },
                { status: 404 }
            );
        }

        // Eliminar el archivo del storage
        const { error: storageError } = await supabase.storage
            .from("documentos")
            .remove([documento.storage_path]);

        if (storageError) {
            console.error("Error deleting from storage:", storageError);
            // Continuar de todos modos para limpiar la base de datos
        }

        // Eliminar el registro de la base de datos
        const { error: deleteError } = await supabase
            .from("Documentos")
            .delete()
            .eq("id", id);

        if (deleteError) {
            console.error("Error deleting documento:", deleteError);
            return NextResponse.json(
                { error: "Error al eliminar el documento", details: deleteError.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Documento eliminado exitosamente" },
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
