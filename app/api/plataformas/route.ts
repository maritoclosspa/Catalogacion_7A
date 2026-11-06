import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { jsonError } from "@/lib/http";

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("q")?.trim();
    const query = supabaseServer()
      .from("plataformas")
      .select("*")
      .order("nombre");
    const { data, error } = search ? await query.ilike("nombre", `%${search}%`) : await query;
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (error) {
    return jsonError(error, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nombre } = await request.json();
    if (!nombre?.trim()) return jsonError("El nombre es obligatorio.", 422);
    const { data, error } = await supabaseServer()
      .from("plataformas")
      .insert({ nombre: nombre.trim() })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
