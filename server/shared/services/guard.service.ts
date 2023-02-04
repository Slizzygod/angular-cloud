import * as createHttpError from 'http-errors';

import { NextFunction, Request, Response } from 'express';

import { usersService } from '../../modules/users/users.service';

export class GuardService {
  constructor() { }

  check(required: string[]) {
    const _middleware = (
      req: Request,
      res: Response,
      next: NextFunction
    ): void => {
      const user = usersService.getCurrentSessionUser(req);

      if (!user) {
        return next(createHttpError(404, 'User not found'));
      }

      if (!Array.isArray(user.permissions)) {
        return next(
          createHttpError(403, 'Permissions should be an Array or String')
        );
      }

      const checkPermissions = user.permissions.find(
        (permission: string) => !required.includes(permission)
      );

      if (!checkPermissions) {
        return next(createHttpError(403, 'Permissions denied'));
      }

      next(null);
    };


    _middleware.unless = require('express-unless');

    return _middleware;
  }
}

export const guard = new GuardService();
