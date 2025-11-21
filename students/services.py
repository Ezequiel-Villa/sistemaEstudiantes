"""Servicios de negocio y utilidades de datos."""
from __future__ import annotations
from typing import Iterable
import pandas as pd
import requests
from django.conf import settings
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
