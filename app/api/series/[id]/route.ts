import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { jsonError } from "@/lib/http";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { nombre, plataforma_id } = await request.json();
    if (!nombre?.trim() || !plataforma_id) {
      return jsonError("Nombre y plataforma son obligatorios.", 422);
    }
    const { data, error } = await supabaseServer()
      .from("series")
      .update({ nombre: nombre.trim(), plataforma_id: Number(plataforma_id) })
      .eq("id", params.id)
      .select("*, plataformas(*)")
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabaseServer().from("series").delete().eq("id", params.id);
    if (error) throw error;
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return jsonError(error);
  }
}
