import * as restify from 'restify';

import {
  RenderPageOptions as PlaygroundRenderPageOptions,
  renderPlaygroundPage,
} from '@apollographql/graphql-playground-html';

import {
  ApolloServerBase,
  convertNodeHttpToRequest,
  FileUploadOptions,
  formatApolloErrors,
  GraphQLOptions,
  HttpQueryError,
  runHttpQuery,
} from 'apollo-server-core';

import { processRequest as processFileUploads } from 'apollo-upload-server';

export type RestifyGraphQLOptionsFunction =
  (req?: restify.Request, res?: restify.Response) => GraphQLOptions | Promise<GraphQLOptions>;

export type RestifyHandler =
  (req: restify.Request, res: restify.Response, next) => void;

export function graphqlRestify(
  options: GraphQLOptions | RestifyGraphQLOptionsFunction,
): RestifyHandler {
  if (!options) {
    throw new Error('Apollo Server requires options.');
  }

  if (arguments.length > 1) {
    // TODO: test this
    throw new Error(
      `Apollo Server expects exactly one argument, got ${arguments.length}`,
    );
  }

  const graphqlHandler = (
    req: restify.Request,
    res: restify.Response,
    next,
  ): void => {
    runHttpQuery([req, res], {
      method: req.method,
      options,
      query: req.method === 'POST' ? req.body : req.query,
      request: convertNodeHttpToRequest(req),
    }).then(
      ({ graphqlResponse, responseInit }) => {
        Object.keys(responseInit.headers).forEach((key) =>
          res.setHeader(key, responseInit.headers[key]),
        );
        res.write(graphqlResponse);
        res.end();
        return next();
      },
      (error: HttpQueryError) => {
        if ('HttpQueryError' !== error.name) {
          return next(error);
        }

        if (error.headers) {
          Object.keys(error.headers).forEach((header) => {
            res.setHeader(header, error.headers[header]);
          });
        }

        res.statusCode = error.statusCode;
        res.write(error.message);
        res.end();
        return next();
      },
    );
  };

  return graphqlHandler;
}

const fileUploadMiddleware = (
  uploadsConfig: FileUploadOptions,
  server: ApolloServerBase,
) => {
  return function graphqlFileUpload(
    req: restify.Request,
    res: restify.Response,
    next: restify.NextFunction,
  ) {
    // Note: we use typeis directly instead of via req.is for connect support.
    if (req.is('multipart/form-data')) {
      processFileUploads(req, uploadsConfig)
        .then((body) => {
          req.body = body;
          return next();
        })
        .catch((error) => {
          if (error.status && error.expose) { res.status(error.status); }

          return next(
            formatApolloErrors([error], {
              formatter: server.requestOptions.formatError,
              debug: server.requestOptions.debug,
            }),
          );
        });
    } else {
      return next();
    }
  };
};

export interface ServerRegistration {
  // Note: You can also pass a connect.Server here. If we changed this field to
  // `express.Application | connect.Server`, it would be very hard to get the
  // app.use calls to typecheck even though they do work properly. Our
  // assumption is that very few people use connect with TypeScript (and in fact
  // we suspect the only connect users left writing GraphQL apps are Meteor
  // users).
  app: restify.Application;
  path?: string;
  onHealthCheck?: (req: restify.Request) => Promise<any>;
  disableHealthCheck?: boolean;
}

export class ApolloServer extends ApolloServerBase {
  // This translates the arguments from the middleware into graphQL options It
  // provides typings for the integration specific behavior, ideally this would
  // be propagated with a generic to the super class
  public async createGraphQLServerOptions(
    req: restify.Request,
    res: restify.Response,
  ): Promise<GraphQLOptions> {
    return super.graphQLServerOptions({ req, res });
  }

  public applyMiddleware({
    app,
    path,
    disableHealthCheck,
    onHealthCheck,
  }: ServerRegistration) {
    if (!path) { path = '/graphql'; }

    if (!disableHealthCheck) {
      // uses same path as engine proxy, but is generally useful.
      app.get('/.well-known/apollo/server-health', (req, res, next) => {
        // Response follows https://tools.ietf.org/html/draft-inadarei-api-health-check-01
        res.type('application/health+json');

        if (onHealthCheck) {
          onHealthCheck(req)
            .then(() => {
              res.json({ status: 'pass' });
              return next();
            })
            .catch(() => {
              res.status(503).json({ status: 'fail' });
              return next();
            });
        } else {
          res.json({ status: 'pass' });
          return next();
        }
      });
    }

    const middleware = [];

    if (this.uploadsConfig) {
      middleware.push(fileUploadMiddleware(this.uploadsConfig, this));
    }

    const graphql = (req, res, next) => {
      if (this.playgroundOptions && req.method === 'GET') {
        if (req.accepts('text/html') || req.accepts('application/json')) {
          const playgroundRenderPageOptions: PlaygroundRenderPageOptions = {
            endpoint: path,
            subscriptionEndpoint: this.subscriptionsPath,
            ...this.playgroundOptions,
          };
          const playground = renderPlaygroundPage(playgroundRenderPageOptions);

          res.setHeader('Content-Type', 'text/html');
          res.write(playground);
          res.end();
          return next();
        }
      }

      const graphqlOptions = this.createGraphQLServerOptions.bind(this);
      return graphqlRestify(graphqlOptions)(req, res, next);
    };

    app.get(path, middleware, graphql);
    app.post(path, middleware, graphql);
  }

  protected supportsSubscriptions(): boolean {
    return true;
  }

  protected supportsUploads(): boolean {
    return true;
  }
}
