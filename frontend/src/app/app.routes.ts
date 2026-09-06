import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProyectoListComponent } from './components/proyecto-list/proyecto-list.component';
import { ProyectoFormComponent } from './components/proyecto-form/proyecto-form.component';
import { ProyectoDetailComponent } from './components/proyecto-detail/proyecto-detail.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'proyectos', component: ProyectoListComponent },
  { path: 'proyectos/nuevo', component: ProyectoFormComponent },
  { path: 'proyectos/:id', component: ProyectoDetailComponent },
  { path: 'proyectos/:id/editar', component: ProyectoFormComponent },
  { path: '**', redirectTo: '' }
];
