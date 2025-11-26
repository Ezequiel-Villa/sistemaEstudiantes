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
    data = [{'grupo': s.grupo, 'estado': s.estado, 'carrera': s.carrera.nombre} for s in students]
    df = pd.DataFrame(data)
    grouped = df.groupby(['grupo', 'carrera']).size().reset_index(name='total')
    return grouped.to_dict(orient='records')


def generate_career_stats(students: Iterable[Student]) -> list[dict]:
    """Devuelve el conteo de estudiantes por carrera."""
    if not students:
        return []
    df = pd.DataFrame([{'carrera': s.carrera.nombre} for s in students])
    grouped = df['carrera'].value_counts().reset_index()
    grouped.columns = ['carrera', 'total']
    return grouped.to_dict(orient='records')


def count_status(students: Iterable[Student]) -> dict:
    """Cuenta estudiantes por estado académico."""
    template = {
        'Inscrito': 0,
        'Baja temporal': 0,
        'Baja definitiva': 0,
        'Egresado': 0,
    }
    if not students:
        return template
    df = pd.DataFrame([{'estado': s.estado} for s in students])
    counts = df['estado'].value_counts().to_dict()
    template.update(counts)
    return template


def fetch_universities(
    country: str | None = None,
    name: str | None = None,
    limit: int = 30,
) -> dict:
    """Consume la API Hipolabs para listar universidades.

    Si la API no responde, devolvemos datos de ejemplo y anotamos
    la advertencia para mostrarla en la interfaz.
    """

    base_url = settings.UNIVERSITIES_API_BASE_URL.rstrip('/')
    params: dict[str, str] = {}
    if country:
        params['country'] = country
    if name:
        params['name'] = name

    try:
        response = requests.get(f"{base_url}/search", params=params, timeout=12)
        response.raise_for_status()
        payload = response.json()
    except Exception as exc:  # pragma: no cover - dependiente de la red
        return _fallback_university_data(params, warning=str(exc))

    records: list[dict] = []
    for entry in payload[:limit]:
        web_pages = entry.get('web_pages') or []
        domains = entry.get('domains') or []
        records.append({
            'name': entry.get('name'),
            'country': entry.get('country'),
            'alpha_two_code': entry.get('alpha_two_code'),
            'website': web_pages[0] if web_pages else None,
            'domain': domains[0] if domains else None,
        })

    chart = _build_university_chart(records)
    return {'records': records, 'chart': chart}


def _build_university_chart(records: list[dict]) -> dict:
    """Genera datos listos para Chart.js con el conteo por país."""
    if not records:
        return {'labels': [], 'values': []}
    df = pd.DataFrame(records)
    counts = df['country'].value_counts().reset_index()
    counts.columns = ['country', 'total']
    return {
        'labels': counts['country'].tolist(),
        'values': counts['total'].tolist(),
    }


def _fallback_university_data(params: dict, warning: str | None = None) -> dict:
    """Datos simulados cuando la API de Hipolabs no está disponible."""
    records = [
        {
            'name': 'National Autonomous University of Mexico',
            'country': 'Mexico',
            'alpha_two_code': 'MX',
            'website': 'http://www.unam.mx/',
            'domain': 'unam.mx',
        },
        {
            'name': 'Massachusetts Institute of Technology',
            'country': 'United States',
            'alpha_two_code': 'US',
            'website': 'http://web.mit.edu/',
            'domain': 'mit.edu',
        },
        {
            'name': 'University of Toronto',
            'country': 'Canada',
            'alpha_two_code': 'CA',
            'website': 'http://www.utoronto.ca/',
            'domain': 'utoronto.ca',
        },
    ]
    data = {'records': records, 'chart': _build_university_chart(records)}
    if warning:
        data['warning'] = warning
    return data


def dataframe_from_students(students: Iterable[Student]) -> pd.DataFrame:
    """Crea un DataFrame a partir de una lista/queryset de estudiantes."""
    records = [
        {
            'Nombre': s.nombre,
            'Apellido paterno': s.apellido_paterno,
            'Apellido materno': s.apellido_materno,
            'Carrera': s.carrera.nombre,
            'Matrícula': s.matricula,
            'Correo': s.correo,
            'Teléfono': s.telefono,
            'Grupo': s.grupo,
            'Estado': s.estado,
            'Fecha de nacimiento': s.fecha_nacimiento,
            'Fecha de inscripción': s.fecha_inscripcion,
            'Dirección': s.direccion,
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
        status_counts.get('Inscrito', 0),
        status_counts.get('Baja temporal', 0),
        status_counts.get('Baja definitiva', 0),
        status_counts.get('Egresado', 0),
    ]
    return {
        'group': {'labels': group_labels, 'values': group_values},
        'status': {'labels': status_labels, 'values': status_values},
    }
