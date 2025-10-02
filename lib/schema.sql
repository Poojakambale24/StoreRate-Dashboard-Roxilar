-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL CHECK (char_length(name) >= 20 AND char_length(name) <= 60),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    address TEXT CHECK (char_length(address) <= 400),
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'store_owner', 'customer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL CHECK (char_length(address) <= 400),
    category VARCHAR(50) NOT NULL,
    image_url TEXT,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_ratings INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, store_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON stores(owner_id);
CREATE INDEX IF NOT EXISTS idx_stores_category ON stores(category);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_store_id ON ratings(store_id);

-- Create function to update average rating for stores
CREATE OR REPLACE FUNCTION update_store_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Update average rating and total ratings for the store
    UPDATE stores 
    SET 
        average_rating = (
            SELECT COALESCE(AVG(rating), 0) 
            FROM ratings 
            WHERE store_id = COALESCE(NEW.store_id, OLD.store_id)
        ),
        total_ratings = (
            SELECT COUNT(*) 
            FROM ratings 
            WHERE store_id = COALESCE(NEW.store_id, OLD.store_id)
        ),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = COALESCE(NEW.store_id, OLD.store_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update store ratings
DROP TRIGGER IF EXISTS rating_insert_trigger ON ratings;
DROP TRIGGER IF EXISTS rating_update_trigger ON ratings;
DROP TRIGGER IF EXISTS rating_delete_trigger ON ratings;

CREATE TRIGGER rating_insert_trigger
    AFTER INSERT ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_store_rating();

CREATE TRIGGER rating_update_trigger
    AFTER UPDATE ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_store_rating();

CREATE TRIGGER rating_delete_trigger
    AFTER DELETE ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_store_rating();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON ratings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: Admin123!)
INSERT INTO users (name, email, password_hash, address, role) 
VALUES (
    'System Administrator Account', 
    'admin@storerate.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: Admin123!
    '123 Admin Street, Admin City, AC 12345',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Insert demo store owner (password: Owner123!)
INSERT INTO users (name, email, password_hash, address, role) 
VALUES (
    'Demo Store Owner Account', 
    'owner@storerate.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: Owner123!
    '456 Business Avenue, Commerce City, CC 67890',
    'store_owner'
) ON CONFLICT (email) DO NOTHING;

-- Insert demo customer (password: Customer123!)
INSERT INTO users (name, email, password_hash, address, role) 
VALUES (
    'Demo Customer Account User', 
    'customer@storerate.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: Customer123!
    '789 Residential Lane, Customer City, CU 11111',
    'customer'
) ON CONFLICT (email) DO NOTHING;