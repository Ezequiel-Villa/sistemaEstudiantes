"""Script sencillo para perfilar vistas y funciones clave."""
import cProfile
import pstats
from pathlib import Path
from timeit import timeit
from django.test import RequestFactory

from students.views import dashboard
from students.services import generate_group_stats
from students.models import Student


def run_cprofile_dashboard():
    """Ejecuta cProfile sobre la vista de dashboard sin pasar por el servidor."""
    factory = RequestFactory()
    request = factory.get('/')
    cProfile.runctx('dashboard(request)', globals(), locals(), 'profile_dashboard.prof')
    stats = pstats.Stats('profile_dashboard.prof')
    stats.sort_stats('cumtime').print_stats(10)


def measure_group_stats_time():
    """Mide con timeit la generación de estadísticas con pandas."""
    # Crear datos simulados
    students = [
        Student(first_name='Test', last_name=str(i), matricula=f'M{i}', email=f'test{i}@example.com', phone='55555', group='A', status='activo')
        for i in range(50)
    ]
    duration = timeit(lambda: generate_group_stats(students), number=50)
    print(f"Tiempo acumulado en generar estadísticas 50 veces: {duration:.4f} segundos")


if __name__ == '__main__':
    # Aviso al usuario sobre la ubicación de resultados
    print("Ejecutando perfilado con cProfile (archivo profile_dashboard.prof)...")
    run_cprofile_dashboard()
    print("Midiendo tiempo de generate_group_stats con timeit...")
    measure_group_stats_time()
