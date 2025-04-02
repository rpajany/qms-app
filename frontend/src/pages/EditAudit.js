import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Webcam from "react-webcam";
import moment from 'moment';
import { LoadSpinner } from '../components';
import { toast } from 'react-toastify';

import { DatePicker2, SweetAlert_Delete } from '../components';
import { EditAuditService, Get_AuditData_Service, Update_EditAudit_Service, Get_AuditDetail_Service, Get_UploadFiles_Service, Delete_OldUploadFile_Service } from '../services/EditAuditService';

import { date_strToObject } from '../helpers/Custom';

// css properties
const label_css = 'block mb-2 text-sm font-medium text-gray-900 dark:text-white';
const input_css = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';
const tbl_header = 'border border-slate-600  bg-gray-500 p-1';
const tbl_thead_tr = " text-white border-r-2  border-gray-300";
const tbl_thead_th = "px-6 py-2 border-r-2  border-gray-300";
const tbl_tbody_td = "border-r-2  border-gray-300 px-1";

export const EditAudit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const edit_row = location.state;
  const { id, Audit_UID, Department, Audit_Date, } = edit_row; // destructure
  // console.log('Row_id', Doc_No);


  // const [date, setDate] = useState(date_strToObject(Audit_Date)||new Date()); // date object 
  const [date, setDate] = useState(() => {
    return Audit_Date ? date_strToObject(Audit_Date) : new Date();
  });

  const [auditData, setAuditData] = useState([]);

  const [pageReset, setPageReset] = useState(0);
  const [trigger, setTrigger] = useState(true); // Example condition


  const [isSubmitting, setIsSubmitting] = useState(false); // Track Form submission state
  const [isLoading, setIsLoading] = useState(false);

  const [htmlEdit, setHtmlEdit] = useState(false);
  const [isEdit, setIsEdit] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [activeItemId, setActiveItemId] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const webcamRef = useRef(null);

  const lastYear = moment().subtract(1, 'year').format('YY'); // Last 2 digits of last year
  const currentYear = moment().format('YY'); // Last 2 digits of current year
  const auditYear = lastYear + "-" + currentYear;

  const auditDetail_InitialValue = {
    id: '',
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
    Audit_Date: Audit_Date || date,
    Shift: '',
    Plant: '',
    Status: '',
    ReviewedBy: ''
  }

  const [auditDetail, setAuditDetail] = useState(auditDetail_InitialValue);

  // const reRenderPage = () => {
  //   setPageReset((prev) => prev + 1); // Increment key to force remount
  // };

  // useEffect(() => {
  //   if (trigger) {
  //     reRenderPage();
  //   }
  // }, [trigger]); // Call reRenderPage whenever 'trigger' changes


  // get auditData ...
  const Get_AuditData = async (Audit_UID) => {
    try {
      const result_0 = Array.isArray(await Get_AuditData_Service(Audit_UID))
        ? await Get_AuditData_Service(Audit_UID)
        : [];

      // console.log('result_0', result_0)
      setAuditData(result_0);

    } catch (error) {
      console.log('Error :', error)
    }

  }

  // get auditDetails ...
  const Get_AuditDetail = async (Audit_UID) => {
    try {
      const result_1 = (await Get_AuditDetail_Service(Audit_UID))
        ? await Get_AuditDetail_Service(Audit_UID) : {};
      // console.log('result_1', result_1);

      setAuditDetail((preve) => ({
        ...preve,
        ...result_1
      }));

    } catch (error) {
      console.log('Error :', error)
    }

  }

  // get upload files ...
  const Get_UploadFiles = async (Audit_UID) => {
    try {
      const result = await Get_UploadFiles_Service(Audit_UID);
      console.log("Result from API:", result);
      // console.log('typeof :', typeof (auditData))
      // console.log('typeof result:', typeof (result))

      setAuditData((prev) => {

        console.log("Previous auditData:", prev);

        // Ensure `prev` is an array
        if (!Array.isArray(prev)) {
          console.error("auditData is not an array:", prev);
          return prev;
        }

        // Map through `prev` to create a new array with updates
        const updatedAuditData = prev.map((entry) => {
          // Find items in `result` that match `entry.Doc_No`
          const matchingUploads = result.filter(
            (item) => item.Clause === entry.Clause // check Clause is ===
          );

          // Add `Uploads` to the matching entry, leave others unchanged
          return {
            ...entry,
            Uploads: matchingUploads.length > 0 ? matchingUploads : entry.Uploads || null, // Add `Uploads` or keep it as `null`
          };
        });

        console.log("Updated auditData:", updatedAuditData);
        return updatedAuditData; // Return the updated array
      });


    } catch (error) {
      console.log('Failed to fetch upload files :', error)
    }

  }


  useEffect(() => {

    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Get_AuditData(Audit_UID); // Wait until auditData is fetched
        await Get_AuditDetail(Audit_UID); // Wait until auditDetail is fetched
        await Get_UploadFiles(Audit_UID); // Then, get upload files

      } catch (error) {
        console.log('Error EditAudit fetchData :', error)
      } finally {
        setIsLoading(false);
      }

    };

    fetchData();

  }, [])

  console.log('auditData', auditData)
  console.log('auditDetail', auditDetail)




  const auditDetail_handleChange = (e) => {
    const { name, value } = e.target;

    setAuditDetail((preve) => ({
      ...preve,
      // [name]: value
      ...{ [name]: value } // trim() newly added .trim()
    }));

    // if (name === 'Department' && value !== '') {
    //   Load_MasterData(value); // get master data from API 
    // }

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

  const Update_AuditData_UID = (value) => {
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

  // auditData HandleChange ....
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
            [name]: value, // .trim() Handle other fields like Observation
          };
        }

      }
      return current;
    });

    setAuditData(updatedList);
  };

  // checkbox change ...
  const handle_CheckboxChange = (e, item) => {
    const { name, value } = e.target;

    console.log('item.id', item.id)


    const updatedAuditData = auditData.map((current) =>
      current.id === item.id
        ? { ...current, [name]: value } // Update only the status field for the matching item
        : current // Leave other items unchanged
    );
    setAuditData(updatedAuditData);

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
      const result = await Update_EditAudit_Service(auditDetail, auditData)

      // Reset states after successful update
      setAuditData([]);
      setAuditDetail(auditDetail_InitialValue);

      console.log("Audit Update successful :", result); // Optional logging
      toast.success('Update success...!');
      navigate("/audit", { replace: true });

    } catch (error) {
      console.error("Error updating audit data:", error); // Handle errors gracefully
      toast.error(error.message);
    } finally {
      setIsSubmitting(false); // Unlock the form
      setIsLoading(false);
    }


  }

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

  // remove Old uploaded Files
  const remove_OldUploadFile = async (row) => {
    console.log('Old Uploaded Files :', row)

    const { id: deleteID } = row;

    const shouldDelete = await SweetAlert_Delete("Delete Attachment!, Are you sure ?", "You won't be able to revert this!");
    if (shouldDelete) {
      const status = await Delete_OldUploadFile_Service(row); // delete the file

      // setPageReset((prevKey) => prevKey + 1); // Change the key to force re-render
      // setTrigger(false)

      //  await Get_UploadFiles(Doc_No); //  to re load file upload data

      // Update auditData by removing the upload with the provided id
      setAuditData((prevAuditData) =>
        prevAuditData.map((audit) =>
          audit.Uploads.some((upload) => upload.id === deleteID)
            ? {
              ...audit,
              Uploads: audit.Uploads.filter((upload) => upload.id !== deleteID),
            }
            : audit
        )
      );

    }

    // reRenderPage();


    // window.location.reload(); // Reloads the current page

  }

  const videoConstraints = {
    // width: 1280,
    // height: 720,
    width: 520, // 220
    height: 500, // 200
    // facingMode: "environment", // user / environment
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
        const updatedImages = [...(current.imageIndex || [])];
        // updatedImages.splice(imageIndex, 1);
        return {
          ...current,
          // Images: updatedImages,
          [imageIndex]: "",
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
    //   const imageData = canvasRef.current.toDataURL('image/png'); // Get image as base64
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
  };

  return (
    <div key={pageReset}>

      {/* Loading Spinner */}
      {isLoading && <LoadSpinner isLoading={isLoading} />}

      <div className='bg-yellow-500 text-white py-2 px-4 '>
        <span className='font-semibold'>EDIT: QMS - INTERNAL AUDIT CHECK SHEET</span>
      </div>
      <div className='h-full p-4 mt-2 bg-yellow-100 rounded-lg'>

        {/* <p className='text-center'>EDIT: QMS - INTERNAL AUDIT CHECK SHEET</p> */}
        <div className=''>
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
                  {/* <select
                    id="Department"
                    name="Department"
                    onChange={auditDetail_handleChange}
                    value={auditDetail.Department || ""}
                    className={`${input_css}`}
                  >

                    <option value="">- Select -</option>
                    <option value="PURCHASE">PURCHASE</option>
                  </select> */}

                  <input
                    type="text"
                    id="Department"
                    name="Department"
                    onChange={auditDetail_handleChange}
                    value={auditDetail.Department || ""}
                    placeholder='Enter Department.'
                    readOnly
                    className={`${input_css}`}
                  />
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
                    value="Bike"
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
                      value={auditDetail.Doc_No || ''}
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
                              className="h-5 w-5 accent-yellow-700       rounded cursor-pointer"
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

                          {/* Display Newly uploaded file names with remove buttons */}
                          {item.Files && item.Files.length > 0 && (
                            <ul className="mt-2">
                              {item.Files.map((file, fileIndex) => (
                                <li key={fileIndex} className="relative text-sm bg-green-600 p-1 mb-1 text-white  rounded justify-between items-center m-0">
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

                          {/* Display Old uploaded file names with remove buttons */}
                          {item.Uploads && item.Uploads.length > 0 && (
                            <ul className="mt-2">
                              {item.Uploads.map((file, fileIndex) => (
                                <li key={fileIndex} className="relative text-sm bg-gray-600 p-1 mb-1 text-white  rounded justify-between items-center m-0">
                                  <span>{file.File_Name}</span>
                                  <button
                                    type="button"
                                    className="absolute top-1 right-2 text-red-500 text-xs ml-2"
                                    onClick={() => remove_OldUploadFile(file)}
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
                                                  
                       

                          {item.Images && item.Images !== null ?
                            <ul className="mt-2 flex flex-col items-center">
                              <li className="relative text-sm flex items-center m-0">
                                <img
                                  src={item.Images}
                                  alt={`Captured-1`}
                                  className="w-40 h-20 border m-0"
                                />
                                <button
                                  type="button"
                                  className="absolute top-1 right-2 text-red-500 text-xs ml-2"
                                  onClick={() => removeImageFromAuditData(item.id, 'Images')}
                                >
                                  X
                                </button>
                                <span className='absolute w-5 h-5 bg-white  top-1 left-2   text-red-500 text-sm text-center'>1</span>
                              </li>

                              {item.Images_2 && item.Images_2 !== null ?
                                <li className="relative text-sm flex items-center m-0">
                                  <img
                                    src={item.Images_2}
                                    alt={`Captured-2`}
                                    className="w-40 h-20 border m-0"
                                  />
                                  <button
                                    type="button"
                                    className="absolute top-1 right-2 text-red-500 text-xs ml-2"
                                    onClick={() => removeImageFromAuditData(item.id, 'Images_2')}
                                  >
                                    X
                                  </button>
                                  <span className='absolute w-5 h-5 bg-white  top-1 left-2   text-red-500 text-sm text-center'>2</span>
                                </li> : ''
                              }

                              {item.Images_3 && item.Images_3 !== null ?
                                <li className="relative text-sm flex items-center m-0 ">
                                  <img
                                    src={item.Images_3}
                                    alt={`Captured-3`}
                                    className="w-40 h-20 border m-0"
                                  />
                                  <button
                                    type="button"
                                    className="absolute top-1 right-2 text-red-500 text-xs ml-2"
                                    onClick={() => removeImageFromAuditData(item.id, 'Images_3')}
                                  >
                                    X
                                  </button>

                                  <span className='absolute w-5 h-5 bg-white  top-1 left-2   text-red-500 text-sm text-center'>3</span>


                                </li> : ''
                              }

                            </ul>
                            : ''
                          }



                          {/* {console.log('item', item)} */}




                          {/* {item.Images && item.Images.length > 0 && (
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
                                    
                                    className="absolute top-1 right-2 text-red-500 text-xs ml-2"
                                    onClick={() => removeImageFromAuditData(item.id, imgIndex)}
                                  >
                                    X
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )} */}

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
                    // ></video>

                    // <Webcam
                    //   audio={false}
                    //   height={500} // 200
                    //   width={520} // 220
                    //   ref={webcamRef}
                    //   screenshotFormat="image/jpeg"

                    //   videoConstraints={videoConstraints} />


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

    </div>
  )
}

