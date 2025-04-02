import React from 'react';
import { GET_Api, POST_Api, Upload_APi, DELETE_Api } from './ApiService';
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

export const HeaderService = () => {
    return (
        null
    )
}


export const Get_MsgCount_Service = async () => {
    try {
        const result_1 = await GET_Api(`${BASE_URL}/msg/count`, '');
        console.log('Get_MsgCount_Service :', result_1);
        return result_1.data[0];

    } catch (error) {
        console.log('Error Get_MsgCount_Service : ', error);
        return false;
    }
}

export const Load_MsgView_Service = async () => {
    try {
        const result_2 = await GET_Api(`${BASE_URL}/msg/load`, '');
        console.log('Load_MsgView_Service :', result_2);
        return result_2.data;
    } catch (error) {
        console.log('Error Load_MsgView_Service : ', error);
        return false;
    }
}

export const Delete_Msg_Service = async (id) => {
    try {
        const result_3 = await DELETE_Api(`${BASE_URL}/msg/delete/${id}`, '');
        console.log('Load_MsgView_Service :', result_3);
        return result_3.data;
    } catch (error) {
        console.log('Error Delete_Msg_Service : ', error);
        return false;
    }
}