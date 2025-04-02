import db from '../config/db.js';
import moment from 'moment';

// Get all auditDetail
export const getAllAuditDetail = async (StartDate, EndDate) => {
    try {

        // console.log('StartDate :', StartDate);

        // Ensure dates are properly formatted
        const startDateFormatted = moment(StartDate, 'DD-MM-YYYY').startOf('day').format('YYYY-MM-DD HH:mm:ss');
        const endDateFormatted = moment(EndDate, 'DD-MM-YYYY').endOf('day').format('YYYY-MM-DD HH:mm:ss');

        const [rows] = await db.query('SELECT * FROM tbl_audit_detail WHERE Audit_Date BETWEEN ? AND ? ORDER BY id DESC', [startDateFormatted, endDateFormatted]);

        const formattedData = rows.map((row) => ({
            ...row,
            Audit_Date: moment(row.Audit_Date).format('DD-MM-YYYY'),
        }));

        return formattedData; // rows

        // Return data
        // return {
        //     success: true,
        //     message: `Successfully Get_AllAuditDetail : ${formattedData}`,
        //     data: formattedData,
        // };

    } catch (error) {
        console.error('Error getAllAuditDetail :', error);

        // Optionally throw the error to the controller
        return {
            success: false,
            message: error.message,
        };
    }

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
        const { Audit_UID, AuditNo, Year, Doc_No, Rev_No, Rev_Date, Auditor, RefNo, Department, Auditee, Process, Audit_Date, Shift, Plant, Status } = AuditDetails;

        const formatedDate = moment(Audit_Date, 'DD-MM-YYYY').format('YYYY-MM-DD');

        // Execute the query with parameterized values
        // const [result] = await db.query(
        //     `INSERT INTO tbl_audit_detail
        //      (Audit_UID, AuditNo, Year, Doc_No, Rev_No, Rev_Date, Auditor, RefNo, Department, Auditee, Process, Audit_Date, Shift,Plant, Status)
        //      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        //     [Audit_UID, AuditNo, Year, Doc_No, Rev_No, Rev_Date, Auditor, RefNo, Department, Auditee, Process, formatedDate, Shift, Plant, Status]
        // );

        // RefNo - removed ....
        const [result] = await db.query(
            `INSERT INTO tbl_audit_detail
             (Audit_UID, AuditNo, Year, Doc_No, Rev_No, Rev_Date, Auditor,  Department, Auditee, Process, Audit_Date, Shift,Plant, Status)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [Audit_UID, AuditNo, Year, Doc_No, Rev_No, Rev_Date, Auditor, Department, Auditee, Process, formatedDate, Shift, Plant, Status]
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


// getByUID
export const get_ByUID = async (Audit_UID) => {
    try {
        const [rows] = await db.query('SELECT * FROM tbl_audit_detail WHERE Audit_UID = ?', [Audit_UID]);

        const formattedData = rows.map((row) => ({
            ...row,
            Audit_Date: moment(row.Audit_Date, 'YYYY-MM-DD').format('DD-MM-YYYY')
        }));

        // Return data
        return {
            success: true,
            message: `Successfully Get_AuditDetail_ByUID : ${Audit_UID}`,
            data: formattedData,
        };

    } catch (error) {
        console.error("Error Get_AuditDetail_ByUID :", error);
        // Optionally throw the error to the controller
        return {
            success: false,
            message: error.message,
        };
    }
}


// Delete a AuditDetail
export const deleteAuditDetail = async (Audit_UID) => {
    try {
        // console.log('model ', Doc_No)
        const [result] = await db.query('DELETE FROM tbl_audit_detail WHERE Audit_UID = ?', [Audit_UID]);

        // Check if rows were affected
        if (result.affectedRows === 0) {
            throw new Error(`No record found in AuditDetail with Audit_UID: ${Audit_UID}`);
        }

        // Return confirmation or affected rows
        return {
            success: true,
            message: `Successfully deleted AuditDetail with Audit_UID: ${Audit_UID}`,
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


// Update Status AuditDetail
export const update_AuditStatus = async (statusData) => {
    try {
        const { id, Audit_UID, Status, ReviewedBy } = statusData;
        const [rows] = await db.query('UPDATE  tbl_audit_detail SET Status=?, ReviewedBy=? WHERE id=?', [Status, ReviewedBy, id]);

        // Return data
        return {
            success: true,
            message: `Successfully Update_Audit_Status : ${rows}`,
            data: rows,
        };
    } catch (error) {
        console.error('Error Update_Audit_Status :', error);

        // Optionally throw the error to the controller
        return {
            success: false,
            message: error.message,
        };
    }
}


// Get Dashboard Data :
export const get_DashboardData = async (dateRangeNow) => {
    try {
        // Extract and format dates
        const { startDate, endDate } = dateRangeNow;
        let start_date = moment(startDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
        let end_date = moment(endDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
        // console.log('start_date :', start_date)
        // console.log('end_date :', end_date)

        // Fetch the total count
        const [totalResult] = await db.query(
            'SELECT COUNT(*) as Total FROM tbl_audit_detail WHERE Audit_Date >= ? AND Audit_Date <= ?',
            [start_date, end_date]
        );
        const total = totalResult && totalResult.length > 0 ? totalResult[0].Total : 0;
        // console.log('totalResult :', totalResult);
        // console.log('total :', total);

        // Status array
        const statusArray = ['OPEN', 'PENDING', 'APPROVED', 'REJECTED'];
        const statusCounts = {};

        // Loop through statusArray to get counts
        for (const status of statusArray) {
            const [statusResult] = await db.query(
                'SELECT COUNT(*) as Count FROM tbl_audit_detail WHERE Status = ? AND Audit_Date >= ? AND Audit_Date <= ?',
                [status, start_date, end_date]
            );
            statusCounts[status] = statusResult && statusResult.length > 0 ? statusResult[0].Count : 0;
        }

        // Format data
        const formattedData = {
            Total: total,
            Open: statusCounts['OPEN'] || 0,
            Pending: statusCounts['PENDING'] || 0,
            Approved: statusCounts['APPROVED'] || 0,
            Rejected: statusCounts['REJECTED'] || 0,
        };

        // Return data
        return {
            success: true,
            message: 'Successfully fetched dashboard data',
            data: formattedData,
        };

    } catch (error) {
        console.log('Error get_DashboardData :', error)
    }
}