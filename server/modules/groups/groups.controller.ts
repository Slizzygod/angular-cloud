import { Request, Response } from 'express';

import { User, Group } from '../../core/models';

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
    const name = req.body.name;
    const shortName = req.body.shortName;
    const note = req.body.note;

    if (!name) {
      res.status(412).send('Group name is required');
    }

    if (!shortName) {
      res.status(412).send('Group short name is required');
    }

    try {
      const group = await Group.create({
        name,
        shortName,
        note,
      });

      res.json({ id: group.id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async updateGroup(req: Request, res: Response): Promise<any> {
    const id = req.params['id'];
    const name = req.body.name;
    const shortName = req.body.shortName;
    const note = req.body.note;
    const users = req.body.users;

    if (!Array.isArray(users)) {
      res.status(412).send('Users must be an array');
    }

    try {
      const group = await Group.findByPk(id);

      if (!group) {
        res.status(404).send('Group not found');
      }

      await Promise.all([
        group.update({ name, shortName, note }, { where: { id } }),
        group.setUsers(users)
      ]);

      res.json({ id: group.id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

}

export const groupsCtrl = new GroupsCtrl();
