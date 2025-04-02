import * as PlanDataModel from '../models/planData_model.js';

// get all processData
export const Load_PlanData = async (req, res) => {
    try {
        const users = await PlanDataModel.get_AllPlaneData();

        res.status(200).json(users);
    } catch (error) {
        console.log('Error fetching Load_ProcessData :', error);
        res.status(500).send('Internal Server Error');
    }
}


// insert
// export const Insert_PlanData = async (req, res) => {
//     try {

//         const planData = req.body;  // ✅ Directly extract req.body
//         // console.log(planData)
//         // Validation: Check if required fields exist
//         if (!planData || !planData.Process || !planData.Frequency) {
//             return res.status(400).json({ success: false, message: "Missing required fields" });
//         }

//         const result = await PlanDataModel.insert_PlanData(planData);

//         res.status(200).json(result);

//     } catch (error) {
//         console.error('Error Insert_PlanData :', error);
//         res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// }

// update
export const Update_PlanData = async (req, res) => {
    try {
        //    console.log('req.body :', req.body)
        const planData = req.body;  // ✅ Directly extract req.body
        // console.log(planData)
        // Validation: Check if required fields exist
        // if (!planData || !planData.Process || !planData.Frequency) {
        //     return res.status(400).json({ success: false, message: "Missing required fields" });
        // }

        const result = await PlanDataModel.update_PlanData(req.body);

        res.status(200).json(result);

    } catch (error) {
        console.error('Error Insert_PlanData :', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}