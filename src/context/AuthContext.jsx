import { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.config';

const AuthContext = createContext({});

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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Fetch additional user details from Firestore if needed
                // For now, we trust the auth user object, but we could sync custom fields here.
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signup = async (email, password, displayName) => {
        try {
            setError(null);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update Auth profile
            await updateProfile(user, { displayName: displayName });

            // Create user document in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: displayName,
                createdAt: new Date().toISOString(),
                cart: [], // Initialize empty cart
                phoneNumber: '',
                address: {
                    fullName: '',
                    mobile: '',
                    flatNo: '',
                    area: '',
                    city: '',
                    state: '',
                    pincode: ''
                }
            });

            return user;
        } catch (err) {
            console.error("Signup Error:", err);
            // Improve error messages
            if (err.code === 'auth/email-already-in-use') {
                setError('This email is already in use.');
            } else {
                setError(err.message);
            }
            throw err;
        }
    };

    const login = async (email, password) => {
        try {
            setError(null);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (err) {
            console.error("Login Error:", err);
            if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
                setError('Invalid email or password.');
            } else if (err.code === 'auth/invalid-credential') {
                setError('Invalid credentials.');
            } else {
                setError(err.message);
            }
            throw err;
        }
    };

    const signInWithGoogle = async () => {
        try {
            setError(null);
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user exists in Firestore, if not create them
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    createdAt: new Date().toISOString(),
                    cart: [],
                    phoneNumber: '',
                    address: {
                        fullName: user.displayName || '',
                        mobile: '',
                        flatNo: '',
                        area: '',
                        city: '',
                        state: '',
                        pincode: ''
                    }
                });
            }

            return user;
        } catch (err) {
            console.error("Google Sign-in Error:", err);
            setError(err.message);
            throw err;
        }
    };

    const logout = async () => {
        try {
            setError(null);
            await signOut(auth);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const resetPassword = async (email) => {
        // Implement firebase sendPasswordResetEmail if needed
        console.log("Reset password for", email);
    };

    const updateUserData = async (data) => {
        if (!currentUser) return;
        try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, data);
        } catch (err) {
            console.error("Error updating user data:", err);
            throw err;
        }
    };

    const value = {
        currentUser,
        signup,
        login,
        logout,
        signInWithGoogle,
        resetPassword,
        updateUserData,
        error,
        setError
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
