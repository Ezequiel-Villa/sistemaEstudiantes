import { useState, useEffect } from 'react';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Student } from '../App';
import { toast } from 'sonner@2.0.3';

type StudentFormProps = {
  student: Student | null;
  isEdit: boolean;
  onSubmit: (student: Omit<Student, 'id'>) => void;
  onCancel: () => void;
};

export function StudentForm({ student, isEdit, onSubmit, onCancel }: StudentFormProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    matricula: '',
    correo: '',
    telefono: '',
    grupo: '',
    fechaRegistro: new Date().toISOString().split('T')[0],
    estado: 'activo' as 'activo' | 'inactivo',
    notas: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (student && isEdit) {
      setFormData({
        nombre: student.nombre,
        apellidos: student.apellidos,
        matricula: student.matricula,
        correo: student.correo,
        telefono: student.telefono,
        grupo: student.grupo,
        fechaRegistro: student.fechaRegistro,
        estado: student.estado,
        notas: student.notas || ''
      });
    }
  }, [student, isEdit]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son obligatorios';
    }
    if (!formData.matricula.trim()) {
      newErrors.matricula = 'La matrícula es obligatoria';
    }
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'El formato del correo no es válido';
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    }
    if (!formData.grupo.trim()) {
      newErrors.grupo = 'El grupo es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      toast.success(
        isEdit ? 'Estudiante actualizado correctamente' : 'Estudiante creado correctamente',
        {
          description: `${formData.nombre} ${formData.apellidos} - ${formData.matricula}`
        }
      );
    } else {
      toast.error('Por favor, corrige los errores en el formulario');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={onCancel} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a la lista
        </Button>
        <h1 className="text-gray-900 mb-2">
          {isEdit ? 'Editar Estudiante' : 'Nuevo Estudiante'}
        </h1>
        <p className="text-gray-600">
          {isEdit 
            ? 'Actualiza la información del estudiante' 
            : 'Completa el formulario para registrar un nuevo estudiante'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">
                  Nombre(s) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  placeholder="Ej: Juan Carlos"
                  className={errors.nombre ? 'border-red-500' : ''}
                  maxLength={50}
                />
                {errors.nombre && (
                  <p className="text-sm text-red-500 mt-1">{errors.nombre}</p>
                )}
              </div>

              <div>
                <Label htmlFor="apellidos">
                  Apellidos <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="apellidos"
                  value={formData.apellidos}
                  onChange={(e) => handleChange('apellidos', e.target.value)}
                  placeholder="Ej: García López"
                  className={errors.apellidos ? 'border-red-500' : ''}
                  maxLength={50}
                />
                {errors.apellidos && (
                  <p className="text-sm text-red-500 mt-1">{errors.apellidos}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="matricula">
                  Matrícula <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="matricula"
                  value={formData.matricula}
                  onChange={(e) => handleChange('matricula', e.target.value)}
                  placeholder="Ej: EST001"
                  className={errors.matricula ? 'border-red-500' : ''}
                  maxLength={20}
                />
                {errors.matricula && (
                  <p className="text-sm text-red-500 mt-1">{errors.matricula}</p>
                )}
              </div>

              <div>
                <Label htmlFor="grupo">
                  Grupo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="grupo"
                  value={formData.grupo}
                  onChange={(e) => handleChange('grupo', e.target.value)}
                  placeholder="Ej: A-101"
                  className={errors.grupo ? 'border-red-500' : ''}
                  maxLength={20}
                />
                {errors.grupo && (
                  <p className="text-sm text-red-500 mt-1">{errors.grupo}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="correo">
                  Correo Electrónico <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="correo"
                  type="email"
                  value={formData.correo}
                  onChange={(e) => handleChange('correo', e.target.value)}
                  placeholder="Ej: estudiante@universidad.edu"
                  className={errors.correo ? 'border-red-500' : ''}
                />
                {errors.correo && (
                  <p className="text-sm text-red-500 mt-1">{errors.correo}</p>
                )}
              </div>

              <div>
                <Label htmlFor="telefono">
                  Teléfono <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => handleChange('telefono', e.target.value)}
                  placeholder="Ej: 555-0101"
                  className={errors.telefono ? 'border-red-500' : ''}
                  maxLength={15}
                />
                {errors.telefono && (
                  <p className="text-sm text-red-500 mt-1">{errors.telefono}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Información Académica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fechaRegistro">Fecha de Registro</Label>
                <Input
                  id="fechaRegistro"
                  type="date"
                  value={formData.fechaRegistro}
                  onChange={(e) => handleChange('fechaRegistro', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="estado">
                  Estado <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.estado} onValueChange={(value) => handleChange('estado', value)}>
                  <SelectTrigger id="estado">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="notas">Notas Adicionales (Opcional)</Label>
              <Textarea
                id="notas"
                value={formData.notas}
                onChange={(e) => handleChange('notas', e.target.value)}
                placeholder="Información adicional sobre el estudiante..."
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.notas.length}/500 caracteres
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            {isEdit ? 'Actualizar Estudiante' : 'Guardar Estudiante'}
          </Button>
        </div>
      </form>
    </div>
  );
}
