import React, { useEffect, useState } from 'react';
import { DatePicker2, MonthYearPicker } from '../components';
import { Load_Process_Service, Insert_PlanData_Service } from '../services/AuditPlanService';
import moment from 'moment';
// css properties
const label_css = 'block mb-2 text-sm font-medium text-gray-900 dark:text-white';
const input_css = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';

export const AuditPlan = () => {

    const initial_value = {
        Process: '',
        Frequency: '',

        date1: '',
        date2: '',
        date3: '',
        date4: '',

        plan1: 0,  // Default to 0 , unchecked
        plan2: 0,
        plan3: 0,
        plan4: 0,

        actual1: '',
        actual2: '',
        actual3: '',
        actual4: ''
    }

    const [planData, setPlanData] = useState(initial_value);

    const [date1, setDate1] = useState(new Date());
    const [date2, setDate2] = useState(new Date());
    const [date3, setDate3] = useState(new Date());
    const [date4, setDate4] = useState(new Date());

    const [actual1, setActual1] = useState(new Date());
    const [actual2, setActual2] = useState(new Date());
    const [actual3, setActual3] = useState(new Date());
    const [actual4, setActual4] = useState(new Date());

    const [processApi, setProcessApi] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false); // Track Form submission state
    const [isLoading, setIsLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const plan_handleChange = (e) => {
        const { name, value } = e.target;
        console.log('name :', name)
        console.log('value :', value)

        setPlanData((prev) => ({
            ...prev,
            [name]: value
        }));

        if (name === 'Process') {
            get_ProcessFreq(value);
        }
    };

    const get_ProcessFreq = (process) => {
        const matchedProcess = processApi.find(item => item.Process === process);
        if (matchedProcess) {
            console.log('Frequency:', matchedProcess.Frequency);
            setPlanData((prev) => ({
                ...prev,
                Frequency: matchedProcess.Frequency  // Update Frequency in planData
            }));
        }
    }

    console.log('planData :', planData);

    const checkbox_handleChange = (e) => {
        const { name, checked } = e.target;  // Use checked instead of value
        console.log('name :', name)
        console.log('checked :', checked)

        setPlanData((prev) => ({
            ...prev,
            [name]: checked ? 1 : 0   // Set to 1 when checked, 0 when unchecked
        }));
    };

    useEffect(() => {
        setPlanData((prev) => ({
            ...prev,
            date1: moment(date1).format("MMM/YYYY"),
            date2: moment(date2).format("MMM/YYYY"),
            date3: moment(date3).format("MMM/YYYY"),
            date4: moment(date4).format("MMM/YYYY"),
            actual1: moment(actual1).format("DD-MM-YYYY"),
            actual2: moment(actual2).format("DD-MM-YYYY"),
            actual3: moment(actual3).format("DD-MM-YYYY"),
            actual4: moment(actual4).format("DD-MM-YYYY"),

        }));

    }, [date1, date2, date3, date4, actual1, actual2, actual3, actual4]);


    const load_Process = async () => {
        try {
            const result = await Load_Process_Service();
            console.log('result', result)
            if (result.success) {

                setProcessApi(result.data);

                // Extract only 'Process' values
                //     const processNames = result.data.map(item => item.Process);
                //     setProcess(processNames);

            }
        } catch (error) {
            console.log('Error in load_Process', error);
        }
    }

    console.log('processApi', processApi);


    useEffect(() => {
        load_Process();
    }, []);

    const handle_FormSubmit = async (e) => {
        e.preventDefault();
        console.log('planData', planData);

        try {
            if (!isEdit) { // save
                const result = await Insert_PlanData_Service(planData);
                console.log('result :', result);
                if (result.data.success) {
                    setPlanData(initial_value);
                }

            } else if (isEdit) {  // update

            }
        } catch (error) {

        }

    }

    return (
        <div>
            <form onSubmit={handle_FormSubmit}>

                <div className='grid grid-cols-4 gap-4'>
                    <div>
                        <label htmlFor='Process' className={label_css}>QMS Processes</label>
                        <select
                            id="Process"
                            name="Process"
                            onChange={plan_handleChange}
                            value={planData.Process || ""}
                            required
                            className={`${input_css}`}
                        >
                            <option value="">-- Select --</option>
                            {processApi && processApi.map((item, index) => (
                                <option key={index} value={item.Process}>{item.Process}</option>
                            )


                            )}

                        </select>
                    </div>

                    <div>
                        <label htmlFor='Frequency' className={label_css}>Frequency</label>
                        <input type="text"
                            id="Frequency"
                            name="Frequency"
                            // onChange={plan_handleChange}
                            value={planData.Frequency || ""}
                            required
                            className={`${input_css} w-1/2`}
                        />
                        {/* <select
                            id="Frequency"
                            name="Frequency"
                            onChange={plan_handleChange}
                            value={planData.Frequency || ""}
                            required
                            className={`${input_css}`}
                        >
                            <option value="">-- Select --</option>
                            <option value="1 month">1 month</option>
                            <option value="2 months">2 months</option>
                            <option value="3 months">3 months</option>
                        </select> */}
                    </div>
                </div>

                <div className='border-2 border-gray-400 p-2'>
                    {/* <label htmlFor='Frequency' className={label_css}>Month/Year</label> */}
                    <MonthYearPicker title="Plan - 1" date={date1} setDate={setDate1} />
                    <div className='flex gap-4 justify-center mt-2 '>
                        <div className='flex flex-col ml-2 '>
                            <label className={label_css}>Plan</label>
                            <input
                                type="checkbox"
                                id="plan1"
                                name="plan1"
                                checked={planData.plan1 === 1}  // Compare with 1 (number)
                                onChange={checkbox_handleChange}

                            />
                        </div>


                        <DatePicker2 title="Actual" date={actual1} setDate={setActual1} widthClass={''} />
                    </div>
                </div>


                <div className='grid grid-cols-6 gap-4 mt-4'>


                    <div className='border-2 border-gray-400 p-2'>
                        {/* <label htmlFor='Frequency' className={label_css}>Month/Year</label> */}
                        <MonthYearPicker title="Plan - 1" date={date1} setDate={setDate1} />
                        <div className='flex gap-4 justify-center mt-2 '>
                            <div className='flex flex-col ml-2 '>
                                <label className={label_css}>Plan</label>
                                <input
                                    type="checkbox"
                                    id="plan1"
                                    name="plan1"
                                    checked={planData.plan1 === 1}  // Compare with 1 (number)
                                    onChange={checkbox_handleChange}

                                />
                            </div>


                            <DatePicker2 title="Actual" date={actual1} setDate={setActual1} widthClass={''} />
                        </div>

                    </div>

                    <div className='border-2 border-gray-400 p-2'>
                        {/* <label htmlFor='Frequency' className={label_css}>Month/Year</label> */}
                        <MonthYearPicker title="Plan-2" date={date2} setDate={setDate2} />
                        <div className='flex gap-4 mt-2'>
                            <div className='flex flex-col ml-2'>
                                <label className={label_css}>Plan</label>
                                <input
                                    type="checkbox"
                                    id="plan2"
                                    name="plan2"
                                    checked={planData.plan2 === 1}  // Compare with 1 (number)
                                    onChange={checkbox_handleChange}

                                />
                            </div>


                            <DatePicker2 title="Actual" date={actual2} setDate={setActual2} widthClass={''} />
                        </div>


                    </div>

                    <div className='border-2 border-gray-400 p-2'>
                        {/* <label htmlFor='Frequency' className={label_css}>Month/Year</label> */}
                        <MonthYearPicker title="Plan-3" date={date3} setDate={setDate3} />
                        <div className='flex gap-2 mt-2'>
                            <div className='flex flex-col ml-2'>
                                <label className={label_css}>Plan</label>
                                <input
                                    type="checkbox"
                                    id="plan3"
                                    name="plan3"
                                    checked={planData.plan3 === 1}  // Compare with 1 (number)
                                    onChange={checkbox_handleChange}

                                />
                            </div>


                            <DatePicker2 title="Actual" date={actual3} setDate={setActual3} widthClass={''} />
                        </div>
                    </div>

                    <div className='border-2 border-gray-400 p-2'>
                        {/* <label htmlFor='Frequency' className={label_css}>Month/Year</label> */}
                        <MonthYearPicker title="Plan-4" date={date4} setDate={setDate4} />
                        <div className='flex gap-2 mt-2'>
                            <div className='flex flex-col ml-2'>
                                <label className={label_css}>Plan</label>
                                <input
                                    type="checkbox"
                                    id="plan4"
                                    name="plan4"
                                    checked={planData.plan4 === 1}  // Compare with 1 (number)
                                    onChange={checkbox_handleChange}

                                />
                            </div>

                            <DatePicker2 title="Actual" date={actual4} setDate={setActual4} widthClass={''} />
                        </div>


                    </div>


                </div>


                <div className='  text-center mt-4'>
                    <button type="submit"
                        disabled={isSubmitting}
                        className={` ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'} ${!isEdit ? 'bg-green-800 hover:bg-green-700 text-white' : 'bg-yellow-400 hover:bg-yellow-300 text-black'} w-1/2 mt-2  p-3  rounded-lg `} id="btn_Save" name="btn_Save" >{!isEdit ? "Save" : "Update"}
                    </button>

                </div>
            </form>
        </div>
    )
}
