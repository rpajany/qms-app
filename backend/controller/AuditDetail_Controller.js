
import * as auditDetailModel from '../models/auditDetail_model.js';

// get all auditDetails
export const get_AllAuditDetails = async (req, res) => {
    try {

        const { StartDate, EndDate } = req.body;
        
        const auditDetailList = await auditDetailModel.getAllAuditDetail(StartDate, EndDate);
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
export const updateStatus_AuditDetail = async (req, res) => {

    try {
        const { statusData } = req.body;
        const result = await auditDetailModel.update_AuditStatus(statusData);
        res.status(201).json(result);

    } catch (error) {
        console.error('Error Update_Status_AuditDetail :', error);
        res.status(500).send('Internal Server Error');
    }
}

// get_ByUID
export const getDetail_ByUID = async (req, res) => {
    try {
        const { Audit_UID } = req.params;
        const rowsData = await auditDetailModel.get_ByUID(Audit_UID);
        res.status(200).json(rowsData);

    } catch (error) {
        console.error('Error Get_AuditDetail_ByDocNo :', error);
        res.status(500).send('Internal Server Error');
    }
}

// delete
export const delete_AuditDetail = async (req, res) => {

    try {
        const { Audit_UID } = req.params;

        const delete_Id = await auditDetailModel.deleteAuditDetail(Audit_UID);
        res.status(201).json({ id: delete_Id });

    } catch (error) {
        console.error('Error delete_AuditDetail :', error);
        res.status(500).send('Internal Server Error');
    }
}

// delete
export const dashBoard_Data = async (req, res) => {
    try {
        // console.log(req.body)
        const { dateRangeNow } = req.body;
        const result = await auditDetailModel.get_DashboardData(dateRangeNow);
        res.status(201).json(result);

    } catch (error) {
        console.error('Error dashBoard_Data Controller :', error);
        res.status(500).send('Internal Server Error');
    }
}