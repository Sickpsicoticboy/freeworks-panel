import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Cliente } from '../../models';

/** Validacion cruzada: fecha_limite >= fecha_inicio */
function fechasValidas(group: AbstractControl): ValidationErrors | null {
  const inicio = group.get('fecha_inicio')?.value;
  const limite = group.get('fecha_limite')?.value;
  return inicio && limite && limite < inicio ? { fechas: true } : null;
}

@Component({
  selector: 'app-proyecto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './proyecto-form.component.html',
  styleUrls: ['./proyecto-form.component.css']
})
export class ProyectoFormComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  clientes: Cliente[] = [];
  editandoId: number | null = null;
  errorApi = '';

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: [''],
    cliente: ['', Validators.required],
    prioridad: ['MEDIA', Validators.required],
    estado: ['EN_PROGRESO', Validators.required],
    fecha_inicio: ['', Validators.required],
    fecha_limite: ['', Validators.required]
  }, { validators: fechasValidas });

  ngOnInit(): void {
    this.api.getClientes().subscribe(c => this.clientes = c);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editandoId = +id;
      this.api.getProyecto(this.editandoId).subscribe(p => this.form.patchValue(p as never));
    }
  }

  campo(nombre: string) { return this.form.get(nombre); }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const datos = this.form.value as never;
    const peticion = this.editandoId
      ? this.api.actualizarProyecto(this.editandoId, datos)
      : this.api.crearProyecto(datos);
    peticion.subscribe({
      next: () => this.router.navigate(['/proyectos']),
      error: (err) => this.errorApi = JSON.stringify(err.error)
    });
  }
}
