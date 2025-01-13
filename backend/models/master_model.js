import db from '../config/db.js';

// Get all users
export const getAllMaster = async () => {
    const [rows] = await db.query('SELECT * FROM tbl_master');
    return rows;
};

// Get a single masterData by Department
export const getMasterByDept = async (Dept) => {
    const [rows] = await db.query('SELECT * FROM tbl_master WHERE Department = ?', [Dept]);
    return rows; // Return the first match or undefined if not found
};