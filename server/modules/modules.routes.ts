import * as express from 'express';

import { setUsersRoutes } from './users/users.routes';
import { setGroupsRoutes } from './groups/groups.routes';
import { setFoldersRoutes } from './folders/folders.routes';

export function setModulesRoutes(router: express.Router) {

  setUsersRoutes(router);
  setGroupsRoutes(router);
  setFoldersRoutes(router);

}
