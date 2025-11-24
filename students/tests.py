from io import BytesIO
from unittest.mock import patch
from django.test import Client, TestCase
from django.urls import reverse
import pandas as pd

from .forms import StudentForm
from .models import Student
from .services import count_status, generate_career_stats, generate_group_stats


class StudentModelTests(TestCase):
    def test_full_name_property(self):
        student = Student.objects.create(
            first_name='Ana',
            last_name='García',
            career='Ingeniería en Software',
            matricula='MAT001',
            email='ana@test.com',
            phone='55555',
            group='A',
            status='inscrito',
        )
        self.assertEqual(student.full_name, 'Ana García')

    def test_status_choices(self):
        student = Student.objects.create(
            first_name='Luis',
            last_name='Lopez',
            career='Ciencia de Datos',
            matricula='M002',
            email='luis@test.com',
            phone='55555',
            group='B',
            status='egresado',
        )
        self.assertEqual(student.status, 'egresado')


class StudentFormTests(TestCase):
    def test_form_valid(self):
        form = StudentForm(
            data={
                'first_name': 'Luis',
                'last_name': 'Pérez',
                'career': 'Ciencia de Datos',
                'matricula': 'MAT002',
                'email': 'luis@test.com',
                'phone': '5551234',
                'group': 'B1',
                'status': 'inscrito',
                'notes': 'Prueba',
            }
        )
        self.assertTrue(form.is_valid())

    def test_phone_validation(self):
        form = StudentForm(
            data={
                'first_name': 'Eva',
                'last_name': 'Lopez',
                'career': 'Ingeniería en Software',
                'matricula': 'MAT003',
                'email': 'eva@test.com',
                'phone': '123',
                'group': 'B',
                'status': 'inscrito',
            }
        )
        self.assertFalse(form.is_valid())
        self.assertIn('mínimo 6 caracteres', form.errors['phone'][0])

    def test_matricula_regex(self):
        form = StudentForm(
            data={
                'first_name': 'Eva',
                'last_name': 'Lopez',
                'career': 'Ingeniería en Software',
                'matricula': 'MAT#003',
                'email': 'eva@test.com',
                'phone': '555555',
                'group': 'B',
                'status': 'inscrito',
            }
        )
        self.assertFalse(form.is_valid())


class StudentViewsTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.student = Student.objects.create(
            first_name='Mario',
            last_name='Suarez',
            career='Ingeniería en Software',
            matricula='MAT100',
            email='mario@test.com',
            phone='55555',
            group='A',
            status='inscrito',
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
            'first_name': 'New',
            'last_name': 'Student',
            'career': 'Ciberseguridad',
            'matricula': 'MAT200',
            'email': 'new@test.com',
            'phone': '5555555',
            'group': 'C',
            'status': 'inscrito',
        }
        response = self.client.post(reverse('students:student_create'), data)
        self.assertEqual(response.status_code, 302)
        self.assertTrue(Student.objects.filter(matricula='MAT200').exists())

    def test_update_view_post(self):
        response = self.client.post(
            reverse('students:student_update', args=[self.student.pk]),
            {
                'first_name': 'Mario',
                'last_name': 'Actualizado',
                'career': 'Redes y Telecomunicaciones',
                'matricula': 'MAT100',
                'email': 'mario@test.com',
                'phone': '666666',
                'group': 'A1',
                'status': 'baja_temporal',
            },
        )
        self.assertEqual(response.status_code, 302)
        self.student.refresh_from_db()
        self.assertEqual(self.student.last_name, 'Actualizado')
        self.assertEqual(self.student.status, 'baja_temporal')

    def test_delete_view_post(self):
        response = self.client.post(reverse('students:student_delete', args=[self.student.pk]))
        self.assertEqual(response.status_code, 302)
        self.assertFalse(Student.objects.filter(pk=self.student.pk).exists())

    def test_filter_by_group(self):
        Student.objects.create(
            first_name='Otro',
            last_name='Alumno',
            career='Ciencia de Datos',
            matricula='MAT300',
            email='otro@test.com',
            phone='55555',
            group='B',
            status='inscrito',
        )
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
        df = pd.read_excel(BytesIO(response.content))
        self.assertIn('Matrícula', df.columns)
        self.assertIn('Carrera', df.columns)


class ServicesTests(TestCase):
    def setUp(self):
        self.student_a = Student.objects.create(
            first_name='A',
            last_name='Uno',
            career='Ingeniería en Software',
            matricula='S1',
            email='a@test.com',
            phone='55555',
            group='A',
            status='inscrito',
        )
        self.student_b = Student.objects.create(
            first_name='B',
            last_name='Dos',
            career='Ciberseguridad',
            matricula='S2',
            email='b@test.com',
            phone='55555',
            group='B',
            status='baja_definitiva',
        )
        self.student_c = Student.objects.create(
            first_name='C',
            last_name='Tres',
            career='Ciencia de Datos',
            matricula='S3',
            email='c@test.com',
            phone='55555',
            group='A',
            status='inscrito',
        )

    def test_generate_group_stats(self):
        stats = generate_group_stats(Student.objects.all())
        expected = {(row['grupo'], row['carrera']): row['total'] for row in stats}
        self.assertEqual(expected.get(('A', 'Ingeniería en Software')), 1)
        self.assertEqual(expected.get(('A', 'Ciencia de Datos')), 1)

    def test_generate_career_stats(self):
        stats = generate_career_stats(Student.objects.all())
        careers = {row['carrera']: row['total'] for row in stats}
        self.assertEqual(careers.get('Ingeniería en Software'), 1)
        self.assertEqual(careers.get('Ciberseguridad'), 1)

    def test_count_status(self):
        counts = count_status(Student.objects.all())
        self.assertEqual(counts['inscrito'], 2)
        self.assertEqual(counts['baja_definitiva'], 1)

    def test_dashboard_chart_data(self):
        stats = generate_group_stats(Student.objects.all())
        counts = count_status(Student.objects.all())
        labels = [row['grupo'] for row in stats]
        self.assertIn('A', labels)
        self.assertIn('B', labels)
        self.assertEqual(counts['inscrito'], 2)

    @patch('students.views.fetch_universities')
    def test_external_api_view(self, mock_fetch):
        mock_fetch.return_value = {
            'records': [
                {'name': 'Test University', 'country': 'Mexico', 'alpha_two_code': 'MX', 'website': 'http://test.mx'},
                {'name': 'Demo University', 'country': 'Canada', 'alpha_two_code': 'CA', 'website': 'http://demo.ca'},
            ],
            'chart': {'labels': ['Mexico', 'Canada'], 'values': [1, 1]},
        }
        response = self.client.get(reverse('students:universities'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Test University')
        self.assertContains(response, 'Canada')
        mock_fetch.assert_called_once()
