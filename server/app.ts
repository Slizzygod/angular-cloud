import * as express from 'express';
import * as morgan from 'morgan';
import * as path from 'path';

import { Pool } from 'pg';

import { config } from './core/config/config';
import { models } from './core/models/sequelize';
import { setRoutes } from './routes';

const app = express();

app.set('port', (process.env['PORT'] || 3000));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use('/', express.static(path.join(__dirname, '../public')));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false, limit: '5mb' }));

if (process.env['NODE_ENV'] !== 'production' && process.env['NODE_ENV'] !== 'test') {
  app.use(morgan('dev'));
}

const pgConfig = config.pgConnection;
config.pgPool = new Pool(pgConfig);

setRoutes(app);

app.get('/*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

models.sequelize.sync().then(async () => {
  app.listen(app.get('port'), () => console.log(`Targem Localize app listening on port ${app.get('port')}`));
});

export { app };
