import * as express from 'express';

import { setUsersRoutes } from './users/users.routes';

export function setModulesRoutes(router: express.Router) {

  setUsersRoutes(router);

}
