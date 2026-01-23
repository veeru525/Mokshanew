import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

const API_URL = 'http://localhost:3001/api';

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize auth state from localStorage (only for persistence across refreshes)
    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const signup = async (email, password, displayName) => {
        try {
            setError(null);

            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, displayName })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create account');
            }

            const newUser = await response.json();

            localStorage.setItem('currentUser', JSON.stringify(newUser));
            setCurrentUser(newUser);

            return newUser;
        } catch (err) {
            console.error("Signup error:", err);
            setError(err.message === 'Failed to fetch' ? 'Backend server not running (npm run sql-server)' : err.message);
            throw err;
        }
    };

    const login = async (email, password) => {
        try {
            setError(null);

            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Invalid email or password');
            }

            const user = await response.json();

            localStorage.setItem('currentUser', JSON.stringify(user));
            setCurrentUser(user);

            return user;
        } catch (err) {
            console.error("Login error:", err);
            setError(err.message === 'Failed to fetch' ? 'Backend server not running (npm run sql-server)' : err.message);
            throw err;
        }
    };

    const signInWithGoogle = async () => {
        try {
            setError(null);
            // Simulate Google Auth
            const mockGoogleUser = {
                uid: 'google-' + Date.now(),
                email: `google-${Date.now()}@example.com`,
                displayName: 'Google User',
                photoURL: 'https://via.placeholder.com/150'
            };

            const response = await fetch(`${API_URL}/google-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockGoogleUser)
            });

            if (!response.ok) {
                throw new Error('Google sign in failed');
            }

            const savedUser = await response.json();
            localStorage.setItem('currentUser', JSON.stringify(savedUser));
            setCurrentUser(savedUser);
            return savedUser;
        } catch (err) {
            setError('Google Sign-In failed: ' + err.message);
            throw err;
        }
    };

    const logout = async () => {
        try {
            setError(null);
            localStorage.removeItem('currentUser');
            setCurrentUser(null);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const resetPassword = async (email) => {
        // Just a mock function for now as we don't have email service
        console.log(`Password reset requested for ${email}`);
    };

    const value = {
        currentUser,
        signup,
        login,
        logout,
        signInWithGoogle,
        resetPassword,
        error,
        setError
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
