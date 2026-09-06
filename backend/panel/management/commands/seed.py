"""Datos de ejemplo para el MVP: python manage.py seed"""
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from panel.models import Cliente, Proyecto, Entregable, Comentario


class Command(BaseCommand):
    help = 'Carga datos de ejemplo'

    def handle(self, *args, **options):
        if Cliente.objects.exists():
            self.stdout.write('Ya hay datos, se omite el seed.')
            return
        hoy = date.today()
        c1 = Cliente.objects.create(nombre='Acme Ltda.', email='contacto@acme.cl')
        c2 = Cliente.objects.create(nombre='Nova SpA', email='hola@nova.cl')

        p1 = Proyecto.objects.create(nombre='Sitio corporativo', cliente=c1, prioridad='ALTA',
                                     descripcion='Rediseno del sitio web',
                                     fecha_inicio=hoy - timedelta(days=30), fecha_limite=hoy + timedelta(days=15))
        p2 = Proyecto.objects.create(nombre='App de inventario', cliente=c2, prioridad='MEDIA',
                                     descripcion='MVP movil de inventario',
                                     fecha_inicio=hoy - timedelta(days=60), fecha_limite=hoy - timedelta(days=5))
        p3 = Proyecto.objects.create(nombre='Dashboard ventas', cliente=c1, prioridad='BAJA', estado='FINALIZADO',
                                     descripcion='Panel BI de ventas',
                                     fecha_inicio=hoy - timedelta(days=90), fecha_limite=hoy - timedelta(days=10))

        Entregable.objects.create(proyecto=p1, titulo='Wireframes', fecha=hoy - timedelta(days=20),
                                  archivo_nombre='wireframes.pdf', completado=True)
        Entregable.objects.create(proyecto=p1, titulo='Home responsive', fecha=hoy + timedelta(days=5),
                                  archivo_nombre='home.zip')
        Entregable.objects.create(proyecto=p2, titulo='API productos', fecha=hoy - timedelta(days=10),
                                  archivo_nombre='api_v1.zip', completado=True)
        Entregable.objects.create(proyecto=p2, titulo='App Android', fecha=hoy - timedelta(days=3))
        Entregable.objects.create(proyecto=p3, titulo='Informe final', fecha=hoy - timedelta(days=12),
                                  archivo_nombre='informe.pdf', completado=True)

        Comentario.objects.create(proyecto=p1, autor='Acme', texto='Excelente avance en los wireframes.')
        Comentario.objects.create(proyecto=p2, autor='Nova', texto='Necesitamos acelerar la app Android.')
        self.stdout.write(self.style.SUCCESS('Seed cargado.'))
