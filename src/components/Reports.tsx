import { BarChart3, Download, TrendingUp, Users, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';
import { Student } from '../App';
import { toast } from 'sonner@2.0.3';

type ReportsProps = {
  students: Student[];
};

export function Reports({ students }: ReportsProps) {
  // Datos para gráfica de estudiantes por grupo
  const groupData = students.reduce((acc, student) => {
    const existing = acc.find(item => item.grupo === student.grupo);
    if (existing) {
      existing.total += 1;
      if (student.estado === 'activo') existing.activos += 1;
      else existing.inactivos += 1;
    } else {
      acc.push({
        grupo: student.grupo,
        total: 1,
        activos: student.estado === 'activo' ? 1 : 0,
        inactivos: student.estado === 'inactivo' ? 1 : 0
      });
    }
    return acc;
  }, [] as Array<{ grupo: string; total: number; activos: number; inactivos: number }>);

  // Datos para gráfica de estado
  const statusData = [
    {
      name: 'Activos',
      value: students.filter(s => s.estado === 'activo').length,
      color: '#10b981'
    },
    {
      name: 'Inactivos',
      value: students.filter(s => s.estado === 'inactivo').length,
      color: '#ef4444'
    }
  ];

  // Estadísticas de registros por mes
  const monthData = students.reduce((acc, student) => {
    const month = new Date(student.fechaRegistro).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
    const existing = acc.find(item => item.mes === month);
    if (existing) {
      existing.registros += 1;
    } else {
      acc.push({ mes: month, registros: 1 });
    }
    return acc;
  }, [] as Array<{ mes: string; registros: number }>);

  const handleExport = (format: string) => {
    toast.success(`Exportando reporte en formato ${format.toUpperCase()}`, {
      description: 'La descarga comenzará en breve...'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-gray-900 mb-2">Reportes y Estadísticas</h1>
            <p className="text-gray-600">Análisis de datos generados con pandas y visualizaciones</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('csv')}>
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport('excel')}>
              <Download className="w-4 h-4 mr-2" />
              Exportar Excel
            </Button>
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Total Registros</CardTitle>
            <Users className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-gray-900">{students.length}</div>
            <p className="text-xs text-gray-500 mt-1">Estudiantes totales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Grupos Activos</CardTitle>
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-gray-900">{groupData.length}</div>
            <p className="text-xs text-gray-500 mt-1">Diferentes grupos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Tasa de Actividad</CardTitle>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-gray-900">
              {students.length > 0 
                ? Math.round((students.filter(s => s.estado === 'activo').length / students.length) * 100)
                : 0}%
            </div>
            <p className="text-xs text-gray-500 mt-1">Estudiantes activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Promedio por Grupo</CardTitle>
            <PieChart className="w-5 h-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-gray-900">
              {groupData.length > 0 ? Math.round(students.length / groupData.length) : 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Estudiantes/grupo</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficas principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gráfica de estudiantes por grupo */}
        <Card>
          <CardHeader>
            <CardTitle>Estudiantes por Grupo</CardTitle>
            <p className="text-sm text-gray-500">Distribución de estudiantes activos e inactivos</p>
          </CardHeader>
          <CardContent>
            {groupData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={groupData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="grupo" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar dataKey="activos" fill="#10b981" name="Activos" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="inactivos" fill="#ef4444" name="Inactivos" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No hay datos disponibles
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfica circular de estado */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Estado</CardTitle>
            <p className="text-sm text-gray-500">Proporción de estudiantes activos vs inactivos</p>
          </CardHeader>
          <CardContent>
            {statusData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No hay datos disponibles
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gráfica de registros por mes */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Tendencia de Registros</CardTitle>
          <p className="text-sm text-gray-500">Nuevos estudiantes registrados por periodo</p>
        </CardHeader>
        <CardContent>
          {monthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="registros" fill="#3b82f6" name="Nuevos Registros" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No hay datos disponibles
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabla resumen */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen por Grupo (Análisis Pandas)</CardTitle>
          <p className="text-sm text-gray-500">Tabla generada con procesamiento de datos en Python</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Grupo</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Activos</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Inactivos</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">% Activos</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {groupData.map((group, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{group.grupo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{group.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{group.activos}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{group.inactivos}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Math.round((group.activos / group.total) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
