import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Bogus from "./pages/Bogus";
import PrivateRoute from "./components/PrivateRoute";
import BogusRoute from "./components/BogusRoute"; // ✅ MOVE HERE
import Signup from "./pages/Signup";
import "./App.css";
import LoginRoute from "./components/LoginRoute";

function App() {
  return (
    <Router>
      <Routes>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
  path="/login"
  element={
    <LoginRoute>
      <Login />
    </LoginRoute>
  }
/>
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/myuser"
          element={
            <BogusRoute>
              <Bogus />
            </BogusRoute>
          }
        />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;