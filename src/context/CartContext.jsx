import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase.config';

const CartContext = createContext({});

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();

    // Load cart
    useEffect(() => {
        let unsubscribe;

        if (currentUser) {
            setLoading(true);
            // Real-time listener for Firestore
            const userDocRef = doc(db, 'users', currentUser.uid);

            unsubscribe = onSnapshot(userDocRef, (docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setCartItems(userData.cart || []);
                }
                setLoading(false);
            }, (error) => {
                console.error("Cart subscription error:", error);
                setLoading(false);
            });

        } else {
            // Guest mode: LocalStorage
            const localCart = localStorage.getItem('cart_guest');
            if (localCart) {
                setCartItems(JSON.parse(localCart));
            } else {
                setCartItems([]);
            }
            setLoading(false);
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [currentUser]);

    // Save cart helper
    const saveCart = async (newCart) => {
        if (currentUser) {
            try {
                const userDocRef = doc(db, 'users', currentUser.uid);
                // Use setDoc with merge: true to create the document if it doesn't exist
                await setDoc(userDocRef, {
                    cart: newCart
                }, { merge: true });
            } catch (error) {
                console.error('Error saving cart to Firestore:', error);
            }
        } else {
            localStorage.setItem('cart_guest', JSON.stringify(newCart));
        }
    };

    const addToCart = async (product) => {
        const existingItem = cartItems.find(item => item.id === product.id);
        let newCart;

        if (existingItem) {
            newCart = cartItems.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            newCart = [...cartItems, { ...product, quantity: 1 }];
        }

        // Optimistic UI update (optional, but since we have onSnapshot, 
        // passing it to saveCart is better or we just set it locally and wait for sync?
        // Let's set it locally to avoid lag, onSnapshot will confirm it.)
        setCartItems(newCart);
        await saveCart(newCart);
    };

    const removeFromCart = async (productId) => {
        const newCart = cartItems.filter(item => item.id !== productId);
        setCartItems(newCart);
        await saveCart(newCart);
    };

    const updateQuantity = async (productId, quantity) => {
        if (quantity <= 0) {
            await removeFromCart(productId);
            return;
        }

        const newCart = cartItems.map(item =>
            item.id === productId
                ? { ...item, quantity }
                : item
        );

        setCartItems(newCart);
        await saveCart(newCart);
    };

    const clearCart = async () => {
        setCartItems([]);
        await saveCart([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartItemCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        loading
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
