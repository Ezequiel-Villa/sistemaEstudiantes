# Sistema de Registro de Estudiantes (Django)

Proyecto académico que implementa un CRUD completo de estudiantes utilizando **Django**, **Bootstrap 5** y librerías auxiliares como `requests`, `pandas` y `python-dotenv`. Se adapta un diseño previo para mantener la estética con plantillas de Django y HTML estándar.

## Tecnologías principales
- Python 3.11+
- Django 5 (MVT)
- SQLite
- Bootstrap 5 + Bootstrap Icons
- Librerías: `requests`, `pandas`, `python-dotenv`, `openpyxl` (exportación Excel)
- Frontend: plantillas Django con **Bootstrap 5**, **Bootstrap Icons** y visualizaciones con **Chart.js** (CDN)

## Estructura del proyecto
```
student_registry/        # Configuración del proyecto
students/                # App principal (modelos, vistas, formularios, servicios, tests)
templates/               # Plantillas Django (base y vistas)
static/                  # Estilos adicionales
profiling.py             # Script de perfilado (cProfile y timeit)
requirements.txt         # Dependencias de Python
```

## Modelo Student
Campos principales: `first_name`, `last_name`, `career` (Carrera/Especialidad con choices), `matricula` (única), `email`, `phone`, `group`, `status` (Inscrito, Baja temporal, Baja definitiva, Egresado), `notes`, `created_at`.
- Choices de carrera incluidos: Ingeniería en Software, Sistemas Computacionales, Ciencia de Datos, Ciberseguridad, Redes y Telecomunicaciones.
- El estado usa exactamente cuatro opciones: Inscrito, Baja temporal, Baja definitiva, Egresado.

## Vistas clave
- **Dashboard**: métricas de estudiantes por estado (inscritos, bajas, egresados), conteo de grupos, tabla generada con `pandas` por grupo y carrera, gráficas dinámicas de grupo, estados y distribución por carrera con Chart.js.
- **Listado**: filtros por nombre/matrícula, grupo y estado; acciones de detalle, edición y eliminación; botones para exportar CSV o Excel.
- **Crear/Editar**: formularios con validaciones y mensajes de éxito/error.
- **Detalle**: visualización de la ficha del estudiante.
- **Eliminar**: confirmación de borrado.
- **Indicadores educativos**: consumo de la API de **UNESCO UIS** usando `requests`, configurable por variables de entorno. Permite filtrar por código de país y código de indicador y muestra tabla + gráfica.

## Variables de entorno
Se cargan con `python-dotenv` desde `.env` (opcional):
```
DJANGO_SECRET_KEY=clave-segura
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
UNESCO_API_URL=https://api.uis.unesco.org/sdmx/cube
UNESCO_DEFAULT_INDICATOR=SE.TER.ENRR
UNESCO_DEFAULT_AREA=MEX;USA;ARG
```

## Instalación y ejecución
1. **Crear entorno virtual**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # En Windows: .\.venv\Scripts\Activate.ps1
   ```
2. **Instalar dependencias**
   ```bash
   pip install -r requirements.txt
   ```
3. **Aplicar migraciones**
   ```bash
   python manage.py migrate
   ```
4. **(Opcional) crear superusuario**
   ```bash
   python manage.py createsuperuser
   ```
5. **Cargar datos iniciales (opcional)**: usa el formulario “Nuevo estudiante”.
6. **Ejecutar servidor**
   ```bash
   python manage.py runserver
   ```
   Visita `http://127.0.0.1:8000/`.

## Pruebas unitarias
Se usan las pruebas integradas de Django (`unittest`). Ejecutar:
```bash
python manage.py test
```
Las pruebas cubren modelo, formularios (incluyendo validaciones reforzadas y nuevo campo de carrera), vistas (GET/POST), filtros, exportaciones CSV/Excel, servicios con `pandas` (estadísticas por grupo y carrera), datos para gráficas y una prueba mockeada de la API de indicadores UNESCO.

## Perfilado y rendimiento
- **cProfile**:
  ```bash
  python profiling.py
  ```
  Genera `profile_dashboard.prof` y muestra las 10 funciones más costosas de la vista de dashboard. El script inicializa
  Django automáticamente (no necesitas exportar `DJANGO_SETTINGS_MODULE`) y al final imprime el ranking. Una salida típica
  muestra la vista `dashboard` como la más costosa, seguida de la renderización de plantillas, con un tiempo total cercano a
  décimas de segundo en entornos locales.
- **timeit**: dentro del mismo script se mide `generate_group_stats` con datos simulados y se imprime el tiempo acumulado. Si
  ves tiempos en el orden de milisegundos o décimas de segundo para ~50 ejecuciones, el comportamiento es el esperado.

## Notas sobre el diseño
- Se respetó la estructura visual del diseño original adaptándola a **Bootstrap 5**, eliminando dependencias de frameworks JS pesados.
- Los estilos adicionales están en `static/css/styles.css` para mantener tarjetas redondeadas e iconos circulares.
- Las gráficas del dashboard se renderizan con Chart.js (CDN) usando datos generados por `pandas`, incluyendo la nueva distribución por carrera y los cuatro estados académicos.
- La exportación de estudiantes a CSV/Excel está disponible desde el listado mediante el botón "Exportar" e incluye el campo de carrera.

## Ejecución en Windows + VS Code (paso a paso)
1. Instalar **Python 3** y **pip** desde [python.org](https://python.org).
2. Instalar **VS Code** y la extensión de Python.
3. (Opcional) clonar el repositorio con Git.
4. Abrir el proyecto en VS Code y abrir la terminal integrada.
5. Crear entorno virtual:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```
   Si aparece advertencia de ejecución de scripts, ejecutar: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` y reintentar.
6. Instalar dependencias: `pip install -r requirements.txt`.
7. Migraciones: `python manage.py migrate`.
8. Crear superusuario (opcional): `python manage.py createsuperuser`.
9. Levantar servidor: `python manage.py runserver` y abrir `http://127.0.0.1:8000/`.
10. Ejecutar pruebas: `python manage.py test`.
11. Perfilado: `python profiling.py` (crea el archivo `profile_dashboard.prof` y muestra métricas de tiempo).

## Créditos
Proyecto implementado con propósitos educativos para demostrar integración completa Django + Bootstrap + librerías de análisis y consumo de APIs.
