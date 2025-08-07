-- Run this script to set up your database
-- Make sure your MySQL server is running and you have the correct credentials

-- Option 1: Using MySQL command line
-- mysql -u your_username -p your_database_name < setup_database.sql

-- Option 2: Copy and paste the contents of setup_database.sql into your MySQL client

-- After running the setup, you can verify the data with:
SELECT 'Instruments count:' as info, COUNT(*) as count FROM instruments
UNION ALL
SELECT 'Goals count:', COUNT(*) FROM goals
UNION ALL
SELECT 'Trade logs count:', COUNT(*) FROM trade_log; 