"""Modelos de datos para el registro de estudiantes."""
from django.db import models


class Student(models.Model):
    """Representa a un estudiante registrado en el sistema."""

    first_name = models.CharField("Nombre", max_length=100)
    last_name = models.CharField("Apellidos", max_length=150)
    matricula = models.CharField(
        "Matrícula",
        max_length=50,
        unique=True,
        help_text="Identificador único de alumno"
    )
    email = models.EmailField("Correo electrónico", unique=True)
    phone = models.CharField("Teléfono", max_length=30)
    group = models.CharField("Grupo", max_length=50)
    status = models.CharField(
        "Estado",
        max_length=10,
        choices=[('activo', 'Activo'), ('inactivo', 'Inactivo')],
        default='activo'
    )
    notes = models.TextField("Notas", blank=True, null=True)
    created_at = models.DateTimeField("Fecha de registro", auto_now_add=True)

    class Meta:
        ordering = ['last_name', 'first_name']
        verbose_name = "Estudiante"
        verbose_name_plural = "Estudiantes"

    def __str__(self) -> str:  # pragma: no cover - representación simple
        return f"{self.full_name} ({self.matricula})"

    @property
    def full_name(self) -> str:
        """Devuelve el nombre completo del estudiante."""
        return f"{self.first_name} {self.last_name}".strip()
