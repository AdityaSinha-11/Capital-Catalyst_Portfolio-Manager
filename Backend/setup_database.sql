-- Stock Broking App Database Setup
-- This script creates the database tables and inserts mock data

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS trade_log;
DROP TABLE IF EXISTS goals;
DROP TABLE IF EXISTS instruments;

-- Table 1: Instruments (Stocks, Mutual Funds, Gold)
CREATE TABLE instruments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    symbol VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    type ENUM('STOCK', 'MF', 'GOLD') NOT NULL,
    current_price DECIMAL(12,4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_type (type),
    INDEX idx_symbol (symbol)
);

-- Table 2: Goals
CREATE TABLE goals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    target_amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_name (name)
);

-- Table 3: Trade Log (Buy/Sell History)
CREATE TABLE trade_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    instrument_id INT NOT NULL,
    goal_id INT,
    transaction_type ENUM('BUY', 'SELL') NOT NULL,
    quantity DECIMAL(15,4) NOT NULL,
    price DECIMAL(12,4) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (instrument_id) REFERENCES instruments(id),
    FOREIGN KEY (goal_id) REFERENCES goals(id),
    
    INDEX idx_instrument (instrument_id),
    INDEX idx_goal (goal_id),
    INDEX idx_type (transaction_type),
    INDEX idx_date (created_at)
);

-- Insert Sample Instruments Data
INSERT INTO instruments (symbol, name, type, current_price) VALUES
('RELIANCE', 'Reliance Industries Ltd', 'STOCK', 2450.50),
('TCS', 'Tata Consultancy Services', 'STOCK', 3250.75),
('INFY', 'Infosys Ltd', 'STOCK', 1450.25),
('HDFC_BANK', 'HDFC Bank Ltd', 'STOCK', 1650.80),
('ICICI_BANK', 'ICICI Bank Ltd', 'STOCK', 950.45),
('HDFC_TOP100', 'HDFC Top 100 Fund', 'MF', 650.45),
('SBI_SMALL_CAP', 'SBI Small Cap Fund', 'MF', 125.30),
('AXIS_BLUECHIP', 'Axis Bluechip Fund', 'MF', 45.75),
('MIRAE_EMERGING', 'Mirae Asset Emerging Bluechip Fund', 'MF', 35.20),
('GOLD_24K', '24K Gold per gram', 'GOLD', 6250.00),
('SILVER', 'Silver per gram', 'GOLD', 78.50),
('PLATINUM', 'Platinum per gram', 'GOLD', 3200.00);

-- Insert Sample Goals Data
INSERT INTO goals (name, target_amount) VALUES
('Retirement Fund', 5000000.00),
('House Purchase', 2000000.00),
('Emergency Fund', 500000.00),
('Child Education', 1500000.00),
('Vacation Fund', 300000.00),
('Car Purchase', 800000.00);

-- Insert Sample Trade Log Data
INSERT INTO trade_log (instrument_id, goal_id, transaction_type, quantity, price, total_amount) VALUES
(1, 1, 'BUY', 10, 2400.00, 24000.00),
(3, 1, 'BUY', 50, 650.00, 32500.00),
(5, 2, 'BUY', 5, 6200.00, 31000.00),
(1, 1, 'SELL', 5, 2450.00, 12250.00),
(2, 3, 'BUY', 15, 3200.00, 48000.00),
(4, 4, 'BUY', 20, 1600.00, 32000.00),
(6, 1, 'BUY', 100, 650.00, 65000.00),
(7, 2, 'BUY', 500, 125.00, 62500.00),
(10, 5, 'BUY', 10, 6200.00, 62000.00),
(11, 6, 'BUY', 100, 78.00, 7800.00),
(2, 3, 'SELL', 5, 3250.00, 16250.00),
(8, 1, 'BUY', 200, 45.00, 9000.00),
(9, 4, 'BUY', 300, 35.00, 10500.00),
(12, 5, 'BUY', 5, 3200.00, 16000.00),
(3, 1, 'SELL', 20, 1450.00, 29000.00);

-- Display the created data
SELECT 'Instruments Table:' as table_name;
SELECT * FROM instruments;

SELECT 'Goals Table:' as table_name;
SELECT * FROM goals;

SELECT 'Trade Log Table:' as table_name;
SELECT 
    tl.id,
    tl.instrument_id,
    i.symbol as instrument_symbol,
    i.name as instrument_name,
    tl.goal_id,
    g.name as goal_name,
    tl.transaction_type,
    tl.quantity,
    tl.price,
    tl.total_amount,
    tl.created_at
FROM trade_log tl
LEFT JOIN instruments i ON tl.instrument_id = i.id
LEFT JOIN goals g ON tl.goal_id = g.id
ORDER BY tl.created_at DESC; 