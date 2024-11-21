import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./views/home/Home";
import Register from "./views/register/Register";
import Login from "./views/login/Login";
import Sandbox from "./views/sandbox/Sandbox";
import Pricing from "./views/pricing/Pricing";
import Dashboard from "./views/dashboard/Dashboard";
import ProjectDetails from "./views/project/ProjectDetails";
import { AuthProvider, useAuth } from "./context/AuthContext";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sandbox" element={<Sandbox />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/project/:id" element={<ProjectDetails />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
