export interface Cliente {
  id: number;
  nombre: string;
  email: string;
}

export interface Entregable {
  id?: number;
  proyecto: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  archivo_nombre: string;
  completado: boolean;
}

export interface Comentario {
  id?: number;
  proyecto: number;
  autor: string;
  texto: string;
  fecha?: string;
}

export type Estado = 'EN_PROGRESO' | 'FINALIZADO' | 'ATRASADO';
export type Prioridad = 'ALTA' | 'MEDIA' | 'BAJA';

export interface Proyecto {
  id?: number;
  nombre: string;
  descripcion: string;
  cliente: number;
  cliente_nombre?: string;
  estado: Estado;
  estado_calculado?: Estado;
  atrasado?: boolean;
  prioridad: Prioridad;
  fecha_inicio: string;
  fecha_limite: string;
  progreso?: number;
  entregables?: Entregable[];
  comentarios?: Comentario[];
}

export interface Filtros {
  cliente?: string;
  estado?: string;
  prioridad?: string;
  q?: string;
}
