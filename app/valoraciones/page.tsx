"use client";

import { FormEvent, useEffect, useState } from "react";
import Modal from "@/components/modal";
import { api } from "@/lib/api";
import { Plataforma, Serie, Valoracion } from "@/lib/types";

export default function ValoracionesPage() {
  const [items, setItems] = useState<Valoracion[]>([]);
  const [platforms, setPlatforms] = useState<Plataforma[]>([]);
  const [series, setSeries] = useState<Serie[]>([]);
  const [filterPlatform, setFilterPlatform] = useState("");
  const [filterSeries, setFilterSeries] = useState("");
  const [editing, setEditing] = useState<Valoracion | null>(null);
  const [open, setOpen] = useState(false);
  const [platformId, setPlatformId] = useState("");
  const [serieId, setSerieId] = useState("");
  const [puntaje, setPuntaje] = useState("8");
  const [observacion, setObservacion] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const params = new URLSearchParams();
      if (filterPlatform) params.set("plataforma", filterPlatform);
      if (filterSeries) params.set("serie", filterSeries);
      const [valoraciones, plataformas, catalogo] = await Promise.all([
        api<Valoracion[]>(`/api/valoraciones?${params}`),
        api<Plataforma[]>("/api/plataformas"),
        api<Serie[]>("/api/series"),
      ]);
      setItems(valoraciones); setPlatforms(plataformas); setSeries(catalogo); setError("");
    } catch (e) { setError((e as Error).message); }
  }
  useEffect(() => { void load(); }, []);
  function beginCreate() { setEditing(null); setPlatformId(""); setSerieId(""); setPuntaje("8"); setObservacion(""); setOpen(true); }
  function beginEdit(item: Valoracion) { setEditing(item); setPlatformId(String(item.plataforma_id)); setSerieId(String(item.serie_id)); setPuntaje(String(item.puntaje)); setObservacion(item.observacion || ""); setOpen(true); }
  async function save(event: FormEvent) {
    event.preventDefault();
    try {
      const body = JSON.stringify({ plataforma_id: platformId, serie_id: serieId, puntaje, observacion });
      if (editing) await api(`/api/valoraciones/${editing.id}`, { method: "PUT", body });
      else await api("/api/valoraciones", { method: "POST", body });
      setOpen(false); setMessage(editing ? "Valoración actualizada." : "Valoración registrada."); await load();
    } catch (e) { setError((e as Error).message); }
  }
  async function remove(item: Valoracion) {
    if (!confirm(`¿Eliminar la valoración de "${item.series?.nombre}"?`)) return;
    try { await api(`/api/valoraciones/${item.id}`, { method: "DELETE" }); await load(); setMessage("Valoración eliminada."); }
    catch (e) { setError((e as Error).message); }
  }
  const formSeries = series.filter((s) => String(s.plataforma_id) === platformId);
  const filterSeriesOptions = series.filter((s) => !filterPlatform || String(s.plataforma_id) === filterPlatform);

  return <div>
    <div className="page-header"><div><h1>Valoraciones</h1><p className="muted">Tus opiniones sobre las series.</p></div><button className="btn btn-primary" onClick={beginCreate}>+ Nueva valoración</button></div>
    {error && <div className="alert alert-error">{error}</div>}{message && <div className="alert alert-success">{message}</div>}
    <section className="card"><div className="toolbar">
      <select className="select" value={filterPlatform} onChange={(e) => { setFilterPlatform(e.target.value); setFilterSeries(""); }}><option value="">Todas las plataformas</option>{platforms.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}</select>
      <select className="select" value={filterSeries} onChange={(e) => setFilterSeries(e.target.value)}><option value="">Todas las series</option>{filterSeriesOptions.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}</select>
      <button className="btn btn-secondary" onClick={load}>Filtrar</button>
    </div><div className="table-wrap"><table><thead><tr><th>Serie</th><th>Plataforma</th><th>Puntaje</th><th>Observación</th><th className="actions">Acciones</th></tr></thead><tbody>
      {items.map((item) => <tr key={item.id}><td><strong>{item.series?.nombre}</strong></td><td><span className="badge">{item.plataformas?.nombre}</span></td><td><span className="rating">{item.puntaje}/10</span></td><td>{item.observacion || "-"}</td><td className="actions"><button className="btn-icon" onClick={() => beginEdit(item)}>Editar</button><button className="btn-icon" onClick={() => remove(item)}>Eliminar</button></td></tr>)}
    </tbody></table></div>{!items.length && <div className="empty">No hay valoraciones registradas.</div>}</section>
    {open && <Modal title={editing ? "Editar valoración" : "Nueva valoración"} onClose={() => setOpen(false)}><form className="form" onSubmit={save}>
      <div className="field"><label htmlFor="rating-platform">Plataforma *</label><select id="rating-platform" className="select" required value={platformId} onChange={(e) => { setPlatformId(e.target.value); setSerieId(""); }}><option value="">Seleccionar...</option>{platforms.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}</select></div>
      <div className="field"><label htmlFor="rating-series">Serie *</label><select id="rating-series" className="select" required value={serieId} onChange={(e) => setSerieId(e.target.value)}><option value="">Seleccionar...</option>{formSeries.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}</select></div>
      <div className="field"><label htmlFor="rating-score">Puntaje (1-10) *</label><select id="rating-score" className="select" required value={puntaje} onChange={(e) => setPuntaje(e.target.value)}>{Array.from({ length: 10 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}</select></div>
      <div className="field"><label htmlFor="rating-observation">Observación</label><textarea id="rating-observation" className="textarea" maxLength={500} value={observacion} onChange={(e) => setObservacion(e.target.value)} /></div>
      <div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>Cancelar</button><button className="btn btn-primary">Guardar</button></div>
    </form></Modal>}
  </div>;
}
