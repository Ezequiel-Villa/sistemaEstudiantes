"""Rutas de la aplicación students."""
from django.urls import path
from . import views

app_name = 'students'

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('estudiantes/', views.student_list, name='student_list'),
    path('estudiantes/nuevo/', views.student_create, name='student_create'),
    path('estudiantes/<int:pk>/', views.student_detail, name='student_detail'),
    path('estudiantes/<int:pk>/editar/', views.student_update, name='student_update'),
    path('estudiantes/<int:pk>/eliminar/', views.student_delete, name='student_delete'),
    path('estudiantes/exportar/csv/', views.export_students_csv_view, name='export_csv'),
    path('estudiantes/exportar/excel/', views.export_students_excel_view, name='export_excel'),
    path('api-externa/', views.external_api_view, name='external_api'),
]
