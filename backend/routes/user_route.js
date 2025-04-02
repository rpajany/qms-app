import express from 'express';
import * as UserController from '../controller/User_Controller.js';

const router = express.Router();

router.get('/load', UserController.getAllUsers);
router.get('/getUserByid/:id', UserController.getUserById);
router.post("/insert", UserController.createUser); // Create a user
router.post('/update', UserController.updateUser);
router.delete('/delete/:id', UserController.deleteUser);

export default router;