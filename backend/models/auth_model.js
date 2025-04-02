import db from '../config/db.js';

// login
export const login = async (loginData) => {
    try {
        const { username, password } = loginData;
        // console.log('loginData :', loginData)

        const [rows] = await db.query('SELECT *  FROM tbl_users WHERE Username = ? AND Password = ?', [username, password]);
        // return rows; // rows

        if (rows.length > 0) {
            return {
                success: true,
                message: `Login Success`,
                data: rows,
            };
        } else {
            return {
                success: false,
                message: `Login Fail Check username / password.. !!`,
                data: [],
            };
        }


    } catch (error) {
        console.error('Error auth_login_model :', error);

        // Optionally throw the error to the controller
        return {
            success: false,
            message: error.message,
        };
    }
}