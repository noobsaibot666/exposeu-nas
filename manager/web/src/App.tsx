import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CreateProject from './pages/CreateProject'
import ProjectDetail from './pages/ProjectDetail'
import SharePage from './pages/SharePage'
import { useAuth } from './components/useAuth'

function App() {
  const { token } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/share/:token" element={<SharePage />} />
      <Route
        path="/"
        element={token ? <Dashboard /> : <Navigate to="/login" replace />} 
      />
      <Route
        path="/projects/:id"
        element={token ? <ProjectDetail /> : <Navigate to="/login" replace />} 
      />
      <Route
        path="/projects/new"
        element={token ? <CreateProject /> : <Navigate to="/login" replace />} 
      />
      <Route path="*" element={<Navigate to={token ? '/' : '/login'} replace />} />
    </Routes>
  )
}

export default App
