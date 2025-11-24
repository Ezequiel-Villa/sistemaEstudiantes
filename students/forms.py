"""Formularios basados en el modelo Student."""
import re
from django import forms
from django.core.validators import RegexValidator
from .models import Student


class StudentForm(forms.ModelForm):
    """Formulario de alta y edición de estudiantes con validaciones reforzadas."""

    name_validator = RegexValidator(
        regex=r"^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s'\-]+$",
        message="Solo se permiten letras y espacios.",
    )
    matricula_validator = RegexValidator(
        regex=r"^[A-Za-z0-9_-]+$",
        message="La matrícula solo permite letras, números, guiones y guion bajo.",
    )
    phone_validator = RegexValidator(
        regex=r"^[+0-9][0-9\-\s]{5,}$",
        message="Usa solo números, espacios o guiones (mínimo 6 caracteres).",
    )
    group_validator = RegexValidator(
        regex=r"^[A-Za-z0-9\-\s]+$",
        message="El grupo solo permite letras, números y guiones.",
    )

    first_name = forms.CharField(label="Nombre", max_length=80, validators=[name_validator])
    last_name = forms.CharField(label="Apellidos", max_length=120, validators=[name_validator])
    career = forms.ChoiceField(label="Carrera/Especialidad", choices=Student.CAREER_CHOICES)
    matricula = forms.CharField(label="Matrícula", max_length=50, validators=[matricula_validator])
    email = forms.EmailField(label="Correo electrónico")
    phone = forms.CharField(label="Teléfono", max_length=25, validators=[phone_validator])
    group = forms.CharField(label="Grupo", max_length=50, validators=[group_validator])
    status = forms.ChoiceField(label="Estado", choices=Student.STATUS_CHOICES)
    notes = forms.CharField(label="Notas", widget=forms.Textarea(attrs={'rows': 3}), required=False, max_length=600)

    class Meta:
        model = Student
        fields = ['first_name', 'last_name', 'career', 'matricula', 'email', 'phone', 'group', 'status', 'notes']
        widgets = {
            'status': forms.Select(),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for name, field in self.fields.items():
            css_class = 'form-select' if isinstance(field.widget, forms.Select) else 'form-control'
            existing = field.widget.attrs.get('class', '')
            field.widget.attrs['class'] = f"{existing} {css_class}".strip()
            field.widget.attrs.setdefault('placeholder', field.label)
            if isinstance(field.widget, forms.TextInput):
                field.widget.attrs['maxlength'] = field.max_length or ''

    def clean_phone(self):
        """Valida longitud y formato del teléfono."""
        phone = self.cleaned_data.get('phone', '').strip()
        if len(phone) < 6:
            raise forms.ValidationError('El teléfono debe contener al menos 6 caracteres.')
        return phone

    def clean_notes(self):
        notes = self.cleaned_data.get('notes')
        if notes and len(notes) > 600:
            raise forms.ValidationError('Las notas no pueden exceder 600 caracteres.')
        return notes

    def clean_matricula(self):
        matricula = self.cleaned_data.get('matricula', '').strip()
        if not re.match(r"^[A-Za-z0-9_-]+$", matricula):
            raise forms.ValidationError('Usa solo letras, números, guiones y guion bajo para la matrícula.')
        return matricula
