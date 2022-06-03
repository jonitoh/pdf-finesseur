import fs from 'fs';
import { HTTP_STATUS_CODE } from './main';
import { HTTPError } from './error/http-error';

// path should have trailing slash rootPath = "/path/to/remove";
export default function removeEntity(entityPath: string, shouldRemoveRootDir = true) {
  console.log('into remove entity');
  // check if file or directory
  fs.stat(entityPath, (entityErr, entityStats) => {
    if (entityErr) {
      throw new HTTPError(
        'UNFOUND_FILE',
        entityErr.message,
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
        entityErr
      );
    }
    // it's a file so we remove it
    if (entityStats.isFile()) {
      console.info(`File at path ${entityPath} created at: ${entityStats.birthtime.toString()}`);
      // remove file
      fs.unlink(entityPath, (unlinkEntityErr) => {
        if (unlinkEntityErr) {
          throw new HTTPError(
            'CANT_DELETE_FILE',
            unlinkEntityErr.message,
            HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            unlinkEntityErr
          );
        }
      });
    }

    // it's a directory so we need to remove each file or directory
    // and maybe the directory itself
    if (entityStats.isDirectory()) {
      console.info(
        `Directory at path ${entityPath} created at: ${entityStats.birthtime.toString()}`
      );
      // remove all files in it
      fs.readdir(entityPath, (dirErr, files) => {
        if (dirErr) {
          throw new HTTPError(
            'UNFOUND_DIRECTORY',
            dirErr.message,
            HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            dirErr
          );
        }
        // remove all files
        for (let index = 0; index < files.length; index += 1) {
          const filePath = entityPath + files[index];
          fs.stat(filePath, (err, stats) => {
            if (err) {
              throw new HTTPError(
                'UNFOUND_FILE_OR_DIRECTORY',
                err.message,
                HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
                err
              );
            }
            if (stats.isFile()) {
              console.info(`File at path ${filePath} created at: ${stats.birthtime.toString()}`);
              // remove file
              fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                  throw new HTTPError(
                    'CANT_DELETE_FILE',
                    unlinkErr.message,
                    HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
                    unlinkErr
                  );
                }
              });
            }
            // be recursive
            if (stats.isDirectory()) {
              removeEntity(filePath, true);
            }
          });
        }

        // remove rootDir
        if (shouldRemoveRootDir) {
          fs.rmdir(entityPath, (rootErr) => {
            if (rootErr) {
              throw new HTTPError(
                'CANT_DELETE_ROOT',
                rootErr.message,
                HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
                rootErr
              );
            }
          });
        }
      });
    }
  });
}
