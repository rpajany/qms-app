import * as auditDataModel from '../models/auditData_model.js';

// insert 
export const insert_AuditData = async (req, res) => {
    try {
        const { AuditData } = req.body;
        // console.log('AuditData', AuditData);
        const newData_Id = await auditDataModel.insertAuditData(AuditData);
        res.status(201).json({ id: newData_Id });

    } catch (error) {
        console.error('Error insert_AuditData :', error);
        res.status(500).send('Internal Server Error');
    }
};

// delete
export const delete_AuditData = async (req, res) => {
    try {
        const { Doc_No } = req.params;
        const delete_Id = await auditDataModel.deleteAuditData(Doc_No);
        res.status(201).json({ id: delete_Id });
    } catch (error) {
        console.error('Error insert_AuditData :', error);
        res.status(500).send('Internal Server Error');
    }
}
