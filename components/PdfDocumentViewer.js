import React, { useState } from 'react'
import { Document, Page, pdfjs } from "react-pdf";
export default function PdfDocumentViewer({ fileBase64 }) {
    const [numPages, setNumPages] = useState(null);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    }

    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  return (
      <div className='mt-3'>
          <Document className="outer-doc" file={fileBase64} onLoadSuccess={onDocumentLoadSuccess} onContextMenu={(e) => e.preventDefault()}>
              {Array.from(new Array(numPages), (el, index) => (
                  <Page key={`page_${index + 1}`} pageNumber={index + 1} />
              ))}
          </Document>
      </div>
  )
}
