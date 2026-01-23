import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { products, categories, getProductsByCategory, searchProducts } from '../data/productsData';
import ProductCard from '../components/ProductCard';
import './Products.css';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(products);

    useEffect(() => {
        let result = products;

        // Filter by category
        if (selectedCategory && selectedCategory !== 'All') {
            result = getProductsByCategory(selectedCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            result = searchProducts(searchQuery);
            if (selectedCategory && selectedCategory !== 'All') {
                result = result.filter(p => p.category === selectedCategory);
            }
        }

        setFilteredProducts(result);
    }, [selectedCategory, searchQuery]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        if (category === 'All') {
            setSearchParams({});
        } else {
            setSearchParams({ category });
        }
    };

    return (
        <div className="products-page">
            <div className="container">
                {/* Page Header */}
                <div className="products-header">
                    <h1 className="page-title gradient-text">Our Products</h1>
                    <p className="page-subtitle">Discover amazing products at great prices</p>
                </div>

                {/* Search Bar */}
                <div className="search-section">
                    <div className="search-bar">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Category Filters */}
                <div className="filters-section">
                    <div className="filter-header">
                        <FaFilter /> <span>Filter by Category</span>
                    </div>
                    <div className="category-filters">
                        <button
                            className={`filter-btn ${selectedCategory === 'All' ? 'active' : ''}`}
                            onClick={() => handleCategoryChange('All')}
                        >
                            All Products
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                className={`filter-btn ${selectedCategory === category.name ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(category.name)}
                            >
                                <span className="filter-icon">{category.icon}</span>
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                <div className="products-content">
                    <div className="products-info">
                        <p className="products-count">
                            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                        </p>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="products-grid">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-products">
                            <div className="no-products-icon">🔍</div>
                            <h3>No Products Found</h3>
                            <p>Try adjusting your search or filter to find what you're looking for.</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('All');
                                    setSearchParams({});
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;
