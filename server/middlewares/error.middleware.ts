import { Router, Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import { HTTPError } from '../utils/error/http-error';
import { HTTP_STATUS_CODE } from '../utils/main';

function handleStorageError(error: unknown, req: Request, res: Response, next: NextFunction): void {
  if (error instanceof MulterError) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({
      type: `MulterError: ${error.code}`,
      message: error.message,
      additionalMessage: error.field || 'no additional message',
      data: {},
    });
  }
  next(error);
}

function handleHTTPError(error: unknown, req: Request, res: Response, next: NextFunction): void {
  if (error instanceof HTTPError) {
    res.status(error.statusCode).send({
      type: error.name,
      message: error.fullMessage,
      additionalMessage: error.fullAdditionalMessage,
      data: error.info,
    });
  }
  next(error);
}

function handleGenericError(error: unknown, req: Request, res: Response, next: NextFunction): void {
  if (error instanceof Error) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({
      type: error.name,
      message: error.message,
      additionalMessage: 'no additional message',
      data: error.stack,
    });
  }
  next(error);
}

function handleUnknownError(error: unknown, req: Request, res: Response): void {
  res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({
    type: 'error',
    message: 'Unknown error',
    additionalMessage: 'no additional message',
    data: error,
  });
}

function safelyHandleError(): Router {
  const router: Router = Router();

  router.use(handleStorageError);
  router.use(handleHTTPError);
  router.use(handleGenericError);
  router.use(handleUnknownError);

  return router;
}

export default { safelyHandleError };
