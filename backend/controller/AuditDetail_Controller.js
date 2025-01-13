
import * as auditDetailModel from '../models/auditDetail_model.js';

// get all auditDetails
export const get_AllAuditDetails = async (req, res) => {
    try {
        const auditDetailList = await auditDetailModel.getAllAuditDetail();
        // console.log('Load All auditDetailList :', auditDetailList)
        res.status(200).json(auditDetailList);
    } catch (error) {
        console.log('Error fetching get_AllAuditDetails :', error);
        res.status(500).send('Internal Server Error');
    }
};

// get auditDetail By id
export const get_Byid = async (req, res) => {
    try {
        const { id } = req.params;
        const auditDetailList = await auditDetailModel.getAuditDetailByID(id);
        if (auditDetailList) {
            res.status(200).json(auditDetailList);
        } else {
            res.status(404).send('masterList_Byid not found');
        }
    } catch (error) {
        console.error('Error fetching get_MasterByID :', error);
        res.status(500).send('Internal Server Error');
    }
};

// insert 
export const insert_AuditDetail = async (req, res) => {
    try {
        const { AuditDetails } = req.body;
        const newDetail_Id = await auditDetailModel.insertAuditDetail(AuditDetails);
        res.status(201).json({ id: newDetail_Id });
        

    } catch (error) {
        console.error('Error insert_AuditDetail :', error);
        res.status(500).send('Internal Server Error');
    }
};

// update
export const update_AuditDetail = async (req, res) => {
    try {

    } catch (error) {
        console.error('Error update_AuditDetail :', error);
        res.status(500).send('Internal Server Error');
    }
}

// delete
export const delete_AuditDetail = async (req, res) => {
 
    try {
        const { Doc_No } = req.params;
      
        const delete_Id = await auditDetailModel.deleteAuditDetail(Doc_No);
        res.status(201).json({ id: delete_Id });

    } catch (error) {
        console.error('Error delete_AuditDetail :', error);
        res.status(500).send('Internal Server Error');
    }
}