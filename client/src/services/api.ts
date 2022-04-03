/*
Service for the server in the application.
*/
import axios, { AxiosResponse } from 'axios';

// ----- INSTANCES ----- //
const storageInstance = axios.create({
  baseURL: `${process.env.API_URL}/storage`,
  timeout: 1000,
  headers: {
    'Content-Type': 'multipart/form-data',
    // authorization: process.env.SERVER_TOKEN || "token"
  },
});

// ----- HELPERS ----- //
function genericFilename(file: File, filename: string | undefined) {
  return filename || file.name;
}

export function manageErrorMessageFromCode(code: string | undefined) {
  if (code) {
    switch (code) {
      case 'FILE_MISSING':
        return 'Please select a file before uploading!';
      case 'LIMIT_FILE_SIZE':
        return 'File size is too large. Please upload files below 1MB!';
      case 'INVALID_TYPE':
        return 'This file type is not supported! Only .png, .jpg and .jpeg files are allowed';
      case 'CANT_DELETE': // TODO to remove it is for DELETE
        return 'Unsuccessful deletion';
      case 'UNFOUND_FILE': // TODO to remove it is for DELETE
        return 'Unfound file during the deletion process';
      default:
        return 'Sorry! Something went wrong. Please try again later';
    }
  } else {
    return 'Unknown error!!';
  }
}

// ----- GENERIC PARTS ----- //
function genericBefore(file: File, filename: string | undefined): [File, string] {
  const newFilename = genericFilename(file, filename);
  return [file, newFilename];
}

function genericUploadProgress(file: File, filename: string | undefined) {
  return (progressEvent: ProgressEvent) => {};
}

function hasStatus(response: unknown): response is { status: number } {
  if (typeof response !== 'object' || !response) {
    return false;
  }
  return 'status' in response;
}

function genericSuccess<TResponse, TResult>(
  file: File,
  filename: string,
  response: AxiosResponse<TResponse>
) {
  console.info('response in success', response);
  if (hasStatus(response)) {
    console.info('status of the response', response.status);
  } else {
    console.info('oups something went wrong');
  }
  return response as unknown as TResult;
}

function genericCatcher(file: File, filename: string | undefined, error: unknown) {
  console.info('catched error', error);
  let code: string | undefined;
  if (axios.isAxiosError(error)) {
    code = error?.response?.data?.code;
  }
  const message = manageErrorMessageFromCode(code);
  console.warn('appropriate error message', message);
  return undefined;
}

// ----- UPLOAD FILE ----- //
type UploadFileArgs<TResponse, TResult> = {
  file: File;
  filename?: string;
  before?(file: File, filename: string | undefined): [File, string];
  onUploadProgress?(
    file: File,
    filename: string | undefined
  ): (progressEvent: ProgressEvent) => void;
  success?(file: File, filename: string, response: AxiosResponse<TResponse>): TResult;
  catcher?(file: File, filename: string | undefined, error: unknown): undefined;
};

export async function uploadFile<TResponse = unknown, TResult = void>({
  file,
  filename = undefined,
  before = genericBefore,
  onUploadProgress = genericUploadProgress,
  success = genericSuccess,
  catcher = genericCatcher,
}: UploadFileArgs<TResponse, TResult>): Promise<TResult | undefined> {
  // before process
  const [processedFile, processedFilename] = before(file, filename);

  // initialisation
  const formData = new FormData();
  formData.append('files', processedFile, processedFilename);

  // send request
  async function sendRequest() {
    return (
      storageInstance
        .request({
          url: '/',
          method: 'POST',
          data: formData,
          onUploadProgress: onUploadProgress(processedFile, processedFilename),
        })
        // handle response
        .then((response: AxiosResponse<TResponse>) =>
          success(processedFile, processedFilename, response)
        )
        // catch errors
        .catch((error) => catcher(processedFile, processedFilename, error))
    );
  }

  return sendRequest();
}
