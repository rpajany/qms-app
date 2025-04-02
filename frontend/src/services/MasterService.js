import React from 'react'
import { GET_Api, POST_Api, Upload_APi, DELETE_Api } from './ApiService';
import qs from "qs"; // Import qs library for URL-encoding

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

export const MasterService = () => {
    return (
        null
    )
}

export const Load_Department_Service = async () => {

    try {
        const result_0 = await GET_Api(`${BASE_URL}/department/load`, '');
        // console.log('Load_Department_Service :', result_0);
        return result_0.data;

    } catch (error) {
        console.log('Error Load_Department_Service : ', error);
        return false;
    }
}

// load master Data ...
export const Load_Master_Service = async () => {
    try {
        const result_1 = await GET_Api(`${BASE_URL}/master/load`, '');
        // console.log('Load_Master_Service :', result_1);
        return result_1.data;

    } catch (error) {
        console.log('Error Load_Master_Service : ', error);
        return false;
    }
}



// check Duplicate Clause ...
export const Check_DuplicateClause_Service = async (masterData) => {
    try {
        // 1. Check Duplicate ClauseByDept ...
        const result_1 = await POST_Api(`${BASE_URL}/master/check_duplicateClause`, '', { masterData });
        console.log('result_1 : ', result_1.data);
        const { data } = result_1.data;

        if (data >= 1) {
            return { error: `${masterData.Clause} - Duplicate Clause !!` }
        }
    } catch (error) {
        console.log('Error Save_Master_Service : ', error);
        return false;
    }
}

// Save master
export const Save_Master_Service = async (masterData) => {

    // Convert data to URL-encoded string
    const urlEncodedData = qs.stringify(masterData);

    try {

        const result_2 = await POST_Api(`${BASE_URL}/master/insert`, '', { masterData: masterData });
        // console.log('Save Master Service :', result_2);
        return result_2.data;

    } catch (error) {
        console.log('Error Save_Master_Service : ', error);
        return false;
    }
}



// Update master
export const Update_Master_Service = async (masterData) => {
    try {
        const { id } = masterData;
        const result_3 = await POST_Api(`${BASE_URL}/master/update/${id}`, '', { masterData: masterData });
        // console.log('Update Master Service :', result_3);
        return result_3.data;
    } catch (error) {
        console.log('Error Update_Master_Service : ', error);
        return false;
    }
}

// Delee master
export const Delete_Master_Service = async (id) => {
    try {

        const result_4 = await DELETE_Api(`${BASE_URL}/master/delete/${id}`, '');
        // console.log('Delete Master Service :', result_4);
        return result_4.data;
    } catch (error) {
        console.log('Error Delete_Master_Service : ', error);
        return false;
    }
}