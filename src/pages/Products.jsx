import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaFilter, FaUpload, FaSpinner, FaPlus, FaDownload, FaTimes } from 'react-icons/fa';
import { categories } from '../data/productsData';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import * as XLSX from 'xlsx';
import './Products.css';

const Products = () => {
    const { currentUser } = useAuth();
    // In a real app, role would be checked securely via Claims or DB. Using hardcoded email for this demo.
    const isAdmin = currentUser?.email === 'admin@moksha.com';

    const fileInputRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
    const [searchQuery, setSearchQuery] = useState('');

    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Add Product Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '', category: 'Electronics', price: '', originalPrice: '', rating: '5', reviews: '1', image: '', description: ''
    });

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/products');
            if (res.ok) {
                const data = await res.json();
                setAllProducts(data);
            } else {
                console.error("Failed to fetch products");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        console.log("Delete button clicked for ID:", id);
        // Temporarily bypassing window.confirm if it's being blocked
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        console.log("Confirm result:", confirmDelete);
        if (!confirmDelete) return;

        try {
            console.log("Sending delete request to API...");
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                console.log("Delete successful");
                fetchProducts();
            } else {
                alert("Failed to delete product.");
                console.error("Delete failed");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Error deleting product.");
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            });
            if (res.ok) {
                alert("Product added successfully!");
                setIsAddModalOpen(false);
                setNewProduct({ name: '', category: 'Electronics', price: '', originalPrice: '', rating: '5', reviews: '1', image: '', description: '' });
                fetchProducts();
            } else {
                alert("Failed to add product.");
            }
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Error adding product.");
        }
    };

    const handleDownloadSample = () => {
        console.log("Download Sample button clicked");
        try {
            const sampleData = [
                {
                    name: "Premium Wireless Headphones",
                    category: "Electronics",
                    price: 5999,
                    originalPrice: 8999,
                    rating: 4.5,
                    reviews: 128,
                    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
                    description: "High-quality wireless headphones with noise cancellation."
                }
            ];
            const worksheet = XLSX.utils.json_to_sheet(sampleData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "SampleProducts");

            // Generate array buffer to download manually (bypasses XLSX.writeFile issues in Vite)
            console.log("Writing XLSX buffer...");
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

            console.log("Creating Blob...");
            const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);

            console.log("Triggering download frame...");
            const a = document.createElement("a");
            a.href = url;
            a.download = "SampleProducts_Format.xlsx";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            console.log("Download triggered.");
        } catch (err) {
            console.error("Error in generating sample file:", err);
            alert("Failed to generate sample file");
        }
    };

    useEffect(() => {
        let result = allProducts;

        // Filter by category
        if (selectedCategory && selectedCategory !== 'All') {
            result = result.filter(p => p.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const lowercaseQuery = searchQuery.toLowerCase();
            result = result.filter(product =>
                product.name?.toLowerCase().includes(lowercaseQuery) ||
                product.description?.toLowerCase().includes(lowercaseQuery) ||
                product.category?.toLowerCase().includes(lowercaseQuery)
            );
        }

        setFilteredProducts(result);
    }, [selectedCategory, searchQuery, allProducts]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        if (category === 'All') {
            setSearchParams({});
        } else {
            setSearchParams({ category });
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const reader = new FileReader();

            reader.onload = async (event) => {
                try {
                    const data = new Uint8Array(event.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const json = XLSX.utils.sheet_to_json(worksheet);

                    if (json.length === 0) {
                        alert("The uploaded Excel file appears to be empty.");
                        setUploading(false);
                        return;
                    }

                    const res = await fetch('/api/products/bulk', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(json)
                    });

                    if (res.ok) {
                        alert('Products uploaded successfully!');
                        fetchProducts(); // Refresh the list
                    } else {
                        const err = await res.json();
                        alert(`Upload failed: ${err.error || 'Unknown error'}`);
                    }
                } catch (parseError) {
                    console.error("Parse Error:", parseError);
                    alert('Error parsing Excel file contents. Please ensure it is a valid .xlsx or .xls file.');
                } finally {
                    setUploading(false);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                }
            };

            reader.onerror = (error) => {
                console.error("FileReader Error:", error);
                alert('Error reading the file.');
                setUploading(false);
            };

            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error(error);
            alert('Error initiating file upload.');
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
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

                {/* Admin Actions */}
                {isAdmin && (
                    <div className="admin-actions-bar" style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap', alignItems: 'stretch' }}>
                        <div style={{ display: 'flex', margin: 0 }}>
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                className="file-input"
                                id="upload-excel"
                                onChange={handleFileUpload}
                                ref={fileInputRef}
                            />
                            <label htmlFor="upload-excel" className={`btn btn-primary ${uploading ? 'disabled' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, height: '100%', cursor: 'pointer' }}>
                                {uploading ? <FaSpinner className="spinner" /> : <FaUpload />}
                                {uploading ? 'Uploading...' : 'Upload Products (Excel)'}
                            </label>
                        </div>
                        <button className="btn btn-secondary" onClick={handleDownloadSample} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, height: '100%' }}>
                            <FaDownload /> Download Sample Excel
                        </button>
                        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', height: '100%' }}>
                            <FaPlus /> Add Product
                        </button>
                    </div>
                )}

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
                    {loading ? (
                        <div className="loading-container" style={{ textAlign: 'center', padding: '50px' }}>
                            <FaSpinner className="spinner" size={40} />
                            <p>Loading products...</p>
                        </div>
                    ) : (
                        <>
                            <div className="products-info">
                                <p className="products-count">
                                    Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                                </p>
                            </div>

                            {filteredProducts.length > 0 ? (
                                <div className="products-grid">
                                    {filteredProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} isAdmin={isAdmin} onDelete={handleDelete} />
                                    ))}
                                </div>
                            ) : (
                                <div className="no-products">
                                    <div className="no-products-icon">🔍</div>
                                    <h3>No Products Found</h3>
                                    <p>Try adjusting your search or filter, or upload products if you're an Admin.</p>
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
                        </>
                    )}
                </div>
            </div>

            {/* Add Product Modal */}
            {isAddModalOpen && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div className="modal-content" style={{ background: '#f8f9fa', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eaeaea', paddingBottom: '15px' }}>
                            <h2 style={{ margin: 0, color: '#111827', fontSize: '1.5rem', fontWeight: 'bold' }}>Add New Product</h2>
                            <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}><FaTimes /></button>
                        </div>
                        <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Product Name</label>
                                <input type="text" required placeholder="e.g. Wireless Bluetooth Earbuds" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: 'white', color: '#111827' }} />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Category</label>
                                <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: 'white', color: '#111827' }}>
                                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Price (₹)</label>
                                    <input type="number" required placeholder="e.g. 1499" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: 'white', color: '#111827' }} />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Original Price (₹)</label>
                                    <input type="number" placeholder="e.g. 2999" value={newProduct.originalPrice} onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: 'white', color: '#111827' }} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Image URL</label>
                                <input type="url" required placeholder="https://example.com/image.jpg" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: 'white', color: '#111827' }} />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Description</label>
                                <textarea rows="3" required placeholder="Describe the product features and specifications clearly..." value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', resize: 'vertical', backgroundColor: 'white', color: '#111827' }}></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ marginTop: '15px', width: '100%', padding: '12px', fontSize: '1rem', fontWeight: 'bold' }}>Add Product to Catalog</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
