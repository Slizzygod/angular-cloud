import { NextFunction, Request, Response } from 'express';

import { Folder, Log, User } from '../../core/models';

export class LogsCtrl {

  async getLogs(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const logs = await Log.findAll({
        include: [
          {
            model: User,
            as: 'user'
          },
          {
            model: Folder,
            as: 'folder'
          }
        ]
      });

      res.send(logs);
    } catch (error) {
      next(error);
    }
  }

}

export const logsCtrl = new LogsCtrl();
