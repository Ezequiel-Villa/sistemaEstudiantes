from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='career',
            field=models.CharField(
                choices=[
                    ('Ingeniería en Software', 'Ingeniería en Software'),
                    ('Sistemas Computacionales', 'Sistemas Computacionales'),
                    ('Ciencia de Datos', 'Ciencia de Datos'),
                    ('Ciberseguridad', 'Ciberseguridad'),
                    ('Redes y Telecomunicaciones', 'Redes y Telecomunicaciones'),
                ],
                default='Ingeniería en Software',
                max_length=100,
                verbose_name='Carrera/Especialidad',
            ),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='student',
            name='first_name',
            field=models.CharField(max_length=80, verbose_name='Nombre'),
        ),
        migrations.AlterField(
            model_name='student',
            name='last_name',
            field=models.CharField(max_length=120, verbose_name='Apellidos'),
        ),
        migrations.AlterField(
            model_name='student',
            name='phone',
            field=models.CharField(max_length=25, verbose_name='Teléfono'),
        ),
        migrations.AlterField(
            model_name='student',
            name='status',
            field=models.CharField(
                choices=[
                    ('inscrito', 'Inscrito'),
                    ('baja_temporal', 'Baja temporal'),
                    ('baja_definitiva', 'Baja definitiva'),
                    ('egresado', 'Egresado'),
                ],
                default='inscrito',
                max_length=20,
                verbose_name='Estado',
            ),
        ),
    ]
