import { Request, Response } from 'express';

import { User, Group, FolderUser } from '../../core/models';
import { foldersService } from '../folders/services';
import { usersService } from '../users/users.service';

export class GroupsCtrl {

  async getGroups(req: Request, res: Response): Promise<any> {
    try {
      const data = await Group.findAll({
        include: [
          {
            model: User,
            as: 'users',
          },
        ],
      });

      res.json(data);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async createGroup(req: Request, res: Response): Promise<any> {
    const user = usersService.getCurrentSessionUser(req);
    const name = req.body.name;
    const shortName = req.body.shortName;
    const note = req.body.note;

    if (!name) {
      return res.status(412).send('Group name is required');
    }

    try {
      const group = await Group.create({ name, shortName, note });

      const folder = await foldersService.createFolder({ name, root: true, user, group: group.id });

      await FolderUser.create({ userId: user.id, folderId: folder.id, owner: true });

      res.json(group);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async updateGroup(req: Request, res: Response): Promise<any> {
    const user = usersService.getCurrentSessionUser(req);
    const id = Number(req.params['id']);
    const name = req.body.name;
    const shortName = req.body.shortName;
    const note = req.body.note;
    const schedule = req.body.schedule;
    const users = req.body.users;

    if (!Array.isArray(users)) {
      return res.status(412).send('Users must be an array');
    }

    try {
      const group = await Group.findOne({ where: { id } });

      if (!group) {
        return res.status(404).send('Group not found');
      }

      const folderId = await foldersService.updateFolder({ group: id, name, user });

      await Promise.all([
        users.length > 0
          ? FolderUser.bulkCreate(users.map((user: number) => ({ userId: user, folderId, owner: false })))
          : FolderUser.destroy({ where: { folderId } }),
        group.update({ name, shortName, note, schedule }, { where: { id } }),
        group.setUsers(users)
      ]);

      res.json({ id: group.id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async deleteGroup(req: Request, res: Response): Promise<any> {
    const user = usersService.getCurrentSessionUser(req);
    const id = Number(req.params['id']);

    try {
      await Promise.all([
        Group.destroy({ where: { id } }),
        foldersService.deleteFolder({ group: id, user })
      ]);

      res.json({ id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

}

export const groupsCtrl = new GroupsCtrl();
