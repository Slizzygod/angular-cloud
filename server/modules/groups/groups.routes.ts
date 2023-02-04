import * as express from 'express';

import { groupsCtrl } from './groups.controller';

import { PERMISSION_ADMIN } from '../../shared/constants';
import { guard } from '../../shared/services';

export function setGroupsRoutes(router: express.Router) {

  router.route('/groups').get(guard.check([ PERMISSION_ADMIN ]), groupsCtrl.getGroups);
  router.route('/groups').post(guard.check([ PERMISSION_ADMIN ]), groupsCtrl.createGroup);
  router.route('/groups/:id').put(guard.check([ PERMISSION_ADMIN ]), groupsCtrl.updateGroup);
  router.route('/groups/:id').delete(guard.check([ PERMISSION_ADMIN ]), groupsCtrl.deleteGroup);

}
