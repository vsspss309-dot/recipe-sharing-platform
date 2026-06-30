import axios from "axios";

// Access token is stored in-memory for security
let accessToken = "";

export const setAccessToken = (token) => {
    accessToken = token;
};

export const getAccessToken = () => {
    return accessToken;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true // Essential for sending/receiving HTTP-only cookies
});

// Request interceptor to automatically attach Access Token
api.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token expiry & silent refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If response is 401, we haven't retried yet, AND the failing request
        // is NOT itself an auth endpoint (to prevent the refresh cascade loop)
        const isAuthEndpoint = originalRequest.url?.includes("/auth/");
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            !isAuthEndpoint
        ) {
            originalRequest._retry = true;

            try {
                // Trigger refresh token API to issue a new Access Token
                const response = await axios.post(
                    `${API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const { accessToken: newAccessToken } = response.data;
                
                // Update in-memory token
                setAccessToken(newAccessToken);

                // Update authorization header and retry original request
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error("Session refresh failed:", refreshError.message);
                
                // Refresh failed (e.g., cookie expired or is missing) -> Log out user
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("user");
                setAccessToken("");
                
                // Redirect user to login page
                if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
                    window.location.href = "/login";
                }
                
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
