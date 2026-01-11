import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import BudgetControl from './pages/BudgetControl'
import BudgetDetail from './pages/BudgetDetail'
import StatProjects from './pages/StatProjects'
import CreateProject from './pages/CreateProject'
import ProjectDetail from './pages/ProjectDetail'
import Archive from './pages/Archive'
import SharePage from './pages/SharePage'
import NotFound from './pages/NotFound'
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
        path="/budgets"
        element={token ? <BudgetControl /> : <Navigate to="/login" replace />} 
      />
      <Route
        path="/budgets/:id"
        element={token ? <BudgetDetail /> : <Navigate to="/login" replace />} 
      />
      <Route
        path="/stats/:type"
        element={token ? <StatProjects /> : <Navigate to="/login" replace />} 
      />
      <Route
        path="/projects/:id"
        element={token ? <ProjectDetail /> : <Navigate to="/login" replace />} 
      />
      <Route
        path="/projects/new"
        element={token ? <CreateProject /> : <Navigate to="/login" replace />} 
      />
      <Route
        path="/archive"
        element={token ? <Archive /> : <Navigate to="/login" replace />} 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
