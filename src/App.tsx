import { Routes, Route, Navigate } from 'react-router-dom';
import { ProjectsPage } from './pages/ProjectsPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { ProjectProvider } from './hooks/useProjects';
import { initializeSampleData } from './data/storage';

// Initialize sample data on first load
initializeSampleData();

function App() {
  return (
    <ProjectProvider>
      <div className="h-full bg-slate-50">
        <Routes>
          <Route path="/" element={<ProjectsPage />} />
          <Route path="/project/:projectId" element={<WorkspacePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ProjectProvider>
  );
}

export default App;

