import * as express from 'express';

import { usersCtrl } from './users.controller';

export function setUsersRoutes(router: express.Router) {

  router.route('/login').post(usersCtrl.login);

}
