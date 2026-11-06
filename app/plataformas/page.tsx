"use client";

import { FormEvent, useEffect, useState } from "react";
import Modal from "@/components/modal";
import { api } from "@/lib/api";
import { Plataforma } from "@/lib/types";

export default function PlataformasPage() {
  const [items, setItems] = useState<Plataforma[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Plataforma | null>(null);
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try { setItems(await api<Plataforma[]>(`/api/plataformas?q=${encodeURIComponent(search)}`)); setError(""); }
    catch (e) { setError((e as Error).message); }
  }
  useEffect(() => { void load(); }, []);

  function beginCreate() { setEditing(null); setNombre(""); setOpen(true); }
  function beginEdit(item: Plataforma) { setEditing(item); setNombre(item.nombre); setOpen(true); }
  async function submit(event: FormEvent) {
    event.preventDefault();
    try {
      if (editing) await api(`/api/plataformas/${editing.id}`, { method: "PUT", body: JSON.stringify({ nombre }) });
      else await api("/api/plataformas", { method: "POST", body: JSON.stringify({ nombre }) });
      setOpen(false); setMessage(editing ? "Plataforma actualizada." : "Plataforma registrada."); await load();
      window.setTimeout(() => setMessage(""), 2500);
    } catch (e) { setError((e as Error).message); }
  }
  async function remove(item: Plataforma) {
    if (!confirm(`¿Eliminar la plataforma "${item.nombre}"? También se eliminarán sus series asociadas.`)) return;
    try { await api(`/api/plataformas/${item.id}`, { method: "DELETE" }); await load(); setMessage("Plataforma eliminada."); }
    catch (e) { setError((e as Error).message); }
  }

  return (
    <div>
      <div className="page-header"><div><h1>Plataformas</h1><p className="muted">Servicios de streaming disponibles.</p></div><button className="btn btn-primary" onClick={beginCreate}>+ Nueva plataforma</button></div>
      {error && <div className="alert alert-error">{error}</div>}{message && <div className="alert alert-success">{message}</div>}
      <section className="card">
        <div className="toolbar">
          <input className="input search" placeholder="Buscar plataforma..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn btn-secondary" onClick={load}>Buscar</button>
        </div>
        <div className="table-wrap"><table><thead><tr><th>ID</th><th>Nombre</th><th className="actions">Acciones</th></tr></thead>
          <tbody>{items.map((item) => <tr key={item.id}><td>#{item.id}</td><td><strong>{item.nombre}</strong></td><td className="actions"><button className="btn-icon" title="Editar" onClick={() => beginEdit(item)}>Editar</button><button className="btn-icon" title="Eliminar" onClick={() => remove(item)}>Eliminar</button></td></tr>)}</tbody>
        </table></div>
        {!items.length && <div className="empty">No hay plataformas registradas.</div>}
      </section>
      {open && <Modal title={editing ? "Editar plataforma" : "Nueva plataforma"} onClose={() => setOpen(false)}>
        <form className="form" onSubmit={submit}><div className="field"><label htmlFor="nombre">Nombre *</label><input id="nombre" className="input" required maxLength={80} value={nombre} onChange={(e) => setNombre(e.target.value)} /></div><div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>Cancelar</button><button className="btn btn-primary">Guardar</button></div></form>
      </Modal>}
    </div>
  );
}
