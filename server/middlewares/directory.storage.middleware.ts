// use of multer
// cf. https://github.com/expressjs/multer#diskstorage
import multer from 'multer';
import { HTTPError } from '../utils/error/http-error';
import { HTTP_STATUS_CODE } from '../utils/main';

const availableMimetypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];

// our handler tied to our storage
function handleStorage(path: string) {
  console.info('chosen storage path', path);

  // multer configuration
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, path);
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

export default {
  handleStorage,
};
