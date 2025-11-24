"""Pruebas unitarias para el módulo students."""
from io import BytesIO
from unittest.mock import patch
from django.test import Client, TestCase
from django.urls import reverse
import pandas as pd

from .forms import StudentForm
from .models import Student
from .services import count_status, generate_group_stats


class StudentModelTests(TestCase):
    def test_full_name_property(self):
        student = Student.objects.create(
            first_name='Ana', last_name='García', matricula='MAT001', email='ana@test.com', phone='55555', group='A', status='activo'
        )
        self.assertEqual(student.full_name, 'Ana García')


class StudentFormTests(TestCase):
    def test_form_valid(self):
        form = StudentForm(data={
            'first_name': 'Luis', 'last_name': 'Pérez', 'matricula': 'MAT002', 'email': 'luis@test.com',
            'phone': '5551234', 'group': 'B', 'status': 'activo', 'notes': 'Prueba'
        })
        self.assertTrue(form.is_valid())

    def test_phone_validation(self):
        form = StudentForm(data={
            'first_name': 'Eva', 'last_name': 'Lopez', 'matricula': 'MAT003', 'email': 'eva@test.com',
            'phone': '123', 'group': 'B', 'status': 'activo'
        })
        self.assertFalse(form.is_valid())
        self.assertIn('El teléfono debe contener al menos 5 caracteres.', form.errors['phone'])


class StudentViewsTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.student = Student.objects.create(
            first_name='Mario', last_name='Suarez', matricula='MAT100', email='mario@test.com', phone='55555', group='A', status='activo'
        )

    def test_list_view_ok(self):
        response = self.client.get(reverse('students:student_list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Estudiantes')

    def test_detail_view_ok(self):
        response = self.client.get(reverse('students:student_detail', args=[self.student.pk]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.student.full_name)

    def test_create_view_post(self):
        data = {
            'first_name': 'New', 'last_name': 'Student', 'matricula': 'MAT200', 'email': 'new@test.com',
            'phone': '5555555', 'group': 'C', 'status': 'activo'
        }
        response = self.client.post(reverse('students:student_create'), data)
        self.assertEqual(response.status_code, 302)
        self.assertTrue(Student.objects.filter(matricula='MAT200').exists())

    def test_update_view_post(self):
        response = self.client.post(reverse('students:student_update', args=[self.student.pk]), {
            'first_name': 'Mario', 'last_name': 'Actualizado', 'matricula': 'MAT100', 'email': 'mario@test.com',
            'phone': '666666', 'group': 'A', 'status': 'inactivo'
        })
        self.assertEqual(response.status_code, 302)
        self.student.refresh_from_db()
        self.assertEqual(self.student.last_name, 'Actualizado')
        self.assertEqual(self.student.status, 'inactivo')

    def test_delete_view_post(self):
        response = self.client.post(reverse('students:student_delete', args=[self.student.pk]))
        self.assertEqual(response.status_code, 302)
        self.assertFalse(Student.objects.filter(pk=self.student.pk).exists())

    def test_filter_by_group(self):
        Student.objects.create(first_name='Otro', last_name='Alumno', matricula='MAT300', email='otro@test.com', phone='55555', group='B', status='activo')
        response = self.client.get(reverse('students:student_list'), {'group': 'B'})
        self.assertContains(response, 'MAT300')
        self.assertNotContains(response, 'MAT100')

    def test_export_csv(self):
        response = self.client.get(reverse('students:export_csv'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'].split(';')[0], 'text/csv')
        self.assertIn('estudiantes_', response['Content-Disposition'])
        self.assertIn('MAT100', response.content.decode('utf-8'))

    def test_export_excel(self):
        response = self.client.get(reverse('students:export_excel'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response['Content-Type'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        )
        self.assertIn('estudiantes_', response['Content-Disposition'])
        # Leer pocas filas para validar que el archivo xlsx es legible
        df = pd.read_excel(BytesIO(response.content))
        self.assertIn('Matrícula', df.columns)


class ServicesTests(TestCase):
    def setUp(self):
        self.student_a = Student.objects.create(first_name='A', last_name='Uno', matricula='S1', email='a@test.com', phone='55555', group='A', status='activo')
        self.student_b = Student.objects.create(first_name='B', last_name='Dos', matricula='S2', email='b@test.com', phone='55555', group='B', status='inactivo')
        self.student_c = Student.objects.create(first_name='C', last_name='Tres', matricula='S3', email='c@test.com', phone='55555', group='A', status='activo')

    def test_generate_group_stats(self):
        stats = generate_group_stats(Student.objects.all())
        expected = {row['grupo']: row['total'] for row in stats}
        self.assertEqual(expected.get('A'), 2)
        self.assertEqual(expected.get('B'), 1)

    def test_count_status(self):
        counts = count_status(Student.objects.all())
        self.assertEqual(counts['activo'], 2)
        self.assertEqual(counts['inactivo'], 1)

    def test_dashboard_chart_data(self):
        stats = generate_group_stats(Student.objects.all())
        counts = count_status(Student.objects.all())
        # los datos de grafica deben ser coherentes con los conteos
        labels = [row['grupo'] for row in stats]
        self.assertIn('A', labels)
        self.assertIn('B', labels)
        self.assertEqual(counts['activo'], 2)

    @patch('students.views.fetch_external_data')
    def test_external_api_view(self, mock_fetch):
        mock_fetch.return_value = [{'nombre': 'México', 'capital': 'CDMX', 'region': 'Americas', 'poblacion': 120000000}]
        response = self.client.get(reverse('students:external_api'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'México')
        mock_fetch.assert_called_once()
