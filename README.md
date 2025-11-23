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
Campos principales: `first_name`, `last_name`, `matricula` (única), `email`, `phone`, `group`, `status` (activo/inactivo), `notes`, `created_at`.

## Vistas clave
- **Dashboard**: métricas de estudiantes, activos/inactivos, grupos, tabla generada con `pandas` por grupo y gráficas dinámicas (barra/donut) renderizadas con Chart.js.
- **Listado**: filtros por nombre/matrícula, grupo y estado; acciones de detalle, edición y eliminación; botones para exportar CSV o Excel.
- **Crear/Editar**: formularios con validaciones y mensajes de éxito/error.
- **Detalle**: visualización de la ficha del estudiante.
- **Eliminar**: confirmación de borrado.
- **API externa**: consumo de `https://restcountries.com` usando `requests`, configurable por variables de entorno.

## Variables de entorno
Se cargan con `python-dotenv` desde `.env` (opcional):
```
DJANGO_SECRET_KEY=clave-segura
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
EXTERNAL_API_URL=https://restcountries.com/v3.1/all
EXTERNAL_API_FIELDS=name,capital,region,population
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
Las pruebas cubren modelo, formularios, vistas (GET/POST), filtros, exportaciones CSV/Excel, servicios con `pandas`, datos para gráficas y una prueba mockeada de la API externa.

## Perfilado y rendimiento
- **cProfile**: 
  ```bash
  python profiling.py
  ```
  Genera `profile_dashboard.prof` y muestra las 10 funciones más costosas de la vista de dashboard.
- **timeit**: dentro del mismo script se mide `generate_group_stats` con datos simulados y se imprime el tiempo acumulado.

## Notas sobre el diseño
- Se respetó la estructura visual del diseño original adaptándola a **Bootstrap 5**, eliminando dependencias de frameworks JS pesados.
- Los estilos adicionales están en `static/css/styles.css` para mantener tarjetas redondeadas e iconos circulares.
- Las gráficas del dashboard se renderizan con Chart.js (CDN) usando datos generados por `pandas`.
- La exportación de estudiantes a CSV/Excel está disponible desde el listado mediante el botón "Exportar".

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
