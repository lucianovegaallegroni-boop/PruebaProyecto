import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export interface CaseData {
    title: string;
    description?: string;
    client_name: string;
    contact_person?: string;
    client_email?: string;
    client_phone?: string;
    practice_area?: string;
    case_type?: string;
    opponent?: string;
    opponent_lawyer?: string;
    file_number?: string;
    court?: string;
    jurisdiction?: string;
    judge?: string;
    status?: string;
    next_hearing?: string;
    amount?: number;
    fees?: string;
    responsible_lawyer?: string;
    assistants?: string;
    strategy?: string;
    risks?: string;
}

// GET - Obtener todos los casos
export async function GET() {
    try {
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const { data, error } = await supabase
            .from("Casos")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching cases:", error);
            return NextResponse.json(
                { error: "Error al obtener los casos", details: error.message },
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

// POST - Crear un nuevo caso
export async function POST(request: NextRequest) {
    try {
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const body: CaseData = await request.json();

        // Validación básica
        if (!body.title || !body.client_name) {
            return NextResponse.json(
                { error: "El título y nombre del cliente son obligatorios" },
                { status: 400 }
            );
        }

        // Preparar los datos para insertar
        const caseData = {
            title: body.title,
            description: body.description || null,
            client_name: body.client_name,
            contact_person: body.contact_person || null,
            client_email: body.client_email || null,
            client_phone: body.client_phone || null,
            practice_area: body.practice_area || null,
            case_type: body.case_type || null,
            opponent: body.opponent || null,
            opponent_lawyer: body.opponent_lawyer || null,
            file_number: body.file_number || null,
            court: body.court || null,
            jurisdiction: body.jurisdiction || null,
            judge: body.judge || null,
            status: body.status || "inicio",
            next_hearing: body.next_hearing ? new Date(body.next_hearing).toISOString() : null,
            amount: body.amount || null,
            fees: body.fees || null,
            responsible_lawyer: body.responsible_lawyer || null,
            assistants: body.assistants || null,
            strategy: body.strategy || null,
            risks: body.risks || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            start_date: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from("Casos")
            .insert([caseData])
            .select()
            .single();

        if (error) {
            console.error("Error creating case:", error);
            return NextResponse.json(
                { error: "Error al crear el caso", details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Caso creado exitosamente", data },
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
