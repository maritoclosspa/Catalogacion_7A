import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { jsonError } from "@/lib/http";

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("q")?.trim();
    const plataforma = request.nextUrl.searchParams.get("plataforma");
    let query = supabaseServer()
      .from("series")
      .select("*, plataformas(*)")
      .order("nombre");
    if (search) query = query.ilike("nombre", `%${search}%`);
    if (plataforma) query = query.eq("plataforma_id", plataforma);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (error) {
    return jsonError(error, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nombre, plataforma_id } = await request.json();
    if (!nombre?.trim() || !plataforma_id) {
      return jsonError("Nombre y plataforma son obligatorios.", 422);
    }
    const { data, error } = await supabaseServer()
      .from("series")
      .insert({ nombre: nombre.trim(), plataforma_id: Number(plataforma_id) })
      .select("*, plataformas(*)")
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
