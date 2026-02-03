-- Run this as a user with sufficient privileges (eg. root)
CREATE DATABASE IF NOT EXISTS auth_db;

-- Create user and grant privileges (adjust host if needed)
CREATE USER IF NOT EXISTS 'challenge_user'@'localhost' IDENTIFIED BY 'P455w0rdChallenge!';
GRANT ALL PRIVILEGES ON auth_db.* TO 'challenge_user'@'localhost';
FLUSH PRIVILEGES;

USE auth_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  username VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
