import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import BudgetControl from './pages/BudgetControl'
import BudgetDetail from './pages/BudgetDetail'
import AdminUsers from './pages/AdminUsers'
import StatProjects from './pages/StatProjects'
import CreateProject from './pages/CreateProject'
import ProjectDetail from './pages/ProjectDetail'
import Archive from './pages/Archive'
import Roadmaps from './pages/Roadmaps'
import RoadmapDetail from './pages/RoadmapDetail'
import CalendarExport from './pages/CalendarExport'
import SharePage from './pages/SharePage'
import NotFound from './pages/NotFound'
import { useAuth } from './components/useAuth'

function App() {
  const { token } = useAuth()
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
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
          path="/admin/users"
          element={token ? <AdminUsers /> : <Navigate to="/login" replace />}
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
        <Route
          path="/roadmaps"
          element={token ? <Roadmaps /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/roadmaps/:id"
          element={token ? <RoadmapDetail /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/calendar"
          element={token ? <CalendarExport /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

export default App
