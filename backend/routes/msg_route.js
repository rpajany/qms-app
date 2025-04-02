import express from 'express';
import * as MsgController from '../controller/Msg_Controller.js';

const router = express.Router();

router.get('/load', MsgController.get_AllMsg);
router.get('/count', MsgController.get_MsgCount);
router.get('/getMsgByUID/:Audit_UID', MsgController.get_MsgByUID);
router.post("/insert", MsgController.insert_Msg);
router.post('/update/:id', MsgController.update_Msg);
router.delete('/delete/:id', MsgController.delete_Msg);

export default router;