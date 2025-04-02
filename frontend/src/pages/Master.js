import React, { useState, useEffect } from 'react';
import { Load_Department_Service, Save_Master_Service, Load_Master_Service, Update_Master_Service, Delete_Master_Service, Check_DuplicateClause_Service } from '../services/MasterService';
import { DataTableVIew, SweetAlert_Delete, LoadSpinner } from '../components';
import { AuditPlan } from './AuditPlan';
import { Department } from './Department';
import { toast } from 'react-toastify';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";

// css properties
const label_css = 'block mb-2 text-sm font-medium text-gray-900 dark:text-white';
const input_css = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';
const tbl_header = 'border border-slate-600  bg-gray-500 p-1';
const tbl_thead_tr = " text-white border-r-2  border-gray-300";
const tbl_thead_th = "px-6 py-2 border-r-2  border-gray-300";
const tbl_tbody_td = "border-r-2  border-gray-300 px-1";

export const Master = () => {
    const [activeTab, setActiveTab] = useState(1);

    const MasterData_InitialValue = {
        id: '',
        Department: '',
        Process: '',
        Clause: '',
        Check_Points: '',
        Guide_Lines: '',
    }
    const [masterData, setMasterData] = useState(MasterData_InitialValue);
    const [isSubmitting, setIsSubmitting] = useState(false); // Track Form submission state
    const [isLoading, setIsLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [departmentData, setDepartmentData] = useState([]);

    const [masterGridData, setMasterGridData] = useState([]);

    const [error, setError] = useState("");

    // load Department data ...
    const Load_Department = async () => {
        try {
            setIsLoading(true);
            const result_0 = await Load_Department_Service();
            console.log('Load_Department :', result_0)
            setDepartmentData(result_0);
        } catch (error) {
            console.error("❌ Error Load_Department :", error.message || error); // Handle errors gracefully
        } finally {
            setIsLoading(false);
        }

    }

    // load Master data ...
    const Load_MasterData = async () => {
        try {
            setIsLoading(true);
            const result_1 = await Load_Master_Service();
            console.log('Load_MasterData :', result_1);
            setMasterGridData(result_1);
        } catch (error) {
            console.error("❌ Error Load_MasterData :", error.message || error); // Handle errors gracefully
        } finally {
            setIsLoading(false);
        }

    }

    // useEffect(() => {
    //     const fetchData = async () => {
    //         await Load_Department();
    //         await Load_MasterData();
    //     }

    //     fetchData();

    // }, []);


    useEffect(() => {
        if (activeTab === 1) {
            Load_Department();


        }
        if (activeTab === 2) {
            Load_Department();
            Load_MasterData();
        }


    }, [activeTab]);

    const master_handleChange = (e) => {
        const { name, value } = e.target;

        setMasterData((preve) => ({
            ...preve,
            [name]: value.trim()
        }
        ))
    }

    // console.log('departmentData :', departmentData)
    console.log('masterData :', masterData)


    const handle_FormSubmit = async (e) => {
        e.preventDefault();

        setError(""); // clear error

        // Prevent duplicate submissions
        if (isSubmitting) {
            return;
        }


        setIsSubmitting(true);
        setIsLoading(true);

        // check Duplicate and exit Save
        try {
            const isDuplicate = await Check_DuplicateClause_Service(masterData);

            console.log('isDuplicate', isDuplicate);
            if (isDuplicate.error) {
                toast.error("Duplicate Clause !!")
                setError(isDuplicate.error)

                setIsSubmitting(false); // Unlock the form
                setIsLoading(false);
                return;
            }
        } catch (error) {
            console.error("Error Check_DuplicateClause :", error);
        } finally {
            setIsSubmitting(false); // Unlock the form
            setIsLoading(false);
        }



        try {

            if (!isEdit) {
                const result_1 = await Save_Master_Service(masterData);

                if (result_1.success) {

                }
            } else if (isEdit) {
                const result_2 = await Update_Master_Service(masterData);

            }

            setMasterData(MasterData_InitialValue);
            // setIsSubmitting(false);
            setIsEdit(false);
            await Load_MasterData();

        } catch (error) {
            console.error("Error Save Master data:", error); // Handle errors gracefully
        } finally {
            setIsSubmitting(false); // Unlock the form
            setIsLoading(false);
        }

    }

    const handleEdit = (row) => {
        setIsEdit(true);
        setMasterData((preve) => ({
            ...preve,
            ...row
        }));
    }

    const handleDelete = async (row) => {

        const confirm = await SweetAlert_Delete();

        if (confirm) {
            try {
                const restult = await Delete_Master_Service(row.id);
                await Load_MasterData();
            } catch (error) {
                console.error("Error Delete Master Data :", error);
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
            name: 'Process',
            selector: row => row.Process,
            sortable: true
        },
        {
            name: 'Clause',
            selector: row => row.Clause,
            sortable: true
        },
        {
            name: 'Check_Points',
            selector: row => row.Check_Points,
            cell: row => (
                <div title={row.Check_Points} style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                    {row.Check_Points}
                </div>
            ),
            sortable: true
        },
        {
            name: 'Guide_Lines',
            selector: row => row.Guide_Lines,
            cell: row => (
                <div title={row.Guide_Lines} style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                    {row.Guide_Lines}
                </div>
            ),
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
            {/* Loading Spinner */}
            {isLoading && <LoadSpinner isLoading={isLoading} />}

            <div className="w-full mx-auto p-1">
                {/* Tab navigation */}
                <ul className='flex space-x-4 border-b-2 border-gray-200'>
                    <li
                        onClick={() => setActiveTab(1)}
                        className={`${activeTab === 1 ? 'text-blue-600 border-blue-600 border-b-2  bg-blue-100 rounded-t-lg px-2' : 'hover:cursor-pointer'}`}>
                        Department
                    </li>
                    <li
                        onClick={() => setActiveTab(2)}
                        className={`${activeTab === 2 ? 'text-blue-600 border-blue-600 border-b-2  bg-blue-100 rounded-t-lg px-2' : 'hover:cursor-pointer'}`}>
                        Master
                    </li>

                    <li
                        onClick={() => setActiveTab(3)}
                        className={`${activeTab === 3 ? 'text-blue-600 border-blue-600 border-b-2  bg-blue-100 rounded-t-lg px-2' : 'hover:cursor-pointer'}`}
                    >
                        Audit-Plan
                    </li>
                </ul>

                {/* Tab content */}
                <div className="mt-4">
                    {activeTab === 1 && (
                        <div className="h-full  bg-blue-100 rounded-lg mb-4">
                            {/*  Content for Tab 1  */}
                            <Department />
                        </div>
                    )}
                    {activeTab === 2 && (
                        <div className="h-full  bg-blue-100 rounded-lg">
                            {/*  Content for Tab 2  */}
                            <div className='bg-gray-500 text-white px-4 py-2'>
                                <p>Add Master</p>
                            </div>

                            <div className='p-4'>


                                <form onSubmit={handle_FormSubmit}>
                                    <div className='grid gap-6 mb-6 md:grid-cols-3'>
                                        <div>
                                            <label htmlFor='Department' className={`${label_css}`}>Department</label>
                                            <select
                                                id="Department"
                                                name="Department"
                                                onChange={master_handleChange}
                                                value={masterData.Department || ""}
                                                required
                                                className={`${input_css}`}>

                                                <option value="">- Select -</option>
                                                {departmentData && departmentData.map((item, index) => (
                                                    <option key={index} value={item.Department} >{item.Department}</option>
                                                ))}

                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor='Process' className={`${label_css}`}>Process</label>
                                            <select
                                                id="Process"
                                                name="Process"
                                                onChange={master_handleChange}
                                                value={masterData.Process || ""}
                                                required
                                                className={`${input_css}`}>

                                                <option value="">- Select -</option>
                                                <option value="Main">Main</option>
                                                <option value="Common">Common</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor='Clause' className={`${label_css}`}>Clause No.</label>
                                            <input
                                                type="text"
                                                id="Clause"
                                                name="Clause"
                                                onChange={master_handleChange}
                                                value={masterData.Clause || ""}
                                                required
                                                placeholder='Enter Clause Number.'
                                                className={`${input_css}`}
                                            />
                                            {error && <span className='text-red-400 pl-2'>{error}</span>}
                                        </div>


                                    </div>

                                    <div className='grid gap-6 mb-6 md:grid-cols-2'>
                                        <div>
                                            <label htmlFor='Check_Points' className={`${label_css}`}>CheckPoints</label>
                                            <textarea
                                                type="text"
                                                id="Check_Points"
                                                name="Check_Points"
                                                rows={5}
                                                cols={5}
                                                onChange={master_handleChange}
                                                value={masterData.Check_Points || ""}
                                                required
                                                placeholder='Enter Check Points.'
                                                className={`${input_css}`}
                                            >

                                            </textarea>
                                        </div>

                                        <div>
                                            <label htmlFor='Guide_Lines' className={`${label_css}`}>GuideLines</label>
                                            <textarea
                                                type="text"
                                                id="Guide_Lines"
                                                name="Guide_Lines"
                                                rows={5}
                                                cols={5}
                                                onChange={master_handleChange}
                                                value={masterData.Guide_Lines || ""}
                                                required
                                                placeholder='Enter Guide Lines.'
                                                className={`${input_css}`}
                                            >

                                            </textarea>
                                        </div>
                                    </div>

                                    {/* <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button> */}
                                    <div className='  text-center '>
                                        <button type="submit"
                                            disabled={isSubmitting}
                                            className={` ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'} ${!isEdit ? 'bg-green-800 hover:bg-green-700 text-white' : 'bg-yellow-400 hover:bg-yellow-300 text-black'} w-1/2 mt-2  p-3  rounded-lg `} id="btn_Save" name="btn_Save" >{!isEdit ? "Save" : "Update"}
                                        </button>

                                    </div>
                                </form>
                            </div>

                            <hr className='mt-4 border-1 border-gray-400'></hr>

                            <div className='bg-gray-500 text-white px-4 py-2 mt-4'>
                                <p>Master Report</p>
                            </div>

                            <div className='mt-4'>
                                {/* <table className='w-full table-auto'>
                                    <thead className={tbl_header}>
                                        <tr className={tbl_thead_tr}>
                                            <td className={`${tbl_thead_th} text-center`}>#</td>
                                            <td className={`${tbl_thead_th} text-center`}>Department</td>
                                            <td className={`${tbl_thead_th} text-center`}>Clause Mo</td>
                                            <td className={`${tbl_thead_th} text-center`}>Check Points</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className='border border-slate-600 p-1 text-center'>1</td>
                                            <td className='border border-slate-600 p-1 text-center'>1</td>
                                            <td className='border border-slate-600 p-1 text-center'>1</td>
                                            <td className='border border-slate-600 p-1 text-center'>1</td>
                                        </tr>
                                    </tbody>
                                </table> */}

                                <DataTableVIew tbl_title={''} columns={columns} apiData={masterGridData} />
                            </div>

                        </div>
                    )}

                    {activeTab === 3 && (
                        <div className='h-full bg-blue-100 rounded-lg'>
                            {/*  Content for Tab 2  */}
                            <div className='bg-gray-500 text-white px-4 py-2'>
                                <p>Add Plan</p>
                            </div>

                            <div className='p-4'>
                                <AuditPlan/>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
