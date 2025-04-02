import express from 'express';
import * as AuditDetailController from '../controller/AuditDetail_Controller.js';

const router = express.Router();

router.post('/load', AuditDetailController.get_AllAuditDetails);
router.get('/getByUID/:Audit_UID', AuditDetailController.getDetail_ByUID);
router.post("/insert", AuditDetailController.insert_AuditDetail); // Create a user
router.post('/dashBoardData', AuditDetailController.dashBoard_Data);
router.post('/updateStatus', AuditDetailController.updateStatus_AuditDetail);
router.delete('/delete/:Audit_UID', AuditDetailController.delete_AuditDetail);

export default router;