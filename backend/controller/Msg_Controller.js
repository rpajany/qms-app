import * as MsgModel from '../models/msg_model.js';

// get all maser
export const get_AllMsg = async (req, res) => {
    try {

        const msgList = await MsgModel.get_AllMsg();
        // console.log('load master :', masterList)
        res.status(200).json(msgList);
    } catch (error) {
        console.log('Error fetching get_AllMaster :', error);
        res.status(500).send('Internal Server Error');
    }
};


export const get_MsgCount = async (req, res) => {
    try {
        const msgCount = await MsgModel.MsgCount();
        // console.log('load master :', masterList)
        res.status(200).json(msgCount);
    } catch (error) {
        console.error('Error fetching get_MsgCount :', error);
        res.status(500).send('Internal Server Error');
    }
}


// get userbyid
export const get_MsgByUID = async (req, res) => {
    try {
        const { Audit_UID } = req.params;
        const msgList = await MsgModel.get_ByUID(Audit_UID);
        if (msgList) {
            res.status(200).json(msgList);
        } else {
            res.status(404).send('msgList not found');
        }
    } catch (error) {
        console.error('Error fetching get_MasterByDept :', error);
        res.status(500).send('Internal Server Error');
    }
};

// insert
export const insert_Msg = async (req, res) => {
    try {
        const { Audit_UID, Message } = req.body;
        const result = await MsgModel.insert_Msg(Audit_UID, Message);

        res.status(200).json(result);

    } catch (error) {
        console.error('Error Insert Master :', error);
        res.status(500).send('Internal Server Error');
    }
}

// update_Master
export const update_Msg = async (req, res) => {
    try {
        const { msgData } = req.body;
        const result = await MsgModel.updateMsg(msgData);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error Insert Master :', error);
        res.status(500).send('Internal Server Error');
    }
}

// delete
export const delete_Msg = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await MsgModel.deleteMsg(id);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error Delete Master :', error);
        res.status(500).send('Internal Server Error');
    }
}