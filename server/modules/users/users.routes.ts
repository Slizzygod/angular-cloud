import * as express from 'express';

import { usersCtrl } from './users.controller';

export function setUsersRoutes(router: express.Router) {

  router.route('/login').post(usersCtrl.login);

  router.route('/users/settings').get(usersCtrl.getUserSettings);
  router.route('/users/settings').post(usersCtrl.updateUserSettings);

}
