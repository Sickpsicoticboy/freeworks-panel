import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Entregable, Proyecto } from '../../models';

@Component({
  selector: 'app-proyecto-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './proyecto-detail.component.html',
  styleUrls: ['./proyecto-detail.component.css']
})
export class ProyectoDetailComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  proyecto?: Proyecto;
  mostrarFormEntregable = false;
  errorApi = '';

  formEntregable = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: [''],
    fecha: ['', Validators.required],
    archivo_nombre: ['']
  });

  formComentario = this.fb.group({
    autor: ['', Validators.required],
    texto: ['', [Validators.required, Validators.minLength(5)]]
  });

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getProyecto(id).subscribe(p => this.proyecto = p);
  }

  cambiarEstado(estado: string): void {
    if (!this.proyecto?.id) return;
    this.api.cambiarEstado(this.proyecto.id, estado).subscribe(p => this.proyecto = p);
  }

  agregarEntregable(): void {
    if (this.formEntregable.invalid || !this.proyecto?.id) {
      this.formEntregable.markAllAsTouched();
      return;
    }
    const datos = { ...this.formEntregable.value, proyecto: this.proyecto.id } as Partial<Entregable>;
    this.api.crearEntregable(datos).subscribe({
      next: () => { this.formEntregable.reset(); this.mostrarFormEntregable = false; this.errorApi = ''; this.cargar(); },
      error: (err) => this.errorApi = JSON.stringify(err.error)
    });
  }

  toggleCompletado(e: Entregable): void {
    if (!e.id) return;
    this.api.actualizarEntregable(e.id, { completado: !e.completado }).subscribe(() => this.cargar());
  }

  agregarComentario(): void {
    if (this.formComentario.invalid || !this.proyecto?.id) {
      this.formComentario.markAllAsTouched();
      return;
    }
    const datos = { ...this.formComentario.value, proyecto: this.proyecto.id };
    this.api.crearComentario(datos as never).subscribe(() => {
      this.formComentario.reset();
      this.cargar();
    });
  }

  c(form: 'e' | 'c', nombre: string) {
    const grupo: FormGroup = form === 'e' ? this.formEntregable : this.formComentario;
    return grupo.get(nombre);
  }
}
