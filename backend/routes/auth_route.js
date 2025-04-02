import express from 'express';
import * as AuthController from '../controller/Auth_Controller.js';

const router = express.Router();

router.post('/login', AuthController.get_user);
// router.get('/getByDocNo/:Doc_No', AuditDetailController.get_ByDocNo);
// router.post("/insert", AuditDetailController.insert_AuditDetail); // Create a user
// router.put('/update/:id', AuditDetailController.update_AuditDetail);
// router.delete('/delete/:Doc_No', AuditDetailController.delete_AuditDetail);

export default router;