import { useState } from 'react';
import { Search, Plus, Eye, Pencil, Trash2, UserX } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Student } from '../App';

type StudentsListProps = {
  students: Student[];
  onViewDetail: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
  onNew: () => void;
};

export function StudentsList({ students, onViewDetail, onEdit, onDelete, onNew }: StudentsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Obtener grupos únicos
  const uniqueGroups = Array.from(new Set(students.map(s => s.grupo))).sort();

  // Filtrar estudiantes
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.correo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGroup = filterGroup === 'all' || student.grupo === filterGroup;
    const matchesStatus = filterStatus === 'all' || student.estado === filterStatus;

    return matchesSearch && matchesGroup && matchesStatus;
  });

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      onDelete(studentToDelete.id);
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-gray-900 mb-2">Gestión de Estudiantes</h1>
            <p className="text-gray-600">Administra el registro completo de estudiantes</p>
          </div>
          <Button onClick={onNew} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Estudiante
          </Button>
        </div>

        {/* Barra de búsqueda y filtros */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre, matrícula o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterGroup} onValueChange={setFilterGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por grupo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los grupos</SelectItem>
                {uniqueGroups.map(group => (
                  <SelectItem key={group} value={group}>Grupo {group}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="activo">Activos</SelectItem>
                <SelectItem value="inactivo">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
      </div>

      {/* Tabla de estudiantes */}
      {filteredStudents.length === 0 && students.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <UserX className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">No hay estudiantes registrados</h3>
            <p className="text-gray-500 mb-6">Comienza agregando tu primer estudiante al sistema</p>
            <Button onClick={onNew} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Estudiante
            </Button>
          </div>
        </Card>
      ) : filteredStudents.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">No se encontraron resultados</h3>
            <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Matrícula</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Correo</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Grupo</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{student.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{student.nombre}</div>
                        <div className="text-sm text-gray-500">{student.apellidos}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.matricula}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {student.correo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                        {student.grupo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        student.estado === 'activo'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {student.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDetail(student)}
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(student)}
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(student)}
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Mostrando <span className="text-gray-900">{filteredStudents.length}</span> de{' '}
              <span className="text-gray-900">{students.length}</span> estudiantes
            </p>
          </div>
        </Card>
      )}

      {/* Modal de confirmación de eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar estudiante?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el registro de{' '}
              <span className="text-gray-900">
                {studentToDelete?.nombre} {studentToDelete?.apellidos}
              </span>{' '}
              (Matrícula: {studentToDelete?.matricula}) del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
