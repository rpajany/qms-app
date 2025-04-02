import express from 'express';
import * as DepartmentController from '../controller/Department_Controller.js';

const router = express.Router();

router.get('/load', DepartmentController.load_AllDeparments);
// router.get('/getByDept/:Dept', MasterController.get_ByDept);
router.post("/insert", DepartmentController.Insert_Department);
router.post('/update', DepartmentController.Update_DepartmentByID);
router.delete('/delete/:id', DepartmentController.Delete_DepartmentByID);


export default router;