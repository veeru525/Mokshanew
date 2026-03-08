import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaHome, FaBox, FaInfoCircle } from 'react-icons/fa';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { currentUser, logout } = useAuth();
    const { getCartItemCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const cartCount = getCartItemCount();

    return (
        <nav className="navbar glass">
            <div className="container navbar-container">
                <Link to="/" className="navbar-brand">
                    <span className="gradient-text">Moksha</span>
                    <span className="brand-tagline">Shop</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="navbar-links">
                    {currentUser && (
                        <>
                            <Link to="/" className="nav-link">
                                <FaHome /> Home
                            </Link>
                            <Link to="/products" className="nav-link">
                                <FaBox /> Products
                            </Link>
                            <Link to="/about" className="nav-link">
                                <FaInfoCircle /> About
                            </Link>
                        </>
                    )}
                </div>

                {/* Right Side Actions */}
                <div className="navbar-actions">
                    <Link to="/cart" className="cart-icon-wrapper">
                        <FaShoppingCart className="cart-icon" />
                        {cartCount > 0 && (
                            <span className="cart-badge">{cartCount}</span>
                        )}
                    </Link>

                    {currentUser ? (
                        <div className="user-menu-wrapper">
                            <button
                                className="user-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowUserMenu(!showUserMenu);
                                }}
                            >
                                <FaUser />
                                <span className="user-name">
                                    {currentUser.displayName || 'User'}
                                </span>
                            </button>

                            {showUserMenu && (
                                <>
                                    <div className="user-menu-overlay" onClick={() => setShowUserMenu(false)}></div>
                                    <div className="user-dropdown glass" onClick={(e) => e.stopPropagation()}>
                                        <div className="user-info">
                                            <p className="user-name-display">{currentUser.displayName || 'Professional User'}</p>
                                            <p className="user-email">{currentUser.email}</p>
                                        </div>
                                        <div className="user-dropdown-links">
                                            <Link to="/cart" onClick={() => setShowUserMenu(false)}>My Cart</Link>
                                        </div>
                                        <button className="logout-btn" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary login-btn">
                            Login
                        </Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-menu-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && currentUser && (
                <div className="mobile-menu">
                    <Link to="/" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                        <FaHome /> Home
                    </Link>
                    <Link to="/products" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                        <FaBox /> Products
                    </Link>
                    <Link to="/about" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                        <FaInfoCircle /> About
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
