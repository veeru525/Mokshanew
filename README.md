# Moksha Shop - E-Commerce Web Application

A modern, feature-rich e-commerce web application built with React, Firebase, and Vite. Inspired by Meesho, this application provides a seamless shopping experience with user authentication, product browsing, shopping cart functionality, and more.

## Features

### 🔐 Authentication
- **Email/Password Signup & Login** - Create an account with email and password
- **Google Sign-In** - Quick authentication using Google account
- **Forgot Password** - Password reset functionality (requires Firebase email configuration)
- **Secure Logout** - Safe session termination
- **User Data Persistence** - User information stored in Firestore

### 🛍️ Shopping Experience
- **Home Page** - Hero section, featured products, categories, and promotional content
- **Products Page** - Browse all products with category filtering and search
- **Shopping Cart** - Add, remove, and manage cart items with quantity controls
- **About Page** - Company information, values, and contact details

### 🎨 Premium Design
- **Modern UI** - Glassmorphism effects and gradient backgrounds
- **Responsive Design** - Mobile-first approach, works on all devices
- **Premium Color Palette** - Purple-pink gradients with sophisticated neutrals
- **Smooth Animations** - Micro-interactions and hover effects
- **Google Fonts** - Inter for body text, Outfit for headings

### 💾 Data Management
- **Firebase Firestore** - User data and cart persistence
- **Local Storage Fallback** - Cart data for non-authenticated users
- **Real-time Sync** - Cart syncs across devices when logged in

## Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Backend**: Firebase (Authentication + Firestore)
- **Icons**: React Icons
- **Styling**: Vanilla CSS with CSS Variables

## Getting Started

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation & Running (Demo Mode)

The application uses **JSON Server** as a mock database.

1. **Clone or navigate to the project directory**
   ```bash
   cd Moksha
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the Database Server** (Terminal 1)
   ```bash
   npm run sql-server
   ```
   This runs the SQLite backend at `http://localhost:3001`.
   
   *Note: This creates a real SQLite database file named `server/database.sqlite`.*

4. **Start the Application** (Terminal 2)
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:5173`.

   **Demo Credentials:**
   - Signup with any email to create a new user in the database.
   - Login with created credentials.
   - Data is saved to `db.json` file.

---

### Production Setup (Optional)

To use real Firebase services instead of the demo mock services:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Follow the setup steps in `.env.example`
3. Update `src/context/AuthContext.jsx` and `src/context/CartContext.jsx` to rely on Firebase imports.

## Project Structure

```
Moksha/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx       # Navigation bar with cart and user menu
│   │   ├── Footer.jsx       # Footer with links and social media
│   │   ├── ProductCard.jsx  # Product display card
│   │   └── ProtectedRoute.jsx # Route protection wrapper
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Homepage
│   │   ├── Products.jsx     # Products listing page
│   │   ├── Cart.jsx         # Shopping cart page
│   │   ├── About.jsx        # About us page
│   │   ├── Login.jsx        # Login page
│   │   ├── Signup.jsx       # Signup page
│   │   └── ForgotPassword.jsx # Password reset page
│   ├── context/             # React Context providers
│   │   ├── AuthContext.jsx  # Authentication state management
│   │   └── CartContext.jsx  # Shopping cart state management
│   ├── data/                # Mock data
│   │   └── productsData.js  # Product catalog
│   ├── firebase.config.js   # Firebase initialization
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles and design system
├── .env.example             # Environment variables template
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
└── vite.config.js           # Vite configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Deployment Options

1. **Vercel** (Recommended)
   - Connect your GitHub repository
   - Vercel will auto-detect Vite
   - Add environment variables in Vercel dashboard
   - Deploy!

2. **Netlify**
   - Drag and drop the `dist` folder
   - Or connect via Git
   - Configure environment variables
   - Deploy!

3. **Firebase Hosting**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   npm run build
   firebase deploy
   ```

### Important Notes for Deployment

- Make sure to add all Firebase environment variables to your hosting platform
- Update Firebase security rules for production
- Configure authorized domains in Firebase Authentication settings
- For Google Sign-In, add your production domain to authorized domains

## Features Roadmap

- [ ] Payment gateway integration
- [ ] Order history and tracking
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced search with filters
- [ ] Seller dashboard
- [ ] Admin panel

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For support, email support@mokshashop.com or create an issue in the repository.

---

**Made with ❤️ in India**
