import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Proyecto } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);

  proyectos: Proyecto[] = [];
  cargando = true;

  ngOnInit(): void {
    this.api.getProyectos().subscribe({
      next: (data) => { this.proyectos = data; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  get total(): number { return this.proyectos.length; }
  get enProgreso(): number { return this.proyectos.filter(p => p.estado_calculado === 'EN_PROGRESO').length; }
  get finalizados(): number { return this.proyectos.filter(p => p.estado_calculado === 'FINALIZADO').length; }
  get atrasados(): Proyecto[] { return this.proyectos.filter(p => p.atrasado); }

  get progresoGlobal(): number {
    if (!this.proyectos.length) return 0;
    const suma = this.proyectos.reduce((acc, p) => acc + (p.progreso ?? 0), 0);
    return Math.round(suma / this.proyectos.length);
  }

  /** Longitud del arco para el grafico circular SVG (r=52) */
  get dashArray(): string {
    const c = 2 * Math.PI * 52;
    return `${(this.progresoGlobal / 100) * c} ${c}`;
  }
}
