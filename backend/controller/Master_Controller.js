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


