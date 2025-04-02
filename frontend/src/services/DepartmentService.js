import React from 'react';
import { GET_Api, POST_Api, Upload_APi, DELETE_Api } from './ApiService';

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

export const DepartmentService = () => {
    return (
        null
    )
}

export const Load_Department_Service = async () => {
    try {
        const result_1 = await GET_Api(`${BASE_URL}/department/load`, '');
        // console.log('Load Department_Service :', result_1);
        return result_1.data;

    } catch (error) {
        console.log('Error Load_Department_Service : ', error);
        return false;
    }
}

export const Save_Department_Service = async (departmentData) => {

    try {
        const result_2 = await POST_Api(`${BASE_URL}/department/insert`, '', { DepartmentData: departmentData });
        // console.log('Save Department_Service :', result_2);
        return result_2.data;
    } catch (error) {
        console.log('Error Save Department_Service : ', error);
        return false;
    }

}

// Update Deparment
export const Update_Department_Service = async (departmentData) => {
    try {

        const result_3 = await POST_Api(`${BASE_URL}/department/update`, '', { DepartmentData: departmentData });
        // console.log('Update Master Service :', result_3);
        return result_3.data;
    } catch (error) {
        console.log('Error Update_Master_Service : ', error);
        return false;
    }
}


export const Delete_Deparment_Service = async (id) => {
    try {
        const result_4 = await DELETE_Api(`${BASE_URL}/department/delete/${id}`, '');
        // console.log('Delete Deparment_Service :', result_4);
        return result_4.data;

    } catch (error) {
        console.log('Error Delete_Deparment_Service : ', error);
        return false;
    }
}