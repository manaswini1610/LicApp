import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/Layout/AppShell'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PolicyActionPage from './pages/PolicyActionPage'
import PolicyLeadsPage from './pages/PolicyLeadsPage'
import PolicyClientsPage from './pages/PolicyClientsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="add-policy" element={<PolicyActionPage />} />
          <Route path="policy-leads" element={<PolicyLeadsPage />} />
          <Route path="policy-clients" element={<PolicyClientsPage />} />
          <Route path="edit-policy/:id" element={<PolicyActionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  )
}
