import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CookingLoader from "../../routes/CookingLoader";

export default function AuthSuccess() {
  const navigate = useNavigate();

  const { checkAuth } = useAuth();

  useEffect(() => {
    // Token is now set as HTTP-only cookie by the server
    // Just redirect to dashboard
    checkAuth();
    navigate("/dashboard");
  }, [navigate]);

  return <CookingLoader />;

}
