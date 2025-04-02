import db from '../config/db.js';

// Get all auditDetail
export const getAllDepartments = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM tbl_department ORDER BY id DESC');

        // Return data
        return {
            success: true,
            message: `Successfully Get_AllDepartments: ${rows}`,
            data: rows,
        };

    } catch (error) {
        console.error('Error Get_AllDepartments :', error);

        // Optionally throw the error to the controller
        return {
            success: false,
            message: error.message,
        };
    }
}

// Insert 
export const insertDepartment = async (DepartmentData) => {
    try {

        const { Department } = DepartmentData;

        // Execute the query with parameterized values
        const [result] = await db.query(
            `INSERT INTO tbl_department
             (Department)
             VALUES (?)`,
            [Department]
        );

        // return result.insertId; // Return the new  ID to controller

        // Return the newly inserted ID
        return {
            success: true,
            insertId: result.insertId,
            message: 'Department Inserted successfully.',
        };

    } catch (error) {
        console.error('Error Insert Department :', error);

        // Optionally throw the error to the controller
        return {
            success: false,
            message: error.message,
        };
    }
}

// Update Department
export const update_Department = async (DepartmentData) => {
    try {
        const { id, Department } = DepartmentData;
        const [rows] = await db.query('UPDATE  tbl_department SET Department=? WHERE id=?', [Department, id]);

        // Return data
        return {
            success: true,
            message: `Successfully Update_Department : ${rows}`,
            data: rows,
        };

    } catch (error) {
        console.error('Error Update Department :', error);

        // Optionally throw the error to the controller
        return {
            success: false,
            message: error.message,
        };
    }
}

// Delete_Department
export const delete_Department = async (id) => {
    try {
        // console.log('model ', Doc_No)
        const [result] = await db.query('DELETE FROM tbl_department WHERE id = ?', [id]);

        // Check if rows were affected
        if (result.affectedRows === 0) {
            throw new Error(`No record found in AuditDetail with Doc_No: ${id}`);
        }

        // Return confirmation or affected rows
        return {
            success: true,
            message: `Successfully deleted Department with id : ${id}`,
            affectedRows: result.affectedRows,
        };

    } catch (error) {
        console.error('Error Deleting Department :', error);

        // Optionally throw the error to the controller
        return {
            success: false,
            message: error.message,
        };
    }


}