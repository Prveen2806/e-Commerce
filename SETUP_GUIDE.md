# Quick Setup Guide for Admin Sim

## Prerequisites
- Node.js (v16 or higher) and npm installed

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase (Required for Authentication)

**Option A: Using Firebase Console (Recommended)**
1. Go to https://console.firebase.google.com/
2. Create a new project or select existing one
3. Enable Authentication → Sign-in method → Google
4. Go to Project Settings → General
5. Scroll down to "Your apps" and click Web icon
6. Copy the Firebase configuration
7. Paste it into `src/firebase.ts`, replacing the placeholder values

**Option B: Skip for Now (Will show Firebase errors)**
- You can skip this and test other features, but login won't work

### 3. Start the Backend (JSON Server)

**Terminal 1:**
```bash
npx json-server db.json --port 3008
```

Keep this terminal running. You should see:
```
Resources
http://localhost:3008/categories
http://localhost:3008/products
http://localhost:3008/users
http://localhost:3008/orders
```

### 4. Start the Frontend

**Terminal 2:**
```bash
npm run dev
```

The app will open at http://localhost:8080

## Testing the Application

### Without Login (Guest Mode)
✅ Browse products
✅ Search and filter products
✅ View product details
❌ Cannot add to wishlist
❌ Cannot checkout
❌ Cannot view dashboard

### With Login (After Firebase Setup)
✅ Google login
✅ Add to wishlist
✅ Add to cart
✅ Complete checkout
✅ View order history
✅ Access admin panel

## Quick Test Scenario

1. **Browse Products**
   - Visit homepage
   - Use search bar to find "Laptop"
   - Filter by "Electronics" category
   - Sort by price

2. **Add to Cart**
   - Click "Add to Cart" on any product
   - Notice the cart badge updates in navbar
   - Try adding a product with 0 stock (button should be disabled)

3. **Login** (if Firebase configured)
   - Click "Login" button
   - Sign in with Google
   - Notice "My Account" dropdown appears

4. **Wishlist**
   - Click heart icon on products to add to wishlist
   - Go to Dashboard → Wishlist tab
   - Remove items or add to cart

5. **Checkout**
   - Click Cart in navbar
   - Add a delivery address
   - Select address and confirm order

6. **Admin Panel**
   - Go to My Account → Admin Panel
   - View all orders
   - Change order status from "On Process" to "Shipped" or "Delivered"

7. **Order History**
   - Go to Dashboard → Order History
   - See your order with updated status

## Troubleshooting

### "Failed to load products"
- Ensure JSON Server is running on port 3008
- Check terminal 1 for any errors
- Visit http://localhost:3008/products to verify

### "Firebase Authentication Error"
- Verify Firebase config in `src/firebase.ts`
- Check Firebase Console: Authentication → Sign-in method → Google is enabled
- Add localhost to authorized domains if needed

### Cart/Wishlist not persisting
- Check browser's localStorage (should work automatically)
- Clear cache and reload if needed

### Admin panel not showing orders
- Ensure you've completed a checkout first
- Check that JSON Server is running
- Refresh the page (auto-refreshes every 5 seconds)

## Default Data

The `db.json` includes:
- 4 categories (Electronics, Clothing, Home & Garden, Books)
- 10 sample products
- Some products with 0 stock for testing

## Next Steps

After setup:
- Customize products in `db.json`
- Add your own Firebase project
- Explore the code structure in `src/`
- Build new features!

## Need Help?

Check the main `README.md` for:
- Complete API documentation
- Project structure details
- Advanced configuration options
