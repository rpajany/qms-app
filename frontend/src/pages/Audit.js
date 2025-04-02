import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from "react-webcam";

import { Get_AuditUID_Service, Update_AuditUID_Service, AuditService, Load_AuditData_Service, Get_MasterList, Save_AuditService, Delete_AuditService } from '../services/AuditService';
import { ReactDateRangePicker, DataTableVIew, DatePicker2, SweetAlert_Delete, LoadSpinner } from '../components';
import { Load_Department_Service } from '../services/MasterService';
import moment from 'moment';
import { toast } from 'react-toastify';

import { TbFileExport } from "react-icons/tb";
import { LuView } from "react-icons/lu";
import { MdPreview } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";

// import { RadioButton } from '../components';
import { ModalConfirm } from './../components/ModalConfirm';

// css properties
const label_css = 'block mb-2 text-sm font-medium text-gray-900 dark:text-white';
const input_css = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';
const tbl_header = 'border border-slate-600  bg-gray-500 p-1';
const tbl_thead_tr = " text-white border-r-2  border-gray-300";
const tbl_thead_th = "px-6 py-2 border-r-2  border-gray-300";
const tbl_tbody_td = "border-r-2  border-gray-300 px-1";


export const Audit = () => {

  const navigate = useNavigate();


  const [date, setDate] = useState(new Date()); // date object   
  const [isSubmitting, setIsSubmitting] = useState(false); // Track Form submission state
  const [isLoading, setIsLoading] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [auditData, setAuditData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [htmlEdit, setHtmlEdit] = useState(false);


  const lastYear = moment().subtract(1, 'year').format('YY'); // Last 2 digits of last year
  const currentYear = moment().format('YY'); // Last 2 digits of current year
  const auditYear = lastYear + "-" + currentYear;

  const auditDetail_InitialValue = {
    id: '',
    Audit_UID: '',
    AuditNo: 'Q122',
    Year: auditYear, //'24-25',
    Doc_No: 'CMR/FR/007',
    Rev_No: '01',
    Rev_Date: '',
    Auditor: '',
    // RefNo: '',
    Department: '',
    Auditee: '',
    Process: '',
    Audit_Date: moment(date).format('DD-MM-YYYY'),
    Shift: '',
    Plant: '',
    Status: 'PENDING',
    ReviewedBy: ''
  }

  const [auditDetail, setAuditDetail] = useState(auditDetail_InitialValue);

  // const staus_Array = ['O+', 'OI', 'NC'];
  // const [statusOption, setStatusOption] = useState(staus_Array);

  const [dateRangeNow, setDateRangeNow] = useState({});
  // const [gridData, setGridData] = useState([{ id: 1, name: 'This is a very long text that might be truncated..erwqewqeqweqweqweqwe weqweqwew qweqweqwe', age: 20 }]); // []
  const [gridData, setGridData] = useState([]); // []
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [activeItemId, setActiveItemId] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const webcamRef = useRef(null);


  // load Department data ...
  const Load_Department = async () => {
    const result_0 = await Load_Department_Service();
    console.log('Load_Department :', result_0)
    setDepartmentData(result_0);
  }

  useEffect(() => {
    const fetchData = async () => {
      await Load_Department();
    }

    fetchData();

  }, []);


  const auditData_handleChange = (e, item) => {
    const { name, value, files } = e.target;
    const updatedList = auditData.map((current) => {
      if (current.id === item.id) {
        if (name === 'Files') {
          // Handle multiple files
          return {
            ...current,
            //Files: Array.from(files), // Store the selected files as an array
            Files: [...(current.Files || []), ...Array.from(files)],
          };
        } else if (name === 'Observation') {
          return {
            ...current,
            [name]: value, // Handle other fields like Observation
          };
        }

      }
      return current;
    });

    setAuditData(updatedList);
  };


  const handle_CheckboxChange = (e, item) => {
    const { name, value } = e.target;

    console.log('item.id', item.id)
    // const updatedAuditData = auditData.map((current) => {
    //   if (current.id === item.id) {
    //     return {
    //       ...current,
    //       [name]: value,  
    //     };
    //   }
    //   return current; // Return the item unchanged if it's not the one being updated
    // });

    const updatedAuditData = auditData.map((current) =>
      current.id === item.id
        ? { ...current, [name]: value } // Update only the status field for the matching item
        : current // Leave other items unchanged
    );
    setAuditData(updatedAuditData);
    // Use shallow copy to ensure React recognizes the state change
    // setAuditData([...updatedAuditData]);
  };

  // remove File from auditData
  const removeFile = (itemId, fileIndex) => {
    const updatedList = auditData.map((current) => {
      if (current.id === itemId) {
        const updatedFiles = current.Files.filter((_, index) => index !== fileIndex);
        return {
          ...current,
          Files: updatedFiles,
        };
      }
      return current;
    });

    setAuditData(updatedList);
  };


  const videoConstraints = {
    // width: 1280,
    // height: 720,
    width: 520,
    height: 500,
    //facingMode: "environment" // "user" /  {exact: "environment"} , { ideal: "environment"  }
    facingMode: { ideal: "environment" }

  };

  // add photo to audit Data
  const addImageToAuditData = (itemId, imageData) => {
    const updatedList = auditData.map((current) => {
      if (current.id === itemId) {
        return {
          ...current,
          Images: [...(current.Images || []), imageData],
        };
      }
      return current;
    });

    setAuditData(updatedList);

  };

  // Remove photo from audit Data
  const removeImageFromAuditData = (itemId, imageIndex) => {
    const updatedList = auditData.map((current) => {
      if (current.id === itemId) {
        const updatedImages = [...(current.Images || [])];
        updatedImages.splice(imageIndex, 1);
        return {
          ...current,
          Images: updatedImages,
        };
      }
      return current;
    });

    setAuditData(updatedList);
  };

  // open camera
  const startCamera = (itemId) => {
    setActiveItemId(itemId);
    setShowCamera(true);


    // navigator.mediaDevices.getUserMedia({ video: true })
    //   .then(stream =>
    //     // toast.success('Camera access granted')
    //     console.log("Camera access granted")
    //   )
    //   .catch(err =>
    //     // toast.error('Camera error')
    //     console.error("Camera error:", err)
    //   );


    // navigator.mediaDevices.enumerateDevices().then(devices => {
    //   // toast.success(devices)
    //   console.log(devices);
    // });

    // navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    //   .then(stream =>
    //     // toast.success('Back camera works!')
    //     console.log("Back camera works!")
    //   )
    //   .catch(err =>
    //     // toast.error('Back Camera error')
    //     console.error("Camera error:", err)
    //   );



    // navigator.mediaDevices
    //   .getUserMedia({ video: { width: 1280, height: 720 } }) // HD quality
    //   .then((stream) => {
    //     if (videoRef.current) {
    //       videoRef.current.srcObject = stream;
    //       videoRef.current.play();
    //     }
    //   })
    //   .catch((error) => {
    //     console.error('Camera error:', error);
    //   });

    setCapturedImage(null); // Reset captured image
  };

  // take photo
  const captureImage = () => {
    // if (canvasRef.current && videoRef.current) {
    //   const context = canvasRef.current.getContext('2d');
    //   canvasRef.current.width = 1280; // HD width
    //   canvasRef.current.height = 720; // HD height
    //   context.drawImage(videoRef.current, 0, 0, 1280, 720);
    //   // const imageData = canvasRef.current.toDataURL('image/png'); // Get image as base64
    //   const imageData = canvasRef.current.toDataURL('image/jpeg'); // Get image as base64
    //   setCapturedImage(imageData);
    //   addImageToAuditData(activeItemId, imageData);
    // }

    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      addImageToAuditData(activeItemId, imageSrc); // Add new image to audit data
      // setShowCamera(false); // Hide camera after capturing
    }

  };

  // ReTake Photo
  const retakeImage = () => {
    setCapturedImage(null); // Reset captured image
    startCamera(activeItemId); // Start camera again to retake the image
  };

  // stop the camera
  const stopCamera = () => {
    setCapturedImage(null);
    setShowCamera(false); // Hide camera  

    // if (videoRef.current && videoRef.current.srcObject) {
    //   const stream = videoRef.current.srcObject;
    //   const tracks = stream.getTracks();
    //   tracks.forEach((track) => track.stop());
    //   videoRef.current.srcObject = null;
    // }

    // setShowCamera(false); // Hide camera after capturing
  };


  const Update_AuditData_UID = () => {
    setAuditData((prev) =>
      prev.map((item) => ({
        ...item,
        Audit_UID: auditDetail.Audit_UID, // Add or update Doc_No in each object
      }))
    );
  };


  useEffect(() => {


    if (auditDetail.Audit_UID !== "") {
      Update_AuditData_UID();
    }

  }, [auditDetail])

  const auditDetail_handleChange = (e) => {
    const { name, value } = e.target;

    setAuditDetail((preve) => ({
      ...preve,
      // [name]: value
      ...{ [name]: value } // .trim()
    }));

    if (name === 'Department' && value !== '') {
      Load_MasterData(value); // get master data from API 
    }

    // if (name === 'Doc_No' && value !== '') {
    //   UpdateDocNumber(value);
    // }


  };


  useEffect(() => {
    setAuditDetail((preve) => {
      return {
        ...preve,
        Audit_Date: moment(date).format('DD-MM-YYYY'),
      }
    })
  }, [date])


  // useEffect(() => {

  //   setAuditData((prev) => [...prev, auditDetail?.Doc_No]);

  // }, [auditDetail.Doc_No]);


  console.log('auditDetail', auditDetail)
  console.log('auditData', auditData)
  console.log('htmlEdit', htmlEdit)

  // get master data from API...
  const Load_MasterData = async (departValue) => {
    // const masterList = await Get_MasterList(departValue);
    const masterList = Array.isArray(await Get_MasterList(departValue))
      ? await Get_MasterList(departValue)
      : [];
    // Add default properties like Observation for each item
    const initializedData = masterList.map((item) => ({
      ...item,
      // Doc_No: '',
      Observation: item.Observation || '', // Ensure Observation is initialized

      // Status: 'O+',
      Files: [], // Initialize Files property
    }));

    setAuditData(initializedData);
    Update_AuditData_UID(); // add Audit_UID to auditData
  };

  // load table data ..
  const load_Data = async () => {
    try {
      if (dateRangeNow?.startDate && dateRangeNow?.endDate) {
        setIsLoading(true);
        const outputData = await Load_AuditData_Service(dateRangeNow);
        setGridData(outputData || []);
      }
    } catch (error) {
      console.log('Audit, load_Data Error :', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load_Data();

  }, [dateRangeNow])

  // get UID  ..
  const load_UID = async () => {
    try {
      const uid = await Get_AuditUID_Service();
      // console.log(uid);

      if (!uid) {
        console.error('UID is undefined or null');
        return;
      }


      if (uid) {
        setAuditDetail((preve) => {
          return {
            ...preve,
            Audit_UID: uid,
          }
        });


      }

    } catch (error) {
      console.log('Error load_UID :', error);
    }
  };


  // update UID  ..
  const Update_UID = async () => {
    try {
      const new_uid = auditDetail.Audit_UID + 1;
      const result = await Update_AuditUID_Service(new_uid);

    } catch (error) {
      console.log('Error Update_UID :', error);
    }
  };


  const handle_formSubmit = async (e) => {
    e.preventDefault();

    // Prevent duplicate submissions
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true); // Lock the form during submission
    setIsLoading(true);

    try {
      const result = await Save_AuditService(auditData, auditDetail);
      console.log('result', result);
      // if (result) {
      await Update_UID(); // uid update
      await load_UID() // get uid
      setAuditDetail(auditDetail_InitialValue);
      setAuditData([]);
      setActiveTab(1) // go to view after save
      toast.success('Save success...!')
      // }

    } catch (error) {
      console.error("Error Save Audit :", error); // Handle errors gracefully
      toast.error(error.message)
    } finally {
      setIsSubmitting(false); // Unlock the form
      setIsLoading(false);
    }

  };







  console.log('gridData', gridData);

  useEffect(() => {
    if (activeTab === 1) {
      load_Data();
      setAuditDetail(auditDetail_InitialValue);
      setAuditData([]);
    }
    if (activeTab === 2) {
      load_UID();
    }


  }, [activeTab]);


  const handleView = (row) => {
    navigate("/viewer", { state: row })
  }

  const handleExport = (row) => {
    if (row.Status !== 'APPROVED') {
      return;
    }
    // navigate("/printview", { state: row })
    navigate("/pdfGenerator", { state: row })
  }

  const handleEdit = (row) => {
    // console.log('row', row)
    navigate("/edit-audit", { state: row });


  }

  const handleDelete = async (row) => {
    const { Audit_UID } = row;

    if (!Audit_UID) {
      console.warn("⚠️ Audit_UID is missing, delete operation skipped.");
      return;
    }

    const shouldDelete = await SweetAlert_Delete("Delete Audit!, Are you sure ?", "You won't be able to revert this!");
    if (shouldDelete) {
      setIsLoading(true);
      try {
        const result = await Delete_AuditService(Audit_UID);
        console.log('result', result);
        if (result) {  // Ensure API response indicates success
          console.log(`✅ Successfully deleted audit with Audit_UID: ${Audit_UID}`);
          setGridData([]);
          await load_Data();  // Refresh data after successful delete
          toast.success('Delete success...!')
        } else {
          console.warn(`⚠️ Delete failed for Audit_UID: ${Audit_UID}. Response:`, result);

        }

      } catch (error) {
        console.error("❌ Error Deleting Audit:", error.response?.data || error.message || error); // Handle errors gracefully
        toast.error(error.message)
      } finally {
        setIsLoading(false);
      }
    }
  }
  // useEffect(() => {
  //   Delete_AuditService(1);
  // },[])


  const handle_edit = () => {

  }



  // table column ...
  const columns = [
    {
      name: 'id',
      selector: row => row.id,
      sortable: true
    },
    {
      name: 'Audit_UID',
      selector: row => row.Audit_UID,
      sortable: true
    },
    {
      name: 'Audit_No',
      selector: row => row.AuditNo,
      // cell: row => (
      //   <div title={row.name} style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
      //     {row.name}
      //   </div>
      // ),
      sortable: true
    },
    {
      name: 'Audit_Date',
      selector: row => row.Audit_Date,
      sortable: true
    },
    // {
    //   name: 'Rev_No',
    //   selector: row => row.Rev_No,
    //   sortable: true
    // },
    // {
    //   name: 'Rev_Date',
    //   selector: row => row.Rev_Date,
    //   sortable: true
    // },

    {
      name: 'Department',
      selector: row => row.Department,
      sortable: true
    },
    {
      name: 'Auditor',
      selector: row => row.Auditor,
      sortable: true
    },
    {
      name: 'Auditee',
      selector: row => row.Auditee,
      sortable: true
    },
    {
      name: 'Status',
      // selector: row => row.Status,
      selector: row =>
        <span
          className={`px-2 py-4 text-white rounded-full  cursor-pointer ${row.Status === 'APPROVED' ? 'bg-green-400' :
            row.Status === 'PENDING' ? 'bg-blue-400' :
              row.Status === 'REJECTED' ? 'bg-red-400' :
                // row.Status === 'CANCEL' ? 'bg-yellow-400' :
                row.Status === 'OPEN' ? 'bg-blue-600' :
                  'bg-gray-400' // Default color
            }`}

        >{row.Status}</span>,

      sortable: true
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className='flex p-1 '>
          <button onClick={() => handleView(row)} className='bg-blue-300 p-2 rounded-sm mr-1'><span><LuView /></span></button>
          <button onClick={() => handleExport(row)} className={`${row.Status === 'APPROVED' ? 'cursor-pointer' : 'cursor-not-allowed'} bg-green-400 p-2 rounded-sm mr-1`}><span><TbFileExport /></span></button>


          <button
            onClick={() => handleEdit(row)}
            className={`${row.Status === 'APPROVED' ? 'cursor-not-allowed' : 'cursor-pointer'} bg-yellow-300 p-2 rounded-sm mr-1`}
            disabled={row.Status === 'APPROVED' ? true : false}>
            <span><FaEdit />
            </span>
          </button>



          < button onClick={() => handleDelete(row)} className='bg-red-500 p-2 rounded-sm' > <RiDeleteBin2Line /></button >
        </div >
      ),
      ignoreRowClick: true, // Prevent triggering row click event when clicking buttons
      allowoverflow: true, // Ensure the buttons are visible - "allowOverflow"
      // button: true, // Makes it clear they are buttons
    }
  ]

  return (
    <main>
      {/* Loading Spinner */}
      {isLoading && <LoadSpinner isLoading={isLoading} />}

      <div className='w-full   '>
        {/* Tab navigation */}
        <ul className='flex space-x-4 border-b-2 border-gray-200'>
          <li
            onClick={() => setActiveTab(1)}
            className={`${activeTab === 1 ? 'text-blue-600 border-blue-600 border-b-2  bg-green-200 rounded-t-lg px-2 ' : 'hover:cursor-pointer'}`}>
            View Audit
          </li>

          <li
            onClick={() => setActiveTab(2)}
            className={`${activeTab === 2 ? 'text-blue-600 border-blue-600 border-b-2  bg-green-200 rounded-t-lg px-2 ' : 'hover:cursor-pointer'}`}>
            New Audit
          </li>
        </ul>

        {/* Tab content */}
        <div className='mt-4'>
          {activeTab === 1 && (
            <div className='h-screen p-4 bg-green-100 rounded-lg'>
              {/*  Content for Tab 1  */}
              <div className='flex mb-4'>

                <ReactDateRangePicker setDateRangeNow={setDateRangeNow} />
              </div>
              <DataTableVIew tbl_title={''} columns={columns} apiData={gridData} />
            </div>
          )}

          {activeTab === 2 && (
            <div className='h-full p-1 border'>
              {/*  Content for Tab 2  */}
              <div className='bg-gray-400 text-white py-2 px-4 '>
                <span className='font-semibold'>NEW: QMS - INTERNAL AUDIT CHECK SHEET</span>
              </div>
              {/* <p className='text-center'>QMS - INTERNAL AUDIT CHECK SHEET</p> */}
              <div className='bg-green-100 rounded-lg mt-2'>
                <form onSubmit={handle_formSubmit} encType='multipart/form-data'>


                  <div className='grid grid-rows-3  border-2 border-gray-300'>


                    <div className='grid grid-cols-3 gap-4 p-2'>
                      <div>
                        <label htmlFor='Audit_UID' className={`${label_css}`}>Audit_UID</label>
                        <input
                          type="text"
                          id="Audit_UID"
                          name="Audit_UID"
                          onChange={auditDetail_handleChange}
                          value={auditDetail.Audit_UID || ""}
                          readOnly
                          className={`${input_css} cursor-not-allowed`}
                        />

                      </div>
                      <div>
                        {/* <label htmlFor="Date" className={`${label_css}`}>Date</label> */}
                        {/* <input
                          type='text'
                          id="Date"
                          name="Date"
                          onChange={auditDetail_handleChange}
                          value={auditDetail.Date}
                          placeholder='Audit Date.'
                          className={`${input_css}`} /> */}
                        <DatePicker2 title={'Audit Date'} date={date} setDate={setDate} />
                      </div>

                      <div>
                        <label htmlFor="Shift" className={`${label_css}`}>Shift</label>
                        <select
                          id="Shift"
                          name="Shift"
                          onChange={auditDetail_handleChange}
                          value={auditDetail.Shift || ""}
                          className={`${input_css}`}
                        >

                          <option value="">- Select -</option>
                          <option value="GENERAL">GENERAL</option>
                          <option value="FIRST SHIFT">FIRST SHIFT</option>
                          <option value="SECOND SHIFT">SECOND SHIFT</option>
                          <option value="THIRD SHIFT">THIRD SHIFT</option>
                        </select>
                      </div>

                    </div>


                    <div className='grid grid-cols-3 gap-4 p-2'>

                      <div>
                        <label htmlFor='Department' className={`${label_css}`}>Department</label>
                        <select
                          id="Department"
                          name="Department"
                          onChange={auditDetail_handleChange}
                          value={auditDetail.Department || ""}
                          className={`${input_css}`}
                        >

                          <option value="">- Select -</option>

                          {departmentData && departmentData.map((item, index) => (
                            <option key={index} value={item.Department} >{item.Department}</option>
                          ))}

                        </select>
                      </div>

                      <div>
                        <label htmlFor="AuditNo" className={`${label_css}`}>AuditNo.</label>
                        <input
                          type='text'
                          id="AuditNo"
                          name="AuditNo"
                          onChange={auditDetail_handleChange}
                          value={auditDetail.AuditNo}
                          placeholder='Enter AuditNo.'
                          className={`${input_css}`} />
                      </div>

                      <div>
                        <label htmlFor="Year" className={`${label_css}`}>Year</label>
                        <input
                          type='text'
                          id="Year"
                          name="Year"
                          onChange={auditDetail_handleChange}
                          value={auditDetail.Year}
                          placeholder='Enter Year.'
                          className={`${input_css}`} />
                      </div>

                    </div>

                    <div className='flex flex-col border-t-2 p-2'>
                      <div className='pl-3 flex  text-center'>

                        <input
                          type="checkbox"
                          name="checkbox1"
                          value="checkbox1"
                          onChange={() => setHtmlEdit(!htmlEdit)}
                          className='w-5 h-5 pl-5' />
                        <label htmlFor='' className='ml-2'>Edit</label>
                      </div>

                      <div className='grid grid-cols-3 gap-4 p-2'>


                        <div>
                          <label htmlFor="Doc_No" className={`${label_css}`}>Doc_No.</label>
                          <input
                            type='text'
                            id="Doc_No"
                            name="Doc_No"
                            onChange={auditDetail_handleChange}
                            value={auditDetail.Doc_No || ""}
                            readOnly={!htmlEdit}
                            placeholder='Enter Doc No.'
                            className={`${input_css}`} />
                        </div>

                        <div>
                          <label htmlFor="Rev_No" className={`${label_css}`}>Rev No.</label>
                          <input
                            type='text'
                            id="Rev_No"
                            name="Rev_No"
                            onChange={auditDetail_handleChange}
                            value={auditDetail.Rev_No || ""}
                            readOnly={!htmlEdit}
                            placeholder='Enter Rev No.'
                            className={`${input_css}`} />
                        </div>

                        <div>
                          <label htmlFor="Rev_Date" className={`${label_css}`}>Rev Date</label>
                          <input
                            type='text'
                            id="Rev_Date"
                            name="Rev_Date"
                            onChange={auditDetail_handleChange}
                            value={auditDetail.Rev_Date || ''}
                            readOnly={!htmlEdit}
                            placeholder='Enter Rev Date'
                            className={`${input_css}`} />
                        </div>

                      </div>
                    </div>

                  </div>



                  <div className='grid grid-rows-2 mt-4 border-2 border-gray-300'>


                    <div className='grid grid-cols-2 gap-4 p-2'>
                      <div className=' '>
                        <label htmlFor="Auditor" className={`${label_css}`}>Auditor</label>
                        <input
                          type="text"
                          id="Auditor"
                          name="Auditor"
                          onChange={auditDetail_handleChange}
                          value={auditDetail.Auditor}
                          placeholder='Auditor Name.'
                          className={`${input_css} w-full`}
                        />
                      </div>

                      {/* <div className=' '>
                        <label htmlFor="RefNo" className={`${label_css}`}>Ref.No</label>
                        <input
                          type="text"
                          id="RefNo"
                          name="RefNo"
                          onChange={auditDetail_handleChange}
                          value={auditDetail.RefNo}
                          placeholder='Audit Ref No.'
                          className={`${input_css} w-full`}
                        />
                      </div> */}

                      <div className=' '>
                        <label htmlFor="Plant" className={`${label_css}`}>Plant</label>
                        {/* <input
                          type="text"
                          id="Plant"
                          name="Plant"
                          onChange={auditDetail_handleChange}
                          value={auditDetail.Plant}
                          placeholder='Plant Location.'
                          className={`${input_css} w-full`}
                        /> */}

                        <select
                          id="Plant"
                          name="Plant"
                          onChange={auditDetail_handleChange}
                          value={auditDetail.Plant || ""}
                          className={`${input_css}`}
                        >

                          <option value="">- Select -</option>
                          <option value="PUDUCHERRY">PUDUCHERRY</option>
                          <option value="HOSUR">HOSUR</option>
                          <option value="REWARI">REWARI</option>
                          <option value="TECH CENTRE">TECH CENTRE</option>
                        </select>
                      </div>

                    </div>


                    <div className='grid grid-cols-2 gap-4 p-2'>


                      <div className=' '>
                        <label htmlFor="Auditee" className={`${label_css}`}>Auditee</label>
                        <input
                          type="text"
                          id="Auditee"
                          name="Auditee"
                          onChange={auditDetail_handleChange}
                          value={auditDetail.Auditee}
                          placeholder='Auditee Name.'
                          className={`${input_css} w-full`}
                        />
                      </div>

                      <div className=' '>
                        <label htmlFor="Process" className={`${label_css}`}>Process</label>
                        <input
                          type="text"
                          id="Process"
                          name="Process"
                          onChange={auditDetail_handleChange}
                          value={auditDetail.Process}
                          placeholder='Enter Audit Process.'
                          className={`${input_css} w-full`}
                        />
                      </div>

                      {/* <div className=' '>
                        <label htmlFor="ReviewedBy" className={`${label_css}`}>REVIEWED BY</label>
                        <input
                          type="text"
                          id="ReviewedBy"
                          name="ReviewedBy"
                          onChange={auditDetail_handleChange}
                          value={auditDetail.ReviewedBy}
                          placeholder='Enter ReviewedBy Name.'
                          className={`${input_css} w-full`}
                        />
                      </div>   */}

                    </div>
                  </div>


                  <div className=' overflow-x-auto overflow-y-auto mt-4'>
                    {auditData.length > 0 && (
                      <table className='w-full table-auto'>
                        <thead className={tbl_header}>
                          <tr className={tbl_thead_tr}>
                            <th className={`${tbl_thead_th} `}>#</th>
                            <th className={`${tbl_thead_th}`}>Clause</th>
                            <th className={`${tbl_thead_th}`}>Check_Points</th>
                            <th className={`${tbl_thead_th}`}>Guide_Lines / Observation</th>
                            {/* <th className={`${tbl_header}`}>Observation</th> */}
                            <th className={`${tbl_thead_th}`}>Status</th>
                            <th className={`${tbl_thead_th}`}>File Attachment</th>
                            <th className={`${tbl_thead_th}`}>Image</th>
                          </tr>
                        </thead>
                        <tbody>
                          {auditData && auditData.map((item, index) => (
                            <tr key={index}>
                              <td className='border border-slate-600 p-1 text-center'>{index + 1}</td>
                              <td className='border border-slate-600 p-1 text-center'>{item.Clause}</td>
                              <td className='border border-slate-600 p-2'>{item.Check_Points}</td>
                              <td className='border border-slate-600 p-2'>
                                {item.Guide_Lines}
                                <textarea
                                  id={`Observation-${item.id}`}
                                  name={`Observation`}
                                  onChange={(e) => auditData_handleChange(e, item)}
                                  value={item.Observation || ""}
                                  rows="4" cols="30"
                                  placeholder='Enter Observation ....'
                                  className={`${''} p-1 border-2 border-yellow-300 mt-2 focus:border-2 focus:border-green-300`}></textarea>
                              </td>
                              {/* <td className='border border-slate-600 p-1'>
                      <textarea
                        id={`Observation-${item.id}`}
                        name={`Observation`}
                        onChange={(e) => auditData_handleChange(e, item)}
                        value={item.Observation || ""}
                        rows="4" cols="30"
                        className={`${input_css}`}></textarea>
                    </td> */}
                              <td className='border border-slate-600 p-1'>
                                {/* <RadioButton title="" selectedOption={statusOption} setSelectedOption={setStatusOption} dataArray={staus_Array} /> */}
                                {/* Radio buttons for Status */}
                                <div className="flex flex-row items-center text-center m-1">
                                  <input
                                    type="checkbox"
                                    id={`Status-O+-${item.id}`}
                                    name="Status"
                                    value="O+"
                                    checked={item.Status === "O+" ? true : false} // Reflect state directly
                                    onChange={(e) => handle_CheckboxChange(e, item)}
                                    // className="h-5 w-5 appearance-none border border-gray-300 rounded-sm checked:bg-green-700 checked:border-green-500 checked:text-white focus:outline-none "
                                    className="h-5 w-5 accent-green-700     rounded cursor-pointer"
                                  />
                                  <label htmlFor={`Status-O+-${item.id}`} style={{ margin: '0px 5px' }}>
                                    O+
                                  </label>

                                  <input
                                    type="checkbox"
                                    id={`Status-OI-${item.id}`}
                                    name="Status"
                                    value="OI"
                                    checked={item.Status === "OI" ? true : false} // Reflect state directly
                                    onChange={(e) => handle_CheckboxChange(e, item)}
                                    className="h-5 w-5 accent-yellow-700      rounded cursor-pointer"
                                  />
                                  <label htmlFor={`Status-OI-${item.id}`} style={{ margin: '0px 5px' }}>
                                    OI
                                  </label>

                                  <input
                                    type="checkbox"
                                    id={`Status-NC-${item.id}`}
                                    name="Status"
                                    value="NC"
                                    checked={item.Status === "NC" ? true : false} // Reflect state directly
                                    onChange={(e) => handle_CheckboxChange(e, item)}
                                    className="h-5 w-5 accent-red-500      rounded cursor-pointer"
                                  />
                                  <label htmlFor={`Status-NC-${item.id}`} style={{ margin: '0px 5px' }}>
                                    NC
                                  </label>
                                </div>
                              </td>
                              <td className='border border-slate-600 p-1'>
                                <input
                                  type="file"
                                  id={`Files-${item.id}`}
                                  name="Files"
                                  multiple // Allow multiple file selection
                                  onChange={(e) => auditData_handleChange(e, item)}
                                  className={`w-40`}
                                />
                                {/* Display uploaded file names with remove buttons */}
                                {item.Files && item.Files.length > 0 && (
                                  <ul className="mt-2">
                                    {item.Files.map((file, fileIndex) => (
                                      <li key={fileIndex} className="relative text-sm bg-gray-600 p-1 mb-1 text-white  rounded justify-between items-center m-0">
                                        <span>{file.name}</span>
                                        <button
                                          type="button"
                                          className="absolute top-1 right-2 text-red-500 text-xs ml-2"
                                          onClick={() => removeFile(item.id, fileIndex)}
                                        >
                                          X
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </td>
                              <td className='  border border-slate-600 p-1 w-3/4     items-center'>
                                <button
                                  type="button"
                                  className="bg-blue-500 text-white px-2 py-1 rounded"
                                  onClick={() => startCamera(item.id)}
                                >
                                  Take Photo
                                </button>
                                {item.Images && item.Images.length > 0 && (
                                  <ul className="mt-2 flex flex-col items-center gap-1">
                                    {item.Images.map((image, imgIndex) => (
                                      <li key={imgIndex} className="relative text-sm flex items-center m-0">
                                        <img
                                          src={image}
                                          alt={`Captured-${imgIndex}`}
                                          className="w-40 h-20 border m-0"
                                        />

                                        <button
                                          type="button"
                                          // className="absolute bg-red-500 text-white px-1 py-.5 rounded  top-0    right-0 z-10"
                                          className="absolute top-1 right-2 text-red-500 text-xs ml-2"
                                          onClick={() => removeImageFromAuditData(item.id, imgIndex)}
                                        >
                                          X
                                        </button>
                                        {/* <span className='absolute top-1 left-2 text-white text-sm'>{imgIndex + 1}</span> */}
                                        <span className='absolute w-5 h-5 bg-white  top-1 left-2   text-red-500 text-sm text-center'>{imgIndex + 1}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}




                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                  </div>

                  <div className='mt-4'>
                    <button type="submit"
                      disabled={isSubmitting}
                      className={` ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'} ${!isEdit ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-yellow-400 hover:bg-yellow-300 text-black'} w-full  mt-4  p-3  rounded-lg `} id="btn_Save" name="btn_Save" >{!isEdit ? "Save" : "Update"}
                    </button>

                  </div>

                </form>

                {/* Camera Modal */}
                {showCamera && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-auto h-auto rounded-lg shadow-lg relative flex flex-col items-center justify-center">
                      <div className="bg-gray-800 text-white w-full p-3 m-0 flex justify-center items-center">
                        <h3 className="text-xl">Take Photo</h3>
                      </div>

                      <div className="relative w-full h-full m-0">
                        {/* photo preview */}

                        {capturedImage !== null ?
                          <img src={capturedImage} alt="capturedImage" className='m-0' /> :
                          // <video
                          //   ref={videoRef}
                          //   className={`${capturedImage ? 'hidden' : 'absolute'}  top-0 left-0 w-full h-full object-cover z-10 m-0`}
                          // >                            
                          // </video>

                          // <Webcam

                          //   audio={false}
                          //   height={500} // 200
                          //   width={520} // 220
                          //   ref={webcamRef}
                          //   screenshotFormat="image/jpeg"
                          //   // screenshotQuality={0.8} // Quality range: 0.1 (low) to 1.0 (high)

                          //   videoConstraints={videoConstraints}
                          // />

                          <Webcam
                            audio={false}
                            screenshotFormat="image/jpeg"
                            ref={webcamRef}
                            videoConstraints={{
                              width: 1280, // 1280
                              height: 720, // 720
                              facingMode: { ideal: "environment" }, // Try "ideal" instead of "exact"
                              advanced: [{ focusMode: "continuous" }], // Autofocus mode
                            }}
                          />



                        }




                        {/* Video preview */}
                        {/* <video
                ref={videoRef}
                className="absolute top-0 left-0 w-full h-full object-cover z-10 m-0"
              ></video> */}

                        {/* Canvas for capturing image */}
                        {/* <canvas
                          ref={canvasRef}
                          className="absolute  top-0 left-0 w-full h-full hidden m-0"
                        ></canvas> */}

                        {/* Preview */}
                        {/* <div className="absolute top-0 left-0 right-0 flex justify-center">
                {capturedImage && (
                  <div className="mb-4">
                    <img
                      src={capturedImage}
                      alt="Captured Preview"
                      className="w-60 h-60 object-cover border rounded"
                    />
                  </div>
                )}
              </div> */}

                        {/* Buttons overlay */}
                        <div className="absolute bottom-24 left-0 right-0 flex justify-center space-x-4 z-20">
                          <button
                            className=" hover:bg-green-500 text-white px-4 border border-green-500 py-2 rounded"
                            onClick={capturedImage ? retakeImage : captureImage}
                          >
                            {capturedImage ? 'Re Take' : 'Capture'}
                          </button>
                          <button
                            className=" hover:bg-red-500 text-white border border-red-500 px-4 py-2 rounded"
                            onClick={stopCamera}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </main>

  )
}
