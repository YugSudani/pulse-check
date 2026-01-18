import { createContext, useEffect, useState, useContext } from "react";
import api from "../lib/api";

const authContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    const checkAuth = async () => {
        try {
            const response = await api.get(
                `/user/getMe`,
                { withCredentials: true }
            );
            setUser(response.data.user);
            setIsAuthenticated(true);
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
        }
    }

    useEffect(() => {
        checkAuth();
    }, [])

    return (
        <authContext.Provider
            value={{ user, isAuthenticated, checkAuth }}>
            {children}
        </authContext.Provider>
    );
};


export const useAuth = () => useContext(authContext);