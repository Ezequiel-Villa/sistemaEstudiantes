#!/usr/bin/env python
"""
Punto de entrada para las utilidades de administración de Django.
Se mantiene igual que el generado por startproject para asegurar compatibilidad.
"""
import os
import sys


def main():
    """Ejecuta las tareas administrativas de Django."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'student_registry.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "No se pudo importar Django. Asegúrate de que está instalado y accesible en el entorno actual."
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
