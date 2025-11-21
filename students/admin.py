"""Configuración del panel de administración para estudiantes."""
from django.contrib import admin
from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'matricula', 'email', 'group', 'status', 'created_at')
    search_fields = ('first_name', 'last_name', 'matricula', 'email', 'group')
    list_filter = ('status', 'group')
    ordering = ('last_name', 'first_name')
