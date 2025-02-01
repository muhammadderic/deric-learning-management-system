import { Navigate, Route, Routes } from "react-router-dom"

import MainLayout from "./modules/core/layout/MainLayout"

import HomePage from "./modules/core/HomePage"
import RegisterPage from "./modules/auth/presentation/pages/RegisterPage"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      {/* Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
