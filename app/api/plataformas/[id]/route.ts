import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { jsonError } from "@/lib/http";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { nombre } = await request.json();
    if (!nombre?.trim()) return jsonError("El nombre es obligatorio.", 422);
    const { data, error } = await supabaseServer()
      .from("plataformas")
      .update({ nombre: nombre.trim() })
      .eq("id", params.id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabaseServer()
      .from("plataformas")
      .delete()
      .eq("id", params.id);
    if (error) throw error;
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return jsonError(error);
  }
}
