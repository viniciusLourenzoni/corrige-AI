import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateEssay from "./pages/CreateEssay";
import EssayDetails from "./pages/EssayDetails";
import "react-toastify/dist/ReactToastify.css";
import { RoleEnum } from "./types/enums";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/essays/create"
            element={
              <ProtectedRoute allowedRoles={[RoleEnum.STUDENT]}>
                <CreateEssay />
              </ProtectedRoute>
            }
          />
          <Route
            path="/essays/:id"
            element={
              <ProtectedRoute>
                <EssayDetails />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </Router>
  );
}

export default App;
