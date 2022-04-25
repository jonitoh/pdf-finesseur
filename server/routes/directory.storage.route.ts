import { Router } from 'express';
import middleware from '../middlewares/directory.storage.middleware';
import controller from '../controllers/directory.storage.controller';

function getRouter() {
  // Initiate router
  const router = Router();

  const storagePath = process.env.SERVER_STORAGEPATH || '../uploads/';

  // POST ROUTE
  const upload = middleware.handleStorage(storagePath);
  router.post('/', upload, controller.uploadFiles);

  // DELETE ROUTE -- any files
  router.delete('/:path', controller.deleteFile);

  // DELETE ROUTE -- all files
  router.delete('/', controller.deleteAll);

  return router;
}

export { getRouter };
