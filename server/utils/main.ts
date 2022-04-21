/* eslint-enable */
const pad = (number: number): string => (number < 10 ? `0${number}` : `${number}`);

const formatDate = (date: Date): string =>
  `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}-${pad(
    date.getUTCHours()
  )}-${pad(date.getUTCMinutes())}-${pad(date.getUTCSeconds())}`;

// : {[key:string]: number;}
const HTTP_STATUS_CODE = {
  OK: 200, // Standard response for successful HTTP requests
  CREATED: 201, // Request has been fulfilled. New resource created
  NO_CONTENT: 204, // Request processed. No content returned
  MOVED_PERMANENTLY: 301, // This and all future requests directed to the given URI
  NOT_MODIFIED: 304, // Resource has not been modified since last requested
  BAD_REQUEST: 400, // Request cannot be fulfilled due to bad syntax
  UNAUTHORIZED: 401, // Authentication is possible, but has failed or needs to be done
  FORBIDDEN: 403, // Server refuses to respond to request and the server known the client's identity unlike unauthorized 401
  NOT_FOUND: 404, // Requested resource could not be found
  UNSUPPORTED_MEDIA_TYPE: 415, // The media format of the requested data is not supported by the server, so the server is rejecting the request.
  INTERNAL_SERVER_ERROR: 500, // Generic error message when server fails
  NOT_IMPLEMENTED: 501, // Server does not recognize method or lacks ability to fulfill
  SERVICE_UNAVAILABLE: 503, // Server is currently unavailable
} as const;

type TypeLike<T = string> = T | undefined;

type TypeLikeMutator<T> = {
  [P in keyof T]: TypeLike<T[P]>;
};

export { formatDate, HTTP_STATUS_CODE, TypeLike, TypeLikeMutator };
