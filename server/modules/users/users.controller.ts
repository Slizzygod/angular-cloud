import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';

import { User } from '../../core/models';
import { config } from '../../core/config/env/all';
import { PERMISSION_USER } from '../../shared/constants';

export class UsersCtrl {

  async login(req: Request, res: Response, next: NextFunction): Promise<any> {
    const username = req.body.username;
    const password = req.body.password;

    if (!username) {
      res.status(404).send('Username required');
    }

    if (!password) {
      res.status(404).send('Password required');
    }

    try {
      let user = await User.findOne({
        where: {
          username
        }
      });

      if (user) {
        const hashNewPassword = crypto.pbkdf2Sync(password, 'salt', 1000, 64, `sha512`).toString(`hex`);

        if (user.password !== hashNewPassword) {
          return res.status(403).send('Permissions denied by passsword');
        }
      } else {
        const hashNewPassword = crypto.pbkdf2Sync(password, 'salt', 1000, 64, `sha512`).toString(`hex`);

        user = await User.create({
          username: username,
          password: hashNewPassword,
          permissions: [PERMISSION_USER]
        });
      }

      if (user && user.blocked) {
        return res.sendStatus(403).send('Permissions denied');
      }

      const token = jwt.sign({ id: user.id, username: user.username, permissions: user.permissions }, config.jwt.secretToken, { expiresIn: config.jwt.expiresIn });

      res.json({ token });
    } catch (error) {
      next(error);
    }
  }

}

export const usersCtrl = new UsersCtrl();
