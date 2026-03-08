import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaArrowRight, FaTruck, FaShieldAlt, FaUndo } from 'react-icons/fa';
import { categories } from '../data/productsData';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
    const { currentUser } = useAuth();
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                setFeaturedProducts(data.slice(0, 8));
            })
            .catch(err => console.error("Error fetching featured products:", err));
    }, []);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container hero-container">
                    <div className="hero-content fade-in">
                        <h1 className="hero-title">
                            Shop Smart, <span className="gradient-text">Live Better</span>
                        </h1>
                        <p className="hero-description">
                            Discover amazing products at unbeatable prices. Your one-stop destination
                            for fashion, electronics, home essentials, and more.
                        </p>
                        <div className="hero-actions">
                            <Link to="/products" className="btn btn-primary btn-large">
                                <FaShoppingBag /> Start Shopping
                            </Link>
                            <Link to="/about" className="btn btn-outline btn-large">
                                Learn More <FaArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-card glass">
                            <div className="feature-icon">
                                <FaTruck />
                            </div>
                            <h3>Free Delivery</h3>
                            <p>Free shipping on all orders with no minimum purchase</p>
                        </div>
                        <div className="feature-card glass">
                            <div className="feature-icon">
                                <FaShieldAlt />
                            </div>
                            <h3>Secure Payment</h3>
                            <p>100% secure and encrypted payment processing</p>
                        </div>
                        <div className="feature-card glass">
                            <div className="feature-icon">
                                <FaUndo />
                            </div>
                            <h3>Easy Returns</h3>
                            <p>7-day hassle-free return and refund policy</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="categories-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Shop by Category</h2>
                        <p className="section-subtitle">Explore our wide range of categories</p>
                    </div>
                    <div className="categories-grid">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                to={`/products?category=${category.name}`}
                                className="category-card glass"
                            >
                                <span className="category-icon">{category.icon}</span>
                                <h3 className="category-name">{category.name}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            {currentUser && (
                <section className="featured-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Featured Products</h2>
                            <p className="section-subtitle">Handpicked items just for you</p>
                        </div>
                        <div className="products-grid">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        <div className="section-footer">
                            <Link to="/products" className="btn btn-primary">
                                View All Products <FaArrowRight />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {!currentUser && (
                <section className="featured-section">
                    <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <div className="section-header">
                            <h2 className="section-title">Want to see our collection?</h2>
                            <p className="section-subtitle">Login or signup now to browse our amazing product catalog</p>
                        </div>
                        <div style={{ marginTop: '30px' }}>
                            <Link to="/login" className="btn btn-primary btn-large">
                                Login to Browse
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container cta-container glass">
                    <h2 className="cta-title">Ready to Start Shopping?</h2>
                    <p className="cta-description">
                        Join thousands of happy customers and discover amazing deals today!
                    </p>
                    <Link to="/products" className="btn btn-primary btn-large">
                        Browse Products <FaArrowRight />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
