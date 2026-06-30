import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import api, { setAccessToken } from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // On every page load, try to silently restore the session using the
        // HttpOnly refresh cookie. This prevents 401 cascades on protected routes.
        const initAuth = async () => {
            const isLoggedIn = localStorage.getItem("isLoggedIn");
            if (isLoggedIn) {
                try {
                    const response = await axios.post(
                        "http://localhost:5000/api/auth/refresh",
                        {},
                        { withCredentials: true }
                    );
                    const { accessToken: newToken, user: userData } = response.data;
                    setAccessToken(newToken);
                    setUser(userData);
                    localStorage.setItem("user", JSON.stringify(userData));
                } catch {
                    // Refresh cookie expired — clean up stale local state
                    localStorage.removeItem("isLoggedIn");
                    localStorage.removeItem("user");
                    setAccessToken("");
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = (accessToken, userData) => {
        setAccessToken(accessToken);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout API failed", error);
        } finally {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("user");
            setAccessToken("");
            setUser(null);
        }
    };

    const updateAuthUser = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, updateAuthUser }}>
            {children}
        </AuthContext.Provider>
    );
};
