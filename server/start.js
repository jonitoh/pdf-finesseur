const express = require('express');// Import express framework
const cors = require('cors');
const bodyParser = require('body-parser');
const { getRoutes } = require('./routes');

// cross-origin resource sharing configuration
const checkOrigin = (whitelist = ['*']) => (
  (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1 || whitelist.indexOf('*') !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  }
)

// error Middleware
const errorMiddleware = (error, req, res, next) => {
  if (res.headersSent) {
    next(error)
  } else {
    logger.error(error)
    res.status(500)
    res.json({
      message: error.message,
      // we only add a `stack` property in non-production environments
      ...(process.env.NODE_ENV === 'production' ? null : { stack: error.stack }),
    })
  }
}

// thx https://github.com/kentcdodds/express-app-example
const setupCloseOnExit = (server) => {
  // thank you stack overflow
  // https://stackoverflow.com/a/14032965/971592
  const exitHandler = async (options = {}) => {
    await server
      .close()
      .then(() => {
        logger.info('Server successfully closed')
      })
      .catch((e) => {
        logger.warn('Something went wrong closing the server', e.stack)
      })
    // eslint-disable-next-line no-process-exit
    if (options.exit) process.exit()
  }

  // do something when app is closing
  process.on('exit', exitHandler)

  // catches ctrl+c event
  process.on('SIGINT', exitHandler.bind(null, { exit: true }))

  // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR1', exitHandler.bind(null, { exit: true }))
  process.on('SIGUSR2', exitHandler.bind(null, { exit: true }))

  // catches uncaught exceptions
  process.on('uncaughtException', exitHandler.bind(null, { exit: true }))
}

const startServer = (port = process.env.PORT || 5000) => {
  // Initiate express app
  const app = express();

  // Initiate config for middleware
  const corsOptions = {
    origin: '*',//checkOrigin([`http://localhost:${port}`]),
    credentials: true,
    optionsSuccessStatus: 200,
  }

  // Implement middleware;
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors(corsOptions));
  app.use(errorMiddleware);

  // being able to serve static files
  app.use('/public', express.static('public'));

  // Implement routes
  app.use('/', getRoutes())


  // for development and avoid CORS stuff
  if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
    app.get('*', (req, res) => {
      res.sendFile('build/index.html', { root: __dirname })
    })
  }

  // HELLO WORLD ROUTE
  app.get('/hello-world', (req, res) => {
    res.send({ express: 'YOUR EXPRESS BACKEND IS ALIVE' });
  });

  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      console.info(`Listening on port ${server.address().port}`)
      const originalClose = server.close.bind(server)
      server.close = () => {
        return new Promise((resolveClose) => {
          originalClose(resolveClose)
        })
      }
      setupCloseOnExit(server)
      resolve(server)
    })
  })
}

module.exports = { startServer }