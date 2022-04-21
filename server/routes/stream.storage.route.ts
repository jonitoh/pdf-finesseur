import { Router } from 'express';
import middleware from '../middlewares/stream.storage.middleware';
import controller from '../controllers/stream.storage.controller';

function getRouter() {
  // Initiate router
  const router = Router();

  // POST ROUTE
  const upload = middleware.handleStorage();
  router.post('/', upload, controller.uploadFiles);

  // DELETE ROUTE -- any files
  router.delete('/:path', controller.deleteFile);

  // DELETE ROUTE -- all files
  router.delete('/', controller.deleteAll);

  return router;
}

export { getRouter };
