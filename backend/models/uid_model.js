import db from '../config/db.js';

// Get all users
export const get_AuditUID = async () => {
    try {
        const [rows] = await db.query('SELECT Audit_UID FROM tbl_uid WHERE id=1');
        return rows;


    } catch (error) {
        console.error('Error get_AuditUID :', error);

        // Optionally throw the error to the controller
        return {
            success: false,
            message: error.message,
        };
    }

};

// update UID
export const update_AuditUID = async (Audit_UID) => {
    try {
        const [rows] = await db.query('UPDATE tbl_uid  SET Audit_UID=? WHERE id=1', [Audit_UID]);
        return rows;


    } catch (error) {
        console.error('Error update_AuditUID :', error);

        // Optionally throw the error to the controller
        return {
            success: false,
            message: error.message,
        };
    }

};