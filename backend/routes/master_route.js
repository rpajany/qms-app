import express from 'express';
import * as MasterController from '../controller/Master_Controller.js';

const router = express.Router();

router.get('/load', MasterController.get_AllMaster);
router.get('/getByDept/:Dept', MasterController.get_ByDept);
router.post('/check_duplicateClause', MasterController.checkDuplicate_ClauseByDept);
router.post("/insert", MasterController.insert_Master);
router.post('/update/:id', MasterController.update_Master);
router.delete('/delete/:id', MasterController.delete_Master);

export default router;