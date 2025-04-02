import * as MasterModel from '../models/master_model.js';

// get all maser
export const get_AllMaster = async (req, res) => {
    try {

        const masterList = await MasterModel.getAllMaster();
        // console.log('load master :', masterList)
        res.status(200).json(masterList);
    } catch (error) {
        console.log('Error fetching get_AllMaster :', error);
        res.status(500).send('Internal Server Error');
    }
};

// get userbyid
export const get_ByDept = async (req, res) => {
    try {
        const { Dept } = req.params;
        const masterList = await MasterModel.getMasterByDept(Dept);
        if (masterList) {
            res.status(200).json(masterList);
        } else {
            res.status(404).send('masterList not found');
        }
    } catch (error) {
        console.error('Error fetching get_MasterByDept :', error);
        res.status(500).send('Internal Server Error');
    }
};


// duplicate clause
export const checkDuplicate_ClauseByDept = async (req, res) => {

    try {
        const { masterData } = req.body


        const duplicate = await MasterModel.Duplicate_ClauseByDept(masterData);
        res.status(200).json(duplicate);
    } catch (error) {
        console.error('Error fetching checkDuplicate_ClauseByDept :', error);
        res.status(500).send('Internal Server Error');
    }
}

// insert
export const insert_Master = async (req, res) => {
    try {
        const { masterData } = req.body;
        const result = await MasterModel.insertMaster(masterData);

        res.status(200).json(result);

    } catch (error) {
        console.error('Error Insert Master :', error);
        res.status(500).send('Internal Server Error');
    }
}

// update_Master
export const update_Master = async (req, res) => {
    try {
        const { masterData } = req.body;
        const result = await MasterModel.updateMaster(masterData);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error Insert Master :', error);
        res.status(500).send('Internal Server Error');
    }
}

// delete
export const delete_Master = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await MasterModel.deleteMaster(id);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error Delete Master :', error);
        res.status(500).send('Internal Server Error');
    }
}