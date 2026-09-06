from django.contrib import admin
from .models import Cliente, Proyecto, Entregable, Comentario


class EntregableInline(admin.TabularInline):
    model = Entregable
    extra = 0


@admin.register(Proyecto)
class ProyectoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'cliente', 'estado_calculado', 'prioridad', 'fecha_limite', 'progreso')
    list_filter = ('estado', 'prioridad', 'cliente')
    search_fields = ('nombre',)
    inlines = [EntregableInline]


admin.site.register(Cliente)
admin.site.register(Entregable)
admin.site.register(Comentario)
