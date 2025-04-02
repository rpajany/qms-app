import express from 'express';
import * as uidController from '../controller/UID_Controller.js';

const router = express.Router();


router.get('/getUID', uidController.getAudit_UID);
router.post("/update", uidController.updateAudit_UID);
// router.post("/insert", MasterController.insert_Master);
// router.post('/update/:id', MasterController.update_Master);
// router.delete('/delete/:id', MasterController.delete_Master);

export default router;