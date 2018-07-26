import { sync } from './db';
import { apolloServer } from './instances/apollo';
import { config } from './instances/config';
import { logger } from './instances/logger';
import { server } from './instances/restify';

sync()
  .then(() => {
    // NOTE: you can also mount routes here too if you'd like
    apolloServer.applyMiddleware({ app: server, path: '/graphql' });
    apolloServer.installSubscriptionHandlers(server.server);

    // Listen
    server.listen(config.server.port, config.server.host, () => {
      logger.info('Server started [%s:%d]', config.server.host, config.server.port);
    });
  })
  .catch((err) => {
    logger.fatal({err}, 'fatal error while initializing');
  });
