# FreeWorks — Panel de Control para Freelancers

MVP de panel web para que freelancers gestionen sus proyectos, entregables y
comunicación con clientes. Desarrollado con **Angular 17** (frontend) y
**Django 5 + Django REST Framework** (backend), contenerizado con **Docker**.

## Funcionalidades

- Listado de proyectos activos, entregados y pendientes con estado visual
  (En progreso / Finalizado / Atrasado).
- Estado **Atrasado calculado automáticamente** (fecha límite vencida y avance < 100%).
- Cambio de estado manual del proyecto.
- Entregables con fecha, descripción y archivo simulado; % de progreso calculado
  como entregables completados / totales.
- Comentarios del cliente por proyecto.
- Tablero (dashboard) con estadísticas, gráfico de progreso global y alertas
  de proyectos atrasados.
- Filtros por cliente, estado y prioridad; búsqueda por nombre de proyecto o entregable.
- Diseño responsivo con estilos propios (CSS custom properties).

## Estructura

```
freeworks/
├── backend/        # Django + DRF (API REST)
│   ├── freeworks_backend/   # settings, urls
│   ├── panel/               # modelos, serializers, views
│   └── Dockerfile
├── frontend/       # Angular 17 standalone
│   ├── src/app/
│   │   ├── components/      # dashboard, proyecto-list, proyecto-form, proyecto-detail
│   │   └── services/        # api.service.ts
│   ├── Dockerfile
│   └── nginx.conf
└── docker-compose.yml
```

## Ejecución local (sin Docker)

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed           # datos de ejemplo
python manage.py runserver      # API en http://localhost:8000/api/
```

### Frontend
```bash
cd frontend
npm install
npm start                       # http://localhost:4200
```

> El frontend en desarrollo apunta a `http://localhost:8000/api`
> (ver `src/environments/environment.ts`).

## Ejecución con Docker

```bash
docker compose up --build
```

- Frontend: http://localhost:4200
- API: http://localhost:8000/api/ (también proxied en http://localhost:4200/api/)

El contenedor del backend ejecuta migraciones y carga datos de ejemplo
automáticamente al iniciar.

## API principal

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/proyectos/?cliente=&estado=&prioridad=&q=` | Lista con filtros y búsqueda |
| POST | `/api/proyectos/` | Crear proyecto (valida fechas) |
| POST | `/api/proyectos/{id}/cambiar_estado/` | Cambio manual de estado |
| GET/POST | `/api/entregables/` | Entregables (valida fecha vs proyecto) |
| GET/POST | `/api/comentarios/` | Comentarios del cliente |
| GET/POST | `/api/clientes/` | Clientes |

## Flujo de trabajo Git

Ramas `feature/*` integradas a `main` mediante merge, con commits atómicos
y descriptivos (ver historial).
## Autor
- Roberto Farías
