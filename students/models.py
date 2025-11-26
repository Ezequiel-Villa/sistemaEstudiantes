"""Modelos de datos para el registro de estudiantes."""
from django.db import models


class Career(models.Model):
    """Catálogo de carreras universitarias."""

    nombre = models.CharField("Nombre", max_length=200)
    clave = models.CharField("Clave", max_length=10, unique=True)
    created_at = models.DateTimeField("Creado", auto_now_add=True)

    class Meta:
        ordering = ['nombre']
        verbose_name = "Carrera"
        verbose_name_plural = "Carreras"

    def __str__(self) -> str:  # pragma: no cover - representación simple
        return f"{self.nombre} ({self.clave})"


class Student(models.Model):
    """Representa a un estudiante registrado en el sistema."""

    STATUS_CHOICES = [
        ('Inscrito', 'Inscrito'),
        ('Baja temporal', 'Baja temporal'),
        ('Baja definitiva', 'Baja definitiva'),
        ('Egresado', 'Egresado'),
    ]

    nombre = models.CharField("Nombre", max_length=100)
    apellido_paterno = models.CharField("Apellido paterno", max_length=100)
    apellido_materno = models.CharField("Apellido materno", max_length=100)
    matricula = models.CharField(
        "Matrícula",
        max_length=20,
        unique=True,
        help_text="Identificador único de alumno"
    )
    correo = models.EmailField("Correo electrónico", unique=True)
    telefono = models.CharField("Teléfono", max_length=15)
    direccion = models.TextField("Dirección")
    fecha_nacimiento = models.DateField("Fecha de nacimiento")
    grupo = models.CharField("Grupo", max_length=10)
    carrera = models.ForeignKey(Career, verbose_name="Carrera", on_delete=models.PROTECT, related_name="estudiantes")
    estado = models.CharField("Estado", max_length=20, choices=STATUS_CHOICES, default='Inscrito')
    fecha_inscripcion = models.DateField("Fecha de inscripción")
    created_at = models.DateTimeField("Creado", auto_now_add=True)
    updated_at = models.DateTimeField("Actualizado", auto_now=True)

    class Meta:
        ordering = ['apellido_paterno', 'apellido_materno', 'nombre']
        verbose_name = "Estudiante"
        verbose_name_plural = "Estudiantes"

    def __str__(self) -> str:  # pragma: no cover - representación simple
        return f"{self.full_name} ({self.matricula})"

    @property
    def full_name(self) -> str:
        """Devuelve el nombre completo del estudiante."""
        return f"{self.nombre} {self.apellido_paterno} {self.apellido_materno}".strip()
