import express from 'express';
import * as planDataController from '../controller/PlanData_Controller.js';
const router = express.Router();

router.get('/load', planDataController.Load_PlanData)
// router.post('/insert', planDataController.Insert_PlanData)
router.post('/update', planDataController.Update_PlanData)


export default router;