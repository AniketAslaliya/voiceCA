import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import { isLoggedIn } from "./lib/auth";
import { hasCompletedOnboarding } from "./lib/personalization";

function ProtectedRoute({ children }) {
  if (!isLoggedIn()) return <Navigate to="/auth" replace />;
  if (!hasCompletedOnboarding()) return <Navigate to="/onboarding" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/onboarding"
          element={isLoggedIn() ? <Onboarding /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
