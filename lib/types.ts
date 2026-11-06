export type Plataforma = {
  id: number;
  nombre: string;
};

export type Serie = {
  id: number;
  nombre: string;
  plataforma_id: number;
  plataformas?: Plataforma | null;
};

export type Valoracion = {
  id: number;
  plataforma_id: number;
  serie_id: number;
  puntaje: number;
  observacion: string;
  plataformas?: Plataforma | null;
  series?: Serie | null;
};
