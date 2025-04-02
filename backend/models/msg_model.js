import db from '../config/db.js';
import moment from 'moment';

// Get all users
export const get_AllMsg = async () => {
    try {
        // const [rows] = await db.query('SELECT * FROM tbl_msg');
        // const [rows] = await db.query('SELECT ad.Audit_Date, ad.Department, ad.Process, msg.id, msg.Message FROM tbl_audit_detail ad INNER JOIN tbl_msg msg ON ad.Audit_UID = msg.Audit_UID WHERE ad.Audit_UID = ?; ', [Audit_UID]);
        // const [rows] = await db.query('SELECT ad.Audit_UID, ad.AuditNo, ad.Audit_Date, ad.Department, ad.Process, msg.id, msg.Message FROM tbl_audit_detail ad INNER JOIN tbl_msg msg ON ad.Audit_UID = msg.Audit_UID');
        const [rows] = await db.query('SELECT ad.Audit_UID, ad.AuditNo, ad.Audit_Date, ad.Department, ad.Process, msg.id, msg.Message FROM tbl_audit_detail ad INNER JOIN tbl_msg msg ON ad.Audit_UID = msg.Audit_UID');
        const formattedData = rows.map((row) => ({
            ...row,
            Audit_Date: moment(row.Audit_Date, 'YYYY-MM-DD').format('DD-MM-YYYY')
        }));

        // Return data
        return {
            success: true,
            message: `Successfully get_AllMsg : ${rows}`,
            data: formattedData,
        };
    } catch (error) {
        console.error('Error get_AllMsg :', error);

        // Optionally throw the error to the controller
        return {
            success: false,
            message: error.message,
        };
    }

};


export const MsgCount = async () => {
    try {
        const [rows] = await db.query('SELECT COUNT(*) as Total  FROM tbl_msg WHERE IsViewed = ?', [0]);
        return {
            success: true,
            message: `Successfully Msg_Count : ${rows}`,
            data: rows,
        };
    } catch (error) {
        console.error('Error Msg_Count :', error);

        // Optionally throw the error to the controller
        return {
            success: false,
            message: error.message,
        };
    }
}

// Get a single masterData by Department
export const get_ByUID = async (Audit_UID) => {
    try {
        const [rows] = await db.query('SELECT * FROM tbl_msg WHERE Audit_UID = ?', [Audit_UID]);
        // return rows; // Return the first match or undefined if not found



        // return formattedData;

        // Return data
        return {
            success: true,
            message: `Successfully get_MsgByUID : ${rows}`,
            data: rows,
        };
    } catch (error) {

    }

};

// insert
export const insert_Msg = async (Audit_UID, Message) => {
    // console.log('masterData', masterData)
    try {


        // Execute the query with parameterized values
        const [result] = await db.query(
            `INSERT INTO tbl_msg (Audit_UID, Message, IsViewed) VALUES (?, ?, ?)`, [Audit_UID, Message, 0]
        );

        // Return data
        return {
            success: true,
            message: `Successfully insert_Msg: ${result}`,
            data: result,
        };

    } catch (error) {
        console.error('Error insert_Msg :', error);

        // Optionally throw the error to the controller
        return {
            success: false,
            message: error.message,
        };
    }
}

// update_Msg
export const updateMsg = async (msgData) => {
    try {
        // Destructure 
        const { id, Audit_UID, Message } = msgData;
        // Execute the query with parameterized values
        const [result] = await db.query(
            `UPDATE tbl_msg SET Message=?, IsViewed=?  WHERE ID=?`, [Message, 1, id]
        );

        // Return data
        return {
            success: true,
            message: `Successfully Update_Msg : ${result}`,
            data: result,
        };

    } catch (error) {
        console.error('Error Update_Msg :', error);

        // Optionally throw the error to the controller
        return {
            success: false,
            message: error.message,
        };
    }
}

// deleteMaster
export const deleteMsg = async (id) => {
    try {

        // Execute the query with parameterized values
        const [result] = await db.query(
            `DELETE FROM tbl_msg WHERE id = ?`, [id]
        );

        // Return data
        return {
            success: true,
            message: `Successfully Deleted_Msg : ${result}`,
            data: result,
        };

    } catch (error) {
        console.error('Error Deleted_Msg :', error);

        // Optionally throw the error to the controller
        return {
            success: false,
            message: error.message,
        };
    }
}