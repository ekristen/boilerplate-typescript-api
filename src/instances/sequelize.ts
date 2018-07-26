import { cloneDeep } from 'lodash';
import * as Sequelize from 'sequelize';

import { config } from './config';
import { logger } from './logger';

const databaseConfig = cloneDeep(config.database[config.database.driver]);

const sqlLogger = logger.child({component: 'sequelize'});

databaseConfig.dialect = config.database.driver;
databaseConfig.logging = (str) => {
  sqlLogger.trace(str);
};

export const sequelize = new Sequelize(
  config.database.dbname,
  config.database.username,
  config.database.password,
  databaseConfig,
);
