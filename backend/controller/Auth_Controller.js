import * as authModel from '../models/auth_model.js';

// get user
export const get_user = async (req, res) => {
    try {
        const { loginData } = req.body;
        const result = await authModel.login(loginData)
        res.status(200).json(result);
    } catch (error) {
        console.log('Error Login get_user :', error);
        res.status(500).send('Internal Server Error');
    }
}