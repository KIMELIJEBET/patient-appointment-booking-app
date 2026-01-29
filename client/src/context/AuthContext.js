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

        if (storedToken) {
            try {
                const response = await fetch('http://localhost:3000/api/auth/verify', {
                    headers: {
                        'Authorization': `Bearer ${storedToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                    setToken(data.token);
                    setAuthenticated(true);
                    localStorage.setItem('user', JSON.stringify(data.user));
                } else {
                    // Token is invalid or expired
                    clearAuth();
                }
            } catch (err) {
                console.log('Token verification failed');
                clearAuth();
            }
        } else if (storedUser) {
            // User data exists but no token, clear it
            clearAuth();
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
