import { CheckCircle2, Clock, Activity, Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Información del sistema */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-900">Sistema de Registro de Estudiantes</p>
            <p className="text-xs text-gray-500">Django + Python | Bootstrap 5 | Librerías: requests, pandas, datetime</p>
          </div>
          <div className="text-xs text-gray-500">
            <p>© 2024 - Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    </footer>
  );
}