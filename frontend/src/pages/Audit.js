import { useState, useRef, useEffect } from 'react';
import { AuditService, Load_AuditData_Service, Get_MasterList, Save_AuditService, Delete_AuditService } from '../services/AuditService';
import { ReactDateRangePicker, DataTableVIew, DatePicker2 } from '../components';
import moment from 'moment';

import { TbFileExport } from "react-icons/tb";
import { LuView } from "react-icons/lu";
import { MdPreview } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";

// import { RadioButton } from '../components';

// css properties
// const label_css = ' block mb-2 ml-0 text-sm font-medium text-gray-900 dark:text-white';
const label_css = 'block mb-2 text-sm font-medium text-gray-900 dark:text-white';
// const input_css = 'block bg-white border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500';
const input_css = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';
const tbl_header = 'border border-slate-600  bg-gray-500 p-1';
const tbl_thead_tr = " text-white border-r-2  border-gray-300";

const tbl_thead_th = "px-6 py-2 border-r-2  border-gray-300";

const tbl_tbody_td = "border-r-2  border-gray-300 px-1";


export const Audit = () => {

  // const auditData_InitialValue = {
  //   id: '',
  // }
  const [date, setDate] = useState(new Date()); // date object   
  const [isSubmitting, setIsSubmitting] = useState(false); // Track Form submission state
  const [isEdit, setIsEdit] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [auditData, setAuditData] = useState([]);

  const auditDetail_InitialValue = {
    id: '',
    Doc_No: '',
    Rev_No: '',
    Rev_Date: '',
    Auditor: '',
    RefNo: '',
    Department: '',
    Auditee: '',
    Process: '',
    Audit_Date: '',
    Shift: '',
    Plant: '',
    Status: 'OPEN',
  }

  const [auditDetail, setAuditDetail] = useState(auditDetail_InitialValue);

  const staus_Array = ['O+', 'OI', 'NC'];
  const [statusOption, setStatusOption] = useState(staus_Array);

  const [dateRangeNow, setDateRangeNow] = useState({});
  // const [gridData, setGridData] = useState([{ id: 1, name: 'This is a very long text that might be truncated..erwqewqeqweqweqweqwe weqweqwew qweqweqwe', age: 20 }]); // []
  const [gridData, setGridData] = useState([]); // []
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [activeItemId, setActiveItemId] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);


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

  const startCamera = (itemId) => {
    setActiveItemId(itemId);
    setShowCamera(true);

    navigator.mediaDevices
      .getUserMedia({ video: { width: 1280, height: 720 } }) // HD quality
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch((error) => {
        console.error('Camera error:', error);
      });
  };

  const captureImage = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = 1280; // HD width
      canvasRef.current.height = 720; // HD height
      context.drawImage(videoRef.current, 0, 0, 1280, 720);
      const imageData = canvasRef.current.toDataURL('image/png'); // Get image as base64
      setCapturedImage(imageData);
      addImageToAuditData(activeItemId, imageData);
    }
  };

  const retakeImage = () => {
    setCapturedImage(null); // Reset captured image
    startCamera(activeItemId); // Start camera again to retake the image
  };

  const stopCamera = () => {
    setCapturedImage(null);
    setShowCamera(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };


  const UpdateDocNumber = (value) => {
    setAuditData((prev) =>
      prev.map((item) => ({
        ...item,
        Doc_No: value, // Add or update Doc_No in each object
      }))
    );
  };

  const auditDetail_handleChange = (e) => {
    const { name, value } = e.target;

    setAuditDetail((preve) => ({
      ...preve,
      // [name]: value
      ...{ [name]: value }
    }));

    if (name === 'Department' && value !== '') {
      Load_MasterData(value); // get master data from API 
    }

    if (name === 'Doc_No' && value !== '') {
      UpdateDocNumber(value);
    }


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
  // console.log('auditData', auditData)

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
  };


  const handle_formSubmit = async (e) => {
    e.preventDefault();

    const result = await Save_AuditService(auditData, auditDetail);

    if (result) {
      setAuditDetail(auditDetail_InitialValue);
      setAuditData([]);
    }

  }



  const load_Data = async () => {
    try {
      const outputData = await Load_AuditData_Service();
      setGridData(outputData);
    } catch (error) {
      console.log('Audit, load_Data Error :', error);
    }
  }

  // console.log('gridData', gridData);

  useEffect(() => {
    if (activeTab === 1) {
      load_Data();
    }
  }, [activeTab]);


  const handleView = (row) => {

  }

  const handleExport = (row) => {

  }

  const handleEdit = (row) => {
    const { id } = row;

  }

  const handleDelete = async (row) => {
    const { Doc_No } = row;

    const result = await Delete_AuditService(Doc_No);
    if (result) {
      load_Data();
    }


  }

  // useEffect(() => {
  //   Delete_AuditService(1);
  // },[])

  // table column ...
  const columns = [
    {
      name: 'id',
      selector: row => row.id,
      sortable: true
    },
    {
      name: 'Doc_No',
      selector: row => row.Doc_No,
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
    {
      name: 'Rev_No',
      selector: row => row.Rev_No,
      sortable: true
    },
    {
      name: 'Rev_Date',
      selector: row => row.Rev_Date,
      sortable: true
    },
    {
      name: 'Auditor',
      selector: row => row.Auditor,
      sortable: true
    },
    {
      name: 'Department',
      selector: row => row.Department,
      sortable: true
    },
    {
      name: 'Auditee',
      selector: row => row.Auditee,
      sortable: true
    },
    {
      name: 'Status',
      selector: row => row.Status,
      sortable: true
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className='flex p-1 '>
          <button onClick={() => handleView(row)} className='bg-blue-300 p-2 rounded-sm mr-1'><span><LuView /></span></button>
          <button onClick={() => handleExport(row)} className='bg-green-400 p-2 rounded-sm mr-1'><span><TbFileExport /></span></button>
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
    <main>
      <div className='w-full p-1 mt-4'>
        {/* Tab navigation */}
        <ul className='flex space-x-4 border-b-2 border-gray-200'>
          <li
            onClick={() => setActiveTab(1)}
            className={`${activeTab === 1 ? 'text-blue-600 border-blue-600 border-b-2  bg-green-200 rounded-t-lg px-2' : ''}`}>
            View Audit
          </li>

          <li
            onClick={() => setActiveTab(2)}
            className={`${activeTab === 2 ? 'text-blue-600 border-blue-600 border-b-2  bg-green-200 rounded-t-lg px-2' : ''}`}>
            Audit
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
            <div className='h-full p-4 bg-green-100 rounded-lg '>
              {/*  Content for Tab 2  */}
              <p className='text-center'>QMS - INTERNAL AUDIT CHECK SHEET</p>
              <div className=''>
                <form onSubmit={handle_formSubmit} encType='multipart/form-data'>


                  <div className='grid grid-rows-2  border-2 border-gray-300'>
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
                          <option value="PURCHASE">PURCHASE</option>
                        </select>
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
                          <option value="FIRST SHIFT">FIRST SHIFT</option>
                          <option value="SECOND SHIFT">SECOND SHIFT</option>
                          <option value="THIRD SHIFT">THIRD SHIFT</option>
                        </select>
                      </div>

                    </div>


                    <div className='grid grid-cols-3 gap-4 p-2'>

                      <div>
                        <label htmlFor="Doc_No" className={`${label_css}`}>Doc_No.</label>
                        <input
                          type='text'
                          id="Doc_No"
                          name="Doc_No"
                          onChange={auditDetail_handleChange}
                          value={auditDetail.Doc_No}
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
                          value={auditDetail.Rev_No}
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
                          value={auditDetail.Rev_Date}
                          placeholder='Enter Rev Date'
                          className={`${input_css}`} />
                      </div>

                    </div>
                  </div>



                  <div className='grid grid-rows-2 mt-4 border-2 border-gray-300'>
                    <div className='grid grid-cols-4 gap-4 p-2'>
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

                      <div className=' '>
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
                      </div>

                      <div className=' '>
                        <label htmlFor="Plant" className={`${label_css}`}>Plant</label>
                        <input
                          type="text"
                          id="Plant"
                          name="Plant"
                          onChange={auditDetail_handleChange}
                          value={auditDetail.Plant}
                          placeholder='Plant Location.'
                          className={`${input_css} w-full`}
                        />
                      </div>

                    </div>


                    <div className='grid grid-cols-4 gap-4 p-2'>


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
                        <label htmlFor="Audit_Process" className={`${label_css}`}>Audit_Process</label>
                        <input
                          type="text"
                          id="Audit_Process"
                          name="Audit_Process"
                          onChange={auditDetail_handleChange}
                          value={auditDetail.Audit_Process}
                          placeholder='Enter Audit Process.'
                          className={`${input_css} w-full`}
                        />
                      </div> */}

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
                            <th className={`${tbl_thead_th}`}>File Atachment</th>
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
                                  <ul className="mt-2 flex flex-col items-center">
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
                    {/* <button type='submit' id="Save" name="Save" className='bg-green-500 text-white'>Save</button> */}
                  </div>

                </form>

                {/* Camera Modal */}
                {showCamera && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-3/4 h-3/4 rounded-lg shadow-lg relative flex flex-col items-center justify-center">
                      <div className="bg-gray-800 text-white w-full p-3 m-0 flex justify-center items-center">
                        <h3 className="text-xl">Take Photo</h3>
                      </div>

                      <div className="relative w-full h-full m-0">
                        {/* photo preview */}

                        {capturedImage !== null ?
                          <img src={capturedImage} alt="capturedImage" className='m-0' /> :
                          <video
                            ref={videoRef}
                            className={`${capturedImage ? 'hidden' : 'absolute'}  top-0 left-0 w-full h-full object-cover z-10 m-0`}
                          ></video>

                        }




                        {/* Video preview */}
                        {/* <video
                ref={videoRef}
                className="absolute top-0 left-0 w-full h-full object-cover z-10 m-0"
              ></video> */}

                        {/* Canvas for capturing image */}
                        <canvas
                          ref={canvasRef}
                          className="absolute  top-0 left-0 w-full h-full hidden m-0"
                        ></canvas>

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
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4 z-20">
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
