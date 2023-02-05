import * as express from 'express';
import { logsCtrl } from './logs.controller';

import { guard } from '../../shared/services';
import { PERMISSION_ADMIN } from '../../shared/constants';

export function setLogsRoutes(router: express.Router) {

  router.route('/logs').get(guard.check([ PERMISSION_ADMIN ]), logsCtrl.getLogs);

}
