import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

import { User } from '../../core/models';
import { config } from '../../core/config/env/all';

export class UsersService {

  getCurrentSessionUser(req: Request): User {
    return jwt.verify(
      req.headers.authorization.replace('Bearer ', ''),
      config.jwt.secretToken
    );
  }

}

export const usersService = new UsersService();
