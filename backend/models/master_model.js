import db from '../config/db.js';

// Get all users
export const getAllMaster = async () => {
    const [rows] = await db.query('SELECT * FROM tbl_master');
    // return rows;
    // Return data
    return {
        success: true,
        message: `Successfully Load AllMaster : ${rows}`,
        data: rows,
    };
};

// Get a single masterData by Department
export const getMasterByDept = async (Dept) => {
    const [rows] = await db.query('SELECT * FROM tbl_master WHERE Department = ?', [Dept]);
    // return rows; // Return the first match or undefined if not found

    // Return data
    return {
        success: true,
        message: `Successfully Get MasterByDept: ${rows}`,
        data: rows,
    };
};


// check duplicate 
export const Duplicate_ClauseByDept = async (masterData) => {
    try {
        // Destructure 
        const { Department, Clause } = masterData;

        const [result] = await db.query(
            `SELECT COUNT(*) AS COUNT FROM tbl_master WHERE Department=? AND Clause=?`, [Department.trim(), Clause.trim()]
        );


        // console.log('Result :', [result])
        // Return data
        return {
            success: true,
            message: `Check Duplicate_ClauseByDept : ${result[0].COUNT}`,
            data: result[0].COUNT, // Extracting actual count
        };

    } catch (error) {
        console.error('Error Check Duplicate_ClauseByDept :', error);

        // Optionally throw the error to the controller
        return {
            success: false,
            message: error.message,
        };
    }
}


// insert
export const insertMaster = async (masterData) => {
    // console.log('masterData', masterData)
    try {
        // Destructure 
        const { Department, Process, Clause, Check_Points, Guide_Lines } = masterData;
        // Execute the query with parameterized values
        const [result] = await db.query(
            `INSERT INTO tbl_master (Department, Process, Clause, Check_Points, Guide_Lines) VALUES (?, ?, ?, ?, ?)`, [Department.trim(), Process.trim(), Clause.trim(), Check_Points.trim(), Guide_Lines.trim()]
        );

        // Return data
        return {
            success: true,
            message: `Successfully insert Master: ${result}`,
            data: result,
        };

    } catch (error) {
        console.error('Error insertMaster :', error);

        // Optionally throw the error to the controller
        return {
            success: false,
            message: error.message,
        };
    }
}

// updateMaster
export const updateMaster = async (masterData) => {
    try {
        // Destructure 
        const { id, Department, Process, Clause, Check_Points, Guide_Lines } = masterData;
        // Execute the query with parameterized values
        const [result] = await db.query(
            `UPDATE tbl_master SET Department=?, Process=?, Clause=?, Check_Points=?, Guide_Lines=?  WHERE ID=?`, [Department.trim(), Process.trim(), Clause.trim(), Check_Points.trim(), Guide_Lines.trim(), id]
        );

        // Return data
        return {
            success: true,
            message: `Successfully Updated Master : ${result}`,
            data: result,
        };

    } catch (error) {
        console.error('Error Update Master :', error);

        // Optionally throw the error to the controller
        return {
            success: false,
            message: error.message,
        };
    }
}

// deleteMaster
export const deleteMaster = async (id) => {
    try {

        // Execute the query with parameterized values
        const [result] = await db.query(
            `DELETE FROM tbl_master WHERE id = ?`, [id]
        );

        // Return data
        return {
            success: true,
            message: `Successfully Deleted Master : ${result}`,
            data: result,
        };

    } catch (error) {
        console.error('Error Deleted Master :', error);

        // Optionally throw the error to the controller
        return {
            success: false,
            message: error.message,
        };
    }
}