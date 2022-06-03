import { Request, Response } from 'express';
import { HTTP_STATUS_CODE } from '../utils/main';

function uploadFiles(req: Request, res: Response) {
  console.info('MULTER STREAM STORAGE -- Entry point for uploading files');
  res.sendStatus(HTTP_STATUS_CODE.OK);
}

function deleteFile(req: Request, res: Response) {
  console.info('MULTER STREAM STORAGE -- Entry point for deleting a file');
  res.sendStatus(HTTP_STATUS_CODE.OK);
}

function deleteAllFiles(req: Request, res: Response) {
  console.info('MULTER STREAM STORAGE -- Entry point for deleting all the files');
  res.sendStatus(HTTP_STATUS_CODE.OK);
}

export default {
  uploadFiles,
  deleteFile,
  deleteAllFiles,
};
