import { Home, Users, BarChart3, Globe, Settings } from 'lucide-react';
import { ViewType } from '../App';

type NavigationProps = {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
};

export function Navigation({ currentView, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'dashboard' as ViewType, label: 'Inicio', icon: Home },
    { id: 'students' as ViewType, label: 'Estudiantes', icon: Users },
    { id: 'reports' as ViewType, label: 'Reportes', icon: BarChart3 },
    { id: 'api' as ViewType, label: 'API Externa', icon: Globe },
    { id: 'config' as ViewType, label: 'Configuración', icon: Settings }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y nombre */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-blue-600">Sistema de Registro</h1>
              <p className="text-xs text-gray-500">de Estudiantes</p>
            </div>
          </div>

          {/* Menú de navegación */}
          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id || 
                (item.id === 'students' && (currentView === 'student-form' || currentView === 'student-detail'));
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
