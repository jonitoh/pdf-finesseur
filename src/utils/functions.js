/*
Utilities -- functions.
*/
import { v4 as uuidv4 } from "uuid";

// Build resilient ids
const generateStrongId = () => (uuidv4());
const generateWeakId = (min = 1, max = 100) => (`${(Math.floor(Math.random() * (max - min) + min))}`);

// manage data
const dataURLtoFile = (dataURL, filename) => {
    // mime extension extraction
    const mimeExtension = dataURL.split(',')[0].split(':')[1].split(';')[0];

    // Extract remaining part of URL and convert it to binary value
    const byteString = window.atob(dataURL.split(',')[1]);

    const blobArray = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        blobArray[i] = byteString.charCodeAt(i);
    }

    return new File([blobArray], filename, { type: mimeExtension, lastModified: new Date() });
}

export {
    generateStrongId,
    generateWeakId,
    dataURLtoFile
}