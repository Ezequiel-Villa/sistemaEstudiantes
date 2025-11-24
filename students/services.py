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
    """Genera estadísticas por grupo y carrera utilizando pandas."""
    if not students:
        return []
    data = [{'grupo': s.group, 'estado': s.status, 'carrera': s.career} for s in students]
    df = pd.DataFrame(data)
    grouped = df.groupby(['grupo', 'carrera']).size().reset_index(name='total')
    return grouped.to_dict(orient='records')


def generate_career_stats(students: Iterable[Student]) -> list[dict]:
    """Devuelve el conteo de estudiantes por carrera."""
    if not students:
        return []
    df = pd.DataFrame([{'carrera': s.career} for s in students])
    grouped = df['carrera'].value_counts().reset_index()
    grouped.columns = ['carrera', 'total']
    return grouped.to_dict(orient='records')


def count_status(students: Iterable[Student]) -> dict:
    """Cuenta estudiantes por estado académico."""
    template = {
        'inscrito': 0,
        'baja_temporal': 0,
        'baja_definitiva': 0,
        'egresado': 0,
    }
    if not students:
        return template
    df = pd.DataFrame([{'estado': s.status} for s in students])
    counts = df['estado'].value_counts().to_dict()
    template.update(counts)
    return template


def fetch_education_indicators(
    country_code: str | None = None,
    indicator_code: str | None = None,
    limit: int = 12,
) -> dict:
    """Consume la API de indicadores educativos de UNESCO UIS.

    Si la API no responde (por ejemplo, 404 u otra condición de red),
    devolvemos datos de muestra para mantener la interfaz operativa
    y mostrar un mensaje informativo.
    """
    url = settings.UNESCO_API_URL.rstrip('/')
    params = {
        'format': 'json',
        'time': 'latest',
        'indicator': indicator_code or settings.UNESCO_DEFAULT_INDICATOR,
        'ref_area': country_code or settings.UNESCO_DEFAULT_AREA,
    }
    try:
        response = requests.get(url, params=params, timeout=12)
        response.raise_for_status()
        payload = response.json()
    except Exception as exc:  # pragma: no cover - dependiente de la red
        return _fallback_indicator_data(params, warning=str(exc))

    raw_records = payload.get('data', payload)
    if isinstance(raw_records, dict):
        raw_records = raw_records.get('data', [])
    records: list[dict] = []
    for entry in raw_records[:limit]:
        valor = entry.get('OBS_VALUE') or entry.get('value')
        try:
            valor_num = float(valor)
        except (TypeError, ValueError):
            valor_num = 0
        records.append({
            'pais': entry.get('REF_AREA') or entry.get('ref_area') or entry.get('country'),
            'anio': entry.get('TIME_PERIOD') or entry.get('time'),
            'indicador': entry.get('INDICATOR') or params['indicator'],
            'valor': valor_num,
            'unidad': entry.get('UNIT_MULT') or entry.get('unit'),
        })

    labels = [f"{row.get('pais', 'N/D')} ({row.get('anio', 's/f')})" for row in records]
    values = [row.get('valor', 0) for row in records]
    return {'records': records, 'chart': {'labels': labels, 'values': values}}


def _fallback_indicator_data(params: dict, warning: str | None = None) -> dict:
    """Devuelve datos simulados cuando la API UNESCO no está disponible."""
    records = [
        {'pais': 'MEX', 'anio': '2022', 'indicador': params['indicator'], 'valor': 88.4, 'unidad': '%'},
        {'pais': 'USA', 'anio': '2022', 'indicador': params['indicator'], 'valor': 91.2, 'unidad': '%'},
        {'pais': 'ARG', 'anio': '2022', 'indicador': params['indicator'], 'valor': 86.5, 'unidad': '%'},
    ]
    labels = [f"{row['pais']} ({row['anio']})" for row in records]
    values = [row['valor'] for row in records]
    data = {'records': records, 'chart': {'labels': labels, 'values': values}}
    if warning:
        data['warning'] = warning
    return data


def dataframe_from_students(students: Iterable[Student]) -> pd.DataFrame:
    """Crea un DataFrame a partir de una lista/queryset de estudiantes."""
    records = [
        {
            'Nombre': s.first_name,
            'Apellidos': s.last_name,
            'Carrera': s.career,
            'Matrícula': s.matricula,
            'Email': s.email,
            'Teléfono': s.phone,
            'Grupo': s.group,
            'Estado': dict(Student.STATUS_CHOICES).get(s.status, s.status),
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
    group_labels = [f"{row['grupo']} · {row['carrera']}" for row in stats_by_group]
    group_values = [row['total'] for row in stats_by_group]
    status_labels = ['Inscrito', 'Baja temporal', 'Baja definitiva', 'Egresado']
    status_values = [
        status_counts.get('inscrito', 0),
        status_counts.get('baja_temporal', 0),
        status_counts.get('baja_definitiva', 0),
        status_counts.get('egresado', 0),
    ]
    return {
        'group': {'labels': group_labels, 'values': group_values},
        'status': {'labels': status_labels, 'values': status_values},
    }
