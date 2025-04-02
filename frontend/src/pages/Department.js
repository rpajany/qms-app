import React, { useState, useEffect } from 'react';
import { DataTableVIew, SweetAlert_Delete } from '../components';
import { Save_Department_Service, Load_Department_Service, Update_Department_Service, Delete_Deparment_Service } from '../services/DepartmentService';

import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";


// css properties
const label_css = 'block mb-2 text-sm font-medium text-gray-900 dark:text-white';
const input_css = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';
const tbl_header = 'border border-slate-600  bg-gray-500 p-1';
const tbl_thead_tr = " text-white border-r-2  border-gray-300";
const tbl_thead_th = "px-6 py-2 border-r-2  border-gray-300";
const tbl_tbody_td = "border-r-2  border-gray-300 px-1";

export const Department = () => {
    const [isSubmitting, setIsSubmitting] = useState(false); // Track Form submission state
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);


    const DepartmentData_InitialValue = {
        id: '',
        Department: '',

    }
    const [departmentData, setDepartmentData] = useState(DepartmentData_InitialValue);
    const [deparmentGridData, setDepartmentGridData] = useState([]);

    console.log('departmentData :', departmentData);
    // console.log('deparmentGridData :', deparmentGridData);

    const handle_DepartmentChange = (e) => {
        const { name, value } = e.target;

        setDepartmentData((preve) => ({
            ...preve,
            [name]: value.trim()
        }
        ))
    }

    const load_Data = async () => {
        const result_0 = await Load_Department_Service();
        setDepartmentGridData(result_0)
    }

    useEffect(() => {
        load_Data();
    }, []);

    const handle_FormSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);
        setLoading(true);

        if (!isEdit) {
            const save_result = await Save_Department_Service(departmentData);
        } else if (isEdit) {
            const update_result = await Update_Department_Service(departmentData);
        }

        await load_Data();
        setDepartmentData(DepartmentData_InitialValue);
        setLoading(false);
        setIsSubmitting(false);
        setIsEdit(false);
    }

    const handleEdit = (row) => {
        setIsEdit(true);
        setDepartmentData((preve) => ({
            ...preve,
            ...row
        }));
    }

    const handleDelete = async (row) => {
        const { id } = row;

        const confirm = await SweetAlert_Delete();
        if (confirm) {
            const result_1 = await Delete_Deparment_Service(id);

            if (result_1.success) {
                await load_Data();
            }
        }

    }

    const columns = [
        {
            name: 'id',
            selector: row => row.id,
            sortable: true
        },
        {
            name: 'Department',
            selector: row => row.Department,
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
            <div className='bg-gray-500 text-white py-2 px-4 border-2  border-gray-300'>
                <span className=''>Add Department</span>
            </div>

            <div className='w-1/4 ml-4 mt-4'>

                <form onSubmit={handle_FormSubmit}>
                    <label htmlFor='Department' className={`${label_css}`}>Department</label>
                    <input
                        type="text"
                        id="Department"
                        name="Department"
                        onChange={handle_DepartmentChange}
                        value={departmentData.Department}
                        placeholder='Enter Department Name.'
                        className={`${input_css}`}
                    />
                    <div className='    '>
                        <button type="submit"
                            disabled={isSubmitting}
                            className={` ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'} ${!isEdit ? 'bg-green-800 hover:bg-green-700 text-white' : 'bg-yellow-400 hover:bg-yellow-300 text-black'} w-1/2 mt-2  p-3  rounded-lg `} id="btn_Save" name="btn_Save" >{!isEdit ? "Save" : "Update"}
                        </button>
                    </div>
                </form>

            </div>

            <div className='mt-4'>
                <DataTableVIew tbl_title={'Department List'} columns={columns} apiData={deparmentGridData} pagination={false} rowsPerPage={25} />
            </div>
        </>
    )
}
