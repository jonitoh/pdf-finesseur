import { CorsOptions } from 'cors';
import allowedOrigins from './allowed-origins.config';

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback) => {
    if (
      (typeof origin === 'string' && allowedOrigins.indexOf(origin) !== -1) ||
      !origin ||
      allowedOrigins.indexOf('*') !== -1
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

export default corsOptions;
