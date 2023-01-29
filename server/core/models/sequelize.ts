import { Sequelize } from 'sequelize';

import { config } from '../config/config';

const sequelizeConfig = {
  username: config.pgConnection.user,
  database: config.pgConnection.database,
  host: config.pgConnection.host,
  password: config.pgConnection.password,
  pool: config.pgConnection.pool,
  dialect: 'postgres' as const,
};

const sequelize = new Sequelize(sequelizeConfig);

export const models = { sequelize, Sequelize };
