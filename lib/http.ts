import { NextResponse } from "next/server";

export function jsonError(error: unknown, status = 400) {
  const message =
    error instanceof Error ? error.message : "Ocurrió un error inesperado.";
  return NextResponse.json({ error: message }, { status });
}
