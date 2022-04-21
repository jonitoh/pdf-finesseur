// use of multer
// cf. https://github.com/expressjs/multer#memorystorage
import multer from 'multer';

// our handler tied to our storage
function handleStorage() {
  // multer configuration
  const storage = multer.memoryStorage();

  // handler
  const upload = multer({
    storage,
  }).array('files');

  return upload;
}

export default {
  handleStorage,
};
