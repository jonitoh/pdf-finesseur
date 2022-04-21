/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
import { Express, Response, Request } from 'express';
import fs from 'fs';
import { HTTP_STATUS_CODE } from '../utils/main';
import { HTTPError } from '../utils/error/http-error';

type MulterRequest = Express.Request;
type OutputElement = { filename: string; path: string };

function uploadFiles(req: MulterRequest, res: Response) {
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

  if (files instanceof Array) {
    output = files.map(({ originalname, path }) => ({
      filename: originalname,
      path,
    }));
  }

  if (!(files instanceof Array)) {
    output = Object.fromEntries(
      Object.keys(files).map((key) => [
        key,
        files[key].map(({ originalname, path }) => ({
          filename: originalname,
          path,
        })),
      ])
    );
  }

  res.status(HTTP_STATUS_CODE.OK).send({ message: 'File Uploaded', output });
}

type Params = { path: string };
function deleteFile(req: Request<Params>, res: Response) {
  const { path } = req.params;

  fs.stat(path, (err, stats) => {
    // check in the last updated
    console.info(`File at path ${path} created at: ${stats.birthtime.toString()}`);
    if (err) {
      throw new HTTPError('UNFOUND_FILE', err.message, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, err);
    }
    fs.unlink(path, (unlinkErr) => {
      if (unlinkErr) {
        throw new HTTPError(
          'CANT_DELETE_FILE',
          unlinkErr.message,
          HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          unlinkErr
        );
      }
      res.sendStatus(HTTP_STATUS_CODE.OK);
    });
  });
}

function deleteAll(req: Request, res: Response) {
  console.info('MULTER DIRECTORY STORAGE -- Entry point for deleting all the files');
  res.sendStatus(HTTP_STATUS_CODE.OK);
}

export default {
  uploadFiles,
  deleteFile,
  deleteAll,
};
