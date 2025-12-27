const BASE_URL = import.meta.env.VITE_API_URL;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const getToken = (key) => localStorage.getItem(key);
const setToken = (key, value) => localStorage.setItem(key, value);

const cleanupAndRedirect = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    window.location.href = "/login";
};

const originalFetch = async (endpoint, options) => {
    let token = getToken("accessToken");

    const headers = {
        ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...options.headers,
    };
    if (token && token !== "undefined" && token !== "null") {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
};


export const fetchWithAuth = async (endpoint, options = {}) => {
    let response;

    try {
        response = await originalFetch(endpoint, options);
    } catch (networkError) {
        console.error("ERREUR RÉSEAU :", networkError);
        throw networkError;
    }

    if (response.ok) return response;

    if (response.status === 401 || response.status === 403) {

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then(() => {
                    return originalFetch(endpoint, options);
                })
                .catch((err) => {
                    return Promise.reject(err);
                });
        }
        isRefreshing = true;

        try {
            console.log("Renouvellement du token en cours...");
            const refreshResponse = await fetch(`${BASE_URL}/refresh`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            if (!refreshResponse.ok) {
                throw new Error("Impossible de rafraîchir le token (Session expirée)");
            }

            const data = await refreshResponse.json();
            const newAccessToken = data.token;

            if (!newAccessToken) throw new Error("Pas de token dans la réponse refresh");

            setToken("accessToken", newAccessToken);
            processQueue(null, newAccessToken);
            return originalFetch(endpoint, options);

        } catch (refreshError) {
            processQueue(refreshError, null);
            cleanupAndRedirect();
            throw refreshError;
        } finally {
            isRefreshing = false;
        }
    }

    return response;
};

export const authService = {
    register: async (userData) => {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(errorBody.message || "Erreur inscription");
        }
        return await response.json();
    },

    login: async (credentials) => {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) throw new Error("Erreur connexion");
        return await response.json();
    },

    verifyOtp: async (otpData, rememberMe = false) => {
        const payload = { ...otpData, stayConnected: rememberMe };
        const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("OTP Invalide");
        const data = await response.json();
        if (data.token) localStorage.setItem("accessToken", data.token);
        return data;
    },

    getCurrentUser: async () => {
        const response = await fetchWithAuth("/users/me", { method: "GET" });
        if (!response.ok) throw new Error("Erreur chargement profil");
        return await response.json();
    },

    logout: async () => {
        try {
            await fetchWithAuth("/auth/logout", { method: "POST" });
        } catch (error) {
            console.warn("Erreur logout serveur, nettoyage local forcé.");
        } finally {
            cleanupAndRedirect();
        }
    },

    forgotPassword: async (emailData) => {
        const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emailData),
        });
        if (!response.ok) throw new Error("Erreur demande reset password.");
    },

    resetPassword: async (resetData) => {
        const response = await fetch(`${BASE_URL}/auth/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resetData),
        });
        if (!response.ok) throw new Error("Erreur reset password.");
        return await response.text();
    },

    updateProfile: async (userData) => {
        const response = await fetchWithAuth("/users/me", {
            method: "PUT",
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(errorBody.message || "Error updating profile.");
        }
        return await response.json();
    },

    uploadAvatar: async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetchWithAuth("/users/me/avatar", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Error uploading image.");
        }
        return await response.json();
    },

    updateUserXp: async (amount) => {
        const response = await fetchWithAuth("/users/xp", {
            method: "POST",
            body: JSON.stringify({ amount }),
        });
        if (!response.ok) {
             throw new Error("Failed to update XP");
        }
        return response;
    }
};
