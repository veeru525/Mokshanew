import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartItemCount } = useCart();
    const { currentUser } = useAuth();

    const subtotal = getCartTotal();
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + tax;

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity >= 1) {
            updateQuantity(productId, newQuantity);
        }
    };

    const handleCheckout = () => {
        if (!currentUser) return;

        // Replace with your WhatsApp number (include country code, no + or spaces)
        // Example: 919876543210 for India (+91)
        const phoneNumber = "919876543210";

        let message = `*New Order from ${currentUser.displayName || currentUser.email}* 🛍️\n\n`;

        cartItems.forEach((item, index) => {
            message += `${index + 1}. ${item.name} x${item.quantity} - ₹${item.price * item.quantity}\n`;
        });

        message += `\n*Total Amount: ₹${total.toFixed(2)}*`;
        message += `\n\nPlease confirm my order!`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <div className="empty-cart-icon">
                            <FaShoppingBag />
                        </div>
                        <h2>Your Cart is Empty</h2>
                        <p>Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/products" className="btn btn-primary btn-large">
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <div className="cart-header">
                    <h1 className="page-title gradient-text">Shopping Cart</h1>
                    <p className="cart-count">{getCartItemCount()} {getCartItemCount() === 1 ? 'item' : 'items'}</p>
                </div>

                <div className="cart-content">
                    {/* Cart Items */}
                    <div className="cart-items-section">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item glass">
                                <div className="cart-item-image">
                                    <img src={item.image} alt={item.name} />
                                </div>

                                <div className="cart-item-details">
                                    <h3 className="cart-item-name">{item.name}</h3>
                                    <p className="cart-item-category">{item.category}</p>
                                    <p className="cart-item-price">₹{item.price}</p>
                                </div>

                                <div className="cart-item-actions">
                                    <div className="quantity-controls">
                                        <button
                                            className="quantity-btn"
                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            <FaMinus />
                                        </button>
                                        <span className="quantity-value">{item.quantity}</span>
                                        <button
                                            className="quantity-btn"
                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>

                                    <button
                                        className="remove-btn"
                                        onClick={() => removeFromCart(item.id)}
                                        title="Remove item"
                                    >
                                        <FaTrash /> Remove
                                    </button>
                                </div>

                                <div className="cart-item-total">
                                    <p className="item-total-label">Total</p>
                                    <p className="item-total-price">₹{item.price * item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="cart-summary glass">
                        <h2 className="summary-title">Order Summary</h2>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>

                        <div className="summary-row">
                            <span>Tax (18% GST)</span>
                            <span>₹{tax.toFixed(2)}</span>
                        </div>

                        <div className="summary-row summary-total">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>

                        {!currentUser && (
                            <div className="login-notice">
                                <p>Please login to proceed with checkout</p>
                                <Link to="/login" className="btn btn-secondary">
                                    Login
                                </Link>
                            </div>
                        )}

                        <button
                            className="btn btn-primary btn-large checkout-btn"
                            disabled={!currentUser}
                            onClick={handleCheckout}
                        >
                            {currentUser ? 'Proceed to Checkout via WhatsApp' : 'Login to Checkout'}
                        </button>

                        <Link to="/products" className="continue-shopping">
                            ← Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
