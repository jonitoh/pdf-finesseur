/* eslint-disable no-param-reassign */
// use of multer
// cf. https://github.com/expressjs/multer#diskstorage
import multer from 'multer';
import path from 'path';
import express, { Application, Request } from 'express';
import { HTTPError } from '../utils/error/http-error';
import { HTTP_STATUS_CODE } from '../utils/main';

const availableMimetypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];

// our handler tied to our storage
function handleStorage(storagePath: string) {
  console.info('chosen storage path', storagePath);

  // multer configuration
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, storagePath);
    },
    filename(req, file, cb) {
      cb(null, file.originalname);
    },
  });

  // handler
  const upload = multer({
    storage,
    fileFilter(req, file, cb) {
      if (availableMimetypes.indexOf(file.mimetype) !== -1) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(
          new HTTPError(
            'INVALID_TYPE',
            `This file has a wrong format.`,
            HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            {}
          )
        );
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  }).array('files');

  return upload;
}

function getPathFromStorageAsStatic(storagePath: string, staticRoute: string) {
  return function getFullPathFromStatic(req: Request, filePath: string) {
    const normalizedFilePath = path.isAbsolute(filePath) ? filePath : path.normalize(filePath);
    console.debug('normalizedFilepath', normalizedFilePath);

    const normalizedStoragePath = path.isAbsolute(storagePath)
      ? storagePath
      : path.normalize(storagePath);
    console.debug('normalizedStoragepath', normalizedStoragePath);

    const basePath = path.relative(normalizedStoragePath, normalizedFilePath);
    console.debug('basePath', basePath);

    if (req.headers.host) {
      const fullPath = `${req.protocol}://${req.headers.host}${staticRoute}/${basePath}`;
      console.debug('fullPath', fullPath);
      return fullPath;
    }
    return filePath;
  };
}

function serveStorageAsStatic(storagePath: string) {
  return function serveAsStatic(app: Application) {
    const staticRoute = process.env.SERVER_STATICROUTE || '/uploads';
    app.use(staticRoute, express.static(storagePath));

    app.locals.staticRoute = staticRoute;
    app.locals.getFullPath = getPathFromStorageAsStatic(storagePath, staticRoute);
  };
}

export default {
  handleStorage,
  serveStorageAsStatic,
};
