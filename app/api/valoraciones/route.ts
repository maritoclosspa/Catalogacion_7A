import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { jsonError } from "@/lib/http";

const select = "*, plataformas(*), series(*)";

export async function GET(request: NextRequest) {
  try {
    const plataforma = request.nextUrl.searchParams.get("plataforma");
    const serie = request.nextUrl.searchParams.get("serie");
    let query = supabaseServer().from("valoraciones").select(select).order("id", { ascending: false });
    if (plataforma) query = query.eq("plataforma_id", plataforma);
    if (serie) query = query.eq("serie_id", serie);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (error) {
    return jsonError(error, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { plataforma_id, serie_id, puntaje, observacion } = await request.json();
    const score = Number(puntaje);
    if (!plataforma_id || !serie_id || !Number.isInteger(score) || score < 1 || score > 10) {
      return jsonError("Completá plataforma, serie y un puntaje entre 1 y 10.", 422);
    }
    const { data: serie, error: serieError } = await supabaseServer()
      .from("series")
      .select("plataforma_id")
      .eq("id", serie_id)
      .single();
    if (serieError) throw serieError;
    if (Number(serie.plataforma_id) !== Number(plataforma_id)) {
      return jsonError("La serie seleccionada no pertenece a esa plataforma.", 422);
    }
    const { data, error } = await supabaseServer()
      .from("valoraciones")
      .insert({ plataforma_id: Number(plataforma_id), serie_id: Number(serie_id), puntaje: score, observacion: observacion?.trim() || "" })
      .select(select)
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
