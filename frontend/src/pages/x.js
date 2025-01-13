<div className='bg-blue-50'>
    <form onSubmit={handle_formSubmit} encType='multipart/form-data'>
        <div >

            <div>
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
            </div>
            <div>
                <div>
                    <label htmlFor="Doc_No" className={`${label_css}`}>Doc_No.</label>
                    <input
                        type='text'
                        id="Doc_No"
                        name="Doc_No"
                        onChange={auditDetail_handleChange}
                        value={auditDetail.Doc_No}
                        placeholder=''
                        className={`${input_css}`} />
                </div>
            </div>
        </div>

        <div className='w-3/4'>
            {auditData.length > 0 && (
                <table className='table-auto'>
                    <thead>
                        <tr>
                            <th className={`${tbl_header}`}>#</th>
                            <th className={`${tbl_header}`}>Clause</th>
                            <th className={`${tbl_header}`}>Check_Points</th>
                            <th className={`${tbl_header}`}>Guide_Lines / Observation</th>
                            {/* <th className={`${tbl_header}`}>Observation</th> */}
                            <th className={`${tbl_header}`}>Status</th>
                            <th className={`${tbl_header}`}>File</th>
                            <th className={`${tbl_header}`}>Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auditData && auditData.map((item, index) => (
                            <tr key={index}>
                                <td className='border border-slate-600 p-1'>{index + 1}</td>
                                <td className='border border-slate-600 p-1'>{item.Clause}</td>
                                <td className='border border-slate-600 p-1'>{item.Check_Points}</td>
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
                                <td className='border border-slate-600 p-1 w-3/4     items-center'>
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

        <div>
            <button type='submit' id="Save" name="Save" className='bg-green-500 text-white'>Save</button>
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