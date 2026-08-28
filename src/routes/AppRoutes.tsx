import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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
              .select-wrap::after { content: 'â–¼'; top: 50%; transform: translateY(-52%); font-size: 11px; color: #178277; }
            `}</style>
            <EmployeeLifecyclePage />
          </>
        }
      />
      <Route path="/employee-lifecycle" element={<EmployeeLifecyclePage />} />
      <Route path="/employee-lifecycle/journey" element={<EmployeeLifecyclePage />} />
      <Route path="/employee-lifecycle/lifecycle" element={<EmployeeLifecyclePage />} />
      <Route path="/employee-lifecycle/operations" element={<EmployeeLifecyclePage />} />
      <Route path="/employee-lifecycle/masterdata" element={<EmployeeLifecyclePage />} />
      <Route path="/employee-lifecycle/reports" element={<EmployeeLifecyclePage />} />
      <Route path="/employee-lifecycle/workbench" element={<EmployeeLifecyclePage />} />
      <Route path="/employee-lifecycle/infographic/:id" element={<EmployeeLifecyclePage />} />
      <Route path="/employee-lifecycle/flowchart/:id" element={<EmployeeLifecyclePage />} />
      <Route path="/employee-lifecycle/raci/:id" element={<EmployeeLifecyclePage />} />
      <Route path="/employee-lifecycle/workflow/:id" element={<EmployeeLifecyclePage />} />
      <Route path="/employee-lifecycle/wireframe/:id" element={<EmployeeLifecyclePage />} />
      <Route path="/employee-lifecycle/erd" element={<EmployeeLifecyclePage />} />
      <Route path="/employee-lifecycle/policies" element={<EmployeeLifecyclePage />} />
      <Route path="/employee-lifecycle/policies/:id" element={<EmployeeLifecyclePage />} />
      <Route path="*" element={<Navigate to="/employee-lifecycle" replace />} />
    </Routes>
  )
}
