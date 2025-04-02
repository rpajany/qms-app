import express from 'express';
import * as AuditDataController from '../controller/AuditData_Controller.js';

const router = express.Router();

// router.get('/load', AuditDataController.get_AllAuditData);
router.get('/getByUID/:Audit_UID', AuditDataController.get_ByUID);
router.post("/insert", AuditDataController.insert_AuditData); // Create a user
router.post('/update', AuditDataController.Update_AuditData);
router.delete('/delete/:Audit_UID', AuditDataController.delete_AuditData);

export default router;