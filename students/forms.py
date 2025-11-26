"""Formularios basados en el modelo Student."""
import re
from django import forms
from django.core.validators import RegexValidator
from .models import Career, Student


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

    nombre = forms.CharField(label="Nombre", max_length=100, validators=[name_validator])
    apellido_paterno = forms.CharField(label="Apellido paterno", max_length=100, validators=[name_validator])
    apellido_materno = forms.CharField(label="Apellido materno", max_length=100, validators=[name_validator])
    carrera = forms.ModelChoiceField(label="Carrera", queryset=Career.objects.all())
    matricula = forms.CharField(label="Matrícula", max_length=20, validators=[matricula_validator])
    correo = forms.EmailField(label="Correo electrónico")
    telefono = forms.CharField(label="Teléfono", max_length=15, validators=[phone_validator])
    grupo = forms.CharField(label="Grupo", max_length=10, validators=[group_validator])
    estado = forms.ChoiceField(label="Estado", choices=Student.STATUS_CHOICES)
    direccion = forms.CharField(label="Dirección", widget=forms.Textarea(attrs={'rows': 2}))
    fecha_nacimiento = forms.DateField(label="Fecha de nacimiento", widget=forms.DateInput(attrs={'type': 'date'}))
    fecha_inscripcion = forms.DateField(label="Fecha de inscripción", widget=forms.DateInput(attrs={'type': 'date'}))

    class Meta:
        model = Student
        fields = [
            'nombre',
            'apellido_paterno',
            'apellido_materno',
            'matricula',
            'correo',
            'telefono',
            'direccion',
            'fecha_nacimiento',
            'grupo',
            'carrera',
            'estado',
            'fecha_inscripcion',
        ]
        widgets = {
            'estado': forms.Select(),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for name, field in self.fields.items():
            css_class = 'form-select' if isinstance(field.widget, forms.Select) else 'form-control'
            existing = field.widget.attrs.get('class', '')
            field.widget.attrs['class'] = f"{existing} {css_class}".strip()
            field.widget.attrs.setdefault('placeholder', field.label)
            if isinstance(field.widget, forms.TextInput):
                field.widget.attrs['maxlength'] = getattr(field, 'max_length', '') or ''

    def clean_telefono(self):
        """Valida longitud y formato del teléfono."""
        phone = self.cleaned_data.get('telefono', '').strip()
        if len(phone) < 6:
            raise forms.ValidationError('El teléfono debe contener al menos 6 caracteres.')
        return phone

    def clean_matricula(self):
        matricula = self.cleaned_data.get('matricula', '').strip()
        if not re.match(r"^[A-Za-z0-9_-]+$", matricula):
            raise forms.ValidationError('Usa solo letras, números, guiones y guion bajo para la matrícula.')
        return matricula
