/*
Service for the server in the application.
*/
import axios from "axios";
import { API_URL } from "../utils/constants";

// ----- INSTANCES ----- //
const storageInstance = axios.create({
    baseURL: `${API_URL}/storage`,
    timeout: 1000,
    headers: {
        'Content-Type': 'multipart/form-data',
        //authorization: process.env.SERVER_TOKEN || "token"
    }
});

// ----- HELPERS ----- //
const genericFilename = (file, filename) => (!!filename ? filename : file.name)

const manageErrorMessageFromCode = code => {
    if (code) {
        switch (code) {
            case "FILE_MISSING":
                return "Please select a file before uploading!"
                break
            case "LIMIT_FILE_SIZE":
                return "File size is too large. Please upload files below 1MB!"
                break
            case "INVALID_TYPE":
                return "This file type is not supported! Only .png, .jpg and .jpeg files are allowed"
                break
            case "CANT_DELETE":// TODO to remove it is for DELETE
                return 'Unsuccessful deletion'
                break
            case "UNFOUND_FILE":// TODO to remove it is for DELETE
                return 'Unfound file during the deletion process'
                break
            default:
                return "Sorry! Something went wrong. Please try again later"
                break
        }
    } else {
        return "Unknown error!!"
    }
}

// ----- GENERIC PARTS ----- //
const genericBefore = (file, filename) => {
    filename = genericFilename(file, filename);
    return [file, filename]
}

const genericUploadProgress = (file, filename) => ((progressEvent) => {})

const genericSuccess = (file, filename, response) => {
    console.log("response in success", response)
    if (response.status === 200) {
        console.log("everything is ok")
    } else {
        console.log("oups something went wrong")
    }
}

const genericCatcher = (file, filename, error) => {
    console.log("catched error", error);
    const { code } = error?.response?.data;
    const message = manageErrorMessageFromCode(code)
    console.log("appropriate error message", message)
}

// ----- UPLOAD FILE ----- //
const uploadFile = async ({
    file,
    filename,
    before = (file, filename) => genericBefore(file, filename),
    onUploadProgress = genericUploadProgress(file, filename),
    success = (file, filename, response) => genericSuccess(file, filename, response),
    catcher = (file, filename, error) => genericCatcher(file, filename, error),
    returnResult = false
}) => {
    // before process
    [file, filename] = before(file, filename);

    // initialisation
    let formData = new FormData();
    formData.append('files', file, filename)

    //send request
    const request = async () => await storageInstance.request({
        url: "/",
        method: "POST",
        data: formData,
        onUploadProgress: onUploadProgress,
    })
        // handle response
        .then(response => success(file, filename, response))
        // catch errors
        .catch(error => catcher(file, filename, error))

    if (returnResult) {
        return request()
    } else {
        request()
        return;
    }

}

export {
    manageErrorMessageFromCode,
    uploadFile
}