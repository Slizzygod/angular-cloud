import * as express from 'express';

import { setModulesRoutes } from './modules/modules.routes';

export function setRoutes(app: any) {

  const router = express.Router();

  setModulesRoutes(router);

  app.use('/api', router);
}
