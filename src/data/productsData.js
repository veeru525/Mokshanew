// Mock product data for the e-commerce application
// In production, this would be fetched from a database or API

export const categories = [
    { id: 1, name: 'Fashion', icon: '👗' },
    { id: 2, name: 'Electronics', icon: '📱' },
    { id: 3, name: 'Home & Living', icon: '🏠' },
    { id: 4, name: 'Beauty', icon: '💄' },
    { id: 5, name: 'Accessories', icon: '👜' },
    { id: 6, name: 'Sports', icon: '⚽' }
];

export const products = [
    // Fashion
    {
        id: 1,
        name: 'Premium Cotton T-Shirt',
        category: 'Fashion',
        price: 499,
        originalPrice: 999,
        rating: 4.5,
        reviews: 234,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        description: 'Comfortable premium cotton t-shirt with modern fit'
    },
    {
        id: 2,
        name: 'Denim Jacket',
        category: 'Fashion',
        price: 1299,
        originalPrice: 2499,
        rating: 4.7,
        reviews: 189,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
        description: 'Classic denim jacket with vintage wash'
    },
    {
        id: 3,
        name: 'Floral Summer Dress',
        category: 'Fashion',
        price: 899,
        originalPrice: 1799,
        rating: 4.6,
        reviews: 312,
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop',
        description: 'Beautiful floral print summer dress'
    },
    {
        id: 4,
        name: 'Slim Fit Jeans',
        category: 'Fashion',
        price: 1099,
        originalPrice: 1999,
        rating: 4.4,
        reviews: 456,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
        description: 'Comfortable slim fit jeans with stretch'
    },

    // Electronics
    {
        id: 5,
        name: 'Wireless Earbuds Pro',
        category: 'Electronics',
        price: 2499,
        originalPrice: 4999,
        rating: 4.8,
        reviews: 567,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop',
        description: 'Premium wireless earbuds with noise cancellation'
    },
    {
        id: 6,
        name: 'Smart Watch Series 5',
        category: 'Electronics',
        price: 3999,
        originalPrice: 7999,
        rating: 4.7,
        reviews: 423,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        description: 'Feature-rich smartwatch with health tracking'
    },
    {
        id: 7,
        name: 'Portable Bluetooth Speaker',
        category: 'Electronics',
        price: 1799,
        originalPrice: 2999,
        rating: 4.5,
        reviews: 289,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
        description: 'Waterproof portable speaker with amazing sound'
    },
    {
        id: 8,
        name: 'Wireless Mouse',
        category: 'Electronics',
        price: 599,
        originalPrice: 999,
        rating: 4.3,
        reviews: 178,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
        description: 'Ergonomic wireless mouse with precision tracking'
    },

    // Home & Living
    {
        id: 9,
        name: 'Ceramic Coffee Mug Set',
        category: 'Home & Living',
        price: 699,
        originalPrice: 1299,
        rating: 4.6,
        reviews: 234,
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop',
        description: 'Set of 4 elegant ceramic coffee mugs'
    },
    {
        id: 10,
        name: 'Decorative Wall Art',
        category: 'Home & Living',
        price: 1499,
        originalPrice: 2999,
        rating: 4.7,
        reviews: 156,
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=400&fit=crop',
        description: 'Modern abstract wall art for home decor'
    },
    {
        id: 11,
        name: 'Scented Candle Collection',
        category: 'Home & Living',
        price: 899,
        originalPrice: 1499,
        rating: 4.8,
        reviews: 345,
        image: 'https://images.unsplash.com/photo-1602874801006-96e9d5e7f9e1?w=400&h=400&fit=crop',
        description: 'Set of 3 luxury scented candles'
    },
    {
        id: 12,
        name: 'Throw Pillow Covers',
        category: 'Home & Living',
        price: 499,
        originalPrice: 899,
        rating: 4.4,
        reviews: 267,
        image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=400&fit=crop',
        description: 'Set of 2 decorative throw pillow covers'
    },

    // Beauty
    {
        id: 13,
        name: 'Skincare Gift Set',
        category: 'Beauty',
        price: 1999,
        originalPrice: 3999,
        rating: 4.9,
        reviews: 489,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
        description: 'Complete skincare routine gift set'
    },
    {
        id: 14,
        name: 'Makeup Brush Set',
        category: 'Beauty',
        price: 799,
        originalPrice: 1599,
        rating: 4.6,
        reviews: 312,
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop',
        description: 'Professional makeup brush set with case'
    },
    {
        id: 15,
        name: 'Hair Styling Tools',
        category: 'Beauty',
        price: 2499,
        originalPrice: 4999,
        rating: 4.7,
        reviews: 234,
        image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=400&fit=crop',
        description: 'Professional hair straightener and curler set'
    },
    {
        id: 16,
        name: 'Facial Cleanser',
        category: 'Beauty',
        price: 599,
        originalPrice: 999,
        rating: 4.5,
        reviews: 456,
        image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop',
        description: 'Gentle daily facial cleanser for all skin types'
    },

    // Accessories
    {
        id: 17,
        name: 'Leather Wallet',
        category: 'Accessories',
        price: 899,
        originalPrice: 1799,
        rating: 4.6,
        reviews: 289,
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop',
        description: 'Genuine leather wallet with RFID protection'
    },
    {
        id: 18,
        name: 'Designer Sunglasses',
        category: 'Accessories',
        price: 1299,
        originalPrice: 2499,
        rating: 4.7,
        reviews: 178,
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
        description: 'Stylish UV protection sunglasses'
    },
    {
        id: 19,
        name: 'Leather Handbag',
        category: 'Accessories',
        price: 1999,
        originalPrice: 3999,
        rating: 4.8,
        reviews: 367,
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
        description: 'Premium leather handbag with multiple compartments'
    },
    {
        id: 20,
        name: 'Watch Collection',
        category: 'Accessories',
        price: 2499,
        originalPrice: 4999,
        rating: 4.9,
        reviews: 445,
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop',
        description: 'Elegant analog watch with leather strap'
    },

    // Sports
    {
        id: 21,
        name: 'Yoga Mat Premium',
        category: 'Sports',
        price: 799,
        originalPrice: 1499,
        rating: 4.7,
        reviews: 234,
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop',
        description: 'Non-slip yoga mat with carrying strap'
    },
    {
        id: 22,
        name: 'Gym Duffel Bag',
        category: 'Sports',
        price: 1299,
        originalPrice: 2299,
        rating: 4.5,
        reviews: 189,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
        description: 'Spacious gym bag with shoe compartment'
    },
    {
        id: 23,
        name: 'Resistance Bands Set',
        category: 'Sports',
        price: 599,
        originalPrice: 1199,
        rating: 4.6,
        reviews: 312,
        image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=400&fit=crop',
        description: 'Set of 5 resistance bands for home workout'
    },
    {
        id: 24,
        name: 'Running Shoes',
        category: 'Sports',
        price: 2199,
        originalPrice: 3999,
        rating: 4.8,
        reviews: 567,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        description: 'Lightweight running shoes with cushioned sole'
    }
];

export const getProductsByCategory = (category) => {
    if (!category || category === 'All') return products;
    return products.filter(product => product.category === category);
};

export const getProductById = (id) => {
    return products.find(product => product.id === parseInt(id));
};

export const searchProducts = (query) => {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery)
    );
};
