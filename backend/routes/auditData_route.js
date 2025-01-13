import express from 'express';
import * as AuditDataController from '../controller/AuditData_Controller.js';

const router = express.Router();

// router.get('/load', AuditDataController.get_AllAuditData);
// router.get('/getByDept/:Dept', AuditDataController.get_Byid);
router.post("/insert", AuditDataController.insert_AuditData); // Create a user
// router.put('/update/:id', MasterController.updateUser);
router.delete('/delete/:Doc_No', AuditDataController.delete_AuditData);

export default router;