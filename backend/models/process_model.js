import db from '../config/db.js';

// Get All Process
export const getAllProcess = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM tbl_process');
        // return rows;
        // Return data
        return {
            success: true,
            message: `Successfully Get AllProcess : ${rows}`,
            data: rows,
        };
    } catch (error) {
        console.error('Error getAllProcess :', error);

        // Optionally throw the error to the controller
        return {
            success: false,
            message: error.message,
        };
    }
   
};