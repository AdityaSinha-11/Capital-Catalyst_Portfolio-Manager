const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'tableplus_user',
  password: 'password123', // replace with your actual password
  database: 'tableplus_db',
  port: 3306
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL database!');
    connection.release();
  }
});

// Export the pool for use in other files (optional)
module.exports = pool.promise();