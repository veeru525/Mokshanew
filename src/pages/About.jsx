import { FaStore, FaHeart, FaUsers, FaShieldAlt } from 'react-icons/fa';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="container">
                    <div className="about-hero-content fade-in">
                        <h1 className="about-title">
                            About <span className="gradient-text">Moksha Shop</span>
                        </h1>
                        <p className="about-subtitle">
                            Your trusted partner in online shopping, bringing quality products
                            and exceptional service to your doorstep.
                        </p>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="about-story">
                <div className="container">
                    <div className="story-content">
                        <div className="story-text">
                            <h2 className="section-title">Our Story</h2>
                            <p>
                                Founded with a vision to make quality products accessible to everyone,
                                Moksha Shop has grown into a trusted e-commerce platform serving thousands
                                of happy customers across India.
                            </p>
                            <p>
                                We believe in the power of technology to transform shopping experiences.
                                Our platform combines cutting-edge technology with a customer-first approach
                                to deliver seamless shopping experiences.
                            </p>
                            <p>
                                From fashion to electronics, home essentials to beauty products, we curate
                                the best products from trusted sellers and brands, ensuring quality and
                                affordability in every purchase.
                            </p>
                        </div>
                        <div className="story-image glass">
                            <div className="image-placeholder">
                                <FaStore className="placeholder-icon" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="about-values">
                <div className="container">
                    <h2 className="section-title text-center">Our Values</h2>
                    <p className="section-subtitle text-center">
                        The principles that guide everything we do
                    </p>

                    <div className="values-grid">
                        <div className="value-card glass">
                            <div className="value-icon">
                                <FaHeart />
                            </div>
                            <h3>Customer First</h3>
                            <p>
                                Your satisfaction is our top priority. We go above and beyond
                                to ensure every shopping experience exceeds expectations.
                            </p>
                        </div>

                        <div className="value-card glass">
                            <div className="value-icon">
                                <FaShieldAlt />
                            </div>
                            <h3>Quality Assured</h3>
                            <p>
                                We carefully vet every product and seller on our platform to
                                guarantee quality and authenticity.
                            </p>
                        </div>

                        <div className="value-card glass">
                            <div className="value-icon">
                                <FaUsers />
                            </div>
                            <h3>Community Driven</h3>
                            <p>
                                We're building more than a marketplace - we're creating a
                                community of satisfied customers and trusted sellers.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="about-stats">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3 className="stat-number gradient-text">10K+</h3>
                            <p className="stat-label">Happy Customers</p>
                        </div>
                        <div className="stat-card">
                            <h3 className="stat-number gradient-text">5K+</h3>
                            <p className="stat-label">Products</p>
                        </div>
                        <div className="stat-card">
                            <h3 className="stat-number gradient-text">500+</h3>
                            <p className="stat-label">Trusted Sellers</p>
                        </div>
                        <div className="stat-card">
                            <h3 className="stat-number gradient-text">50+</h3>
                            <p className="stat-label">Cities Served</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="about-contact">
                <div className="container">
                    <div className="contact-card glass">
                        <h2 className="section-title">Get in Touch</h2>
                        <p className="contact-description">
                            Have questions or feedback? We'd love to hear from you!
                        </p>
                        <div className="contact-info">
                            <div className="contact-item">
                                <h4>Email</h4>
                                <p>support@mokshashop.com</p>
                            </div>
                            <div className="contact-item">
                                <h4>Phone</h4>
                                <p>+91 1234567890</p>
                            </div>
                            <div className="contact-item">
                                <h4>Address</h4>
                                <p>Mumbai, Maharashtra, India</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
