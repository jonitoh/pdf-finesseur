import { Router } from 'express';
import storagePath from '../config/storage.config';
import middleware from '../middlewares/directory.storage.middleware';
import controller from '../controllers/directory.storage.controller';

function getRouter() {
  // Initiate router
  const router = Router();

  // POST ROUTE
  const upload = middleware.handleStorage(storagePath);
  router.post('/', upload, controller.uploadFiles);

  // DELETE ROUTE -- any files
  router.delete('/:path', controller.deleteFile);

  // DELETE ROUTE -- all files
  router.delete('/', controller.deleteAllFiles);

  return router;
}

export { getRouter };
