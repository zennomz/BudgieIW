CREATE DATABASE IF NOT EXISTS budgieiw;
USE budgieiw;

CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    numero_phone VARCHAR(20),
    email VARCHAR(60) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    token VARCHAR(64),
    verification_token VARCHAR(64),
    is_active BOOLEAN DEFAULT FALSE,
    date_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE account (
    id_account INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    balance DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    date_created DATE NOT NULL DEFAULT CURRENT_DATE,
    rate_remuneration DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    rate_imposition DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    id_user INT NOT NULL,
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
);

CREATE TABLE prevision (
    id_prevision INT AUTO_INCREMENT PRIMARY KEY,
    date_prevision DATE NOT NULL,
    total_income DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    total_expense DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    total_interest DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    total_final DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    id_account INT NOT NULL,
    FOREIGN KEY (id_account) REFERENCES account(id_account) ON DELETE CASCADE
);

CREATE TABLE income (
    id_income INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    recurring BOOLEAN NOT NULL DEFAULT 0,
    value_recurring ENUM('MONTHLY','WEEKLY','YEARLY') NULL,
    amount DECIMAL(14, 2) NOT NULL,
    date_start DATE NOT NULL,
    date_end DATE,
    id_account INT NOT NULL,
    FOREIGN KEY (id_account) REFERENCES account(id_account) ON DELETE CASCADE
);

CREATE TABLE expense (
    id_expense INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    recurring BOOLEAN NOT NULL DEFAULT 0,
    value_recurring ENUM('MONTHLY','WEEKLY','YEARLY') NULL,
    amount DECIMAL(14, 2) NOT NULL,
    date_start DATE NOT NULL,
    date_end DATE,
    id_account INT NOT NULL,
    FOREIGN KEY (id_account) REFERENCES account(id_account) ON DELETE CASCADE
);