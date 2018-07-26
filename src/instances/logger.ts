import * as bunyan from 'bunyan';
import * as devnull from 'dev-null';

import * as pkg from '../../package.json';

import { config } from './config';

let stream = process.stdout;

// NOTE: if NODE_ENV is set to test, dev null out all log messages
if (process.env.NODE_ENV && process.env.NODE_ENV === 'test') {
  stream = devnull();
}

export const logger = bunyan.createLogger({
  name: (pkg as any).name,
  stream,
  level: config.logger.level,
  serializers: bunyan.stdSerializers,
});
