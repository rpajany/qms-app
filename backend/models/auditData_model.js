import db from '../config/db.js';


// insert auditData
export const insertAuditData = async (AuditData) => {
    try {
        // let id = "";
        // for (const item of AuditData) {
        //     const { Doc_No, Clause, Check_Points, Guide_Lines, Observation, Status } = item;
        //     const [result] = await db.query(
        //         'INSERT INTO tbl_audit_data (Doc_No, Clause, Check_Points, Guide_Lines, Observation, Status) VALUES (?, ?, ?, ?, ?, ?)',
        //         [Doc_No, Clause, Check_Points, Guide_Lines, Observation, Status]
        //     );

        //     console.log('item', item)
        //     id = result.insertId
        // }
        // console.log('AuditData :', AuditData)

        const { Audit_UID, Clause, Check_Points, Guide_Lines, Observation, Status, Images } = AuditData;

        // Determine if Images is an array and single image prepare the value to insert
        // const imageValue = Array.isArray(Images) ? Images[0] : Images || null;

        // const imageValue = Array.isArray(Images) ? Images[0] : Images || null;
        // const imageValue_2 = Array.isArray(Images) ? Images[1] : null
        // const imageValue_3 = Array.isArray(Images) ? Images[2] : null;

        let imageValue = "";
        let imageValue_2 = "";
        let imageValue_3 = "";

        if (Array.isArray(Images)) {
            imageValue = Images[0] || "";
            imageValue_2 = Images[1] || "";
            imageValue_3 = Images[2] || "";
        }

        const [result] = await db.query(
            'INSERT INTO tbl_audit_data (Audit_UID,  Clause, Check_Points, Guide_Lines, Observation, Status, Images, Images_2, Images_3) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [Audit_UID, Clause, Check_Points, Guide_Lines, Observation, Status, imageValue, imageValue_2, imageValue_3]
        );

        // console.log('Image', Images)
        const id = result.insertId

        return id // Return the new  ID to controller

    } catch (error) {
        console.error("Error inserting data:", error);
    }
};

// getByDocNo
export const get_AuditData_ByUID = async (Audit_UID) => {
    // console.log('Audit_UID :', Audit_UID)
    try {
        const [result] = await db.query('SELECT * FROM tbl_audit_data WHERE Audit_UID = ?', [Audit_UID]);

        // Return data
        return {
            success: true,
            message: `Successfully get_AuditData_ByUID : ${Audit_UID}`,
            data: result,
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


// update
export const updateAuditData = async (AuditData) => {
    try {

        // console.log('AuditData :', AuditData)

        const { Audit_UID, Clause, Check_Points, Guide_Lines, Observation, Status, Images, Images_2, Images_3 } = AuditData;

        // Determine if Images is an array and single image prepare the value to insert
        // const imageValue = Array.isArray(Images) ? Images[0] : Images || null;

        // const imageValue = Array.isArray(Images) ? Images[0] : Images || null;
        // const imageValue_2 = Array.isArray(Images) ? Images[1] : null
        // const imageValue_3 = Array.isArray(Images) ? Images[2] : null;

        let imageValue = "";
        let imageValue_2 = "";
        let imageValue_3 = "";

        if (Array.isArray(Images)) {
            imageValue = Images[0] || "";
            imageValue_2 = Images[1] || "";
            imageValue_3 = Images[2] || "";
        } else {
            imageValue = Images || "";
            imageValue_2 = Images_2 || "";
            imageValue_3 = Images_3 || "";
        }

        const [result] = await db.query(
            'INSERT INTO tbl_audit_data (Audit_UID,  Clause, Check_Points, Guide_Lines, Observation, Status, Images, Images_2, Images_3) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [Audit_UID, Clause, Check_Points, Guide_Lines, Observation, Status, imageValue, imageValue_2, imageValue_3]
        );

        // console.log('Image', Images)
        const id = result.insertId

        return id // Return the new  ID to controller

    } catch (error) {
        console.error("Error update AuditData:", error);
    }
};

// delete auditData
export const deleteAuditData = async (Audit_UID) => {
    try {
        const [result] = await db.query('DELETE FROM tbl_audit_data WHERE Audit_UID = ?', [Audit_UID]);

        // Check if rows were affected
        if (result.affectedRows === 0) {
            throw new Error(`No record found in auditData with Audit_UID: ${Audit_UID}`);
        }

        // Return confirmation or affected rows
        return {
            success: true,
            message: `Successfully deleted auditData with Audit_UID: ${Audit_UID}`,
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