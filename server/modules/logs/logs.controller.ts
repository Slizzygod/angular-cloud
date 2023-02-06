import { NextFunction, Request, Response } from 'express';

import { Log } from '../../core/models';

export class LogsCtrl {

  async getLogs(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const logs = await Log.findAll();

      res.send(logs);
    } catch (error) {
      next(error);
    }
  }

}

export const logsCtrl = new LogsCtrl();
