import express, { Response, Request, Application } from 'express'; // Import express framework
import { Server } from 'http';
import cors from 'cors';
import corsOptions from './config/cors-options.config';
import middlewares from './middlewares';
import { getRoutes } from './routes';

const { handleLog, handleError } = middlewares;

// thx https://github.com/kentcdodds/express-app-example
function setupCloseOnExit(server: Server): void {
  // thank you stack overflow
  // https://stackoverflow.com/a/14032965/971592
  function exitHandler(options: { exit?: boolean } = {}): void {
    try {
      server.close();
      console.info('Server successfully closed');
    } catch (e: unknown) {
      console.warn(
        `Something went wrong closing the server${
          e instanceof Error && e.stack ? `: ${e.stack}` : ''
        }`
      );
    }
    // eslint-disable-next-line no-process-exit
    if (options.exit) process.exit();
  }

  // do something when app is closing
  process.on('exit', exitHandler);

  // catches ctrl+c event
  process.on('SIGINT', exitHandler.bind(null, { exit: true }));

  // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
  process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

  // catches uncaught exceptions
  process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
}

export async function startServer(
  port: number = parseFloat(process.env.PORT || '4000')
): Promise<Server> {
  // Initiate express app
  const app: Application = express();

  // Implement middleware;
  // custom logs
  app.use(handleLog.logHandler);

  // CORS
  app.use(cors(corsOptions));
  // parse requests of content-type - application/json
  app.use(express.json());
  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));

  // being able to serve static files
  app.use('/public', express.static('public'));

  // Implement routes
  app.use('/api', getRoutes());

  // having a viable route -- for development purpose
  if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
    console.info('measures for development purpose');
    // HELLO WORLD ROUTE
    app.get('/hello-world', (req: Request, res: Response) => {
      res.send({ message: 'YOUR EXPRESS BACKEND IS ALIVE' });
    });
  }

  // for development and avoid CORS stuff
  if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
    app.get('*', (req, res) => {
      res.sendFile('build/index.html', { root: __dirname });
    });
  }

  // error Handlers
  // -- log into a file the errors
  app.use(handleLog.errorHandler);
  // handleError
  app.use(handleError.safelyHandleError());

  return new Promise((resolve) => {
    const server: Server = app.listen(port, () => {
      const usedServer = server?.address();
      console.info(
        `Listening on port ${
          usedServer && typeof usedServer !== 'string' ? usedServer.port : 'unknown'
        }`
      );
      console.info(
        `Listening on address ${
          usedServer && typeof usedServer !== 'string' ? usedServer.address : 'unknown'
        }`
      );
      const originalClose = server.close.bind(server);

      function closeServer(callback?: ((err?: Error | undefined) => void) | undefined) {
        console.info('Should we dump the database?', !!process.env.DB_DUMP_AT_CLOSE);
        return originalClose(callback);
      }
      server.close = closeServer;
      setupCloseOnExit(server);
      resolve(server);
    });
  });
}

export default { startServer };
