import { Navigate, Outlet } from "react-router";
import useAuthStore from "../store/authStore";

function ProtectedRoute() {
    const token = useAuthStore((state) => state.token);

    // If there's no token, redirect to login page
    if (token === null) {
        return <Navigate to="/login" replace />;
    }

    // Render the children routes
    return <Outlet />;
}

export default ProtectedRoute;
