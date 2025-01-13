import express from 'express';
import * as AuditDetailController from '../controller/AuditDetail_Controller.js';

const router = express.Router();

router.post('/load', AuditDetailController.get_AllAuditDetails);
router.get('/getByDept/:Dept', AuditDetailController.get_Byid);
router.post("/insert", AuditDetailController.insert_AuditDetail); // Create a user
router.put('/update/:id', AuditDetailController.update_AuditDetail);
router.delete('/delete/:Doc_No', AuditDetailController.delete_AuditDetail);

export default router;