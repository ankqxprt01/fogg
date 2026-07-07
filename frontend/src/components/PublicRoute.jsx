import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  const bogusMode = localStorage.getItem("bogusMode");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  if (bogusMode) {
    return <Navigate to="/myuser" replace />;
  }

  return children;
}

export default PublicRoute;