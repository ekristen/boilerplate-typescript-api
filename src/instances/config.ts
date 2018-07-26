import * as rc from 'rc';

export const defaults = {
  database: {
    driver: 'sqlite',
    dbname: 'boilerplate',
    username: 'boilerplate',
    password: 'boilerplate',
    sqlite: {
      storage: './data/boilerplate.sqlite',
    },
    mysql: {
      host: 'localhost',
      port: 3306,
    },
  },
  graphql: {
    playgroundOptions: false,
  },
  logger: {
    level: 'info',
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
};

export const config = rc('boilerplate', defaults);
