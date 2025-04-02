
import mysql from 'mysql2/promise';

// const db = createConnection({
//     host: "localhost", // MySQL host
//     port: 3306,          // MySQL port (if different from the default 3306)
//     user: "root",      // MySQL username
//     password: "",      // MySQL password
//     database: "qms",   // Database name
// });

const db = mysql.createPool({
    host: 'localhost',    // MySQL host
    port: 3306,          // MySQL port (if different from the default 3306)
    user: 'root',         // MySQL username
    password: '',    // MySQL password
    database: 'qms', // Your database name
    waitForConnections: true,
    connectionLimit: 10,  // Connection pool limit
    queueLimit: 0,
    charset: 'utf8mb4', // Supports emojis and extended characters
    connectTimeout: 10000, // 10 seconds timeout
    multipleStatements: true // Allow multiple SQL statements per query
});




// db.connect((err) => {
//     if (err) {
//         console.error("Database connection failed:", err);
//     } else {
//         console.log("Connected to the database.");
//     }
// });

// Test the connection
async function testDbConnection() {
    try {
        const connection = await db.getConnection(); // Get a connection from the pool
        console.log('Database connection successful.');
        connection.release(); // Release the connection back to the pool
    } catch (err) {
        console.error('Database connection failed:', err.message);
    }
}

// Call the test function
testDbConnection();

export default db; // Export the connection pool