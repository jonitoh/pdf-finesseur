/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
import { Express, Response, Request as ExpressRequest } from 'express';
import { HTTP_STATUS_CODE } from '../utils/main';
import { HTTPError } from '../utils/error/http-error';
import removeEntity from '../utils/storage';
import storagePath from '../config/storage.config';

interface Request extends Express.Request, ExpressRequest {}
type OutputElement = { filename: string; path: string };

function uploadFiles(req: Request, res: Response) {
  const { files } = req;
  if (!files) {
    throw new HTTPError(
      'FILE_MISSING',
      `No file has been sent.`,
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      {}
    );
  }
  let output: OutputElement[] | { [fieldname: string]: OutputElement[] } = [];
  let outputType: 'undefined' | 'array' | 'dict' = 'undefined';

  if (files instanceof Array) {
    outputType = 'array';
    output = files.map(({ originalname, path }) => ({
      filename: originalname,
      path: req.app.locals.getFullPath(req, path) as string,
    }));
  }

  if (!(files instanceof Array)) {
    outputType = 'dict';
    output = Object.fromEntries(
      Object.keys(files).map((key) => [
        key,
        files[key].map(({ originalname, path }) => ({
          filename: originalname,
          path: req.app.locals.getFullPath(req, path) as string,
        })),
      ])
    );
  }

  res.status(HTTP_STATUS_CODE.OK).send({ message: 'File Uploaded', output, type: outputType });
}

type Params = { path: string };
function deleteFile(req: ExpressRequest<Params>, res: Response) {
  const { path } = req.params;
  removeEntity(path);
  res.sendStatus(HTTP_STATUS_CODE.OK);
}

function deleteAllFiles(req: Request, res: Response) {
  console.info('MULTER DIRECTORY STORAGE -- Entry point for deleting all the files');
  removeEntity(storagePath, false);
  res.sendStatus(HTTP_STATUS_CODE.OK);
}

export default {
  uploadFiles,
  deleteFile,
  deleteAllFiles,
};
