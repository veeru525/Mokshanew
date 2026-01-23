import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext({});
const API_URL = 'http://localhost:3001/api';

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

    // Load cart from SQLite Backend
    useEffect(() => {
        const loadCart = async () => {
            if (currentUser) {
                setLoading(true);
                try {
                    const response = await fetch(`${API_URL}/cart/${currentUser.id}`);
                    if (response.ok) {
                        const items = await response.json();
                        setCartItems(items || []);
                    }
                } catch (error) {
                    console.error('Error loading cart:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                // Fallback for guest
                const localCart = localStorage.getItem('cart_guest');
                if (localCart) setCartItems(JSON.parse(localCart));
                else setCartItems([]);
            }
        };

        loadCart();
    }, [currentUser]);

    // Save cart to SQLite Backend
    const saveCart = async (items) => {
        if (currentUser) {
            try {
                // POST request to sync cart
                await fetch(`${API_URL}/cart/${currentUser.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cart: items })
                });
            } catch (error) {
                console.error('Error saving cart:', error);
            }
        } else {
            localStorage.setItem('cart_guest', JSON.stringify(items));
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
