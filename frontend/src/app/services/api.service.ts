import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cliente, Comentario, Entregable, Filtros, Proyecto } from '../models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  // ----- Proyectos -----
  getProyectos(filtros: Filtros = {}): Observable<Proyecto[]> {
    let params = new HttpParams();
    Object.entries(filtros).forEach(([k, v]) => { if (v) params = params.set(k, v); });
    return this.http.get<Proyecto[]>(`${this.base}/proyectos/`, { params });
  }
  getProyecto(id: number): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${this.base}/proyectos/${id}/`);
  }
  crearProyecto(p: Partial<Proyecto>): Observable<Proyecto> {
    return this.http.post<Proyecto>(`${this.base}/proyectos/`, p);
  }
  actualizarProyecto(id: number, p: Partial<Proyecto>): Observable<Proyecto> {
    return this.http.put<Proyecto>(`${this.base}/proyectos/${id}/`, p);
  }
  eliminarProyecto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/proyectos/${id}/`);
  }
  cambiarEstado(id: number, estado: string): Observable<Proyecto> {
    return this.http.post<Proyecto>(`${this.base}/proyectos/${id}/cambiar_estado/`, { estado });
  }

  // ----- Clientes -----
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.base}/clientes/`);
  }
  crearCliente(c: Partial<Cliente>): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.base}/clientes/`, c);
  }

  // ----- Entregables -----
  crearEntregable(e: Partial<Entregable>): Observable<Entregable> {
    return this.http.post<Entregable>(`${this.base}/entregables/`, e);
  }
  actualizarEntregable(id: number, e: Partial<Entregable>): Observable<Entregable> {
    return this.http.patch<Entregable>(`${this.base}/entregables/${id}/`, e);
  }

  // ----- Comentarios -----
  crearComentario(c: Partial<Comentario>): Observable<Comentario> {
    return this.http.post<Comentario>(`${this.base}/comentarios/`, c);
  }
}
