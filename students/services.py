"""Servicios de negocio y utilidades de datos."""
from __future__ import annotations
from typing import Iterable
from io import BytesIO
import pandas as pd
import requests
from django.conf import settings
from django.utils import timezone
from .models import Student


def generate_group_stats(students: Iterable[Student]) -> list[dict]:
    """Genera estadísticas de estudiantes por grupo utilizando pandas."""
    if not students:
        return []
    data = [{'grupo': s.group, 'estado': s.status} for s in students]
    df = pd.DataFrame(data)
    grouped = df.groupby('grupo').size().reset_index(name='total')
    return grouped.to_dict(orient='records')


def count_status(students: Iterable[Student]) -> dict:
    """Cuenta estudiantes activos e inactivos para métricas de dashboard."""
    if not students:
        return {'activo': 0, 'inactivo': 0}
    df = pd.DataFrame([{'estado': s.status} for s in students])
    counts = df['estado'].value_counts().to_dict()
    return {'activo': counts.get('activo', 0), 'inactivo': counts.get('inactivo', 0)}


def fetch_external_data(limit: int = 10) -> list[dict]:
    """Consume la API externa definida en settings y devuelve una lista de registros."""
    url = settings.EXTERNAL_API_URL
    params = {}
    if settings.EXTERNAL_API_FIELDS:
        params['fields'] = settings.EXTERNAL_API_FIELDS
    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()
    payload = response.json()
    countries = []
    for entry in payload[:limit]:
        countries.append({
            'nombre': entry.get('name', {}).get('common') if isinstance(entry.get('name'), dict) else entry.get('name'),
            'capital': ', '.join(entry.get('capital', [])) if isinstance(entry.get('capital'), list) else entry.get('capital'),
            'region': entry.get('region'),
            'poblacion': entry.get('population'),
        })
    return countries


def dataframe_from_students(students: Iterable[Student]) -> pd.DataFrame:
    """Crea un DataFrame a partir de una lista/queryset de estudiantes."""
    records = [
        {
            'Nombre': s.first_name,
            'Apellidos': s.last_name,
            'Matrícula': s.matricula,
            'Email': s.email,
            'Teléfono': s.phone,
            'Grupo': s.group,
            'Estado': s.status,
            'Notas': s.notes,
            # Excel no admite zona horaria; convertimos a naive preservando hora local
            'Registrado': timezone.make_naive(s.created_at) if timezone.is_aware(s.created_at) else s.created_at,
        }
        for s in students
    ]
    return pd.DataFrame(records)


def export_students_csv(students: Iterable[Student]) -> bytes:
    """Genera un CSV en bytes usando pandas a partir de los estudiantes."""
    df = dataframe_from_students(students)
    return df.to_csv(index=False).encode('utf-8-sig')


def export_students_excel(students: Iterable[Student]) -> BytesIO:
    """Genera un archivo Excel (xlsx) en un buffer para descarga."""
    df = dataframe_from_students(students)
    output = BytesIO()
    # Se usa openpyxl como motor por defecto para compatibilidad con pandas
    df.to_excel(output, index=False, engine='openpyxl')
    output.seek(0)
    return output


def build_chart_data(stats_by_group: list[dict], status_counts: dict) -> dict:
    """Crea diccionarios con datos listos para graficar en Chart.js."""
    group_labels = [row['grupo'] for row in stats_by_group]
    group_values = [row['total'] for row in stats_by_group]
    status_labels = ['Activo', 'Inactivo']
    status_values = [status_counts.get('activo', 0), status_counts.get('inactivo', 0)]
    return {
        'group': {'labels': group_labels, 'values': group_values},
        'status': {'labels': status_labels, 'values': status_values},
    }
