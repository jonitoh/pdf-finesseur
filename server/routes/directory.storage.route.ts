import express, { Router } from 'express';
import middleware from '../middlewares/directory.storage.middleware';
import controller from '../controllers/directory.storage.controller';

function getRouter() {
  // Initiate router
  const router = Router();

  // TO serve any file back to the client
  const path = process.env.STORAGEPATH || './public/uploads/';
  router.use(express.static(path));

  // POST ROUTE
  const upload = middleware.handleStorage(path);
  router.post('/', upload, controller.uploadFiles);

  // DELETE ROUTE -- any files
  router.delete('/:path', controller.deleteFile);

  // DELETE ROUTE -- all files
  router.delete('/', controller.deleteAll);

  return router;
}

export { getRouter };
