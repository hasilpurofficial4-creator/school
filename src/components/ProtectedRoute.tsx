import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types";
import LoadingSpinner from "./LoadingSpinner";

interface ProtectedRouteProps {
  role: UserRole;
  children: React.ReactNode;
}

export default function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== role) {
    const rolePaths: Record<string, string> = {
      admin: "/admin",
      teacher: "/teacher",
      student: "/student",
    };
    return <Navigate to={rolePaths[user?.role || ""] || "/"} replace />;
  }

  return <>{children}</>;
}
