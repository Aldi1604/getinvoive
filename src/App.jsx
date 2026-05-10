import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import CreateInvoice from "./pages/CreateInvoice"
import InvoiceDetail from "./pages/InvoiceDetail"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-invoice" element={<CreateInvoice />} />
      <Route path="/invoice/:id" element={<InvoiceDetail />} />
    </Routes>
  )
}

export default App