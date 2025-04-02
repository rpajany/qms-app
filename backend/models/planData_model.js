import db from '../config/db.js';
import moment from 'moment';

// Get All ProcessData
export const get_AllPlaneData = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM tbl_plan_data');
        // return rows;

        // const formattedData = rows.map((row) => ({
        //     ...row,
        //     Actual: moment(row.Actual).format('DD-MM-YYYY'),
        // }));

        // Return data
        return {
            success: true,
            message: `Successfully get_AllPlaneData : ${rows}`,
            data: rows,
        };
    } catch (error) {
        console.error('Error get_AllPlaneData :', error);

        // Optionally throw the error to the controller
        return {
            success: false,
            message: error.message,
        };
    }
}

// insert
// export const insert_PlanData = async (processData) => {
//     try {

//         // Destructure 
//         const { Process, Frequency, date1, date2, date3, date4, plan1, plan2, plan3, plan4, actual1, actual2, actual3, actual4 } = processData;
//         // Execute the query with parameterized values
//         const [result] = await db.query(
//             `INSERT INTO tbl_plan_data (Process, Frequency, date1,date2,date3,date4, plan1,plan2,plan3,plan4, actual1, actual2, actual3, actual4) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//             [
//                 Process?.trim() || "",
//                 Frequency?.trim() || "",
//                 date1 || null,
//                 date2 || null,
//                 date3 || null,
//                 date4 || null,
//                 plan1 || 0,
//                 plan2 || 0,
//                 plan3 || 0,
//                 plan4 || 0,
//                 actual1 || 0,
//                 actual2 || 0,
//                 actual3 || 0,
//                 actual4 || 0
//             ]
//         );

//         // Return data
//         return {
//             success: true,
//             message: `Successfully insert PlanData : ${result}`,
//             data: result,
//         };
//     } catch (error) {
//         console.error('Error insert PlanData :', error);

//         // Optionally throw the error to the controller
//         return {
//             success: false,
//             message: `Error inserting PlanData : ${error.message}`,
//             error: error,  // Include full error details
//         };
//     }
// }


// update
export const update_PlanData = async (planData) => {

    // console.log('planData Module :', planData)
    try {

        // Destructure 
        const { Process, Frequency, id, ...rest } = planData;

        if (!id) {
            throw new Error("ID is required for updating plan data.");
        }

        // Prepare values, ensuring numbers aren't mistakenly converted to `null`
        const values = [
            Process?.trim() || "",
            Frequency?.trim() || "",
            ...Array.from({ length: 12 }, (_, i) => [rest[`P${i + 1}`] ?? null, rest[`A${i + 1}`] ?? null]).flat(),
            id
        ];

        // console.log('values :', values)

        // Execute the query
        const [result] = await db.query(
            `UPDATE tbl_plan_data
             SET Process=?, Frequency=?, 
                 P1=?, A1=?, P2=?, A2=?, P3=?, A3=?, 
                 P4=?, A4=?, P5=?, A5=?, P6=?, A6=?, 
                 P7=?, A7=?, P8=?, A8=?, P9=?, A9=?, 
                 P10=?, A10=?, P11=?, A11=?, P12=?, A12=? 
             WHERE id=?`,
            values
        );


        // console.log(`Update affected ${result.affectedRows} rows`);

        // Return data
        return {
            success: true,
            message: `Successfully updated PlanData. Rows affected: ${result.affectedRows}`,
            data: result,
        };

    } catch (error) {
        console.error('Error update PlanData :', error);

        // Optionally throw the error to the controller
        return {
            success: false,
            message: `Error update PlanData : ${error.message}`,
            error: error,  // Include full error details
        };
    }
}