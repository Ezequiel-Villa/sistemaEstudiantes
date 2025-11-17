import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { StudentsList } from './components/StudentsList';
import { StudentForm } from './components/StudentForm';
import { StudentDetail } from './components/StudentDetail';
import { Reports } from './components/Reports';
import { ExternalAPI } from './components/ExternalAPI';
import { Footer } from './components/Footer';
import { Toaster } from './components/ui/sonner';

export type Student = {
  id: number;
  nombre: string;
  apellidos: string;
  matricula: string;
  correo: string;
  telefono: string;
  grupo: string;
  fechaRegistro: string;
  estado: 'activo' | 'inactivo';
  notas?: string;
};

export type ViewType = 'dashboard' | 'students' | 'student-form' | 'student-detail' | 'reports' | 'api' | 'config';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editMode, setEditMode] = useState(false);

  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      nombre: 'Juan Carlos',
      apellidos: 'García López',
      matricula: 'EST001',
      correo: 'juan.garcia@universidad.edu',
      telefono: '555-0101',
      grupo: 'A-101',
      fechaRegistro: '2024-01-15',
      estado: 'activo',
      notas: 'Estudiante regular'
    },
    {
      id: 2,
      nombre: 'María Elena',
      apellidos: 'Martínez Rodríguez',
      matricula: 'EST002',
      correo: 'maria.martinez@universidad.edu',
      telefono: '555-0102',
      grupo: 'A-101',
      fechaRegistro: '2024-01-16',
      estado: 'activo'
    },
    {
      id: 3,
      nombre: 'Pedro Antonio',
      apellidos: 'Hernández Sánchez',
      matricula: 'EST003',
      correo: 'pedro.hernandez@universidad.edu',
      telefono: '555-0103',
      grupo: 'B-102',
      fechaRegistro: '2024-01-20',
      estado: 'activo'
    },
    {
      id: 4,
      nombre: 'Ana Sofía',
      apellidos: 'González Pérez',
      matricula: 'EST004',
      correo: 'ana.gonzalez@universidad.edu',
      telefono: '555-0104',
      grupo: 'B-102',
      fechaRegistro: '2024-02-01',
      estado: 'inactivo'
    },
    {
      id: 5,
      nombre: 'Luis Fernando',
      apellidos: 'Ramírez Torres',
      matricula: 'EST005',
      correo: 'luis.ramirez@universidad.edu',
      telefono: '555-0105',
      grupo: 'C-103',
      fechaRegistro: '2024-02-05',
      estado: 'activo'
    }
  ]);

  const handleCreateStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: Math.max(...students.map(s => s.id), 0) + 1
    };
    setStudents([...students, newStudent]);
    setCurrentView('students');
  };

  const handleUpdateStudent = (studentData: Omit<Student, 'id'>) => {
    if (selectedStudent) {
      setStudents(students.map(s => 
        s.id === selectedStudent.id ? { ...studentData, id: selectedStudent.id } : s
      ));
      setCurrentView('students');
    }
  };

  const handleDeleteStudent = (id: number) => {
    setStudents(students.filter(s => s.id !== id));
    setCurrentView('students');
  };

  const handleViewDetail = (student: Student) => {
    setSelectedStudent(student);
    setCurrentView('student-detail');
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setEditMode(true);
    setCurrentView('student-form');
  };

  const handleNewStudent = () => {
    setSelectedStudent(null);
    setEditMode(false);
    setCurrentView('student-form');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard students={students} />;
      case 'students':
        return (
          <StudentsList
            students={students}
            onViewDetail={handleViewDetail}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
            onNew={handleNewStudent}
          />
        );
      case 'student-form':
        return (
          <StudentForm
            student={selectedStudent}
            isEdit={editMode}
            onSubmit={editMode ? handleUpdateStudent : handleCreateStudent}
            onCancel={() => setCurrentView('students')}
          />
        );
      case 'student-detail':
        return selectedStudent ? (
          <StudentDetail
            student={selectedStudent}
            onEdit={() => handleEditStudent(selectedStudent)}
            onDelete={() => handleDeleteStudent(selectedStudent.id)}
            onBack={() => setCurrentView('students')}
          />
        ) : null;
      case 'reports':
        return <Reports students={students} />;
      case 'api':
        return <ExternalAPI />;
      case 'config':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="mb-6">Configuración</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Sección de configuración del sistema</p>
            </div>
          </div>
        );
      default:
        return <Dashboard students={students} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation currentView={currentView} onNavigate={setCurrentView} />
      <main className="flex-1">
        {renderView()}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;