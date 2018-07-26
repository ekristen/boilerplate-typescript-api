import * as restify from 'restify';

import * as pkg from '../../package.json';

import { logger } from './logger';

// create Restify server
export const server: restify.Server = restify.createServer({
  name: (pkg as any).name,
  version: (pkg as any).version,
  log: logger.child({component: 'restify'}),
});

// sanitize url
server.pre(restify.pre.sanitizePath());

// support gzip responses
server.use(restify.plugins.gzipResponse());

// parse the body of the request into req.params
server.use(restify.plugins.bodyParser({
  mapParams: true,
}));

// parse the request url query string parameters into req.query
server.use(restify.plugins.queryParser({
  mapParams: true,
}));

// custom restify errors to include request id for better debugging
server.on('restifyError', (req: restify.Request, res: restify.Response, err: any, next: any) => {
  const json: any = err.toJSON();

  err.toJSON = () => {
    return {
      errors: [json],
      request: {
        id: req.id(),
      },
    };
  };

  return next();
});

server.on('after', restify.plugins.auditLogger({
  log: logger.child({component: 'audit'}),
  event: 'after',
}));

// mount all routes here
const rootHandler = (req, res, next) => {
  res.json({
    name: (pkg as any).name,
    version: (pkg as any).version,
  });

  // with restify always call next!
  return next();
};
server.get('/', rootHandler);
