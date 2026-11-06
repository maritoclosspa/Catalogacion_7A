"use client";

import { FormEvent, useEffect, useState } from "react";
import Modal from "@/components/modal";
import { api } from "@/lib/api";
import { Plataforma, Serie } from "@/lib/types";

export default function SeriesPage() {
  const [items, setItems] = useState<Serie[]>([]);
  const [platforms, setPlatforms] = useState<Plataforma[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState<Serie | null>(null);
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [plataformaId, setPlataformaId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (filter) params.set("plataforma", filter);
      const [series, plataformas] = await Promise.all([api<Serie[]>(`/api/series?${params}`), api<Plataforma[]>("/api/plataformas")]);
      setItems(series); setPlatforms(plataformas); setError("");
    } catch (e) { setError((e as Error).message); }
  }
  useEffect(() => { void load(); }, []);
  function beginCreate() { setEditing(null); setNombre(""); setPlataformaId(""); setOpen(true); }
  function beginEdit(item: Serie) { setEditing(item); setNombre(item.nombre); setPlataformaId(String(item.plataforma_id)); setOpen(true); }
  async function save(event: FormEvent) {
    event.preventDefault();
    try {
      const body = JSON.stringify({ nombre, plataforma_id: plataformaId });
      if (editing) await api(`/api/series/${editing.id}`, { method: "PUT", body });
      else await api("/api/series", { method: "POST", body });
      setOpen(false); setMessage(editing ? "Serie actualizada." : "Serie registrada."); await load();
    } catch (e) { setError((e as Error).message); }
  }
  async function remove(item: Serie) {
    if (!confirm(`¿Eliminar la serie "${item.nombre}"?`)) return;
    try { await api(`/api/series/${item.id}`, { method: "DELETE" }); await load(); setMessage("Serie eliminada."); }
    catch (e) { setError((e as Error).message); }
  }

  return <div>
    <div className="page-header"><div><h1>Series</h1><p className="muted">Organizá tu catálogo por plataforma.</p></div><button className="btn btn-primary" onClick={beginCreate}>+ Nueva serie</button></div>
    {error && <div className="alert alert-error">{error}</div>}{message && <div className="alert alert-success">{message}</div>}
    <section className="card"><div className="toolbar">
      <input className="input search" placeholder="Buscar serie..." value={search} onChange={(e) => setSearch(e.target.value)} />
      <select className="select" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="">Todas las plataformas</option>{platforms.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}</select>
      <button className="btn btn-secondary" onClick={load}>Buscar</button>
    </div><div className="table-wrap"><table><thead><tr><th>ID</th><th>Nombre</th><th>Plataforma</th><th className="actions">Acciones</th></tr></thead><tbody>
      {items.map((item) => <tr key={item.id}><td>#{item.id}</td><td><strong>{item.nombre}</strong></td><td><span className="badge">{item.plataformas?.nombre}</span></td><td className="actions"><button className="btn-icon" onClick={() => beginEdit(item)}>Editar</button><button className="btn-icon" onClick={() => remove(item)}>Eliminar</button></td></tr>)}
    </tbody></table></div>{!items.length && <div className="empty">No hay series que coincidan.</div>}</section>
    {open && <Modal title={editing ? "Editar serie" : "Nueva serie"} onClose={() => setOpen(false)}><form className="form" onSubmit={save}>
      <div className="field"><label htmlFor="serie-nombre">Nombre *</label><input id="serie-nombre" className="input" required maxLength={120} value={nombre} onChange={(e) => setNombre(e.target.value)} /></div>
      <div className="field"><label htmlFor="serie-plataforma">Plataforma *</label><select id="serie-plataforma" className="select" required value={plataformaId} onChange={(e) => setPlataformaId(e.target.value)}><option value="">Seleccionar...</option>{platforms.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}</select></div>
      <div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>Cancelar</button><button className="btn btn-primary">Guardar</button></div>
    </form></Modal>}
  </div>;
}
