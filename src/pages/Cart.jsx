import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaTruck, FaSave, FaUser, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartItemCount } = useCart();
    const { currentUser, updateUserData, db } = useAuth();
    const [address, setAddress] = useState({
        fullName: '',
        mobile: '',
        flatNo: '',
        area: '',
        city: '',
        state: '',
        pincode: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        if (currentUser) {
            // Load user's saved address from Firestore
            const fetchUserData = async () => {
                try {
                    const { doc, getDoc } = await import('firebase/firestore');
                    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                    if (userDoc.exists() && userDoc.data().address) {
                        setAddress(userDoc.data().address);
                    } else if (currentUser.displayName) {
                        setAddress(prev => ({ ...prev, fullName: currentUser.displayName }));
                    }
                } catch (error) {
                    console.error("Error loading address:", error);
                }
            };
            fetchUserData();
        }
    }, [currentUser, db]);

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveAddress = async () => {
        setIsSaving(true);
        try {
            await updateUserData({ address });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error("Save address error:", error);
        } finally {
            setIsSaving(false);
        }
    };

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

        // Custom phone number from previous state
        const phoneNumber = "919553301275";

        let message = `*MOKSHA SHOP - NEW ORDER* 📦\n\n`;
        message += `*Customer Details:*\n`;
        message += `- Name: ${address.fullName || currentUser.displayName || currentUser.email}\n`;
        message += `- Mobile: ${address.mobile || 'Not provided'}\n`;
        message += `- Address: ${address.flatNo}, ${address.area}, ${address.city}, ${address.state} - ${address.pincode}\n\n`;

        message += `*Order Items:*\n`;
        cartItems.forEach((item, index) => {
            message += `${index + 1}. ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}\n`;
        });

        message += `\n*Order Summary:*\n`;
        message += `- Subtotal: ₹${subtotal.toFixed(2)}\n`;
        message += `- GST (18%): ₹${tax.toFixed(2)}\n`;
        message += `*Total Payable: ₹${total.toFixed(2)}*\n\n`;

        message += `Please confirm my order and provide payment details. Thank you!`;

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
                    {/* Left Column: Cart Items and Address Form */}
                    <div className="cart-main">
                        <div className="cart-items-section">
                            {cartItems.map((item) => (
                                <div key={item.id} className="cart-item glass">
                                    <div className="cart-item-image">
                                        <img src={item.image} alt={item.name} />
                                    </div>

                                    <div className="cart-item-details">
                                        <h3 className="cart-item-name">{item.name}</h3>
                                        <p className="cart-item-category">{item.category}</p>
                                        <div className="cart-item-pricing">
                                            <span className="cart-item-price">₹{item.price}</span>
                                        </div>
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

                        {/* Delivery Address Form */}
                        <div className="address-section glass">
                            <h2 className="section-title"><FaTruck /> Delivery Address</h2>
                            <p className="section-subtitle">Enter your details for professional delivery</p>

                            <div className="address-form">
                                <div className="form-group">
                                    <label><FaUser /> Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder="Receiver's name"
                                        value={address.fullName}
                                        onChange={handleAddressChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label><FaPhoneAlt /> Mobile Number</label>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        placeholder="10-digit mobile number"
                                        value={address.mobile}
                                        onChange={handleAddressChange}
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label><FaMapMarkerAlt /> Flat / House No.</label>
                                        <input
                                            type="text"
                                            name="flatNo"
                                            placeholder="Unit 12..."
                                            value={address.flatNo}
                                            onChange={handleAddressChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Area / Colony</label>
                                        <input
                                            type="text"
                                            name="area"
                                            placeholder="Street, Sector..."
                                            value={address.area}
                                            onChange={handleAddressChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="Your city"
                                            value={address.city}
                                            onChange={handleAddressChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Pincode</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            placeholder="6 digits"
                                            value={address.pincode}
                                            onChange={handleAddressChange}
                                        />
                                    </div>
                                </div>

                                <button
                                    className={`btn ${saveSuccess ? 'btn-success' : 'btn-secondary'} save-address-btn`}
                                    onClick={handleSaveAddress}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving...' : saveSuccess ? '✓ Address Saved' : <><FaSave /> Save Delivery Details</>}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Cart Summary */}
                    <div className="cart-sidebar">
                        <div className="cart-summary glass">
                            <h2 className="summary-title">Order Summary</h2>

                            <div className="summary-list">
                                {cartItems.map(item => (
                                    <div key={`summary-${item.id}`} className="summary-item">
                                        <span className="summary-item-name">{item.name} x{item.quantity}</span>
                                        <span className="summary-item-price">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <hr className="summary-divider" />

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>

                            <div className="summary-row">
                                <span>Tax (18% GST)</span>
                                <span>₹{tax.toFixed(2)}</span>
                            </div>

                            <div className="summary-row summary-total">
                                <span>Total Amount</span>
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
                                disabled={!currentUser || !address.mobile || !address.city}
                                onClick={handleCheckout}
                            >
                                {currentUser ? 'Place Order via WhatsApp' : 'Login to Checkout'}
                            </button>

                            <Link to="/products" className="continue-shopping">
                                ← Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
