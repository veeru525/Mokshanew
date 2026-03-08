import { Link, useNavigate } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar, FaTrash } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductCard.css';

const ProductCard = ({ product, isAdmin, onDelete }) => {
    const { addToCart } = useCart();
    const { currentUser, setError } = useAuth();
    const navigate = useNavigate();

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`full-${i}`} />);
        }
        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" />);
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaRegStar key={`empty-${i}`} />);
        }
        return stars;
    };

    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    const handleAddToCart = (e) => {
        e.preventDefault();
        if (!currentUser) {
            setError("Please login to add items to cart.");
            navigate('/login');
            return;
        }
        addToCart(product);
    };

    return (
        <div className="product-card">
            <div className="product-image-wrapper">
                <img src={product.image} alt={product.name} className="product-image" />
                {discount > 0 && (
                    <span className="discount-badge">{discount}% OFF</span>
                )}
            </div>

            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-category">{product.category}</p>

                <div className="product-rating">
                    <div className="stars">
                        {renderStars(product.rating)}
                    </div>
                    <span className="rating-text">
                        {product.rating} ({product.reviews})
                    </span>
                </div>

                <div className="product-pricing">
                    <span className="current-price">₹{product.price}</span>
                    {product.originalPrice && (
                        <span className="original-price">₹{product.originalPrice}</span>
                    )}
                </div>

                <div className="product-actions" style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-primary add-to-cart-btn" onClick={handleAddToCart} style={{ flex: 1 }}>
                        Add to Cart
                    </button>
                    {isAdmin && (
                        <button
                            className="btn btn-danger"
                            onClick={(e) => { e.preventDefault(); onDelete(product.id); }}
                            style={{ padding: '0 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            title="Delete Product"
                        >
                            <FaTrash />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
