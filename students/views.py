"""Vistas principales del sistema de registro de estudiantes."""
from __future__ import annotations
from django.contrib import messages
from django.db.models import Q
from django.http import HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone

from .forms import StudentForm
from .models import Student
from .services import (
    build_chart_data,
    count_status,
    export_students_csv,
    export_students_excel,
    fetch_education_indicators,
    generate_career_stats,
    generate_group_stats,
)


def dashboard(request: HttpRequest) -> HttpResponse:
    """Pantalla principal con métricas y estadísticas rápidas."""
    students = Student.objects.all()
    status_counts = count_status(students)
    groups_count = students.values('group').distinct().count()
    stats_by_group = generate_group_stats(students)
    career_stats = generate_career_stats(students)
    charts = build_chart_data(stats_by_group, status_counts)
    charts['career'] = {
        'labels': [row['carrera'] for row in career_stats],
        'values': [row['total'] for row in career_stats],
    }

    context = {
        'students_total': students.count(),
        'status_counts': status_counts,
        'groups_count': groups_count,
        'stats_by_group': stats_by_group,
        'charts': charts,
        'career_stats': career_stats,
    }
    return render(request, 'students/dashboard.html', context)


def student_list(request: HttpRequest) -> HttpResponse:
    """Lista y filtro de estudiantes."""
    query = request.GET.get('q', '').strip()
    group_filter = request.GET.get('group', '').strip()
    status_filter = request.GET.get('status', '').strip()

    students = Student.objects.all()
    if query:
        students = students.filter(
            Q(first_name__icontains=query)
            | Q(last_name__icontains=query)
            | Q(matricula__icontains=query)
        )
    if group_filter:
        students = students.filter(group__iexact=group_filter)
    if status_filter:
        students = students.filter(status=status_filter)

    groups = Student.objects.values_list('group', flat=True).distinct()

    return render(
        request,
        'students/student_list.html',
        {'students': students, 'query': query, 'group_filter': group_filter, 'status_filter': status_filter, 'groups': groups},
    )


def student_detail(request: HttpRequest, pk: int) -> HttpResponse:
    """Detalle de un estudiante específico."""
    student = get_object_or_404(Student, pk=pk)
    return render(request, 'students/student_detail.html', {'student': student})


def student_create(request: HttpRequest) -> HttpResponse:
    """Crea un estudiante y muestra mensajes de éxito o error."""
    if request.method == 'POST':
        form = StudentForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Estudiante creado correctamente.')
            return redirect('students:student_list')
        messages.error(request, 'Revisa los campos obligatorios e intenta nuevamente.')
    else:
        form = StudentForm()
    return render(request, 'students/student_form.html', {'form': form, 'is_edit': False})


def student_update(request: HttpRequest, pk: int) -> HttpResponse:
    """Actualiza los datos de un estudiante existente."""
    student = get_object_or_404(Student, pk=pk)
    if request.method == 'POST':
        form = StudentForm(request.POST, instance=student)
        if form.is_valid():
            form.save()
            messages.success(request, 'Estudiante actualizado correctamente.')
            return redirect('students:student_detail', pk=student.pk)
        messages.error(request, 'No se pudo actualizar, valida los campos.')
    else:
        form = StudentForm(instance=student)
    return render(request, 'students/student_form.html', {'form': form, 'is_edit': True, 'student': student})


def student_delete(request: HttpRequest, pk: int) -> HttpResponse:
    """Elimina un estudiante tras confirmación."""
    student = get_object_or_404(Student, pk=pk)
    if request.method == 'POST':
        student.delete()
        messages.success(request, 'Estudiante eliminado correctamente.')
        return redirect('students:student_list')
    return render(request, 'students/student_confirm_delete.html', {'student': student})


def education_indicators_view(request: HttpRequest) -> HttpResponse:
    """Muestra indicadores educativos de UNESCO UIS usando requests."""
    data: dict | None = None
    error: str | None = None
    warning: str | None = None
    country = request.GET.get('country') or None
    indicator = request.GET.get('indicator') or None
    try:
        data = fetch_education_indicators(country_code=country, indicator_code=indicator, limit=10)
    except Exception as exc:  # pragma: no cover - manejo de conectividad
        error = f"No fue posible obtener indicadores educativos: {exc}"
    if data and data.get('warning'):
        warning = f"Mostrando datos de ejemplo porque la API respondió con: {data['warning']}"
    context = {'data': data, 'error': error, 'warning': warning}
    return render(request, 'students/external_api.html', context)


def export_students_csv_view(request: HttpRequest) -> HttpResponse:
    """Devuelve todos los estudiantes en formato CSV descargable."""
    filename = f"estudiantes_{timezone.now().strftime('%Y%m%d_%H%M%S')}.csv"
    content = export_students_csv(Student.objects.all())
    response = HttpResponse(content, content_type='text/csv; charset=utf-8')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    return response


def export_students_excel_view(request: HttpRequest) -> HttpResponse:
    """Devuelve todos los estudiantes en formato Excel (xlsx)."""
    filename = f"estudiantes_{timezone.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    buffer = export_students_excel(Student.objects.all())
    response = HttpResponse(
        buffer.getvalue(),
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    return response
