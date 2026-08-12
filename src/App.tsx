import { CreateEmployeePage } from './pages/employees/CreateEmployeePage'
import './styles/employee-form.css'
export default function App() {
  return <>
    <style>{`
      .field select { border-radius: 12px; }
      .select-wrap::after { content: '▼'; top: 50%; transform: translateY(-52%); font-size: 11px; color: #178277; }
    `}</style>
    <CreateEmployeePage />
  </>
}
