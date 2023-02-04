import * as express from 'express';
import { usersCtrl } from './users.controller';

import { guard } from '../../shared/services';
import { PERMISSION_ADMIN } from '../../shared/constants';

export function setUsersRoutes(router: express.Router) {

  router.route('/login').post(usersCtrl.login);

  router.route('/users').get(guard.check([ PERMISSION_ADMIN ]), usersCtrl.getUsers);
  router.route('/users/:id/update').put(guard.check([ PERMISSION_ADMIN ]), usersCtrl.updateUser);
  router.route('/users/:id/block').post(guard.check([ PERMISSION_ADMIN ]), usersCtrl.blockUser);
  router.route('/users/:id/unlock').post(guard.check([ PERMISSION_ADMIN ]), usersCtrl.unlockUser);

  router.route('/users/settings').get(usersCtrl.getUserSettings);
  router.route('/users/settings').post(usersCtrl.updateUserSettings);

}
