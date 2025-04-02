import * as ProcessModel from '../models/process_model.js';


// get all process
export const get_AllProcess = async (req, res) => {
    try {

        const users = await ProcessModel.getAllProcess();

        res.status(200).json(users);
    } catch (error) {
        console.log('Error fetching getAllProcess :', error);
        res.status(500).send('Internal Server Error');
    }
}