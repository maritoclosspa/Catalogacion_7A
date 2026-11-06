import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { jsonError } from "@/lib/http";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { plataforma_id, serie_id, puntaje, observacion } = await request.json();
    const score = Number(puntaje);
    if (!plataforma_id || !serie_id || !Number.isInteger(score) || score < 1 || score > 10) {
      return jsonError("Completá plataforma, serie y un puntaje entre 1 y 10.", 422);
    }
    const { data: serie, error: serieError } = await supabaseServer()
      .from("series").select("plataforma_id").eq("id", serie_id).single();
    if (serieError) throw serieError;
    if (Number(serie.plataforma_id) !== Number(plataforma_id)) {
      return jsonError("La serie seleccionada no pertenece a esa plataforma.", 422);
    }
    const { data, error } = await supabaseServer()
      .from("valoraciones")
      .update({ plataforma_id: Number(plataforma_id), serie_id: Number(serie_id), puntaje: score, observacion: observacion?.trim() || "" })
      .eq("id", params.id)
      .select("*, plataformas(*), series(*)")
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabaseServer().from("valoraciones").delete().eq("id", params.id);
    if (error) throw error;
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return jsonError(error);
  }
}
