import { Navigate, Route, Routes } from 'react-router-dom'
import { CreateEmployeePage } from './pages/employees/CreateEmployeePage'
import { EmployeeLifecyclePage } from './pages/employee-lifecycle/EmployeeLifecyclePage'
import './styles/employee-form.css'
export default function App() {
  return <Routes><Route path="/" element={<>
    <style>{`
      .field select { border-radius: 12px; }
      .select-wrap::after { content: '▼'; top: 50%; transform: translateY(-52%); font-size: 11px; color: #178277; }
    `}</style>
    <CreateEmployeePage />
  </>}/><Route path="/employee-lifecycle" element={<EmployeeLifecyclePage />}/><Route path="*" element={<Navigate to="/" replace />}/></Routes>
}
