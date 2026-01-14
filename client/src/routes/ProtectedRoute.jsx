import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CookingLoader from "./CookingLoader";

export default function ProtectedRoute() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === null) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#101724]">
                <div className="flex flex-col items-center gap-4">
                    <CookingLoader />
                </div>
            </div>
        )
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
