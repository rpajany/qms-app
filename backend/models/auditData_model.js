import db from '../config/db.js';


// insert auditData
export const insertAuditData = async (AuditData) => {
    try {
        let id = "";
        // for (const item of AuditData) {
        //     const { Doc_No, Clause, Check_Points, Guide_Lines, Observation, Status } = item;
        //     const [result] = await db.query(
        //         'INSERT INTO tbl_audit_data (Doc_No, Clause, Check_Points, Guide_Lines, Observation, Status) VALUES (?, ?, ?, ?, ?, ?)',
        //         [Doc_No, Clause, Check_Points, Guide_Lines, Observation, Status]
        //     );

        //     console.log('item', item)
        //     id = result.insertId
        // }


        const { Doc_No, Clause, Check_Points, Guide_Lines, Observation, Status, Images } = AuditData;
        const [result] = await db.query(
            'INSERT INTO tbl_audit_data (Doc_No, Clause, Check_Points, Guide_Lines, Observation, Status,Images) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [Doc_No, Clause, Check_Points, Guide_Lines, Observation, Status, Images[0]]
        );

        // console.log('Image', Images)
        id = result.insertId

        return id // Return the new  ID to controller

    } catch (error) {
        console.error("Error inserting data:", error);
    }
};


// delete auditData
export const deleteAuditData = async (Doc_No) => {
    try {
        const [result] = await db.query('DELETE FROM tbl_audit_data WHERE Doc_No = ?', [Doc_No]);

        // Check if rows were affected
        if (result.affectedRows === 0) {
            throw new Error(`No record found in auditData with Doc_No: ${Doc_No}`);
        }

        // Return confirmation or affected rows
        return {
            success: true,
            message: `Successfully deleted auditData with Doc_No: ${Doc_No}`,
            affectedRows: result.affectedRows,
        };
    } catch (error) {
        console.error("Error Deleting AuditData :", error);
        // Optionally throw the error to the controller
        return {
            success: false,
            message: error.message,
        };
    }
}