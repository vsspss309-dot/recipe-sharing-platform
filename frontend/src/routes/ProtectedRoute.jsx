import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requireAdmin = false }) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return null; // Or a simple spinner
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && user.role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
