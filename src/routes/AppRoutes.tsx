import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { CreateEmployeePage } from '../pages/employees/CreateEmployeePage'
import { EmployeeLifecyclePage } from '../pages/employee-lifecycle/EmployeeLifecyclePage'

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <style>{`
              .field select { border-radius: 12px; }
              .select-wrap::after { content: '▼'; top: 50%; transform: translateY(-52%); font-size: 11px; color: #178277; }
            `}</style>
            <CreateEmployeePage />
          </>
        }
      />
      <Route path="/employee-lifecycle" element={<EmployeeLifecyclePage />} />
      <Route path="*" element={<Navigate to="/employee-lifecycle" replace />} />
    </Routes>
  )
}
