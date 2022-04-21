import { Router } from 'express';
import { getRouter as getDatabaseStorageRouter } from './database.storage.route';
import { getRouter as getDirectoryStorageRouter } from './directory.storage.route';
import { getRouter as getStreamStorageRouter } from './stream.storage.route';

// type Engine = 'directory' | 'database' | 'stream';

function getRouter(engine: string): Router {
  if (engine === 'directory') {
    return getDirectoryStorageRouter();
  }
  if (engine === 'stream') {
    return getStreamStorageRouter();
  }
  if (engine === 'database') {
    return getDatabaseStorageRouter();
  }
  throw new Error(
    `engine attribute should have one of the following values: directory, storage or stream. Instead, it is ${engine}`
  );
}

export { getRouter };
