"""Formularios basados en el modelo Student."""
from django import forms
from .models import Student


class StudentForm(forms.ModelForm):
    """Formulario de alta y edición de estudiantes con validaciones básicas."""

    class Meta:
        model = Student
        fields = ['first_name', 'last_name', 'matricula', 'email', 'phone', 'group', 'status', 'notes']
        widgets = {
            'notes': forms.Textarea(attrs={'rows': 3}),
            'status': forms.Select(),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for name, field in self.fields.items():
            css_class = 'form-select' if isinstance(field.widget, forms.Select) else 'form-control'
            existing = field.widget.attrs.get('class', '')
            field.widget.attrs['class'] = f"{existing} {css_class}".strip()

    def clean_phone(self):
        """Valida que el teléfono contenga al menos 5 caracteres."""
        phone = self.cleaned_data.get('phone', '')
        if len(phone) < 5:
            raise forms.ValidationError('El teléfono debe contener al menos 5 caracteres.')
        return phone
