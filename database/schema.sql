-- Hand Embroidery & Mehndi Artist Database Schema
-- FULL REBUILD SCRIPT (Run this to set up the entire database)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE request_status AS ENUM ('new', 'in_progress', 'completed', 'cancelled');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- Products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  specifications TEXT, -- Added specifications
  category VARCHAR(100) NOT NULL,
  images TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  clothing_information JSONB, -- Stores size, fit, fabric, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status order_status DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending',
  coupon_code VARCHAR(50),
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom Design Requests table
CREATE TABLE custom_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  occasion VARCHAR(100),
  budget VARCHAR(50),
  timeline VARCHAR(50),
  color_preferences TEXT,
  style_preferences TEXT,
  description TEXT NOT NULL,
  reference_images TEXT[] DEFAULT '{}',
  status request_status DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mehndi Bookings table
CREATE TABLE mehndi_bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  service_type VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration VARCHAR(50),
  location VARCHAR(255),
  guest_count INTEGER,
  special_requests TEXT,
  status booking_status DEFAULT 'pending',
  total_cost DECIMAL(10,2),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Messages table
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  replied BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery Images table
CREATE TABLE gallery (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter Subscriptions table
CREATE TABLE newsletter_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Users table (Secured)
CREATE TABLE admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Website Settings table (Secured)
CREATE TABLE website_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);



-- Cart Items Table
CREATE TABLE cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Wishlist Items Table
CREATE TABLE wishlist_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Addresses Table
CREATE TABLE addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL, -- Firebase UID is a string
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
-- 1. PRODUCTS (Shop & Filtering)
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_products_created_at_desc ON products(created_at DESC);
CREATE INDEX idx_products_shop_composite ON products(active, category, price);

-- 2. ORDERS & TRANSACTIONS
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_customer_phone ON orders(customer_phone);

-- 3. REQUESTS & BOOKINGS
CREATE INDEX idx_custom_requests_status ON custom_requests(status);
CREATE INDEX idx_custom_requests_email ON custom_requests(email);
CREATE INDEX idx_mehndi_bookings_date ON mehndi_bookings(date);
CREATE INDEX idx_mehndi_bookings_status ON mehndi_bookings(status);
CREATE INDEX idx_mehndi_bookings_email ON mehndi_bookings(email);

-- 4. OTHER
CREATE INDEX idx_messages_read ON messages(read);
CREATE INDEX idx_gallery_category ON gallery(category);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_status ON reviews(status);

-- 5. RELATIONSHIPS (Foreign Keys)
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX idx_wishlist_items_product_id ON wishlist_items(product_id);
CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Security Fix: Set search_path for the function
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_custom_requests_updated_at BEFORE UPDATE ON custom_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mehndi_bookings_updated_at BEFORE UPDATE ON mehndi_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_website_settings_updated_at BEFORE UPDATE ON website_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data sections removed as per user request


-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE mehndi_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY; -- Security Fix
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY; -- Security Fix
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to products and gallery
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (active = true);
CREATE POLICY "Public can view gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public can view approved reviews" ON reviews FOR SELECT USING (status = 'approved');

-- Create policies for authenticated operations
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create custom requests" ON custom_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create bookings" ON mehndi_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view all orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Anyone can view all products" ON products FOR SELECT USING (true);

-- Admin Management Policies (Mock Admin - ideally should be stricter)
CREATE POLICY "Anyone can create products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update products" ON products FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete products" ON products FOR DELETE USING (true);
CREATE POLICY "Anyone can update orders" ON orders FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete orders" ON orders FOR DELETE USING (true);
CREATE POLICY "Anyone can create reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can update reviews" ON reviews FOR UPDATE USING (true);
CREATE POLICY "Admin can delete reviews" ON reviews FOR DELETE USING (true);

-- Address Policies (Simplified for Firebase Auth)
CREATE POLICY "Allow app access to addresses" ON addresses USING (true) WITH CHECK (true);

-- Cart/Wishlist Policies
CREATE POLICY "Allow app access to cart" ON cart_items USING (true) WITH CHECK (true);
CREATE POLICY "Allow app access to wishlist" ON wishlist_items USING (true) WITH CHECK (true);