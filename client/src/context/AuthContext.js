import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    // ✅ REAL verification with Rails backend
    const verifyToken = useCallback(async () => {
        const storedToken = localStorage.getItem('token');

        if (!storedToken) {
            clearAuth();
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/auth/verify_token', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${storedToken}`
                }
            });

            const data = await response.json();

            if (response.ok && data.authenticated) {
                setUser(data.user);
                setToken(storedToken);
                setAuthenticated(true);

                // keep latest user info
                localStorage.setItem('user', JSON.stringify(data.user));
            } else {
                clearAuth();
            }

        } catch (err) {
            console.log('Token verification failed');
            clearAuth();
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        verifyToken();
    }, [verifyToken]);

    // ✅ LOGIN
    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        setAuthenticated(true);

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', authToken);
    };

    // ✅ LOGOUT
    const logout = () => {
        clearAuth();
    };

    // ✅ CLEAR EVERYTHING
    const clearAuth = () => {
        setUser(null);
        setToken(null);
        setAuthenticated(false);

        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                authenticated,
                login,
                logout,
                verifyToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
