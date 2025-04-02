import React, { useEffect, useState, useRef } from 'react';
import { DatePicker2, MonthYearPicker } from '../components';
import { Load_PlanData_Service, Insert_PlanData_Service, Update_PlanData_Service } from '../services/AuditPlanService';
import moment from 'moment';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DatePicker from "react-datepicker";
import { LiaSun } from "react-icons/lia";
import { TiTick } from "react-icons/ti";
import "react-datepicker/dist/react-datepicker.css";
// css properties
const label_css = 'block mb-2 text-sm font-medium text-gray-900 dark:text-white';
const input_css = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';





export const AuditPlan = () => {


    const pdfRef = useRef();
    const [planData, setPlanData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    const [date1, setDate1] = useState(new Date());
    // const [date2, setDate2] = useState(new Date());
    // const [date3, setDate3] = useState(new Date());
    // const [date4, setDate4] = useState(new Date());

    const [actual1, setActual1] = useState(new Date());
    const [actual2, setActual2] = useState(new Date());
    const [actual3, setActual3] = useState(new Date());
    const [actual4, setActual4] = useState(new Date());

    const [processApi, setProcessApi] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false); // Track Form submission state
    const [isLoading, setIsLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(true);

    // const currYear4 = moment().format('YYYY'); // Last two digits of the current year
    // const pastYear4 = moment().subtract(1, 'year').format('YYYY'); // Last two digits of the past year
    const [pastYear4, setPastYear4] = useState("");
    const [currYear4, setCurrYear4] = useState("");

    // const currentYear = moment().format('YY'); // Last two digits of the current year
    // const pastYear = moment().subtract(1, 'year').format('YY'); // Last two digits of the past year

    const [currentYear, setCurrentYear] = useState("");
    const [pastYear, setPastYear] = useState("");



    function getFinancialYear(date = new Date(), startMonth = 4) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1; // Months are 0-indexed

        if (month < startMonth) {
            setPastYear4(year - 1)
            setCurrYear4(year);



            // console.log(`1 :- ${year - 1} -${year}`)
            // return `${year - 1}-${year}`;
        } else {

            setPastYear4(year)
            setCurrYear4(year + 1);



            // console.log(`2 :- ${year} -${year + 1}`)
            // return `${year}-${year + 1}`;
        }


    }

    function getFinancialYearYY(date = new Date(), startMonth = 4) {

        console.log("function called !!")

        let year = date.getFullYear();
        let month = date.getMonth() + 1; // Months are 0-indexed

        if (month < startMonth) {
            setPastYear(year - 1)
            setCurrentYear(year);
            // console.log(`1 :- ${year - 1} -${year}`)
            // return `${year - 1}-${year}`;
        } else {

            setPastYear(year)
            setCurrentYear(year + 1);
            // console.log(`2 :- ${year} -${year + 1}`)
            // return `${year}-${year + 1}`;
        }



        // return `${startYear % 100}-${endYear % 100}`;
    }



    const [modal_P, setModal_P] = useState({
        visible: false,
        row: null,
        col: null,
        x: 0,
        y: 0,
    });

    const [modal_A, setModal_A] = useState({
        visible: false,
        row: null,
        col: null,
        x: 0,
        y: 0,
    });

    const P_statuses = ["None", "Schedule"];
    const A_statuses = ["None", "Rescheduled", "Not Done", "Completed"];
    const [completedDate, setCompletedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(new Date());

    // console.log('planData :', planData);
    // console.log('selectedMonth :', selectedMonth);
    // console.log('selectedYear :', selectedYear);

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
        // setPlanData((prev) => ({
        //     ...prev,
        //     date1: moment(date1).format("MMM/YYYY"),

        //     // date2: moment(date2).format("MMM/YYYY"),
        //     // date3: moment(date3).format("MMM/YYYY"),
        //     // date4: moment(date4).format("MMM/YYYY"),
        //     actual1: moment(actual1).format("DD-MM-YYYY"),
        //     actual2: moment(actual2).format("DD-MM-YYYY"),
        //     actual3: moment(actual3).format("DD-MM-YYYY"),
        //     actual4: moment(actual4).format("DD-MM-YYYY"),

        // }));

        setSelectedMonth(moment(date1).format("MMMM"));
        setSelectedYear(moment(date1).format("YY"))
    }, [date1, actual1, actual2, actual3, actual4]);


    const load_PlanData = async () => {
        try {
            const result = await Load_PlanData_Service();
            console.log('result', result)
            if (result.success) {

                setPlanData(result.data);

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
        load_PlanData();
        getFinancialYear();
        // getFinancialYearYY();
    }, []);

    console.log('pastYear2 :', pastYear);
    console.log('currentYear2 :', currentYear);

    const handle_FormSubmit = async (e) => {
        e.preventDefault();
        console.log('planData', planData);

        try {
            if (isEdit) { // update
                const result = await Update_PlanData_Service(planData);
                console.log('result :', result);
                if (result) {
                    setPlanData([]);

                    load_PlanData();
                }

            }
        } catch (error) {

        }

    }


    const handleRightClick_P = (e, row, col) => {
        e.preventDefault();
        setModal_P({
            visible: true,
            row,
            col,
            x: e.clientX,
            y: e.clientY,
        });
    };

    const handleRightClick_A = (e, row, col) => {
        e.preventDefault();
        setModal_A({
            visible: true,
            row,
            col,
            x: e.clientX,
            y: e.clientY,
        });
    };

    const handleOptionClick_P = (status) => {

        console.log('status :', status);
        console.log('modal.col :', modal_P.col);

        const updatedData = [...planData];
        updatedData[modal_P.row][modal_P.col] = status !== 'None' ? status : '';
        setPlanData(updatedData);
        setModal_P({ ...modal_P, visible: false });
    };

    const handleOptionClick_A = (status) => {

        console.log('status :', status);
        console.log('modal.col :', modal_A.col);

        const updatedData = [...planData];

        if (status === 'Completed') {
            setShowDatePicker(true); // Show date picker

        } else {
            setShowDatePicker(false);
            updatedData[modal_A.row][modal_A.col] = status !== 'None' ? status : '';
            setPlanData(updatedData);
            setModal_A({ ...modal_A, visible: false });
        }

    };

    useEffect(() => {




    }, [completedDate]);


    const handle_CompleteDate = (completedDate) => {
        console.log('modal.col :', modal_A.col);
        console.log('Selected Date:', completedDate); // Debugging


        if (completedDate) {
            const selectedDate = moment(completedDate).format("DD-MM-YYYY"); // Format selected date
            const updatedData = [...planData];
            updatedData[modal_A.row][modal_A.col] = `Completed - ${selectedDate}`;
            setPlanData(updatedData);
        }

        setShowDatePicker(false);
        setModal_A({ ...modal_A, visible: false });
    }


    const downloadPDF = () => {
        const input = pdfRef.current;
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("l", "mm", "a4"); // "l" for landscape
            const imgWidth = 297; // A4 Landscape width
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save(`AuditPlan_${pastYear4}-${currYear4}.pdf`);
        });
    };


    return (
        <div className=''>
            <form onSubmit={handle_FormSubmit}>
                <div className=' p-6' ref={pdfRef}>
                    <div className=' grid grid-cols-1 '>

                        <div className=' text-center'>
                            <span className='text-md font-bold'>ANNUAL AUDIT PLAN - IATF 16949 : 2016</span><br></br>
                            <span className='text-md font-bold'>Period - {pastYear4} - {currYear4}</span>
                        </div>
                        <div>

                        </div>

                    </div>
                    <div className='w-full overflow-x-auto  overflow-y-auto mt-1'>

                        <table border="1" style={{ width: '100%', borderCollapse: "collapse", textAlign: "center", font: '', fontSize: '12px' }} >
                            <colgroup>
                                {/* Three new columns */}
                                <col style={{ width: "2%" }} />
                                <col style={{ width: "25%" }} />
                                <col style={{ width: "10%" }} />


                                {/* <col style={{ width: "20%" }} />
                            <col style={{ width: "17.5%" }} />
                            <col style={{ width: "17.5%" }} />

                            <col style={{ width: "20%" }} />
                            <col style={{ width: "17.5%" }} />
                            <col style={{ width: "17.5%" }} />

                            <col style={{ width: "20%" }} />
                            <col style={{ width: "17.5%" }} />
                            <col style={{ width: "17.5%" }} />

                            <col style={{ width: "20%" }} />
                            <col style={{ width: "17.5%" }} />
                            <col style={{ width: "17.5%" }} />

                            <col style={{ width: "20%" }} />
                            <col style={{ width: "17.5%" }} />
                            <col style={{ width: "17.5%" }} />

                            <col style={{ width: "20%" }} />
                            <col style={{ width: "17.5%" }} />
                            <col style={{ width: "17.5%" }} />

                            <col style={{ width: "20%" }} />
                            <col style={{ width: "17.5%" }} />
                            <col style={{ width: "17.5%" }} /> */}
                            </colgroup>
                            <thead className=' bg-indigo-400 text-white p-2'>


                                <tr >
                                    <th rowSpan={2} className='border border-l p-2'>#</th>
                                    <th rowSpan={2} className='border border-l p-2'>Process</th>
                                    <th rowSpan={2} className='border border-l p-2'>Frequency</th>

                                    <th colSpan={2} className='border-t p-2'>Apr' {pastYear4 % 100}</th>

                                    <th colSpan={2} className='border-l border-t p-2'>May' {pastYear4 % 100}</th>

                                    <th colSpan={2} className='border-l  border-t p-2'>Jun' {pastYear4 % 100}</th>

                                    <th colSpan={2} className='border-l  border-t p-2'>Jul' {pastYear4 % 100}</th>
                                    <th colSpan={2} className='border-l  border-t p-2'>Aug' {pastYear4 % 100}</th>
                                    <th colSpan={2} className='border-l  border-t p-2'>Sep' {pastYear4 % 100}</th>
                                    <th colSpan={2} className='border-l  border-t p-2'>Oct' {pastYear4 % 100}</th>
                                    <th colSpan={2} className='border-l  border-t p-2'>Nov' {pastYear4 % 100}</th>
                                    <th colSpan={2} className='border-l  border-t p-2'>Dec' {pastYear4 % 100}</th>
                                    <th colSpan={2} className='border-l  border-t p-2'>Jan' {currYear4 % 100}</th>
                                    <th colSpan={2} className='border-l  border-t p-2'>Feb' {currYear4 % 100}</th>
                                    <th colSpan={2} className='border-l  border-t p-2'>Mar' {currYear4 % 100}</th>
                                </tr>




                                <tr>
                                    <th className='  border border-r p-2  text-yellow-200'>P</th>
                                    <th className='  border border-r p-2 text-green-300'>A</th>

                                    <th className='border border-r p-2  text-yellow-200'>P</th>
                                    <th className='w-96 border border-r p-2 text-green-300'>A</th>

                                    <th className='border border-r p-2  text-yellow-200'>P</th>
                                    <th className='border border-r p-2 text-green-300'>A</th>

                                    <th className='border border-r p-2  text-yellow-200'>P</th>
                                    <th className='border border-r p-2 text-green-300'>A</th>

                                    <th className='border border-r p-2  text-yellow-200'>P</th>
                                    <th className='border border-r p-2 text-green-300'>A</th>
                                    <th className='border border-r p-2  text-yellow-200'>P</th>
                                    <th className='border border-r p-2 text-green-300'>A</th>

                                    <th className='border border-r p-2  text-yellow-200'>P</th>
                                    <th className='border border-r p-2 text-green-300'>A</th>

                                    <th className='border border-r p-2  text-yellow-200'>P</th>
                                    <th className='border border-r p-2 text-green-300'>A</th>

                                    <th className='border border-r p-2  text-yellow-200'>P</th>
                                    <th className='border border-r p-2 text-green-300'>A</th>

                                    <th className='border border-r p-2  text-yellow-200'>P</th>
                                    <th className='border border-r p-2 text-green-300'>A</th>

                                    <th className='border border-r p-2  text-yellow-200'>P</th>
                                    <th className='border border-r p-2 text-green-300'>A</th>

                                    <th className='border border-r p-2  text-yellow-200'>P</th>
                                    <th className='border border-r p-2 text-green-300'>A</th>

                                </tr>
                            </thead>
                            <tbody>

                                {planData && planData.map((item, index) => (

                                    <tr className='border border-gray-300 p-2' key={index}>


                                        <td>{index + 1}</td>
                                        <td className='  text-pretty p-2 text-left'>{item.Process}</td>
                                        <td>{item.Frequency}</td>


                                        <td className=' bg-blue-500  p-2  ' onContextMenu={(e) => handleRightClick_P(e, index, 'P1')}>
                                            {
                                                item.P1 === 'Schedule' ? <span className='flex flex-col items-center hover:cursor-pointer'><LiaSun className='' /></span> : ''
                                                // item.P1 === 'Completed' ? <span className='flex flex-col items-center hover:cursor-pointer'><TiTick className='hover:cursor-pointer' /></span> :
                                                //     item.P1 === 'Rescheduled' ? <span className='flex flex-col items-center hover:cursor-pointer'> RS</span> :
                                                //         item.P1 === 'Postponed' ? <span className='flex flex-col items-center hover:cursor-pointer'> PP</span> : ""

                                            }
                                        </td>

                                        <td
                                            className={`text-nowrap p-2 text-black ${item.A1?.startsWith("Completed") ? 'bg-green-400' :
                                                item.A1 === "Not Done" ? 'bg-red-400' :
                                                    item.A1 === 'Rescheduled' ? 'bg-yellow-400' : ''
                                                }`}
                                            onContextMenu={(e) => handleRightClick_A(e, index, 'A1')}
                                        >
                                            {item.A1 !== '' ? item.A1 : ''}
                                        </td>

                                        {/* P2 A2 */}
                                        <td className=' bg-blue-500  p-2  ' onContextMenu={(e) => handleRightClick_P(e, index, 'P2')}>
                                            {
                                                item.P2 === 'Schedule' ? <span className='flex flex-col items-center hover:cursor-pointer'><LiaSun className='' /></span> : ''
                                            }
                                        </td>

                                        <td
                                            className={` p-2 text-black ${item.A2?.startsWith("Completed") ? 'bg-green-400' :
                                                item.A2 === "Not Done" ? 'bg-red-400' :
                                                    item.A2 === 'Rescheduled' ? 'bg-yellow-400' : ''
                                                }`}
                                            onContextMenu={(e) => handleRightClick_A(e, index, 'A2')}
                                        >
                                            {item.A2 !== '' ? item.A2 : ''}
                                        </td>


                                        {/* P3 A3 */}
                                        <td className=' bg-blue-500  p-2  ' onContextMenu={(e) => handleRightClick_P(e, index, 'P3')}>
                                            {
                                                item.P3 === 'Schedule' ? <span className='flex flex-col items-center hover:cursor-pointer'><LiaSun className='' /></span> : ''
                                            }
                                        </td>

                                        <td
                                            className={`text-nowrap p-2 text-black ${item.A3?.startsWith("Completed") ? 'bg-green-400' :
                                                item.A3 === "Not Done" ? 'bg-red-400' :
                                                    item.A3 === 'Rescheduled' ? 'bg-yellow-400' : ''
                                                }`}
                                            onContextMenu={(e) => handleRightClick_A(e, index, 'A3')}
                                        >
                                            {item.A3 !== '' ? item.A3 : ''}
                                        </td>

                                        {/* P4 A4 */}
                                        <td className=' bg-blue-500  p-2  ' onContextMenu={(e) => handleRightClick_P(e, index, 'P4')}>
                                            {
                                                item.P4 === 'Schedule' ? <span className='flex flex-col items-center hover:cursor-pointer'><LiaSun className='' /></span> : ''
                                            }
                                        </td>

                                        <td
                                            className={`  p-2 text-black ${item.A4?.startsWith("Completed") ? 'bg-green-400' :
                                                item.A4 === "Not Done" ? 'bg-red-400' :
                                                    item.A4 === 'Rescheduled' ? 'bg-yellow-400' : ''
                                                }`}
                                            onContextMenu={(e) => handleRightClick_A(e, index, 'A4')}
                                        >
                                            {item.A4 !== '' ? item.A4 : ''}
                                        </td>

                                        {/* P5 A5 */}
                                        <td className=' bg-blue-500  p-2  ' onContextMenu={(e) => handleRightClick_P(e, index, 'P5')}>
                                            {
                                                item.P5 === 'Schedule' ? <span className='flex flex-col items-center hover:cursor-pointer'><LiaSun className='' /></span> : ''
                                            }
                                        </td>

                                        <td
                                            className={`  p-2 text-black ${item.A5?.startsWith("Completed") ? 'bg-green-400' :
                                                item.A5 === "Not Done" ? 'bg-red-400' :
                                                    item.A5 === 'Rescheduled' ? 'bg-yellow-400' : ''
                                                }`}
                                            onContextMenu={(e) => handleRightClick_A(e, index, 'A5')}
                                        >
                                            {item.A5 !== '' ? item.A5 : ''}
                                        </td>

                                        {/* P6 A6 */}
                                        <td className=' bg-blue-500  p-2  ' onContextMenu={(e) => handleRightClick_P(e, index, 'P6')}>
                                            {
                                                item.P6 === 'Schedule' ? <span className='flex flex-col items-center hover:cursor-pointer'><LiaSun className='' /></span> : ''
                                            }
                                        </td>

                                        <td
                                            className={`  p-2 text-black ${item.A6?.startsWith("Completed") ? 'bg-green-400' :
                                                item.A6 === "Not Done" ? 'bg-red-400' :
                                                    item.A6 === 'Rescheduled' ? 'bg-yellow-400' : ''
                                                }`}
                                            onContextMenu={(e) => handleRightClick_A(e, index, 'A6')}
                                        >
                                            {item.A6 !== '' ? item.A6 : ''}
                                        </td>

                                        {/* P7 A7 */}
                                        <td className=' bg-blue-500  p-2  ' onContextMenu={(e) => handleRightClick_P(e, index, 'P7')}>
                                            {
                                                item.P7 === 'Schedule' ? <span className='flex flex-col items-center hover:cursor-pointer'><LiaSun className='' /></span> : ''
                                            }
                                        </td>

                                        <td
                                            className={`  p-2 text-black ${item.A7?.startsWith("Completed") ? 'bg-green-400' :
                                                item.A7 === "Not Done" ? 'bg-red-400' :
                                                    item.A7 === 'Rescheduled' ? 'bg-yellow-400' : ''
                                                }`}
                                            onContextMenu={(e) => handleRightClick_A(e, index, 'A7')}
                                        >
                                            {item.A7 !== '' ? item.A7 : ''}
                                        </td>

                                        {/* P8 A8 */}
                                        <td className=' bg-blue-500  p-2  ' onContextMenu={(e) => handleRightClick_P(e, index, 'P8')}>
                                            {
                                                item.P8 === 'Schedule' ? <span className='flex flex-col items-center hover:cursor-pointer'><LiaSun className='' /></span> : ''
                                            }
                                        </td>

                                        <td
                                            className={`  p-2 text-black ${item.A8?.startsWith("Completed") ? 'bg-green-400' :
                                                item.A8 === "Not Done" ? 'bg-red-400' :
                                                    item.A8 === 'Rescheduled' ? 'bg-yellow-400' : ''
                                                }`}
                                            onContextMenu={(e) => handleRightClick_A(e, index, 'A8')}
                                        >
                                            {item.A8 !== '' ? item.A8 : ''}
                                        </td>


                                        {/* P9 A9 */}
                                        <td className=' bg-blue-500  p-2  ' onContextMenu={(e) => handleRightClick_P(e, index, 'P9')}>
                                            {
                                                item.P9 === 'Schedule' ? <span className='flex flex-col items-center hover:cursor-pointer'><LiaSun className='' /></span> : ''
                                            }
                                        </td>

                                        <td
                                            className={`  p-2 text-black ${item.A9?.startsWith("Completed") ? 'bg-green-400' :
                                                item.A9 === "Not Done" ? 'bg-red-400' :
                                                    item.A9 === 'Rescheduled' ? 'bg-yellow-400' : ''
                                                }`}
                                            onContextMenu={(e) => handleRightClick_A(e, index, 'A9')}
                                        >
                                            {item.A9 !== '' ? item.A9 : ''}
                                        </td>

                                        {/* P10 A10 */}
                                        <td className=' bg-blue-500  p-2  ' onContextMenu={(e) => handleRightClick_P(e, index, 'P10')}>
                                            {
                                                item.P10 === 'Schedule' ? <span className='flex flex-col items-center hover:cursor-pointer'><LiaSun className='' /></span> : ''
                                            }
                                        </td>

                                        <td
                                            className={`  p-2 text-black ${item.A10?.startsWith("Completed") ? 'bg-green-400' :
                                                item.A10 === "Not Done" ? 'bg-red-400' :
                                                    item.A10 === 'Rescheduled' ? 'bg-yellow-400' : ''
                                                }`}
                                            onContextMenu={(e) => handleRightClick_A(e, index, 'A10')}
                                        >
                                            {item.A10 !== '' ? item.A10 : ''}
                                        </td>

                                        {/* P11 A11 */}
                                        <td className=' bg-blue-500  p-2  ' onContextMenu={(e) => handleRightClick_P(e, index, 'P11')}>
                                            {
                                                item.P11 === 'Schedule' ? <span className='flex flex-col items-center hover:cursor-pointer'><LiaSun className='' /></span> : ''
                                            }
                                        </td>

                                        <td
                                            className={`  p-2 text-black ${item.A11?.startsWith("Completed") ? 'bg-green-400' :
                                                item.A11 === "Not Done" ? 'bg-red-400' :
                                                    item.A11 === 'Rescheduled' ? 'bg-yellow-400' : ''
                                                }`}
                                            onContextMenu={(e) => handleRightClick_A(e, index, 'A11')}
                                        >
                                            {item.A11 !== '' ? item.A11 : ''}
                                        </td>

                                        {/* P12 A12 */}
                                        <td className=' bg-blue-500  p-2  ' onContextMenu={(e) => handleRightClick_P(e, index, 'P12')}>
                                            {
                                                item.P12 === 'Schedule' ? <span className='flex flex-col items-center hover:cursor-pointer'><LiaSun className='' /></span> : ''
                                            }
                                        </td>

                                        <td
                                            className={` p-2 text-black ${item.A12?.startsWith("Completed") ? 'bg-green-400' :
                                                item.A12 === "Not Done" ? 'bg-red-400' :
                                                    item.A12 === 'Rescheduled' ? 'bg-yellow-400' : ''
                                                }`}
                                            onContextMenu={(e) => handleRightClick_A(e, index, 'A12')}
                                        >
                                            {item.A12 !== '' ? item.A12 : ''}
                                        </td>

                                        {/* <td className='p-2 bg-blue-500 '
                                        
                                        onContextMenu={(e) => handleRightClick_P(e, index, 'P2')}>
                                        {
                                            item.P1 === 'Schedule' ? <span className='flex flex-col items-center hover:cursor-pointer'><LiaSun className='' /></span> : ''
                                        }
                                    </td>
                                    <td className='text-nowrap p-2 bg-green-300' onContextMenu={(e) => handleRightClick_A(e, index, 'A2')}>{item.A2 !== '' ? item.A2 : ''}</td>
 */}



                                        {/* <td className='p-2 bg-yellow-400'>{item.Month === 'June' ? <LiaSun /> : ''}</td>
                                    <td className='text-nowrap p-2 bg-green-300'>{item.Month === 'June' ? item.Actual : ''}</td>


                                    <td className='p-2 bg-yellow-400'>{item.Month === 'July' ? <LiaSun /> : ''}</td>
                                    <td className='text-nowrap p-2 bg-green-300'>{item.Month === 'July' ? item.Actual : ''}</td>


                                    <td className='p-2 bg-yellow-400'>{item.Month === 'August' ? <LiaSun /> : ''}</td>
                                    <td className='text-nowrap p-2 bg-green-300'>{item.Month === 'August' ? item.Actual : ''}</td>


                                    <td className='p-2 bg-yellow-400'>{item.Month === 'September' ? <LiaSun /> : ''}</td>
                                    <td className='text-nowrap p-2 bg-green-300'>{item.Month === 'September' ? item.Actual : ''}</td>


                                    <td className='p-2 bg-yellow-400'>{item.Month === 'October' ? <LiaSun /> : ''}</td>
                                    <td className='text-nowrap p-2 bg-green-300'>{item.Month === 'October' ? item.Actual : ''}</td>


                                    <td className='p-2 bg-yellow-400'>{item.Month === 'November' ? <LiaSun /> : ''}</td>
                                    <td className='text-nowrap p-2 bg-green-300'>{item.Month === 'November' ? item.Actual : ''}</td>


                                    <td className='p-2 bg-yellow-400'>{item.Month === 'December' ? <LiaSun /> : ''}</td>
                                    <td className='text-nowrap p-2 bg-green-300'>{item.Month === 'December' ? item.Actual : ''}</td>


                                    <td className='p-2 bg-yellow-400'>{item.Month === 'January' ? <LiaSun /> : ''}</td>
                                    <td className='text-nowrap p-2 bg-green-300'>{item.Month === 'January' ? item.Actual : ''}</td>


                                    <td className='p-2 bg-yellow-400'>{item.Month === 'February' ? <LiaSun /> : ''}</td>
                                    <td className='text-nowrap p-2 bg-green-300'>{item.Month === 'February' ? item.Actual : ''}</td>


                                    <td className='p-2 bg-yellow-400'>{item.Month === 'March' ? <LiaSun /> : ''}</td>
                                    <td className='text-nowrap p-2 bg-green-300'>{item.Month === 'March' ? item.Actual : ''}</td> */}

                                    </tr>
                                ))}


                            </tbody>
                        </table>


                        <div className='  text-left items-center mt-4'>
                            <span className='flex text-nowrap text-center items-center mb-4 text-md '>{<LiaSun className='mr-2' />}   -  Schedule</span>
                            <span>The Corrective & Preventive action process and Continual improvement process are audited as a part of processes(S.No. 01 to {planData.length}) above.</span>
                        </div>

                        <div className='mt-2'>
                            <b>NOTE :</b>
                            <p>1. Actual Audit schedules will be intimated through Internal note prior to Audit</p>
                            <p>2. Areas to be  audited will be finalised based on status of importance.</p>
                            <p>3. Every month  audit will be conducted as per Annual Audit Plan and results will be reviewed in the Management review</p>
                        </div>

                        <div className='mt-16'>
                            {/* <p>D.Ganesh</p>
                            <p>Unit Head</p>
                            <p>Puducherry</p> */}
                            <p>UMR/CMR</p>
                            <span>CC to : FH's -    MKT / MAT / PROD. / PED / MAINT. / QA / HRD</span>
                        </div>

                        <span>CMR / FR / 006</span>




                    </div>

                </div>
                <div className='   text-center mt-4'>
                    <button type="submit"
                        disabled={isSubmitting}
                        className={` ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'} ${!isEdit ? 'bg-green-800 hover:bg-green-700 text-white' : 'bg-yellow-400 hover:bg-yellow-300 text-black'} w-1/2 mt-2  p-3  rounded-lg `} id="btn_Save" name="btn_Save" >{!isEdit ? "Save" : "Update"}
                    </button>

                    <button onClick={downloadPDF} className='bg-green-600 text-white   p-3  rounded-lg ml-8'>
                        Export
                    </button>
                </div>
            </form>

            {/* Modal - P */}
            {modal_P.visible && (
                <div
                    style={{
                        position: "absolute",
                        width: '150px',
                        top: modal_P.y,
                        left: modal_P.x,
                        background: "white",
                        border: "1px solid black",
                        padding: "5px",
                        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                        zIndex: 1000,
                    }}
                >

                    {P_statuses.map((status) => (
                        <div
                            key={status}
                            style={{
                                padding: "5px",
                                cursor: "pointer",
                                borderBottom: "1px solid gray",
                            }}
                            onClick={() => handleOptionClick_P(status)}
                        >
                            {status}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal - A */}

            {modal_A.visible && (
                <div
                    style={{
                        position: "absolute",
                        width: '150px',
                        top: modal_A.y,
                        left: modal_A.x,
                        background: "white",
                        border: "1px solid black",
                        padding: "5px",
                        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                        zIndex: 1000,
                    }}
                >

                    {A_statuses.map((status, i) => (
                        <div
                            key={status}
                            style={{
                                padding: "5px",
                                cursor: "pointer",
                                borderBottom: "1px solid gray",
                            }}
                            onClick={() => handleOptionClick_A(status)}
                        >
                            {status}
                        </div>
                    ))}

                    {showDatePicker && (
                        <div className=''>

                            <div className='flex flex-col items-center'>
                                <DatePicker2 title="" date={completedDate} setDate={setCompletedDate} widthClass={''} />
                                {/* <DatePicker
                                    date={completedDate}
                                    onChange={(date) => setCompletedDate(date)}
                                /> */}
                                <button onClick={() => handle_CompleteDate(completedDate)}
                                    className='bg-green-600 text-white px-2 mt-2  rounded-md'
                                >Confirm</button>
                            </div>

                        </div>
                    )}
                </div>
            )}







        </div >




    )
}
