import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRouter() {
    const { isAuthenticated } = useAuth();

    if(isAuthenticated === null){
        return(
            <div className="flex items-center bg-[#101724] text-white justify-center h-screen">
                Checking Authentication...
            </div>
        )
    }

    return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
