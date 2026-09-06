from datetime import date
from django.core.exceptions import ValidationError
from django.db import models


class Cliente(models.Model):
    nombre = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    class Meta:
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class Proyecto(models.Model):
    class Estado(models.TextChoices):
        EN_PROGRESO = 'EN_PROGRESO', 'En progreso'
        FINALIZADO = 'FINALIZADO', 'Finalizado'
        ATRASADO = 'ATRASADO', 'Atrasado'

    class Prioridad(models.TextChoices):
        ALTA = 'ALTA', 'Alta'
        MEDIA = 'MEDIA', 'Media'
        BAJA = 'BAJA', 'Baja'

    nombre = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='proyectos')
    estado = models.CharField(max_length=20, choices=Estado.choices, default=Estado.EN_PROGRESO)
    prioridad = models.CharField(max_length=10, choices=Prioridad.choices, default=Prioridad.MEDIA)
    fecha_inicio = models.DateField()
    fecha_limite = models.DateField()
    creado = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['fecha_limite']

    def clean(self):
        """Validacion de negocio: la fecha limite no puede ser anterior al inicio."""
        if self.fecha_limite and self.fecha_inicio and self.fecha_limite < self.fecha_inicio:
            raise ValidationError({'fecha_limite': 'La fecha limite no puede ser anterior a la fecha de inicio.'})

    @property
    def progreso(self):
        """Porcentaje de entregables completados (0-100)."""
        total = self.entregables.count()
        if total == 0:
            return 0
        completados = self.entregables.filter(completado=True).count()
        return round(completados * 100 / total)

    @property
    def estado_calculado(self):
        """Logica de estados: FINALIZADO manual manda; si no, se marca
        ATRASADO cuando la fecha limite ya vencio y el avance no es 100%."""
        if self.estado == self.Estado.FINALIZADO:
            return self.Estado.FINALIZADO
        if self.fecha_limite < date.today() and self.progreso < 100:
            return self.Estado.ATRASADO
        return self.estado

    @property
    def atrasado(self):
        return self.estado_calculado == self.Estado.ATRASADO

    def __str__(self):
        return self.nombre


class Entregable(models.Model):
    proyecto = models.ForeignKey(Proyecto, on_delete=models.CASCADE, related_name='entregables')
    titulo = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True)
    fecha = models.DateField()
    archivo_nombre = models.CharField(
        max_length=200, blank=True,
        help_text='Archivo simulado (solo nombre, sin subida real en el MVP)')
    completado = models.BooleanField(default=False)

    class Meta:
        ordering = ['fecha']

    def clean(self):
        """El entregable debe caer dentro del plazo del proyecto."""
        if self.proyecto_id and self.fecha:
            if self.fecha < self.proyecto.fecha_inicio:
                raise ValidationError({'fecha': 'El entregable no puede ser anterior al inicio del proyecto.'})

    def __str__(self):
        return f'{self.titulo} ({self.proyecto.nombre})'


class Comentario(models.Model):
    proyecto = models.ForeignKey(Proyecto, on_delete=models.CASCADE, related_name='comentarios')
    autor = models.CharField(max_length=100)
    texto = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-fecha']

    def __str__(self):
        return f'{self.autor}: {self.texto[:30]}'
