import * as jwt from 'jsonwebtoken';

import { Request } from 'express';

import { User } from '../../core/models';
import { config } from '../../core/config/env/all';
import { foldersService } from '../folders/services';
import { utilsService } from '../../shared/services';

export class UsersService {

  async getUserStatistics(id: number): Promise<any> {
    const user = await User.findOne({ where: { id }, attributes: ['username', 'space'] });
    const size = await foldersService.getFolderSize(user.username);

    const needlySize = Number((size / (1000 * 1000)).toFixed());
    const needlySpace = Number((user.space * 1000).toFixed());

    return {
      space: user.space,
      size: utilsService.formatBytes(size),
      result: needlySize / needlySpace * 100
    };
  }

  getCurrentSessionUser(req: Request): User {
    return jwt.verify(
      req.headers.authorization.replace('Bearer ', ''),
      config.jwt.secretToken
    );
  }

}

export const usersService = new UsersService();
