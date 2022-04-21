import { Router } from 'express';
import { getRouter as getStorageRouter } from './storage.route';

function getRoutes(): Router {
  // Initiate express router
  const router: Router = Router();

  // Implement routes
  // --> routes for file management
  router.use('/storage', getStorageRouter(process.env.STORAGE || 'directory'));

  return router;
}

export { getRoutes };
