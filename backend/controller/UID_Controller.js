import * as uidModel from '../models/uid_model.js';

// get uid
export const getAudit_UID = async (req, res) => {
    try {

        const UID = await uidModel.get_AuditUID();
        // console.log('getAudit_UID :', UID)
        res.status(200).json(UID);
    } catch (error) {
        console.log('Error fetching getAudit_UID :', error);
        res.status(500).send('Internal Server Error');
    }
}

// UPDATE uid
export const updateAudit_UID = async (req, res) => {
    try {
        const { Audit_UID } = req.body;
        const update_UID = await uidModel.update_AuditUID(Audit_UID);
        // console.log('Updated UID :', update_UID)
        res.status(200).json(update_UID);
    } catch (error) {
        console.log('Error fetching getAudit_UID :', error);
        res.status(500).send('Internal Server Error');
    }
}