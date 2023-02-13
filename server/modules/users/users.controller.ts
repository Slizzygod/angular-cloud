import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';

import { User } from '../../core/models';
import { config } from '../../core/config/env/all';
import { PERMISSION_USER } from '../../shared/constants';
import { usersService } from './users.service';
import { foldersService } from '../folders/services';

export class UsersCtrl {

  async login(req: Request, res: Response, next: NextFunction): Promise<any> {
    const username = req.body.username;
    const password = req.body.password;

    if (!username) {
      return res.status(404).send('Username required');
    }

    if (!password) {
      return res.status(404).send('Password required');
    }

    try {
      let user = await User.findOne({
        where: {
          username,
        },
      });

      if (user) {
        const hashNewPassword = crypto
          .pbkdf2Sync(password, 'salt', 1000, 64, `sha512`)
          .toString(`hex`);

        if (user.password !== hashNewPassword) {
          return res.status(403).send('Permissions denied by passsword');
        }
      } else {
        const hashNewPassword = crypto
          .pbkdf2Sync(password, 'salt', 1000, 64, `sha512`)
          .toString(`hex`);

        user = await User.create({
          username: username,
          password: hashNewPassword,
          permissions: [PERMISSION_USER],
        });
      }

      if (user && user.blocked) {
        return res.sendStatus(403).send('Permissions denied');
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, permissions: user.permissions },
        config.jwt.secretToken,
        { expiresIn: config.jwt.expiresIn }
      );

      await foldersService.createUserFolder(user);

      res.json({ token });
    } catch (error) {
      next(error);
    }
  }

  async getUserSettings(req: Request, res: Response): Promise<any> {
    const user = usersService.getCurrentSessionUser(req);

    try {
      const data = await User.findOne({ where: { id: user.id }, attributes: ['id', 'firstName', 'lastName', 'patronymicName'] });

      res.json(data);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async updateUserSettings(req: Request, res: Response): Promise<any> {
    const user = usersService.getCurrentSessionUser(req);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const patronymicName = req.body.patronymicName;

    try {
      await User.update({ firstName, lastName, patronymicName }, { where: { id: user.id } });

      res.json({ id: user.id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async getUsers(req: Request, res: Response): Promise<any> {
    try {
      const data = await User.findAll();

      res.json(data);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async updateUser(req: Request, res: Response): Promise<any> {
    const id = req.params['id'];
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const patronymicName = req.body.patronymicName;

    try {
      const user = await User.findOne({ where: { id } });

      if (!user) {
        return res.status(404).send('User not found');
      }

      await user.update({ firstName, lastName, patronymicName });

      res.json({ id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async blockUser(req: Request, res: Response): Promise<any> {
    const id = req.params['id'];

    try {
      const user = await User.findOne({ where: { id } });

      if (!user) {
        return res.status(404).send('User not found');
      }

      await user.update({ blocked: true });

      res.json({ id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async unlockUser(req: Request, res: Response): Promise<any> {
    const id = req.params['id'];

    try {
      const user = await User.findOne({ where: { id } });

      if (!user) {
        return res.status(404).send('User not found');
      }

      await user.update({ blocked: false });

      res.json({ id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

}

export const usersCtrl = new UsersCtrl();
