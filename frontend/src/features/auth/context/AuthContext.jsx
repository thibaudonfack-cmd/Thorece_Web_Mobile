import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext({
    user: null,
    loading: true,
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
    reloadUser: () => {}
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    const userData = await authService.getCurrentUser();
                    setUser(userData);
                    return userData;
                } else {
                    setUser(null);
                    return null;
                }
            } catch (error) {
                setUser(null);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('userRole');
                return null;
            } finally {
                setLoading(false);
            }
        }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    const reloadUser = async () => {
        return await fetchUser();
    };

    const value = {
        user,
        login,
        logout,
        reloadUser,
        loading,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
    }
    return context;
};