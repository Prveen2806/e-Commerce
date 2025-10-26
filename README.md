# Admin Sim - E-Commerce Admin Simulation

A full-featured React e-commerce admin simulation with product management, user authentication, and order tracking.

## Features

✅ **Product Management**
- Dynamic product catalog with search, filter, and sort
- Real-time stock tracking
- Category-based organization

✅ **User Authentication**
- Firebase Google Login integration
- User dashboard with wishlist and order history
- Protected routes

✅ **Shopping Experience**
- Add to cart and wishlist
- Stock validation (disabled buttons for out-of-stock items)
- Multi-address checkout flow

✅ **Order Management**
- Order creation with "On Process" status
- Admin panel to update order status (Shipped/Delivered)
- Real-time order status updates

✅ **Tech Stack**
- React 18 + TypeScript
- Vite for fast development
- Ant Design for UI components
- Firebase Authentication
- JSON Server for fake REST API
- Context API for state management
- React Router for navigation

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Google Authentication in Firebase Console
3. Copy your Firebase config to `src/firebase.ts`

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Start JSON Server

In a separate terminal:

```bash
npx json-server db.json --port 3008
```

This will start the fake REST API on http://localhost:3008

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at http://localhost:8080

## Project Structure

```
src/
├── api/
│   ├── axios.ts          # Axios configuration
│   └── services.ts       # API service functions
├── components/
│   └── AppLayout.tsx     # Main layout with navigation
├── context/
│   ├── AuthContext.tsx   # Firebase auth state management
│   └── CartContext.tsx   # Shopping cart state management
├── pages/
│   ├── Home.tsx          # Product listing with search/filter
│   ├── Login.tsx         # Google authentication
│   ├── Dashboard.tsx     # User dashboard (wishlist, orders)
│   ├── Checkout.tsx      # Cart and checkout flow
│   └── Admin.tsx         # Admin panel for order management
├── firebase.ts           # Firebase configuration
├── App.tsx              # Main app with routing
└── main.tsx             # Entry point
```

## API Endpoints

The JSON Server provides these endpoints:

- `GET /categories` - List all categories
- `GET /products` - List all products
- `GET /products/:id` - Get single product
- `GET /orders` - List all orders
- `GET /orders?userId=:id` - Get user's orders
- `POST /orders` - Create new order
- `PATCH /orders/:id` - Update order status
- `GET /users/:id` - Get user data
- `POST /users` - Create user
- `PATCH /users/:id` - Update user data

## Key Features Implementation

### Product Search & Filter
- Real-time search by product name
- Filter by category
- Sort by name, price (ascending/descending)

### Stock Management
- Products with stock = 0 show "Out of Stock"
- Add to Cart and Add to Wishlist buttons disabled when stock = 0

### Authentication Flow
1. User clicks "Login" → Google OAuth popup
2. After successful login, user data is stored in JSON Server
3. Navbar shows "My Account" dropdown with Dashboard and Logout options

### Order Flow
1. User adds products to cart
2. Navigate to Checkout
3. Select or add delivery address
4. Confirm order (saved with status "On Process")
5. View order in Dashboard
6. Admin can update status to "Shipped" or "Delivered"

### Admin Panel
- View all orders from all users
- Update order status
- Real-time updates (polls every 5 seconds)

## Development Tips

- The `db.json` file contains sample data for testing
- Cart data is persisted in localStorage
- Orders are sorted by creation date (newest first)
- Admin panel auto-refreshes to show latest order statuses

## Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## Troubleshooting

**Firebase Authentication not working:**
- Verify Firebase configuration in `src/firebase.ts`
- Ensure Google Sign-In is enabled in Firebase Console
- Check that authorized domains include your localhost

**JSON Server connection issues:**
- Verify JSON Server is running on port 3008
- Check `src/api/axios.ts` for correct base URL
- Ensure `db.json` exists in project root

**Orders not showing:**
- Verify user is logged in
- Check browser console for API errors
- Ensure JSON Server is running

## License

MIT
