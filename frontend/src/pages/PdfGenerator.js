

import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Get_AuditData_Service, Get_AuditDetail_Service } from '../services/EditAuditService';
import { LoadSpinner } from '../components';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Logo from '../assets/INEL_logo_1.png'

export const PdfGenerator = () => { // { auditData, auditDetail, Logo }
    const location = useLocation();
    const navigate = useNavigate(); // Initialize navigate
    const edit_row = location.state;
    const { id, Audit_UID, Department, Audit_Date, } = edit_row; // destructure

    const [isLoading, setIsLoading] = useState(false);

    const auditDetail_InitialValue = {
        id: '',
        Audit_UID: '',
        AuditNo: '',
        Year: '',
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
        Status: '',
        ReviewedBy: ''
    }

    const [auditDetail, setAuditDetail] = useState({});
    const [auditData, setAuditData] = useState([]);
    const pdfGenerated = useRef(false); // Track if PDF has been generated

    // get auditData ...
    const Get_AuditData = async (doc_no) => {
        try {
            const response = await Get_AuditData_Service(doc_no);
            setAuditData(Array.isArray(response) ? response : []);

        } catch (error) {
            console.error("Error fetching audit data:", error);
        }

    }

    // get auditDetails ...
    const Get_AuditDetail = async (Audit_UID) => {
        try {
            const response = await Get_AuditDetail_Service(Audit_UID);
            setAuditDetail(prev => ({ ...prev, ...(response || {}) }));

        } catch (error) {
            console.error("Error fetching audit detail:", error);
        }

    }

    useEffect(() => {

        const fetchDataAndGeneratePdf = async () => {
            if (isLoading || pdfGenerated.current) return; // Prevent duplicate execution

            setIsLoading(true); // Start loading
            try {
                const fetchedAuditData = await Get_AuditData_Service(Audit_UID);
                const fetchedAuditDetail = await Get_AuditDetail_Service(Audit_UID);

                // Update state
                setAuditData(Array.isArray(fetchedAuditData) ? fetchedAuditData : []);
                setAuditDetail(fetchedAuditDetail || {});

                // Call generatePdf with the fetched data
                generatePdf(fetchedAuditData, fetchedAuditDetail);
                // Mark as generated
                pdfGenerated.current = true;

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false); // Stop loading
            }
        };

        if (Audit_UID && !pdfGenerated.current) {
            fetchDataAndGeneratePdf();
        }

    }, [Audit_UID, isLoading])

    console.log('auditData', auditData)
    console.log('auditDetail', auditDetail)


    // https://codepen.io/someatoms/pen/vLYXWB?editors=1010


    // Modify generatePdf to accept data as arguments
    const generatePdf = (data, detail) => {
        const doc = new jsPDF();


        // Add header section with custom content
        const headerContent = () => {

            // Adding border/box for audit details
            doc.setLineWidth(0.2); // Border thickness
            doc.rect(15, 15, 180, 35); // Draws a rectangle (x, y, width, height)

            // Add company logo
            if (Logo) {
                doc.addImage(Logo, "PNG", 20, 20, 10, 10); // Adjust x, y, width, height
            }

            // Add company name
            doc.setFontSize(8);
            doc.text("INDIA NIPPON ELECTRICAL LTD", 35, 25);

            // Add audit checklist title
            doc.setFontSize(8);
            doc.setFont("helvetica", "bold");
            doc.text("QMS - AUDIT CHECKLIST", 105, 25, { align: "center" });

            // Horizontal Line (e.g., under the title)
            doc.setLineWidth(0.2); // Set thickness
            doc.line(15, 38, 195, 38); // From (x1, y1) to (x2, y2)

            // Vertical Line (e.g., as a separator)
            doc.line(50, 38, 50, 50); // From (x1, y1) to (x2, y2)
            doc.line(100, 38, 100, 50); // From (x1, y1) to (x2, y2)
            doc.line(150, 38, 150, 50); // From (x1, y1) to (x2, y2)

            // Add audit details
            doc.setFontSize(6);
            doc.setFont("helvetica", "normal");
            doc.text(`Doc No.: ${detail.Doc_No}`, 150, 20);
            doc.text(`Rev Date: ${detail.Rev_Date}`, 150, 25);
            doc.text(`Rev No.: ${detail.Rev_No}`, 150, 30);

            // Add additional details
            doc.text(`Auditor: ${detail.Auditor}`, 17, 42);
            doc.text(`Audit Date: ${detail.Audit_Date}`, 52, 42);
            doc.text(`Department: ${detail.Department}`, 102, 42);
            doc.text(`Process: ${detail.Process}`, 152, 42);

            // Add additional details
            doc.text(`Auditee: ${detail.Auditee}`, 17, 48);
            // doc.text(`Ref No.: ${detail.Rev_No}`, 52, 48);
            doc.text(`Shift: ${detail.Shift}`, 52, 48);
            doc.text(`Status: ${detail.Status}`, 102, 48);
            doc.text(`Plant: ${detail.Plant}`, 152, 48);

            doc.line(15, 44, 195, 44); // From (x1, y1) to (x2, y2)

            // doc.line(20, 50, 200, 50); // From (x1, y1) to (x2, y2)
        };

        // Call headerContent before adding the table
        headerContent();

        // Table columns and data
        const columns = [
            { header: "S.No", dataKey: "index" },
            { header: "Clause", dataKey: "Clause" },
            { header: "Check Points", dataKey: "Check_Points" },
            { header: "Guide Lines", dataKey: "Guide_Lines" },
            { header: "Audit observation (Including Objective Evidences)", dataKey: "Observation" },
            { header: "Status", dataKey: "Status" },
        ];

        const rows = (data || []).map((item, index) => ({
            index: index + 1,
            Clause: item.Clause || "N/A",
            Check_Points: item.Check_Points || "N/A",
            Guide_Lines: item.Guide_Lines || "N/A",
            Observation: item.Observation || "N/A",
            Status: item.Status || "N/A",
        }));


        const rowsPerPage = 8; // Set the number of rows per page
        const totalPages = Math.ceil(rows.length / rowsPerPage); // Calculate total pages

        for (let i = 0; i < totalPages; i++) {
            const pageRows = rows.slice(i * rowsPerPage, (i + 1) * rowsPerPage); // Get rows for the current page

            // Add table to PDF
            doc.autoTable({
                columns,
                body: pageRows, // rows
                // startY: i === 0 ? 55 : doc.autoTable.previous.finalY + 10, // Adjust start position , 55, // Start table below header
                startY: i === 0 ? 55 : 15, // Reset position for new pages
                margin: { top: 10 },
                didParseCell: function (data) {
                    if (data.column.dataKey === "Status") {
                        if (data.cell.raw === "O+") {
                            // data.cell.styles.fillColor = [0, 255, 0]; // Green
                            data.cell.styles.textColor = [0, 128, 0]; // Green
                        } else if (data.cell.raw === "OI") {
                            // data.cell.styles.fillColor = [255, 255, 0]; // Yellow
                            data.cell.styles.textColor = [255, 165, 0]; // Orange (Yellowish)
                        } else if (data.cell.raw === "NC") {
                            // data.cell.styles.fillColor = [255, 0, 0]; // Red
                            data.cell.styles.textColor = [255, 0, 0]; // Red
                        }
                    }
                },
                didDrawPage: (data) => {
                    // Add page footer
                    const pageCount = doc.internal.getNumberOfPages();
                    doc.setFontSize(8);
                    doc.text(
                        // `Page ${pageCount}`,
                        `Page ${i + 1} of ${totalPages}`,
                        data.settings.margin.left,
                        doc.internal.pageSize.height - 10
                    );
                },
                styles: {
                    overflow: "linebreak",
                    cellPadding: 2,
                    fontSize: 8,
                },

                columnStyles: {
                    index: { cellWidth: 15 }, // S.No column width
                    Clause: { cellWidth: 15 },
                    Check_Points: { cellWidth: 40 },
                    Guide_Lines: { cellWidth: 50 },
                    Observation: { cellWidth: 50 },
                    Status: { cellWidth: 15 },
                },
                // pageBreak: "auto", // Automatically handle pagination
            });








            // If this is the last page, add "Auditor" and "Reviewed By" below the table
            if (i === totalPages - 1) {
                let finalY = doc.autoTable.previous.finalY + 10; // Position below last row
                doc.setLineWidth(0.2); // Set thickness
                doc.line(15, finalY - 6, 198, finalY - 6); // From (x1, y1) to (x2, y2)

                doc.setFontSize(8);
                doc.text(`Auditor: ${detail.Auditor}`, 17, finalY);
                doc.text(`Reviewed By (UMR/CMR) : ${detail.ReviewedBy}`, 152, finalY);


                // Move to a new page for the image table
                doc.addPage();




                // Debugging Logs
                console.log("Data:", data);

                let startY = 10; // Start position for the first image div
                const imageHeight = 30;
                const imageWidth = 50;
                const spacing = 10; // Space between images

                const pageHeight = doc.internal.pageSize.height; // Get page height

                // Loop through auditData to place images in separate div-like rows
                (data || []).forEach((item, index) => {
                    // Add index and clause above each image
                    //  doc.text(`${index + 1}`, 20, startY); // Display index
                    doc.text(`(${index + 1}) Clause: ${item.Clause || 'N/A'}`, 20, startY + 5); // Display clause below index
                    startY += 10; // Move down a bit to leave space for index and clause


              


                    // Function to add an image safely with pagination
                    const addImageToPdf = (image, x, width, height) => {
                        if (startY + height > pageHeight - 20) { // Check if image fits
                            doc.addPage();
                            startY = 20; // Reset start position on new page
                        }
                        doc.addImage(image, "JPEG", x, startY, width, height);
                        startY += height + 5; // Move Y position down for the next image
                    };

                    // if (item.Images) addImageToPdf(item.Images, 20, 50, 30);
                    // if (item.Images_2) addImageToPdf(item.Images_2, 20, 50, 30);
                    // if (item.Images_3) addImageToPdf(item.Images_3, 20, 50, 30);

                    const imagesToShow = [];
                    if (item.Images) imagesToShow.push(item.Images);
                    if (item.Images_2) imagesToShow.push(item.Images_2);
                    if (item.Images_3) imagesToShow.push(item.Images_3);

                    if (imagesToShow.length > 0) {
                        let startX = 20;

                        imagesToShow.forEach((image, i) => {
                            if (startX + imageWidth > doc.internal.pageSize.width - 20) {
                                // If image exceeds page width, move to next row
                                startX = 20;
                                startY += imageHeight + spacing;
                            }

                            try {
                                doc.addImage(image, "JPEG", startX, startY, imageWidth, imageHeight);
                                startX += imageWidth + spacing; // Move to next position
                            } catch (err) {
                                console.error("Error adding image:", err);
                            }
                        });

                        startY += imageHeight + spacing; // Move to the next section
                    }


                   
                    // Add a horizontal line after each row of content (index, clause, images)
                    doc.setLineWidth(0.2); // Set thickness
                    doc.line(20, startY, doc.internal.pageSize.width - 20, startY); // Draw the line across the page

                    // Add space between each div row of images
                    startY += 5; // Adjust space between rows of images

                    // If the next section goes beyond the page, add a new page
                    if (startY > doc.internal.pageSize.height - 40) {
                        // addPageNumber();
                        doc.addPage();
                        // currentPage++;
                        startY = 20; // Reset start position
                    }
                });




                // // Define table columns
                // const image_columns = [
                //     { header: "S.No", dataKey: "index" },
                //     { header: "Clause", dataKey: "Clause" },
                //     { header: "Image 1", dataKey: "Images" },
                //     { header: "Image 2", dataKey: "Images_2" },
                //     { header: "Image 3", dataKey: "Images_3" }
                // ];

                // // Log auditData for debugging
                // console.log("Audit Data:", data);

                // // Process table rows
                // const image_rows = data.map((item, index) => ({
                //     index: index + 1,
                //     Clause: item.Clause || "N/A",
                //     Images: item.Images || "",  // Directly use Base64 data
                //     Images_2: item.Images_2 || "",
                //     Images_3: item.Images_3 || ""
                // }));

                // // Log image rows for debugging
                // console.log("Image Rows:", image_rows);

                // // Add table
                // doc.autoTable({
                //     columns: image_columns,
                //     body: image_rows,
                //     startY: 20,
                //     columnStyles: {
                //         Images: { cellWidth: 50 },
                //         Images_2: { cellWidth: 50 },
                //         Images_3: { cellWidth: 50 }
                //     },
                //     didDrawCell: function (data) {
                //         const columnIndex = data.column.index;
                //         if (columnIndex >= 2) { // Image columns start from index 2
                //             let imgKey = image_columns[columnIndex].dataKey; // Get column key
                //             let imgData = data.row.raw[imgKey]; // Get Base64 data

                //             // Log the image data for debugging
                //             // console.log(`Image data for ${imgKey} at row ${data.row.index}:`, imgData);

                //             // Check if imgData exists and has the correct format
                //             if (imgData && imgData.startsWith("data:image")) {
                //                 let format = imgData.includes("png") ? "PNG" : "JPEG"; // Detect format
                //                 let imgWidth = 40;
                //                 let imgHeight = 20;

                //                 try {
                //                     // Add the image to the PDF
                //                     doc.addImage(imgData, format, data.cell.x + 5, data.cell.y + 2, imgWidth, imgHeight);

                //                     // console.log(`Added ${format} image at X: ${data.cell.x}, Y: ${data.cell.y}`);
                //                 } catch (err) {
                //                     console.error(`Error adding image: ${err.message}`);
                //                 }
                //             } else {
                //                 console.log("No valid image data found for row " + data.row.index);
                //             }
                //         }
                //     }
                // });
            }




            if (i < totalPages - 1) {
                doc.addPage(); // Add a new page before the next batch of rows
            }
        }





        // Save PDF
        doc.save(`${Audit_UID}_AuditReport.pdf`);

        // Mark as generated
        pdfGenerated.current = true;
        setIsLoading(true);

        navigate("/audit", { replace: true }); // Go back to the previous page

        // Delay navigation slightly to ensure PDF download is complete
        // setTimeout(() => {
        //     navigate("/audit", { replace: true }); // Redirect after delay
        // }, 1000); // Adjust delay if needed
    };






    return (
        <div>
            {/* Loading Spinner */}
            {isLoading && <LoadSpinner isLoading={isLoading} />}

            <button
                onClick={() => {
                    if (!pdfGenerated.current) {
                        generatePdf(auditData, auditDetail);
                        pdfGenerated.current = true;
                    }
                }}
            >
                Generate PDF</button>
        </div>
    );
};

// Sample data
// const auditData = [
//     {
//         Clause: "Clause 1",
//         Check_Points: "Check Point 1",
//         Guide_Lines: "Guide Line 1",
//         Observation: "Observation 1",
//         Status: "Pass",
//     },
//     {
//         Clause: "Clause 2",
//         Check_Points: "Check Point 2",
//         Guide_Lines: "Guide Line 2",
//         Observation: "Observation 2",
//         Status: "Fail",
//     },
// ];

// const auditDetail = {
//     Doc_No: "1234",
//     Audit_Date: "2025-01-25",
//     Rev_No: "01",
//     Rev_Date: "2025-01-20",
//     Department: "Quality",
//     Auditor: "John Doe",
//     Process: "Manufacturing",
// };

// const Logo = "https://via.placeholder.com/100"; // Replace with actual logo URL or base64 image

// export default function App() {
//     return <PdfGenerator auditData={auditData} auditDetail={auditDetail} Logo={Logo} />;
// }
