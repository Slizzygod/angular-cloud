import * as Guard from 'express-jwt-permissions';
import * as express from 'express';

import { groupsCtrl } from './groups.controller';

import { PERMISSION_ADMIN } from '../../shared/constants';

export function setUsersRoutes(router: express.Router) {

  const guard = Guard();

  router.route('/groups').get(guard.check(PERMISSION_ADMIN), groupsCtrl.getGroups);
  router.route('/groups').post(guard.check(PERMISSION_ADMIN), groupsCtrl.createGroup);
  router.route('/groups/:id').put(guard.check(PERMISSION_ADMIN), groupsCtrl.updateGroup);

}
