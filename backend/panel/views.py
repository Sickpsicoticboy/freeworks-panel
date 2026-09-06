from django.db.models import Q
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Cliente, Proyecto, Entregable, Comentario
from .serializers import (ClienteSerializer, ProyectoSerializer,
                          EntregableSerializer, ComentarioSerializer)


class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer


class ProyectoViewSet(viewsets.ModelViewSet):
    serializer_class = ProyectoSerializer

    def get_queryset(self):
        """Filtros: ?cliente=<id>&estado=<ESTADO>&prioridad=<PRIORIDAD>&q=<texto>
        La busqueda cubre nombre del proyecto y titulo de entregables."""
        qs = Proyecto.objects.select_related('cliente').prefetch_related('entregables', 'comentarios')
        cliente = self.request.query_params.get('cliente')
        estado = self.request.query_params.get('estado')
        prioridad = self.request.query_params.get('prioridad')
        q = self.request.query_params.get('q')
        if cliente:
            qs = qs.filter(cliente_id=cliente)
        if prioridad:
            qs = qs.filter(prioridad=prioridad)
        if q:
            qs = qs.filter(Q(nombre__icontains=q) | Q(entregables__titulo__icontains=q)).distinct()
        if estado:
            # El estado ATRASADO es calculado, se filtra en memoria
            qs = [p for p in qs if p.estado_calculado == estado]
        return qs

    @action(detail=True, methods=['post'])
    def cambiar_estado(self, request, pk=None):
        """Cambio manual de estado (requerimiento funcional)."""
        proyecto = self.get_object()
        nuevo = request.data.get('estado')
        if nuevo not in Proyecto.Estado.values:
            return Response({'error': f'Estado invalido. Opciones: {Proyecto.Estado.values}'}, status=400)
        proyecto.estado = nuevo
        proyecto.save()
        return Response(ProyectoSerializer(proyecto).data)


class EntregableViewSet(viewsets.ModelViewSet):
    queryset = Entregable.objects.select_related('proyecto')
    serializer_class = EntregableSerializer


class ComentarioViewSet(viewsets.ModelViewSet):
    queryset = Comentario.objects.select_related('proyecto')
    serializer_class = ComentarioSerializer
