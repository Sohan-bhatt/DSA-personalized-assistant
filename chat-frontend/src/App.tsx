import { Navigate, Route, Routes } from "react-router-dom"
import ProtectedRoute from "./routes/ProtectedRoute"
import AuthPage from "./pages/AuthPage"
import ChatPage from "./pages/ChatPage"
import RevisePage from "./pages/RevisePage"

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/revise"
        element={
          <ProtectedRoute>
            <RevisePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
