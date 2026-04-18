import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/Layout/AppShell'
import DashboardPage from './pages/DashboardPage'
import PolicyActionPage from './pages/PolicyActionPage'
import PolicyLeadsPage from './pages/PolicyLeadsPage'
import PolicyClientsPage from './pages/PolicyClientsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="add-policy" element={<PolicyActionPage />} />
        <Route path="policy-leads" element={<PolicyLeadsPage />} />
        <Route path="policy-clients" element={<PolicyClientsPage />} />
        <Route path="edit-policy/:id" element={<PolicyActionPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
