import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const { currentUser } = useAuth();

    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-grid">
                    {/* Brand Section */}
                    <div className="footer-section">
                        <h3 className="footer-brand gradient-text">Moksha Shop</h3>
                        <p className="footer-description">
                            Your trusted destination for quality products at affordable prices.
                            Shop with confidence and style.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-link" aria-label="Facebook">
                                <FaFacebook />
                            </a>
                            <a href="#" className="social-link" aria-label="Twitter">
                                <FaTwitter />
                            </a>
                            <a href="#" className="social-link" aria-label="Instagram">
                                <FaInstagram />
                            </a>
                            <a href="#" className="social-link" aria-label="LinkedIn">
                                <FaLinkedin />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    {currentUser && (
                        <div className="footer-section">
                            <h4 className="footer-heading">Quick Links</h4>
                            <ul className="footer-links">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/products">Products</Link></li>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/cart">Cart</Link></li>
                            </ul>
                        </div>
                    )}

                    {/* Customer Service */}
                    <div className="footer-section">
                        <h4 className="footer-heading">Customer Service</h4>
                        <ul className="footer-links">
                            <li><a href="#">Contact Us</a></li>
                            <li><a href="#">Shipping Info</a></li>
                            <li><a href="#">Returns</a></li>
                            <li><a href="#">FAQ</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-section">
                        <h4 className="footer-heading">Contact</h4>
                        <ul className="footer-links">
                            <li>Email: support@mokshashop.com  </li>
                            <li>Phone: +91 9032524445 </li>
                            <li>Address:kakinada , AP, India</li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="copyright">
                        © {currentYear} Moksha Shop. All rights reserved. Made with <FaHeart className="heart-icon" /> in India
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
