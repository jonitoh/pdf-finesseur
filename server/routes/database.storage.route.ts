import { Router } from 'express';
import controller from '../controllers/database.storage.controller';

function getRouter() {
  // Initiate router
  const router = Router();

  // POST ROUTE
  router.post('/', controller.uploadFiles);

  // DELETE ROUTE -- any files
  router.delete('/:path', controller.deleteFile);

  // DELETE ROUTE -- all files
  router.delete('/', controller.deleteAll);

  return router;
}

export { getRouter };
