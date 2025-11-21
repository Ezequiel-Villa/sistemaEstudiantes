# Generated manually para incluir la estructura inicial del modelo Student
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=100, verbose_name='Nombre')),
                ('last_name', models.CharField(max_length=150, verbose_name='Apellidos')),
                ('matricula', models.CharField(help_text='Identificador único de alumno', max_length=50, unique=True, verbose_name='Matrícula')),
                ('email', models.EmailField(max_length=254, unique=True, verbose_name='Correo electrónico')),
                ('phone', models.CharField(max_length=30, verbose_name='Teléfono')),
                ('group', models.CharField(max_length=50, verbose_name='Grupo')),
                ('status', models.CharField(choices=[('activo', 'Activo'), ('inactivo', 'Inactivo')], default='activo', max_length=10, verbose_name='Estado')),
                ('notes', models.TextField(blank=True, null=True, verbose_name='Notas')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Fecha de registro')),
            ],
            options={
                'verbose_name': 'Estudiante',
                'verbose_name_plural': 'Estudiantes',
                'ordering': ['last_name', 'first_name'],
            },
        ),
    ]
