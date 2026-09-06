from rest_framework import serializers
from .models import Cliente, Proyecto, Entregable, Comentario


class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'


class EntregableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entregable
        fields = '__all__'

    def validate(self, data):
        proyecto = data.get('proyecto') or getattr(self.instance, 'proyecto', None)
        fecha = data.get('fecha') or getattr(self.instance, 'fecha', None)
        if proyecto and fecha and fecha < proyecto.fecha_inicio:
            raise serializers.ValidationError(
                {'fecha': 'El entregable no puede ser anterior al inicio del proyecto.'})
        return data


class ComentarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comentario
        fields = '__all__'


class ProyectoSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    progreso = serializers.IntegerField(read_only=True)
    estado_calculado = serializers.CharField(read_only=True)
    atrasado = serializers.BooleanField(read_only=True)
    entregables = EntregableSerializer(many=True, read_only=True)
    comentarios = ComentarioSerializer(many=True, read_only=True)

    class Meta:
        model = Proyecto
        fields = '__all__'

    def validate(self, data):
        inicio = data.get('fecha_inicio') or getattr(self.instance, 'fecha_inicio', None)
        limite = data.get('fecha_limite') or getattr(self.instance, 'fecha_limite', None)
        if inicio and limite and limite < inicio:
            raise serializers.ValidationError(
                {'fecha_limite': 'La fecha limite no puede ser anterior a la fecha de inicio.'})
        return data
