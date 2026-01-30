import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    const verifyToken = useCallback(async () => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                // Trust the stored token and user data to keep session persistent
                const userData = JSON.parse(storedUser);
                setUser(userData);
                setToken(storedToken);
                setAuthenticated(true);
            } catch (err) {
                console.log('Failed to restore session');
                clearAuth();
            }
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        verifyToken();
    }, [verifyToken]);

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        setAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', authToken);
    };

    const logout = () => {
        clearAuth();
    };

    const clearAuth = () => {
        setUser(null);
        setToken(null);
        setAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            authenticated,
            login,
            logout,
            verifyToken,
        }}>
            {children}
        </AuthContext.Provider>
    );
}
