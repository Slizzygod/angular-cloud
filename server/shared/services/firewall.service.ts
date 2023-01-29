import * as expressJwt from 'express-jwt';
import * as Guard from 'express-jwt-permissions';

import { config } from '../../core/config/env/all';
import { PERMISSION_USER } from '../constants';

const guard = Guard();

export class FirewallService {

  static expressJwt() {
    return expressJwt({
      secret: config.jwt.secretToken,
      algorithms: [ config.jwt.algorithm ]
    }).unless({
      path: [
        { url: '/api/login', method: 'POST' },
        /\/api\/pub/i,
        /^(?!\/api)/
      ]
    });
  }

  static expressGuard() {
    return guard.check(PERMISSION_USER).unless({
      path: [
        { url: '/api/login', method: 'POST' },
        /\/api\/pub/i,
        /\/api\/hub/i,
        /^(?!\/api)/
      ]
    });
  }

}
