from __future__ import annotations

import datetime
from django.db import migrations


def ensure_column(cursor, table: str, column: str, definition_sql: str) -> None:
    """Add column to table if it does not exist."""
    cursor.execute(f"PRAGMA table_info({table});")
    existing = {row[1] for row in cursor.fetchall()}
    if column not in existing:
        cursor.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition_sql};")


def forwards(apps, schema_editor):
    cursor = schema_editor.connection.cursor()

    # Create careers table if it doesn't exist (only for legacy databases).
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='students_career';")
    if not cursor.fetchone():
        cursor.execute(
            """
            CREATE TABLE students_career (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre VARCHAR(200) NOT NULL,
                clave VARCHAR(10) NOT NULL UNIQUE,
                created_at DATETIME NOT NULL
            );
            """
        )
        now = datetime.datetime.now()
        careers = [
            ("Ingeniería en Sistemas", "ISC"),
            ("Ingeniería Industrial", "IIN"),
            ("Arquitectura", "ARQ"),
            ("Administración", "ADM"),
        ]
        cursor.executemany(
            "INSERT INTO students_career (nombre, clave, created_at) VALUES (?, ?, ?);",
            [(name, key, now) for name, key in careers],
        )

    # Add missing columns on students_student for legacy databases.
    table = "students_student"
    ensure_column(cursor, table, "nombre", "VARCHAR(100) DEFAULT ''")
    ensure_column(cursor, table, "apellido_paterno", "VARCHAR(100) DEFAULT ''")
    ensure_column(cursor, table, "apellido_materno", "VARCHAR(100) DEFAULT ''")
    ensure_column(cursor, table, "correo", "VARCHAR(254) DEFAULT ''")
    ensure_column(cursor, table, "telefono", "VARCHAR(15) DEFAULT ''")
    ensure_column(cursor, table, "direccion", "TEXT DEFAULT ''")
    ensure_column(cursor, table, "fecha_nacimiento", "DATE DEFAULT '2000-01-01'")
    ensure_column(cursor, table, "grupo", "VARCHAR(10) DEFAULT ''")
    ensure_column(cursor, table, "estado", "VARCHAR(20) DEFAULT 'Inscrito'")
    ensure_column(cursor, table, "fecha_inscripcion", "DATE DEFAULT '2024-01-01'")
    ensure_column(cursor, table, "updated_at", "DATETIME")

    # Add carrera_id after ensuring careers table exists.
    cursor.execute(f"PRAGMA table_info({table});")
    cols = {row[1] for row in cursor.fetchall()}
    if "carrera_id" not in cols:
        cursor.execute(
            "ALTER TABLE students_student ADD COLUMN carrera_id INTEGER REFERENCES students_career(id) ON DELETE RESTRICT DEFAULT 1;"
        )
        # Ensure at least one carrera exists for FK default.
        cursor.execute("SELECT id FROM students_career ORDER BY id LIMIT 1;")
        row = cursor.fetchone()
        if row:
            cursor.execute(
                f"UPDATE students_student SET carrera_id = {int(row[0])} WHERE carrera_id IS NULL;"
            )

    # Populate new columns from legacy fields when possible.
    cursor.execute(f"PRAGMA table_info({table});")
    cols = {row[1] for row in cursor.fetchall()}
    if "first_name" in cols:
        cursor.execute("UPDATE students_student SET nombre = first_name WHERE nombre = '';")
    if "last_name" in cols:
        cursor.execute("UPDATE students_student SET apellido_paterno = last_name WHERE apellido_paterno = '';")
    if "email" in cols:
        cursor.execute("UPDATE students_student SET correo = email WHERE correo = '';")
    if "phone" in cols:
        cursor.execute("UPDATE students_student SET telefono = phone WHERE telefono = '';")
    if "group" in cols:
        cursor.execute("UPDATE students_student SET grupo = group WHERE grupo = '';")
    if "status" in cols:
        cursor.execute(
            "UPDATE students_student SET estado = CASE status "
            "WHEN 'inscrito' THEN 'Inscrito' "
            "WHEN 'baja_temporal' THEN 'Baja temporal' "
            "WHEN 'baja_definitiva' THEN 'Baja definitiva' "
            "WHEN 'egresado' THEN 'Egresado' "
            "ELSE 'Inscrito' END "
            "WHERE estado IS NULL OR estado = '' OR estado = 'inscrito';"
        )

    # Set fecha_inscripcion default to created_at when available.
    if "created_at" in cols:
        cursor.execute(
            "UPDATE students_student SET fecha_inscripcion = DATE(created_at) "
            "WHERE fecha_inscripcion IS NULL OR fecha_inscripcion = '2024-01-01';"
        )

    # Initialize updated_at safely after column creation (SQLite does not allow
    # non-constant defaults on ALTER TABLE).
    cursor.execute(
        "UPDATE students_student SET updated_at = COALESCE(updated_at, CURRENT_TIMESTAMP) "
        "WHERE updated_at IS NULL;"
    )


def backwards(apps, schema_editor):  # pragma: no cover - irreversible helper
    raise RuntimeError("No se puede revertir esta migración de compatibilidad.")


class Migration(migrations.Migration):
    dependencies = [
        ("students", "0001_initial"),
    ]

    operations = [migrations.RunPython(forwards, backwards)]
