import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// Simple auth — we'll replace with real auth later
// For now: password stored in env variable
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "dftlabs2026";

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(
        () => sessionStorage.getItem("dft_admin") === "true"
    );

    const login = (password) => {
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem("dft_admin", "true");
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        sessionStorage.removeItem("dft_admin");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);