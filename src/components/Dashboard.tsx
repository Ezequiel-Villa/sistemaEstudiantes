import { Users, UserCheck, UserX, Layers, TrendingUp, Activity, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Student } from '../App';

type DashboardProps = {
  students: Student[];
};

export function Dashboard({ students }: DashboardProps) {
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.estado === 'activo').length;
  const inactiveStudents = students.filter(s => s.estado === 'inactivo').length;
  
  // Contar grupos únicos
  const uniqueGroups = new Set(students.map(s => s.grupo)).size;

  // Calcular estudiantes por grupo
  const groupCounts = students.reduce((acc, student) => {
    acc[student.grupo] = (acc[student.grupo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Dashboard Principal</h1>
        <p className="text-gray-600">Resumen general del sistema de registro de estudiantes</p>
      </div>

      {/* Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Total de Estudiantes</CardTitle>
            <Users className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-gray-900">{totalStudents}</div>
            <p className="text-xs text-gray-500 mt-1">Registrados en el sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Estudiantes Activos</CardTitle>
            <UserCheck className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-gray-900">{activeStudents}</div>
            <p className="text-xs text-gray-500 mt-1">
              {totalStudents > 0 ? `${Math.round((activeStudents / totalStudents) * 100)}%` : '0%'} del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Estudiantes Inactivos</CardTitle>
            <UserX className="w-5 h-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-gray-900">{inactiveStudents}</div>
            <p className="text-xs text-gray-500 mt-1">
              {totalStudents > 0 ? `${Math.round((inactiveStudents / totalStudents) * 100)}%` : '0%'} del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Grupos Totales</CardTitle>
            <Layers className="w-5 h-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-gray-900">{uniqueGroups}</div>
            <p className="text-xs text-gray-500 mt-1">Grupos activos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Distribución por grupo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Distribución por Grupo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(groupCounts).map(([group, count]) => (
                <div key={group}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-700">Grupo {group}</span>
                    <span className="text-sm text-gray-900">{count} estudiantes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(count / totalStudents) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              {Object.keys(groupCounts).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No hay grupos disponibles</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Gráfica de tendencias */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Estadísticas Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-700">Total de Grupos</span>
                <span className="text-gray-900">{uniqueGroups}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">Tasa de Actividad</span>
                <span className="text-gray-900">
                  {students.length > 0 
                    ? `${Math.round((activeStudents / totalStudents) * 100)}%`
                    : '0%'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm text-gray-700">Promedio por Grupo</span>
                <span className="text-gray-900">
                  {uniqueGroups > 0 ? Math.round(totalStudents / uniqueGroups) : 0} estudiantes
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actividad reciente */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {students.slice(0, 5).map((student) => (
              <div key={student.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{student.nombre} {student.apellidos}</p>
                    <p className="text-xs text-gray-500">Matrícula: {student.matricula}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{student.fechaRegistro}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    student.estado === 'activo' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {student.estado}
                  </span>
                </div>
              </div>
            ))}
            {students.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No hay actividad reciente</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}