# Hand Embroidery by Sana

> A premium, beautifully designed e-commerce platform dedicated to handcrafted embroidery hoop art and professional mehndi services.

![Embroidery Platform](https://img.shields.io/badge/Status-Active-success) ![React](https://img.shields.io/badge/React-19.1-blue) ![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38B2AC) ![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E)

## 📖 Overview

**Hand Embroidery by Sana** is a sophisticated full-stack web application designed to offer an editorial-grade shopping experience. The platform features an integrated shop for physical goods alongside booking systems for highly customized local services (like Bridal Mehndi and Custom Embroidery Designs). 

It is powered by a modern **React (Vite)** frontend with state-of-the-art **Tailwind CSS v4** styling, incorporating trending UI aesthetics such as glassmorphism, dynamic micro-animations, and premium typography (*Playfair Display* & *Outfit*).

## ✨ Key Features

### User Experience
- **E-Commerce Shop**: Browse categorized products (Bridal, Wall Decor, etc.) with stock tracking and refined filtering.
- **Service Bookings**: Dedicated modules for "Mehndi Booking" and "Custom Embroidery Design" requests, fully managed from the admin panel.
- **Fluid UI Contexts**: Fully functional Cart, advanced Product Details, Wishlist, User Profiles, and Order Tracking.
- **AI Chatbot**: Built-in intelligent chatbot widget for instant customer support.
- **Responsive Navigation**: Seamless Bottom Navigation on mobile, rich desktop Navbar, and smooth transitions.

### Comprehensive Admin Dashboard (`/sadmin`)
- **Product Management**: Full CRUD capabilities to manage shop inventory.
- **Order & Booking Tracking**: Unified management for merchandise orders and service bookings.
- **Reviews & Notifications**: Manage customer feedback and platform alerts directly.
- **Gallery Manager**: Dynamic portfolio management to show past work.
- **Secure Access**: Role-based routing protected via Supabase Authentication.

## 🛠 Tech Stack

### Frontend Core
- **React (v19)** with **Vite** for incredibly fast HMR.
- **React Router (v7)** for optimized, lazy-loaded client routing.
- **Context API** for modular state management (Cart, Auth, Admin, etc.).

### Styling & UI
- **Tailwind CSS v4** with `postcss`.
- **Lucide React** for lightweight, scalable vector icons.
- **Recharts** for admin dashboard analytics.

### Backend & Infrastructure
- **Supabase**: Primary database (PostgreSQL), user authentication, and media storage.
- **Machine Learning API**: Connected ML service for AI Chatbot functionality.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18+ recommended)
- `npm` or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Awinashkr31/embroidery-ecommerce.git
   cd embroidery-ecommerce
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Supabase and specific API keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   # Add your other API / ML variables as needed
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the App:** Navigate to `http://localhost:5173` in your browser.

## 📁 Key Folder Structure

```text
src/
├── components/      # Reusable UI elements (Navbar, Footer, Admin layout)
├── context/         # Centralized state management providers
├── pages/           # Application views (Shop, Cart, Admin, etc.)
├── supabase/        # Database initialization & definitions
├── index.css        # Global CSS and Tailwind definitions
└── App.jsx          # Route declarations and layout wrappers
```

## 📜 Available Scripts

- `npm run dev`: Starts the local development server.
- `npm run build`: Bundles the app for production.
- `npm run lint`: Runs ESLint to check for code quality.
- `npm run preview`: Previews the production build locally.

---
*Crafted with precision for Hand Embroidery by Sana.*
