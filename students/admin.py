"""Configuración del panel de administración para estudiantes."""
from django.contrib import admin
from .models import Career, Student


@admin.register(Career)
class CareerAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'clave', 'created_at')
    search_fields = ('nombre', 'clave')
    ordering = ('nombre',)


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = (
        'nombre',
        'apellido_paterno',
        'apellido_materno',
        'matricula',
        'correo',
        'grupo',
        'estado',
        'created_at',
    )
    search_fields = ('nombre', 'apellido_paterno', 'apellido_materno', 'matricula', 'correo', 'grupo')
    list_filter = ('estado', 'grupo', 'carrera')
    ordering = ('apellido_paterno', 'apellido_materno', 'nombre')
