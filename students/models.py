"""Modelos de datos para el registro de estudiantes."""
from django.db import models


class Student(models.Model):
    """Representa a un estudiante registrado en el sistema."""

    STATUS_CHOICES = [
        ('inscrito', 'Inscrito'),
        ('baja_temporal', 'Baja temporal'),
        ('baja_definitiva', 'Baja definitiva'),
        ('egresado', 'Egresado'),
    ]

    CAREER_CHOICES = [
        ('Ingeniería en Software', 'Ingeniería en Software'),
        ('Sistemas Computacionales', 'Sistemas Computacionales'),
        ('Ciencia de Datos', 'Ciencia de Datos'),
        ('Ciberseguridad', 'Ciberseguridad'),
        ('Redes y Telecomunicaciones', 'Redes y Telecomunicaciones'),
    ]

    first_name = models.CharField("Nombre", max_length=80)
    last_name = models.CharField("Apellidos", max_length=120)
    career = models.CharField("Carrera/Especialidad", max_length=100, choices=CAREER_CHOICES)
    matricula = models.CharField(
        "Matrícula",
        max_length=50,
        unique=True,
        help_text="Identificador único de alumno"
    )
    email = models.EmailField("Correo electrónico", unique=True)
    phone = models.CharField("Teléfono", max_length=25)
    group = models.CharField("Grupo", max_length=50)
    status = models.CharField(
        "Estado",
        max_length=20,
        choices=STATUS_CHOICES,
        default='inscrito'
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
