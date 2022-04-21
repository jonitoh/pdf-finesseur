import handleDirectoryStorage from './directory.storage.middleware';
import handleStreamStorage from './stream.storage.middleware';
import verifyCredentials from './credentials.middleware';
import handleLog from './log.middleware';
import handleError from './error.middleware';

export default {
  handleDirectoryStorage,
  handleStreamStorage,
  verifyCredentials,
  handleLog,
  handleError,
};
