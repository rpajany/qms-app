import React, { useState, useEffect } from 'react';
import { DataTableVIew } from '../components';
import { Load_Users_Service, Save_User_Service, Update_Users_Service, Delete_User_Service } from '../services/UsersService';
import { toast } from 'react-toastify';

import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";

// css properties
const label_css = 'block mb-2 text-sm font-medium text-gray-900 dark:text-white';
const input_css = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';

export const Users = () => {

    const [isEdit, setIsEdit] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // Track Form submission state
    const [apiData, setApiData] = useState([]);


    const userData_initialValue = {
        Username: '',
        Password: '',
        confirm_password: '',
        Role: ''
    }

    const [userData, setUserData] = useState(userData_initialValue);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((preve) => ({
            ...preve,
            [name]: value
        }))
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Prevent duplicate submissions
        if (isSubmitting) {
            return;
        }



        setIsSubmitting(true); // Lock the form during submission

        // <Loader isLoading={isSubmitting} />



        try {

            if (userData.Password.trim() !== userData.confirm_password.trim()) {

                toast.success('Password not Match !!!');
                console.log('Password not Match !!!');
                return

            }

            console.log('Password Match !!!');

            if (!isEdit) { // save
                const result = await Save_User_Service(userData);

                if (result) {
                    setUserData(userData_initialValue);
                }

            } else { // update
                const result = await Update_Users_Service(userData);
                console.log('result :', result)
                if (result) {
                    setUserData(userData_initialValue);
                }
            }


        } catch (error) {
            console.log('Error :', error)
        } finally {
            setIsSubmitting(false); // Unlock the form
            setUserData(userData_initialValue);

            setIsEdit(false);
            await fetchUsers();
        }


    }

    const fetchUsers = async () => {
        const result = await Load_Users_Service();

        if (result) {
            setApiData(result);
        }
    }

    useEffect(() => {

        fetchUsers();

    }, []);

    console.log('apiData :', apiData);
    console.log('userData :', userData);


    const handleEdit = (row) => {
        if (row) {

            setUserData((preve) => ({
                ...preve,
                ...row
            }))
        }

        setIsEdit(true);

    }

    const handleDelete = async (row) => {
        const result = await Delete_User_Service(row);
        if (result) {
            fetchUsers();
        }
    }

    const columns = [
        {
            name: 'id',
            selector: row => row.id,
            sortable: true
        },
        {
            name: 'Username',
            selector: row => row.Username,
            sortable: true
        },

        {
            name: 'Actions',
            cell: (row) => (
                <div className='flex p-1 '>
                    <button onClick={() => handleEdit(row)} className='bg-yellow-300 p-2 rounded-sm mr-1'><span><FaEdit /></span></button>
                    <button onClick={() => handleDelete(row)} className='bg-red-500 p-2 rounded-sm'><RiDeleteBin2Line /></button>
                </div>
            ),
            ignoreRowClick: true, // Prevent triggering row click event when clicking buttons
            allowoverflow: true, // Ensure the buttons are visible - "allowOverflow"
            // button: true, // Makes it clear they are buttons
        }
    ]
    return (
        <>
            <div className="p-4  bg-blue-100 rounded-lg">


                <form onSubmit={handleFormSubmit}>
                    <div className='border-2 w-1/2 rounded-md'>


                        <div className={`${isEdit ? 'bg-yellow-300' : 'bg-green-300'} border-2  p-2`}>
                            <p className='px-2'>{`${isEdit ? 'Edit' : 'Add'} `} User</p>
                        </div>


                        <div className='mt-4 p-2'>
                            <div>
                                <label htmlFor='Username' className={`${label_css}`}>User Name</label>
                                <input type="text"
                                    id="Username"
                                    name="Username"
                                    onChange={handleChange}
                                    value={userData.Username}
                                    required
                                    className={`${input_css} w-1/4`}
                                />
                            </div>

                            <div className='mt-4'>
                                <label htmlFor='Password' className={`${label_css}`}>Password</label>
                                <input type="password"
                                    id="Password"
                                    name="Password"
                                    onChange={handleChange}
                                    value={userData.Password}
                                    required
                                    className={`${input_css} w-1/4`}
                                />
                            </div>
                            <div className='mt-4 mb-4'>
                                <label htmlFor='confirm_password' className={`${label_css}`}>Confirm Password</label>
                                <input type="password"
                                    id="confirm_password"
                                    name="confirm_password"
                                    onChange={handleChange}
                                    value={userData.confirm_password}
                                    required
                                    className={`${input_css} w-1/4`}
                                />
                            </div>

                            <div className="mt-4'">
                                <label htmlFor="Role" className='mr-3'>Role</label>
                                <select className={`${input_css} w-1/4`} id="Role" name="Role" onChange={handleChange} value={userData.Role} required>
                                    <option value="">- Select -</option>
                                    <option value="admin">admin</option>
                                    <option value="audit">audit</option>
                                    {/* <option value="Staff">Staff</option> */}

                                </select>
                            </div>

                            <button type="submit" disabled={isSubmitting} className={`${!isEdit ? 'bg-green-400 hover:bg-green-600 text-white' : 'bg-yellow-400 hover:bg-yellow-300 text-black'}  ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'} w-40  mt-4  p-3  rounded-lg `} id="btn_Save" name="btn_Save" >{!isEdit ? "Save" : "Update"}</button>

                        </div>
                    </div>
                </form>

                <div className='mt-4 w-1/2'>
                    <DataTableVIew tbl_title={'User List'} columns={columns} apiData={apiData} pagination={false} rowsPerPage={25} />
                </div>

            </div>







        </>

    )
}
