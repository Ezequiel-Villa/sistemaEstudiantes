import { useState } from 'react';
import { Globe, Search, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';

export function ExternalAPI() {
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState('MX');
  const [category, setCategory] = useState('universities');
  const [hasData, setHasData] = useState(false);

  // Datos de ejemplo simulando una API externa
  const mockAPIData = {
    universities: [
      { id: 1, name: 'Universidad Nacional Autónoma de México', city: 'Ciudad de México', students: 356000, status: 'public' },
      { id: 2, name: 'Instituto Tecnológico y de Estudios Superiores de Monterrey', city: 'Monterrey', students: 95000, status: 'private' },
      { id: 3, name: 'Universidad de Guadalajara', city: 'Guadalajara', students: 275000, status: 'public' },
      { id: 4, name: 'Instituto Politécnico Nacional', city: 'Ciudad de México', students: 180000, status: 'public' },
    ],
    statistics: {
      totalUniversities: 4,
      totalStudents: 906000,
      avgStudents: 226500,
      lastUpdate: new Date().toLocaleString('es-ES')
    }
  };

  const handleSearch = () => {
    setLoading(true);
    // Simular llamada a API
    setTimeout(() => {
      setLoading(false);
      setHasData(true);
    }, 1500);
  };

  const handleRefresh = () => {
    handleSearch();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Integración con API Externa</h1>
        <p className="text-gray-600">Consulta información adicional desde servicios REST externos</p>
      </div>

      {/* Panel de búsqueda */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            Parámetros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">País</label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MX">México</SelectItem>
                  <SelectItem value="US">Estados Unidos</SelectItem>
                  <SelectItem value="ES">España</SelectItem>
                  <SelectItem value="AR">Argentina</SelectItem>
                  <SelectItem value="CO">Colombia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Categoría</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="universities">Universidades</SelectItem>
                  <SelectItem value="programs">Programas Académicos</SelectItem>
                  <SelectItem value="statistics">Estadísticas Educativas</SelectItem>
                  <SelectItem value="rankings">Rankings</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">&nbsp;</label>
              <Button 
                onClick={handleSearch} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Consultando...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Consultar API
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estado de la API */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <div>
                <p className="text-sm text-gray-900">API REST Conectada</p>
                <p className="text-xs text-gray-500">
                  Endpoint: https://api.universidades.edu/v1/data
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Información de la API */}
      {!hasData ? (
        <Card className="p-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-gray-900 mb-2">API Externa REST</h3>
            <p className="text-gray-500 mb-6">
              Selecciona los parámetros de búsqueda y haz clic en "Consultar API" para obtener datos externos
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-700">Sin autenticación</p>
                <p className="text-xs text-gray-500">API pública</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-700">Tiempo real</p>
                <p className="text-xs text-gray-500">Datos actualizados</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-700">JSON Response</p>
                <p className="text-xs text-gray-500">Formato estándar</p>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <>
          {/* Estadísticas de la API */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Globe className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl text-gray-900">{mockAPIData.statistics.totalUniversities}</div>
                  <p className="text-xs text-gray-500">Universidades</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl text-gray-900">{mockAPIData.statistics.totalStudents.toLocaleString()}</div>
                  <p className="text-xs text-gray-500">Estudiantes Totales</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl text-gray-900">{mockAPIData.statistics.avgStudents.toLocaleString()}</div>
                  <p className="text-xs text-gray-500">Promedio/Universidad</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-xs text-gray-900">Actualizado</div>
                  <p className="text-xs text-gray-500">API en línea</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resultados de la API */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Resultados de la API Externa</CardTitle>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Actualizado desde API externa
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                Última actualización: {mockAPIData.statistics.lastUpdate}
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Universidad</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Ciudad</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Estudiantes</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Tipo</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockAPIData.universities.map((uni) => (
                      <tr key={uni.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{uni.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{uni.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{uni.city}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {uni.students.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={
                            uni.status === 'public'
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                              : 'bg-purple-100 text-purple-700 hover:bg-purple-100'
                          }>
                            {uni.status === 'public' ? 'Pública' : 'Privada'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Información técnica */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                Detalles de la Integración
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Método HTTP</p>
                  <code className="text-xs bg-white px-2 py-1 rounded border border-gray-200">GET</code>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Formato de Respuesta</p>
                  <code className="text-xs bg-white px-2 py-1 rounded border border-gray-200">application/json</code>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Librería utilizada</p>
                  <code className="text-xs bg-white px-2 py-1 rounded border border-gray-200">requests (Python)</code>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Tiempo de respuesta</p>
                  <code className="text-xs bg-white px-2 py-1 rounded border border-gray-200">~150ms</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
