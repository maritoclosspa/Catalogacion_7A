create table if not exists public.plataformas (
  id bigint generated always as identity primary key,
  nombre text not null,
  constraint plataformas_nombre_unique unique (nombre)
);

create table if not exists public.series (
  id bigint generated always as identity primary key,
  nombre text not null,
  plataforma_id bigint not null references public.plataformas(id) on delete cascade,
  constraint series_nombre_plataforma_unique unique (nombre, plataforma_id),
  constraint series_id_plataforma_unique unique (id, plataforma_id)
);

create table if not exists public.valoraciones (
  id bigint generated always as identity primary key,
  plataforma_id bigint not null references public.plataformas(id),
  serie_id bigint not null references public.series(id) on delete cascade,
  puntaje smallint not null check (puntaje between 1 and 10),
  observacion text not null default '',
  constraint valoracion_serie_plataforma_fk foreign key (serie_id, plataforma_id)
    references public.series(id, plataforma_id)
    deferrable initially deferred,
  constraint valoracion_serie_unica unique (serie_id)
);

create index if not exists series_plataforma_idx on public.series(plataforma_id);
create index if not exists valoraciones_plataforma_idx on public.valoraciones(plataforma_id);

alter table public.plataformas enable row level security;
alter table public.series enable row level security;
alter table public.valoraciones enable row level security;

create policy "Acceso público de lectura plataformas"
  on public.plataformas for select using (true);
create policy "Acceso público de escritura plataformas"
  on public.plataformas for all using (true) with check (true);
create policy "Acceso público de lectura series"
  on public.series for select using (true);
create policy "Acceso público de escritura series"
  on public.series for all using (true) with check (true);
create policy "Acceso público de lectura valoraciones"
  on public.valoraciones for select using (true);
create policy "Acceso público de escritura valoraciones"
  on public.valoraciones for all using (true) with check (true);
