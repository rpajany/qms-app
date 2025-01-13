import db from '../config/db.js';
import moment from 'moment';

// Get all auditDetail
export const getAllAuditDetail = async () => {
    const [rows] = await db.query('SELECT * FROM tbl_audit_detail ORDER BY id DESC');
    
    const formattedData = rows.map((row) => ({
        ...row,
        Audit_Date: moment(row.Audit_Date, 'YYYY-MM-DD').format('DD-MM-YYYY')
    }));
    return formattedData; // rows
};

// Get a single auditDetail by id
export const getAuditDetailByID = async (id) => {
    const [rows] = await db.query('SELECT * FROM tbl_audit_detail WHERE id = ?', [id]);
    return rows; // rows[0] Return the first match or undefined if not found
};

// Insert a AuditDetail
export const insertAuditDetail = async (AuditDetails) => {
    try {
        // Destructure the audit details
        const { Doc_No, Rev_No, Rev_Date, Auditor, RefNo, Department, Auditee, Process, Audit_Date, Shift,Plant, Status } = AuditDetails;
        
        // Execute the query with parameterized values
        const [result] = await db.query(
            `INSERT INTO tbl_audit_detail
             (Doc_No, Rev_No, Rev_Date, Auditor, RefNo, Department, Auditee, Process, Audit_Date, Shift, Status)
             VALUES (?, ?, ?,?,?,?,?,?,?,?,?)`,
            [Doc_No, Rev_No, Rev_Date, Auditor, RefNo, Department, Auditee, Process, moment(Audit_Date, 'DD-MM-YYYY').format('YYYY-MM-DD'), Shift, Plant, Status]
        );
        
        // return result.insertId; // Return the new  ID to controller

        // Return the newly inserted ID
        return {
            success: true,
            insertId: result.insertId,
            message: 'Audit detail inserted successfully.',
        };
        
    } catch (error) {
        console.error('Error Insert Audit Data:', error);

        // Optionally throw the error to the controller
        return {
            success: false,
            message: error.message,
        };
    }

};


// Delete a AuditDetail
export const deleteAuditDetail = async (Doc_No) => {
    try {
        console.log('model ', Doc_No)
        const [result] = await db.query('DELETE FROM tbl_audit_detail WHERE Doc_No = ?', [Doc_No]);

        // Check if rows were affected
        if (result.affectedRows === 0) {
            throw new Error(`No record found in AuditDetail with Doc_No: ${Doc_No}`);
        }

        // Return confirmation or affected rows
        return {
            success: true,
            message: `Successfully deleted AuditDetail with Doc_No: ${Doc_No}`,
            affectedRows: result.affectedRows,
        };

    } catch (error) {
        console.error('Error Deleting Audit Data:', error);

        // Optionally throw the error to the controller
        return {
            success: false,
            message: error.message,
        };
    }


}