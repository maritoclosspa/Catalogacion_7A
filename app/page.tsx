import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function count(table: "plataformas" | "series" | "valoraciones") {
  try {
    const { count } = await supabaseServer().from(table).select("*", { count: "exact", head: true });
    return count ?? 0;
  } catch {
    return 0;
  }
}

export default async function Dashboard() {
  const [platformCount, seriesCount, ratingCount] = await Promise.all([count("plataformas"), count("series"), count("valoraciones")]);
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return <div>
    <div className="page-header"><div><h1>Panel principal</h1><p className="muted">Tu biblioteca de series, resumida.</p></div></div>
    {!configured && <div className="alert alert-error">La aplicación necesita las variables de Supabase. Revisá el archivo <strong>.env.example</strong>.</div>}
    <section className="stats">
      <div className="card stat"><div className="stat-value">{platformCount}</div><div className="stat-label">Plataformas</div></div>
      <div className="card stat"><div className="stat-value">{seriesCount}</div><div className="stat-label">Series</div></div>
      <div className="card stat"><div className="stat-value">{ratingCount}</div><div className="stat-label">Valoraciones</div></div>
    </section>
    <div className="dashboard-grid"><section className="card welcome"><h2>Bienvenido a tu catálogo</h2><p className="muted">Administrá plataformas, descubrí qué series tenés registradas y llevá tus valoraciones personales en un solo lugar.</p><div className="quick">
      <Link className="quick-card" href="/plataformas"><strong>Plataformas</strong><span>Gestionar servicios</span></Link>
      <Link className="quick-card" href="/series"><strong>Series</strong><span>Ver el catálogo</span></Link>
      <Link className="quick-card" href="/valoraciones"><strong>Valoraciones</strong><span>Registrar opiniones</span></Link>
    </div></section><section className="card stat"><h3>Estado</h3><p className="muted">{configured ? "Conexión de Supabase configurada." : "Falta configurar Supabase."}</p></section></div>
  </div>;
}
