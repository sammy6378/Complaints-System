
-- admin table
CREATE TABLE admins (
    admin_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- users table
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    status user_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- categories table
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- sub categories table
CREATE TABLE subcategories (
    subcategory_id SERIAL PRIMARY KEY,
    subcategory_name VARCHAR(255) NOT NULL,
    category_id INTEGER REFERENCES categories(category_id),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- add cascade on delete
ALTER TABLE subcategories
DROP CONSTRAINT subcategories_category_id_fkey;

ALTER TABLE subcategories
ADD CONSTRAINT subcategories_category_id_fkey
FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE;




-- states table
CREATE TABLE states (
    state_id SERIAL PRIMARY KEY,
    state_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- complaints table
CREATE TYPE complaint_priority AS ENUM ('Low', 'Medium', 'High', 'Critical');

CREATE TABLE complaints (
    complaint_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    category_id INTEGER REFERENCES categories(category_id),
    subcategory_id INTEGER REFERENCES subcategories(subcategory_id),
    state_id INTEGER REFERENCES states(state_id),
    complaint_title VARCHAR(255) NOT NULL,
    complaint_description TEXT NOT NULL,
    complaint_status VARCHAR(50) DEFAULT 'Pending',
    priority complaint_priority DEFAULT 'Medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drop existing constraints
ALTER TABLE complaints DROP CONSTRAINT complaints_user_id_fkey;
ALTER TABLE complaints DROP CONSTRAINT complaints_category_id_fkey;
ALTER TABLE complaints DROP CONSTRAINT complaints_subcategory_id_fkey;
ALTER TABLE complaints DROP CONSTRAINT complaints_state_id_fkey;

-- Add them back with ON DELETE CASCADE
ALTER TABLE complaints ADD CONSTRAINT complaints_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

ALTER TABLE complaints ADD CONSTRAINT complaints_category_id_fkey
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE;

ALTER TABLE complaints ADD CONSTRAINT complaints_subcategory_id_fkey
  FOREIGN KEY (subcategory_id) REFERENCES subcategories(subcategory_id) ON DELETE CASCADE;

ALTER TABLE complaints ADD CONSTRAINT complaints_state_id_fkey
  FOREIGN KEY (state_id) REFERENCES states(state_id) ON DELETE CASCADE;


-- user logs
CREATE TABLE user_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- admin logs
CREATE TABLE admin_logs (
    log_id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES admins(admin_id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




