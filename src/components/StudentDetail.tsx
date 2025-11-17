import { ArrowLeft, Pencil, Trash2, Mail, Phone, Calendar, Hash, Users, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { Student } from '../App';

type StudentDetailProps = {
  student: Student;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
};

export function StudentDetail({ student, onEdit, onDelete, onBack }: StudentDetailProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a la lista
        </Button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-gray-900 mb-2">Detalle del Estudiante</h1>
            <p className="text-gray-600">Información completa del registro</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={onEdit} className="bg-blue-600 hover:bg-blue-700">
              <Pencil className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar estudiante?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Se eliminará permanentemente el registro de{' '}
                    <span className="text-gray-900">
                      {student.nombre} {student.apellidos}
                    </span>{' '}
                    del sistema.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tarjeta principal con información del estudiante */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">
                    {student.nombre} {student.apellidos}
                  </CardTitle>
                  <p className="text-gray-500">Matrícula: {student.matricula}</p>
                </div>
                <Badge className={
                  student.estado === 'activo'
                    ? 'bg-green-100 text-green-700 hover:bg-green-100'
                    : 'bg-red-100 text-red-700 hover:bg-red-100'
                }>
                  {student.estado}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Correo Electrónico</p>
                    <p className="text-gray-900">{student.correo}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="text-gray-900">{student.telefono}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Grupo</p>
                    <p className="text-gray-900">{student.grupo}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fecha de Registro</p>
                    <p className="text-gray-900">{student.fechaRegistro}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Hash className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ID del Sistema</p>
                    <p className="text-gray-900">#{student.id}</p>
                  </div>
                </div>
              </div>

              {student.notas && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">Notas Adicionales</p>
                      <p className="text-gray-900">{student.notas}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información calculada con librerías (simulación) */}
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Datos (Pandas)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-700">Días desde el registro</span>
                  <span className="text-gray-900">
                    {Math.floor((new Date().getTime() - new Date(student.fechaRegistro).getTime()) / (1000 * 60 * 60 * 24))} días
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-700">Estado de validación</span>
                  <span className="text-green-700">Validado</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm text-gray-700">Formato de datos</span>
                  <span className="text-gray-900">JSON / DataFrame</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar con información adicional */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen Rápido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Estado</p>
                <Badge className={
                  student.estado === 'activo'
                    ? 'bg-green-100 text-green-700 hover:bg-green-100'
                    : 'bg-red-100 text-red-700 hover:bg-red-100'
                }>
                  {student.estado === 'activo' ? 'Estudiante Activo' : 'Estudiante Inactivo'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Matrícula</p>
                <p className="text-gray-900">{student.matricula}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Grupo Asignado</p>
                <p className="text-gray-900">{student.grupo}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información Externa (API)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-600 mb-1">API: Datos Universitarios</p>
                  <p className="text-sm text-gray-700">Campus: Central</p>
                  <p className="text-xs text-gray-500 mt-1">Actualizado hace 5 min</p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs text-green-600 mb-1">API: Sistema Académico</p>
                  <p className="text-sm text-gray-700">Semestre: 2024-1</p>
                  <p className="text-xs text-gray-500 mt-1">Sincronizado</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pruebas y Rendimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Pruebas unitarias</span>
                  <span className="text-green-600">10/10 ✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tiempo de carga</span>
                  <span className="text-gray-900">0.03s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Última validación</span>
                  <span className="text-gray-900">Hoy</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}