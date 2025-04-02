import React from 'react'
import { GET_Api, POST_Api, Upload_APi, DELETE_Api } from './ApiService';
import { toast } from 'react-toastify';
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

export const UsersService = () => {
    return (
        null
    )
}

export const Load_Users_Service = async () => {
    try {
        const result_1 = await GET_Api(`${BASE_URL}/users/load`, '');
        console.log('Load_Users_Service :', result_1);
        return result_1.data;
    } catch (error) {
        console.log('Error Load_Users_Service : ', error);
        return false;
    }
}

export async function Save_User_Service(userData) {
    console.log('userData', userData)
    try {
        // const url_SaveUser = BASE_URL + `/users/insert`;
        const result1 = await POST_Api(`${BASE_URL}/users/insert`, '', userData);
        console.log('1. Save User Service... :', result1);
        if (result1) {
            toast.success('User Added..!');
        }
        return true;
    } catch (error) {
        console.log('Save User Service Error :', error);
        return false
    }
}

// update
export const Update_Users_Service = async (userData) => {
    try {
        // const url_UpdateUser = BASE_URL + `/users/update/${userData.id}`;
        const result1 = await POST_Api(`${BASE_URL}/users/update`, '', userData);
        console.log('Update_Users_Service... :', result1);
        
        if (result1) {
            toast.success('User Updated..!');
        }

        return true;

    } catch (error) {
        console.log('Update_Users_Service Error :', error);
        return false
    }
}

export async function Delete_User_Service(row) {
    // console.log(row)
    try {
        const url_DeleteUser = BASE_URL + `/users/delete/${row.id}`;
        const result6 = await DELETE_Api(url_DeleteUser, '');
        console.log('6. DELETE User Service... :', result6);
        if (result6) {
            toast.success('User Deleted..!');
        }
        return true;
    } catch (error) {
        console.log('Save User Service Error :', error);
        return false
    }
}