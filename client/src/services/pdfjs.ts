/*
Service for extracting images from PDFs in the application.
TODO remove those awful workarounds
    - use PDFDocumentProxy instead of Document due to react-pdf construction
    - extract PDFPageProxy from react-pdf.PDFPageProxy due to react-pdf construction
    - use react-pdf instead of pdfjs-dist
cf. https://github.com/wojtekmaj/react-pdf#readme
*/
import { pdfjs, PDFPageProxy as _PDFPageProxy, DocumentProps } from 'react-pdf';

type PDFDocumentProxy = Parameters<NonNullable<DocumentProps['onLoadSuccess']>>[0];
type PDFPageProxy = Omit<_PDFPageProxy, 'width' | 'height' | 'originalWidth' | 'originalHeight'>;

// Setting worker path to worker bundle.
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;
// '../public/vendors/pdf.worker.js';

export default pdfjs;

export { PDFDocumentProxy, PDFPageProxy };
