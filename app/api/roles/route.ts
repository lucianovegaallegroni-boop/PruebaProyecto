import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// GET - Obtener todos los roles
export async function GET() {
    try {
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const { data, error } = await supabase
            .from("Roles")
            .select("*")
            .eq("activo", true)
            .order("id", { ascending: true });

        if (error) {
            console.error("Error fetching roles:", error);
            return NextResponse.json(
                { error: "Error al obtener los roles", details: error.message },
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
