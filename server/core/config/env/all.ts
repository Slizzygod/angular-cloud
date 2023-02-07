
export const config = {
  app: {
    name: 'Angular Cloud',
    console: true
  },
  production: false,
  development: true,
  pgConnection: {
    host: 'localhost',
    port: 5432,
    database: 'cloud',
    user: 'postgres',
    dialect: 'postgres',
    password: 'Slizzy99',
    max: 30,
    pool: {
      max: 30,
      acquire: 10000
    },
    idleTimeoutMillis: 30000
  },
  pgPool: undefined,
  jwt: {
    expiresIn: (3 * 24 + 12) * 60 * 60,
    algorithm: 'HS256',
    secretToken: '7Ycx1DeMnSqtfdthNjrSMKl2SILTrt3y'
  },
  rootDir: 'server/cloud'
};
