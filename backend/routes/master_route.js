import express from 'express';
import * as MasterController from '../controller/Master_Controller.js';

const router = express.Router();

router.get('/load', MasterController.get_AllMaster);
router.get('/getByDept/:Dept', MasterController.get_ByDept);
// router.post("/insert", MasterController.createUser); // Create a user
// router.put('/update/:id', MasterController.updateUser);
// router.delete('/delete/:id', MasterController.deleteUser);

export default router;