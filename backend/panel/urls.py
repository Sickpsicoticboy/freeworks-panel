from rest_framework.routers import DefaultRouter
from .views import ClienteViewSet, ProyectoViewSet, EntregableViewSet, ComentarioViewSet

router = DefaultRouter()
router.register('clientes', ClienteViewSet)
router.register('proyectos', ProyectoViewSet, basename='proyecto')
router.register('entregables', EntregableViewSet)
router.register('comentarios', ComentarioViewSet)

urlpatterns = router.urls
