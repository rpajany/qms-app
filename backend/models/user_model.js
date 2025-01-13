import db from '../config/db.js';

// Get all users
export const getAllUsers = async () => {
    const [rows] = await db.query('SELECT * FROM tbl_users');
    return rows;
};

// Get a single user by ID
export const getUserById = async (id) => {
    const [rows] = await db.query('SELECT * FROM tbl_users WHERE id = ?', [id]);
    return rows[0]; // Return the first match or undefined if not found
};


// Create a new user
export const createUser = async (user) => {
    const { Username, Password, Role } = user;
    const [result] = await db.query(
        'INSERT INTO tbl_users (Username, Password, Role) VALUES (?, ?, ?)',
        [Username, Password, Role]
    );
    return result.insertId; // Return the new user's ID to controller
};

// Update a user by ID
export const updateUser = async (id, user) => {
    const { Username, Password, Role } = user;
    const [result] = await pool.query(
        'UPDATE tbl_users SET Username = ?, Password = ?, Role = ? WHERE id = ?',
        [Username, Password, Role, id]
    );
    return result.affectedRows; // Number of rows affected
};

// Delete a user by ID
export const deleteUser = async (id) => {
    const [result] = await db.query('DELETE FROM tbl_users WHERE id = ?', [id]);
    return result.affectedRows; // Number of rows deleted
};