import { createContext, useState, useCallback } from "react";
import { adminLogin } from "../api/adminApi";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => sessionStorage.getItem("admin_token") || null);

    const login = useCallback(async (password) => {
        try {
            const data = await adminLogin(password);
            setToken(data.access_token);
            sessionStorage.setItem("admin_token", data.access_token);
            return true;
        } catch {
            return false;
        }
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        sessionStorage.removeItem("admin_token");
    }, []);

    return (
        <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}