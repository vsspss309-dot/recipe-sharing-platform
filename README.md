# 🍳 RecipeHub - The Culinary Universe

RecipeHub is a full-stack Recipe Sharing Platform where professional chefs and passionate home cooks can discover, create, and share extraordinary recipes from around the globe.

## 🌟 Features

### 🧑‍🍳 User Features
- **User Authentication:** Secure JWT-based registration and login system with HTTP-only cookies.
- **Recipe Discovery:** Advanced search and filtering by category, cuisine, difficulty, and cooking time.
- **Interactive Feed:** A dynamic community feed showing the latest recipes from followed chefs.
- **Recipe Management:** Users can create, edit, and delete their own recipes.
- **Engagement:** Save favorites, rate recipes, and engage in comments/discussions.
- **Real-time Notifications:** Instant alerts via Socket.io when someone interacts with your recipes.
- **User Dashboard:** Dedicated space to manage saved recipes and profile settings.

### 🛡️ Admin Features
- **Comprehensive Dashboard:** Monitor total users, recipes, and engagement metrics.
- **Content Moderation:** Manage users, oversee published recipes, and handle reported comments/content.
- **Taxonomy Management:** Add or modify categories and cuisines.
- **Analytics:** Gain insights into the platform's top-performing recipes and user activity.

## 🛠️ Technology Stack

**Frontend:**
- React (bootstrapped with Vite)
- Modern Context API for state management
- Axios (with advanced interceptors for silent token refreshes)
- Framer Motion (for micro-animations and smooth transitions)
- React Router (for client-side routing)

**Backend:**
- Node.js & Express
- MongoDB & Mongoose (Data modeling)
- Socket.io (Real-time WebSockets)
- Redis (Response caching for high-performance querying)
- Cloudinary (Image hosting and processing)
- JWT (JSON Web Tokens for secure session management)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB connection string
- Redis (optional, for caching)
- Cloudinary Account (for image uploads)

### 1. Clone the repository
```bash
git clone https://github.com/vsspss309-dot/recipe-sharing-platform.git
cd recipe-sharing-platform
```

### 2. Backend Setup
```bash
cd Backend
npm install
```
Create a `.env` file in the `Backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
FRONTEND_URL=http://localhost:5173
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the frontend development server:
```bash
npm run dev
```

## 🌐 Deployment

This project is configured for easy deployment on modern cloud platforms.
- **Frontend**: Designed for Vercel, Netlify, or Render Static Sites. Requires setting the `VITE_API_URL` environment variable and a `vercel.json` for React Router fallbacks.
- **Backend**: Designed for Render Web Services. Requires setting the `FRONTEND_URL` environment variable to configure CORS securely.

## 📄 License
This project is for educational and portfolio purposes.
