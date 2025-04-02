import express from 'express';
import * as ProcessController from '../controller/Process_Controller.js';
const router = express.Router();

router.get('/load', ProcessController.get_AllProcess)


export default router;