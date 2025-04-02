import React, { useState } from 'react'
// import ImgsViewer from "react-images-viewer";
import { IoMdDownload } from "react-icons/io";

export const ImageViewer = ({ imageSrc, showImgModel, setShowImgModel }) => {

    // const [isOpen, setIsOpen] = useState(showImgModel); // false

    // const openModal = () => setIsOpen(true);
    // const closeModal = () => setIsOpen(false);
    const closeModal = () => setShowImgModel(false);

    const downloadImage = () => {
        const link = document.createElement('a');
        link.href = imageSrc.ImgSrc;
        link.download = imageSrc.Audit_UID + '_' + imageSrc.Clause + '_' + imageSrc.Img_No + '_image.jpg'; // Default filename for download
        link.click();
    };

    return (
        <div>
            {/* Thumbnail Image */}
            {/* <img
                src={imageSrc}
                alt="Thumbnail"
                className="w-48 cursor-pointer"
                onClick={openModal}
            /> */}

            {/* Modal */}
            {showImgModel && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                    <div className="relative max-w-4xl max-h-screen bg-white rounded-md shadow-lg overflow-hidden">
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-white bg-red-500 hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center"
                        >
                            &times;
                        </button>

                        {/* Full-Screen Image */}
                        <img
                            src={imageSrc.ImgSrc}
                            alt="Full Screen"
                            className="w-full max-h-screen object-contain"
                        />

                        {/* Download Button */}
                        <button
                            onClick={downloadImage}
                            className="absolute bottom-3 right-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-md"
                        >
                            <IoMdDownload />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
