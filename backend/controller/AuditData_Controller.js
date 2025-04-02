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

// get_ByDocNo
export const get_ByUID = async (req, res) => {
    try {
        const { Audit_UID } = req.params;
        const rowsData = await auditDataModel.get_AuditData_ByUID(Audit_UID);
        res.status(200).json(rowsData);

    } catch (error) {
        console.error('Error Get_AuditData_ByDocNo :', error);
        res.status(500).send('Internal Server Error');
    }
}

// update
export const Update_AuditData = async (req, res) => {
    try {
        const { AuditData } = req.body;
        // console.log('AuditData', AuditData);
        const newData_Id = await auditDataModel.updateAuditData(AuditData);
        res.status(201).json({ id: newData_Id });

    } catch (error) {
        console.error('Error Update_AuditData :', error);
        res.status(500).send('Internal Server Error');
    }
};

// delete
export const delete_AuditData = async (req, res) => {
    try {
        const { Audit_UID } = req.params;
        const delete_Id = await auditDataModel.deleteAuditData(Audit_UID);
        res.status(201).json({ id: delete_Id });
    } catch (error) {
        console.error('Error insert_AuditData :', error);
        res.status(500).send('Internal Server Error');
    }
}
