------------------- USERS ----------------------
--# Create User Table
CREATE TABLE USERS (                                                     
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL,
    deleted_at TIMESTAMP NULL
);

--# Insert new user
INSERT INTO users (email, username, password) VALUES (
    email,
    username,
    password
);

--# Find User by ID
SELECT * FROM users WHERE id = payload.id;

--# Find User by email
SELECT * FROM users WHERE email = payload.email;

--# Find all Users
SELECT * FROM users;

--# Delete a user
DELETE FROM users WHERE id = payload.id;

--# Update user email
UPDATE users SET email = payload.email WHERE id = payload.id;

--# Update user password
UPDATE users SET password = payload.password WHERE id = payload.id;