import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Cliente, Filtros, Proyecto } from '../../models';

@Component({
  selector: 'app-proyecto-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './proyecto-list.component.html',
  styleUrls: ['./proyecto-list.component.css']
})
export class ProyectoListComponent implements OnInit {
  private api = inject(ApiService);

  proyectos: Proyecto[] = [];
  clientes: Cliente[] = [];
  filtros: Filtros = { cliente: '', estado: '', prioridad: '', q: '' };
  cargando = true;

  ngOnInit(): void {
    this.api.getClientes().subscribe(c => this.clientes = c);
    this.buscar();
  }

  buscar(): void {
    this.cargando = true;
    this.api.getProyectos(this.filtros).subscribe({
      next: data => { this.proyectos = data; this.cargando = false; },
      error: () => this.cargando = false
    });
  }

  limpiar(): void {
    this.filtros = { cliente: '', estado: '', prioridad: '', q: '' };
    this.buscar();
  }

  eliminar(p: Proyecto): void {
    if (!p.id || !confirm(`¿Eliminar el proyecto "${p.nombre}"?`)) return;
    this.api.eliminarProyecto(p.id).subscribe(() => this.buscar());
  }
}
